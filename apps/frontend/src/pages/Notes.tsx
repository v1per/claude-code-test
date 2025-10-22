import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notesService from '@/services/notes.service';
import type { Note } from '@/types';
import Loading from '@/components/Loading';
import { useAuthStore } from '@/store/authStore';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesService.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Link to="/notes/new" className="btn-primary">
          + Create Note
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No notes yet</p>
          <Link to="/notes/new" className="btn-primary">
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900 flex-1">
                  {note.title}
                </h3>
                {user && note.userId === user.id && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Author
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDate(note.createdAt)}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/notes/${note.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  {user && note.userId === user.id && (
                    <>
                      <Link
                        to={`/notes/${note.id}/edit`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
