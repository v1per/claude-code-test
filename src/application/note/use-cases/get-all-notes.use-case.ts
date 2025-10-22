/**
 * Get All Notes Use Case
 * Application service for retrieving all notes
 */

import { INoteRepository } from '../../../domain/note/note.repository.js';
import { NoteResponseDTO } from '../dtos/note-response.dto.js';
import { Note } from '../../../domain/note/note.entity.js';

export class GetAllNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(): Promise<NoteResponseDTO[]> {
    const notes = await this.noteRepository.findAll();
    return notes.map(note => this.toResponseDTO(note));
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
