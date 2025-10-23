/**
 * Delete Note Use Case
 * Application service for deleting a note
 */

import { INoteRepository } from '../../../domain/note/note.repository.js';
import { NoteNotFoundError } from '../../../domain/note/note.errors.js';
import { NoteResponseDTO } from '../dtos/note-response.dto.js';
import { Note } from '../../../domain/note/note.entity.js';

export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: number, userId: number): Promise<NoteResponseDTO> {
    // Find existing note to check authorization
    const existingNote = await this.noteRepository.findById(id);
    if (!existingNote) {
      throw new NoteNotFoundError(id);
    }

    // Verify authorization - only author can delete
    existingNote.verifyAuthorization(userId);

    // Delete the note
    const deletedNote = await this.noteRepository.delete(id);

    if (!deletedNote) {
      throw new NoteNotFoundError(id);
    }

    return this.toResponseDTO(deletedNote);
  }

  private toResponseDTO(note: Note): NoteResponseDTO {
    const noteObj = note.toObject();
    return {
      id: noteObj.id!,
      userId: noteObj.userId,
      title: noteObj.title,
      content: noteObj.content,
      color: noteObj.color!,
      positionX: noteObj.positionX!,
      positionY: noteObj.positionY!,
      createdAt: noteObj.createdAt!,
      updatedAt: noteObj.updatedAt!,
    };
  }
}
