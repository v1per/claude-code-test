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

  async execute(id: number): Promise<NoteResponseDTO> {
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
      title: noteObj.title,
      content: noteObj.content,
      createdAt: noteObj.createdAt!,
      updatedAt: noteObj.updatedAt!,
    };
  }
}
