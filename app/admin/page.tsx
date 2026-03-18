import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e' }}>Panel Admina</h1>
          <p style={{ color: '#6b7280', marginTop: '0.3rem' }}>Per Amore della Vita – zalogowany jako {session.email}</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { href: '/admin/content', icon: '✏️', title: 'Treść strony', desc: 'Edytuj teksty, nagłówki i opisy' },
            { href: '/admin/gallery', icon: '🖼️', title: 'Galeria', desc: 'Zarządzaj zdjęciami' },
            { href: '/admin/messages', icon: '✉️', title: 'Wiadomości', desc: 'Wiadomości z formularza kontaktowego' },
            { href: '/admin/settings', icon: '⚙️', title: 'Ustawienia', desc: 'Konfiguracja strony' },
          ].map((card) => (
            <a
              key={card.href}
              href={card.href}
              style={{
                background: '#fff',
                padding: '1.5rem',
                display: 'block',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s',
                borderTop: '3px solid #c8a96e',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
              <h2 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '0.4rem' }}>{card.title}</h2>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{card.desc}</p>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '1.5rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '1rem', color: '#1a1a2e', marginBottom: '1rem' }}>Szybkie linki</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/" target="_blank" style={{ color: '#c8a96e', fontSize: '0.9rem' }}>→ Strona główna</a>
            <a href="/kontakt" target="_blank" style={{ color: '#c8a96e', fontSize: '0.9rem' }}>→ Strona kontakt</a>
          </div>
        </div>
      </div>
    </div>
  );
}
