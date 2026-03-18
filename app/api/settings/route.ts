import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      select: { key: true, value: true, type: true, group: true },
      orderBy: { key: 'asc' },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ error: 'Błąd pobierania ustawień' }, { status: 500 });
  }
}
