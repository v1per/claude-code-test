import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import notesService from '@/services/notes.service';
import type { Note } from '@/types';
import Loading from '@/components/Loading';
import { useAuthStore } from '@/store/authStore';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadNote(parseInt(id));
    }
  }, [id]);

  const loadNote = async (noteId: number) => {
    try {
      setLoading(true);
      const data = await notesService.getNoteById(noteId);
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!note || !window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesService.deleteNote(note.id);
      navigate('/notes');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loading />;

  if (error || !note) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error || 'Note not found'}
        </div>
        <Link to="/notes" className="btn-secondary">
          Back to Notes
        </Link>
      </div>
    );
  }

  const isAuthor = user && note.userId === user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/notes" className="text-blue-600 hover:underline">
          ← Back to Notes
        </Link>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
          {isAuthor && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Your Note
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-6 space-y-1">
          <p>Created: {formatDate(note.createdAt)}</p>
          {note.updatedAt !== note.createdAt && (
            <p>Updated: {formatDate(note.updatedAt)}</p>
          )}
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
        </div>

        {isAuthor && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link to={`/notes/${note.id}/edit`} className="btn-primary">
              Edit Note
            </Link>
            <button onClick={handleDelete} className="btn-danger">
              Delete Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
