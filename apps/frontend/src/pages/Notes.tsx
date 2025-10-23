import { useState, useEffect } from 'react';
import notesService from '@/services/notes.service';
import type { Note } from '@/types';
import Loading from '@/components/Loading';
import { useAuthStore } from '@/store/authStore';
import StickyNotesCanvas from '@/components/StickyNotesCanvas';
import CreateNoteModal from '@/components/CreateNoteModal';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      await notesService.updateNote(updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content,
        color: updatedNote.color,
        positionX: updatedNote.positionX,
        positionY: updatedNote.positionY,
      });
      setNotes(notes.map(note =>
        note.id === updatedNote.id ? updatedNote : note
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update note');
    }
  };

  const handleNoteDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesService.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const handleNoteCreate = async (noteData: { title: string; content: string; color?: string }) => {
    try {
      const newNote = await notesService.createNote(noteData);
      setNotes([...notes, newNote]);
      setIsCreateModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create note');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sticky Notes Dashboard</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Note
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Sticky Notes Canvas */}
      <div className="flex-1 overflow-hidden">
        {notes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-4">No notes yet</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create your first note
              </button>
            </div>
          </div>
        ) : (
          <StickyNotesCanvas
            notes={notes}
            currentUserId={user?.id}
            onNoteUpdate={handleNoteUpdate}
            onNoteDelete={handleNoteDelete}
          />
        )}
      </div>

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <CreateNoteModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleNoteCreate}
        />
      )}
    </div>
  );
}
