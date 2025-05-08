import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NoteEditor } from "@/components/notes/note-editor";
import { notesService } from "@/lib/services/notes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditNotePage({ params }: { params: { noteId: string } }) {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const noteId = decodeURIComponent(params.noteId);
    const note = await notesService.getById(noteId, userId);
    
    if (!note) {
      redirect("/dashboard/notes");
    }

    return (
      <div className="container max-w-5xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Edit Note</h1>
          </div>
        </div>
        <NoteEditor note={note} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch note:", error);
    redirect("/dashboard/notes");
  }
} 