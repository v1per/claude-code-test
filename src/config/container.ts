/**
 * Dependency Injection Container
 * Wires together all layers of the application
 */

import { db } from '../infrastructure/database/connection.js';
import { NoteRepositoryImpl } from '../infrastructure/repositories/note.repository.impl.js';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl.js';
import { CreateNoteUseCase } from '../application/note/use-cases/create-note.use-case.js';
import { UpdateNoteUseCase } from '../application/note/use-cases/update-note.use-case.js';
import { DeleteNoteUseCase } from '../application/note/use-cases/delete-note.use-case.js';
import { GetNoteUseCase } from '../application/note/use-cases/get-note.use-case.js';
import { GetAllNotesUseCase } from '../application/note/use-cases/get-all-notes.use-case.js';
import { SignUpUseCase } from '../application/user/use-cases/sign-up.use-case.js';
import { SignInUseCase } from '../application/user/use-cases/sign-in.use-case.js';
import { NoteController } from '../presentation/controllers/note.controller.js';
import { UserController } from '../presentation/controllers/user.controller.js';

/**
 * Application Container
 * Manages dependencies and their lifecycles
 */
export class Container {
  // Repositories
  private noteRepository: NoteRepositoryImpl;
  private userRepository: UserRepositoryImpl;

  // Note Use Cases
  private createNoteUseCase: CreateNoteUseCase;
  private updateNoteUseCase: UpdateNoteUseCase;
  private deleteNoteUseCase: DeleteNoteUseCase;
  private getNoteUseCase: GetNoteUseCase;
  private getAllNotesUseCase: GetAllNotesUseCase;

  // User Use Cases
  private signUpUseCase: SignUpUseCase;
  private signInUseCase: SignInUseCase;

  // Controllers
  private noteControllerInstance: NoteController;
  private userControllerInstance: UserController;

  constructor() {
    // Infrastructure Layer
    this.noteRepository = new NoteRepositoryImpl(db);
    this.userRepository = new UserRepositoryImpl(db);

    // Application Layer - Note Use Cases
    this.createNoteUseCase = new CreateNoteUseCase(this.noteRepository);
    this.updateNoteUseCase = new UpdateNoteUseCase(this.noteRepository);
    this.deleteNoteUseCase = new DeleteNoteUseCase(this.noteRepository);
    this.getNoteUseCase = new GetNoteUseCase(this.noteRepository);
    this.getAllNotesUseCase = new GetAllNotesUseCase(this.noteRepository);

    // Application Layer - User Use Cases
    this.signUpUseCase = new SignUpUseCase(this.userRepository);
    this.signInUseCase = new SignInUseCase(this.userRepository);

    // Presentation Layer
    this.noteControllerInstance = new NoteController(
      this.createNoteUseCase,
      this.updateNoteUseCase,
      this.deleteNoteUseCase,
      this.getNoteUseCase,
      this.getAllNotesUseCase
    );

    this.userControllerInstance = new UserController(
      this.signUpUseCase,
      this.signInUseCase
    );
  }

  /**
   * Get Note Controller
   */
  get noteController(): NoteController {
    return this.noteControllerInstance;
  }

  /**
   * Get User Controller
   */
  get userController(): UserController {
    return this.userControllerInstance;
  }
}

// Export singleton instance
export const container = new Container();
