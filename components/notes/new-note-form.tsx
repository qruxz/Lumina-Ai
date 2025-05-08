'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { notesService } from "@/lib/services/notes";

interface NewNoteFormProps {
  userId: string;
}

export function NewNoteForm({ userId }: NewNoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setIsSaving(true);
      await notesService.create({
        title,
        content,
        userId,
      });
      toast.success("Note saved successfully");
      router.push("/dashboard/notes");
      router.refresh();
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create New Note</h1>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="space-y-6">
          <Input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-700"
          />
          <textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100vh-250px)] p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>
      </div>
    </div>
  );
} 