export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  folderId?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 