import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seedowanie bazy peramoredellavita_cms...');

  // Admini
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@peramoredellavita.pl';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: { email: adminEmail, username: 'admin', passwordHash, role: 'admin', isActive: true },
    });
    console.log(`✅ Admin: ${adminEmail}`);
  }

  // Dev admin
  const devAdmin = await prisma.admin.findUnique({ where: { email: 'dev@suntara.co' } });
  if (!devAdmin) {
    const passwordHash = await bcrypt.hash(process.env.DEV_ADMIN_PASSWORD || 'dev123456', 12);
    await prisma.admin.create({
      data: { email: 'dev@suntara.co', username: 'dev', passwordHash, role: 'admin', isActive: true },
    });
    console.log('✅ Dev admin: dev@suntara.co');
  }

  // Ustawienia
  const settings = [
    { key: 'site.name', value: 'Per Amore della Vita', group: 'general' },
    { key: 'site.description', value: 'Restauracja Per Amore della Vita', group: 'general' },
    { key: 'contact.email', value: 'kontakt@peramoredellavita.pl', group: 'contact' },
    { key: 'contact.phone', value: '+48 123 456 789', group: 'contact' },
    { key: 'contact.address', value: '', group: 'contact' },
    { key: 'social.facebook', value: '', group: 'social' },
    { key: 'social.instagram', value: '', group: 'social' },
    { key: 'seo.title', value: 'Per Amore della Vita – Restauracja', group: 'seo' },
    { key: 'seo.description', value: 'Wyjątkowa restauracja z włoską duszą', group: 'seo' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: s.value, type: 'string', group: s.group },
      update: {},
    });
  }
  console.log('✅ Ustawienia bazowe');

  // Strona główna
  const home = await prisma.page.upsert({
    where: { slug: 'strona-glowna' },
    create: {
      slug: 'strona-glowna',
      title: 'Strona Główna',
      isPublished: true,
      sortOrder: 0,
      sections: {
        create: [
          { name: 'hero',    title: 'Hero',    isVisible: true, sortOrder: 0 },
          { name: 'about',   title: 'O nas',   isVisible: true, sortOrder: 1 },
          { name: 'menu',    title: 'Menu',    isVisible: true, sortOrder: 2 },
          { name: 'gallery', title: 'Galeria', isVisible: true, sortOrder: 3 },
          { name: 'contact', title: 'Kontakt', isVisible: true, sortOrder: 4 },
        ],
      },
    },
    update: {},
  });

  // Strona kontakt
  await prisma.page.upsert({
    where: { slug: 'kontakt' },
    create: {
      slug: 'kontakt',
      title: 'Kontakt',
      isPublished: true,
      sortOrder: 1,
      sections: {
        create: [
          { name: 'hero',    title: 'Hero',    isVisible: true, sortOrder: 0 },
          { name: 'contact', title: 'Kontakt', isVisible: true, sortOrder: 1 },
        ],
      },
    },
    update: {},
  });

  // Treść strony głównej
  const heroSection = await prisma.section.findFirst({
    where: { pageId: home.id, name: 'hero' },
  });

  if (heroSection) {
    const content = [
      { key: 'hero.title',    value: 'Per Amore della Vita', type: 'text' },
      { key: 'hero.subtitle', value: 'Restauracja z włoską duszą', type: 'text' },
      { key: 'hero.button',   value: 'Poznaj nasze menu', type: 'text' },
      { key: 'hero.image',    value: '', type: 'image' },
    ];
    for (const c of content) {
      await prisma.content.upsert({
        where: { key_locale: { key: c.key, locale: 'pl' } },
        create: { key: c.key, value: c.value, type: c.type, locale: 'pl', pageId: home.id, sectionId: heroSection.id },
        update: {},
      });
    }
  }

  console.log('✅ Strona główna + kontakt z sekcjami');
  console.log('\n🎉 Seed zakończony!');
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
