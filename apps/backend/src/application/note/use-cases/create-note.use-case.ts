/**
 * Create Note Use Case
 * Application service for creating a new note
 */

import { Note } from '../../../domain/note/note.entity.js';
import { INoteRepository } from '../../../domain/note/note.repository.js';
import { CreateNoteDTO } from '../dtos/create-note.dto.js';
import { NoteResponseDTO } from '../dtos/note-response.dto.js';

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(userId: number, dto: CreateNoteDTO): Promise<NoteResponseDTO> {
    // Create domain entity with business logic validation
    const note = Note.create({
      userId,
      title: dto.title,
      content: dto.content,
      color: dto.color,
      positionX: dto.positionX,
      positionY: dto.positionY,
    });

    // Persist through repository
    const createdNote = await this.noteRepository.create(note);

    // Return DTO
    return this.toResponseDTO(createdNote);
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
