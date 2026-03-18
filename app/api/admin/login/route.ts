import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { setSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email i hasło są wymagane' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Nieprawidłowe dane logowania' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Nieprawidłowe dane logowania' }, { status: 401 });
    }

    await setSessionCookie(admin.id);
    return NextResponse.json({ success: true, role: admin.role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
