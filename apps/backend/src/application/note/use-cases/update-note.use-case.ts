/**
 * Update Note Use Case
 * Application service for updating an existing note
 */

import { Note } from '../../../domain/note/note.entity.js';
import { INoteRepository } from '../../../domain/note/note.repository.js';
import { NoteNotFoundError } from '../../../domain/note/note.errors.js';
import { UpdateNoteDTO } from '../dtos/update-note.dto.js';
import { NoteResponseDTO } from '../dtos/note-response.dto.js';

export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: number, userId: number, dto: UpdateNoteDTO): Promise<NoteResponseDTO> {
    // Find existing note
    const existingNote = await this.noteRepository.findById(id);
    if (!existingNote) {
      throw new NoteNotFoundError(id);
    }

    // Verify authorization - only author can update
    existingNote.verifyAuthorization(userId);

    // Update using domain logic
    existingNote.update(dto.title, dto.content, dto.color, dto.positionX, dto.positionY);

    // Persist changes
    const updatedNote = await this.noteRepository.update(id, existingNote);
    if (!updatedNote) {
      throw new NoteNotFoundError(id);
    }

    // Return DTO
    return this.toResponseDTO(updatedNote);
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
