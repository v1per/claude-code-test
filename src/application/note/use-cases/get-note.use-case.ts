/**
 * Get Note Use Case
 * Application service for retrieving a single note
 */

import { INoteRepository } from '../../../domain/note/note.repository.js';
import { NoteNotFoundError } from '../../../domain/note/note.errors.js';
import { NoteResponseDTO } from '../dtos/note-response.dto.js';
import { Note } from '../../../domain/note/note.entity.js';

export class GetNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: number): Promise<NoteResponseDTO> {
    const note = await this.noteRepository.findById(id);

    if (!note) {
      throw new NoteNotFoundError(id);
    }

    return this.toResponseDTO(note);
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
