'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { notesService } from '@/lib/services/notes';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

const Editor = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsSaving(true);
      await notesService.create({
        userId,
        title,
        content
      });
      router.push('/dashboard/notes');
      router.refresh();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  }, [userId, title, content, router]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-transparent text-3xl font-bold mb-8 outline-none border-none placeholder-zinc-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-[calc(100vh-300px)] bg-transparent text-lg resize-none outline-none border-none placeholder-zinc-500"
        />
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="fixed bottom-8 right-8 bg-zinc-800 hover:bg-zinc-700 text-white border-none px-6 py-2 rounded-lg shadow-xl"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Editor; 