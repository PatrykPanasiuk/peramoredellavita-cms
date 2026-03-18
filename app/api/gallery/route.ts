import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        isVisible: true,
        ...(category ? { category } : {}),
      },
      select: { id: true, url: true, alt: true, category: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ error: 'Błąd pobierania galerii' }, { status: 500 });
  }
}
