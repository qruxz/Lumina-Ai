import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return new NextResponse('Search query is required', { status: 400 });
    }

    const notes = await prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { some: { name: { contains: query, mode: 'insensitive' } } } },
        ],
      },
      include: {
        folder: true,
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('[NOTES_SEARCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
