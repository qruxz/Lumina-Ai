import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

// Get a specific note
export async function GET(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const note = await prisma.note.findUnique({
      where: {
        id: params.noteId,
        userId,
      },
      include: {
        folder: true,
        tags: true,
      },
    });

    if (!note) {
      return new NextResponse('Note not found', { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('[NOTE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Update a note
export async function PATCH(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body;

    const note = await prisma.note.update({
      where: {
        id: params.noteId,
        userId,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('[NOTE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Delete a note
export async function DELETE(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const note = await prisma.note.delete({
      where: {
        id: params.noteId,
        userId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('[NOTE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
