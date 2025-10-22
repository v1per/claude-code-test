import api from './api';
import type { ApiResponse, Note, CreateNoteFormData, UpdateNoteFormData } from '@/types';

/**
 * Notes Service
 */
class NotesService {
  /**
   * Get all notes
   */
  async getAllNotes(): Promise<Note[]> {
    const response = await api.get<ApiResponse<Note[]>>('/api/notes');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch notes');
  }

  /**
   * Get a single note by ID
   */
  async getNoteById(id: number): Promise<Note> {
    const response = await api.get<ApiResponse<Note>>(`/api/notes/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch note');
  }

  /**
   * Create a new note
   */
  async createNote(data: CreateNoteFormData): Promise<Note> {
    const response = await api.post<ApiResponse<Note>>('/api/notes', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create note');
  }

  /**
   * Update an existing note
   */
  async updateNote(id: number, data: UpdateNoteFormData): Promise<Note> {
    const response = await api.put<ApiResponse<Note>>(`/api/notes/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update note');
  }

  /**
   * Delete a note
   */
  async deleteNote(id: number): Promise<void> {
    const response = await api.delete<ApiResponse<Note>>(`/api/notes/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete note');
    }
  }
}

export default new NotesService();
