import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NewNoteForm } from "@/components/notes/new-note-form";

export default async function NewNotePage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return <NewNoteForm userId={userId} />;
} 