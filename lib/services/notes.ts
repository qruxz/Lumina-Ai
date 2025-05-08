import { Note } from "@/types/note";

class NotesService {
  private getBaseUrl() {
    if (typeof window !== 'undefined') {
      // Client-side
      return window.location.origin;
    }
    // Server-side
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return `http://localhost:${process.env.PORT || 3000}`;
  }

  async create(note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${this.getBaseUrl()}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error("Failed to create note");
    }

    return response.json();
  }

  async update(noteId: string, userId: string, note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${this.getBaseUrl()}/api/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error("Failed to update note");
    }

    return response.json();
  }

  async getById(noteId: string, userId: string): Promise<Note | null> {
    const response = await fetch(`${this.getBaseUrl()}/api/notes/${noteId}?userId=${userId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch note");
    }

    return response.json();
  }

  async getAllByUser(userId: string): Promise<Note[]> {
    const response = await fetch(`${this.getBaseUrl()}/api/notes?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    return response.json();
  }

  async delete(noteId: string, userId: string): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/api/notes/${noteId}?userId=${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete note");
    }
  }

  async search(query: string, userId: string): Promise<Note[]> {
    const response = await fetch(`${this.getBaseUrl()}/api/notes/search?q=${query}&userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to search notes");
    }

    return response.json();
  }
}

export const notesService = new NotesService();
