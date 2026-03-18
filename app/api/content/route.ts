import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const page = searchParams.get('page');
  const locale = searchParams.get('locale') || 'pl';

  try {
    if (key) {
      const content = await prisma.content.findUnique({
        where: { key_locale: { key, locale } },
        select: { key: true, value: true, type: true },
      });
      if (!content) return NextResponse.json({ value: null });
      return NextResponse.json(content);
    }

    if (page) {
      const pageRecord = await prisma.page.findUnique({ where: { slug: page } });
      if (!pageRecord) return NextResponse.json([]);
      const content = await prisma.content.findMany({
        where: { pageId: pageRecord.id, locale },
        select: { key: true, value: true, type: true },
      });
      return NextResponse.json(content);
    }

    const content = await prisma.content.findMany({
      where: { locale },
      select: { key: true, value: true, type: true },
      orderBy: { key: 'asc' },
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('GET /api/content error:', error);
    return NextResponse.json({ error: 'Błąd pobierania treści' }, { status: 500 });
  }
}
