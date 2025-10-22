/**
 * Dependency Injection Container
 * Wires together all layers of the application
 */

import { db } from '../infrastructure/database/connection.js';
import { NoteRepositoryImpl } from '../infrastructure/repositories/note.repository.impl.js';
import { CreateNoteUseCase } from '../application/note/use-cases/create-note.use-case.js';
import { UpdateNoteUseCase } from '../application/note/use-cases/update-note.use-case.js';
import { DeleteNoteUseCase } from '../application/note/use-cases/delete-note.use-case.js';
import { GetNoteUseCase } from '../application/note/use-cases/get-note.use-case.js';
import { GetAllNotesUseCase } from '../application/note/use-cases/get-all-notes.use-case.js';
import { NoteController } from '../presentation/controllers/note.controller.js';

/**
 * Application Container
 * Manages dependencies and their lifecycles
 */
export class Container {
  // Repositories
  private noteRepository: NoteRepositoryImpl;

  // Use Cases
  private createNoteUseCase: CreateNoteUseCase;
  private updateNoteUseCase: UpdateNoteUseCase;
  private deleteNoteUseCase: DeleteNoteUseCase;
  private getNoteUseCase: GetNoteUseCase;
  private getAllNotesUseCase: GetAllNotesUseCase;

  // Controllers
  private noteControllerInstance: NoteController;

  constructor() {
    // Infrastructure Layer
    this.noteRepository = new NoteRepositoryImpl(db);

    // Application Layer
    this.createNoteUseCase = new CreateNoteUseCase(this.noteRepository);
    this.updateNoteUseCase = new UpdateNoteUseCase(this.noteRepository);
    this.deleteNoteUseCase = new DeleteNoteUseCase(this.noteRepository);
    this.getNoteUseCase = new GetNoteUseCase(this.noteRepository);
    this.getAllNotesUseCase = new GetAllNotesUseCase(this.noteRepository);

    // Presentation Layer
    this.noteControllerInstance = new NoteController(
      this.createNoteUseCase,
      this.updateNoteUseCase,
      this.deleteNoteUseCase,
      this.getNoteUseCase,
      this.getAllNotesUseCase
    );
  }

  /**
   * Get Note Controller
   */
  get noteController(): NoteController {
    return this.noteControllerInstance;
  }
}

// Export singleton instance
export const container = new Container();
