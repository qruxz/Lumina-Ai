'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Tag, 
  Plus, 
  X, 
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface NoteTag {
  id: string;
  name: string;
  color: string;
}

interface NoteOrganizerProps {
  selectedFolders: string[];
  selectedTags: string[];
  onFolderSelect: (folderId: string) => void;
  onTagSelect: (tagId: string) => void;
}

export function NoteOrganizer({
  selectedFolders,
  selectedTags,
  onFolderSelect,
  onTagSelect,
}: NoteOrganizerProps) {
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Personal', color: '#22c55e' },
    { id: '2', name: 'Work', color: '#3b82f6' },
    { id: '3', name: 'Study', color: '#f59e0b' },
  ]);

  const [tags, setTags] = useState<NoteTag[]>([
    { id: '1', name: 'Important', color: '#ef4444' },
    { id: '2', name: 'Research', color: '#8b5cf6' },
    { id: '3', name: 'Ideas', color: '#06b6d4' },
  ]);

  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);

  const addFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag: NoteTag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      };
      setTags([...tags, newTag]);
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const deleteFolder = (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId));
  };

  const deleteTag = (tagId: string) => {
    setTags(tags.filter(t => t.id !== tagId));
  };

  return (
    <div className="space-y-6">
      {/* Folders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Folders</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingFolder(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence>
          {isAddingFolder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={addFolder}>Add</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingFolder(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {folders.map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer
                ${selectedFolders.includes(folder.id) ? 'bg-primary/10' : 'hover:bg-secondary/50'}
                transition-colors`}
              onClick={() => onFolderSelect(folder.id)}
            >
              <div className="flex items-center gap-2">
                <FolderOpen 
                  className="h-4 w-4" 
                  style={{ color: folder.color }} 
                />
                <span>{folder.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tags</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingTag(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence>
          {isAddingTag && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={addTag}>Add</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingTag(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer
                ${selectedTags.includes(tag.id) ? 'bg-primary/20' : 'bg-secondary/30'}
                hover:bg-secondary/50 transition-colors`}
              style={{ borderColor: tag.color }}
              onClick={() => onTagSelect(tag.id)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-sm">{tag.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTag(tag.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
