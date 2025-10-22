/**
 * Repository Interface (Port)
 * Defines contract for Note persistence
 */

import { Note } from './note.entity.js';

export interface INoteRepository {
  /**
   * Find all notes
   */
  findAll(): Promise<Note[]>;

  /**
   * Find note by ID
   */
  findById(id: number): Promise<Note | null>;

  /**
   * Create a new note
   */
  create(note: Note): Promise<Note>;

  /**
   * Update an existing note
   */
  update(id: number, note: Note): Promise<Note | null>;

  /**
   * Delete a note
   */
  delete(id: number): Promise<Note | null>;
}
