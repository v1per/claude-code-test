/**
 * Note Domain Entity
 * Contains business logic and invariants
 */

import { InvalidNoteContentError, InvalidNoteTitleError, UnauthorizedNoteAccessError } from './note.errors.js';

export interface NoteProps {
  id?: number;
  title: string;
  content: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Note {
  private constructor(
    private readonly _id: number | undefined,
    private _title: string,
    private _content: string,
    private readonly _userId: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method to create a new Note
   */
  static create(props: NoteProps): Note {
    return new Note(
      props.id,
      props.title,
      props.content,
      props.userId,
      props.createdAt || new Date(),
      props.updatedAt || new Date()
    );
  }

  /**
   * Business rule validation
   */
  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new InvalidNoteTitleError('Title cannot be empty');
    }

    if (this._title.length > 255) {
      throw new InvalidNoteTitleError('Title cannot exceed 255 characters');
    }

    if (!this._content || this._content.trim().length === 0) {
      throw new InvalidNoteContentError('Content cannot be empty');
    }

    if (!this._userId || this._userId <= 0) {
      throw new Error('User ID is required');
    }
  }

  /**
   * Check if the user is the author of this note
   */
  isAuthor(userId: number): boolean {
    return this._userId === userId;
  }

  /**
   * Verify authorization for modifying the note
   */
  verifyAuthorization(userId: number): void {
    if (!this.isAuthor(userId)) {
      throw new UnauthorizedNoteAccessError('Only the author can modify or delete this note');
    }
  }

  /**
   * Update note title
   */
  updateTitle(title: string): void {
    this._title = title;
    this._updatedAt = new Date();
    this.validate();
  }

  /**
   * Update note content
   */
  updateContent(content: string): void {
    this._content = content;
    this._updatedAt = new Date();
    this.validate();
  }

  /**
   * Update both title and content
   */
  update(title?: string, content?: string): void {
    if (title !== undefined) {
      this._title = title;
    }
    if (content !== undefined) {
      this._content = content;
    }
    this._updatedAt = new Date();
    this.validate();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get userId(): number {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Convert to plain object
   */
  toObject(): NoteProps {
    return {
      id: this._id,
      title: this._title,
      content: this._content,
      userId: this._userId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
