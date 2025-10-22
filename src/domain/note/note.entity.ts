/**
 * Note Domain Entity
 * Contains business logic and invariants
 */

import { InvalidNoteContentError, InvalidNoteTitleError } from './note.errors.js';

export interface NoteProps {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Note {
  private constructor(
    private readonly _id: number | undefined,
    private _title: string,
    private _content: string,
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
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
