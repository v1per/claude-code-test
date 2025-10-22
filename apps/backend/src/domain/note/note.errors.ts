/**
 * Domain-specific errors for Note entity
 */

export class NoteNotFoundError extends Error {
  constructor(id: number) {
    super(`Note with id ${id} not found`);
    this.name = 'NoteNotFoundError';
  }
}

export class InvalidNoteTitleError extends Error {
  constructor(message: string = 'Invalid note title') {
    super(message);
    this.name = 'InvalidNoteTitleError';
  }
}

export class InvalidNoteContentError extends Error {
  constructor(message: string = 'Invalid note content') {
    super(message);
    this.name = 'InvalidNoteContentError';
  }
}

export class UnauthorizedNoteAccessError extends Error {
  constructor(message: string = 'You are not authorized to perform this action on this note') {
    super(message);
    this.name = 'UnauthorizedNoteAccessError';
  }
}
