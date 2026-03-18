import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '', email = '', phone = '', message = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      ({ name, email, phone = '', message } = body);
    } else {
      const form = await request.formData();
      name = String(form.get('name') || '');
      email = String(form.get('email') || '');
      phone = String(form.get('phone') || '');
      message = String(form.get('message') || '');
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Imię, email i wiadomość są wymagane' }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, message },
    });

    // redirect for form POST
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/?sent=1', request.url));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'Błąd wysyłania wiadomości' }, { status: 500 });
  }
}
