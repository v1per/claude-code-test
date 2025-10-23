/**
 * Note Type Definitions
 * Shared between frontend and backend
 */

/**
 * Note - Frontend API Response Type
 * Dates as strings (JSON serialized)
 */
export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * NoteResponseDTO - Backend DTO Type
 * Dates as Date objects before serialization
 */
export interface NoteResponseDTO {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
}
