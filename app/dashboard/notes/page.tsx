import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NotesClient } from "@/components/notes/notes-client";
import prisma from "@/lib/prisma";

async function getNotes(userId: string) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return notes;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
}

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const notes = await getNotes(userId);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notes</h1>
      </div>
      <NotesClient initialNotes={notes} />
    </div>
  );
}
