/**
 * Note Repository Implementation (Adapter)
 * Infrastructure concern - implements the domain repository interface
 */

import { eq } from 'drizzle-orm';
import { Note } from '../../domain/note/note.entity.js';
import { INoteRepository } from '../../domain/note/note.repository.js';
import { Database } from '../database/connection.js';
import { notes, NoteRecord } from '../database/schema.js';

export class NoteRepositoryImpl implements INoteRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Note[]> {
    const records = await this.db.select().from(notes).orderBy(notes.createdAt);
    return records.map(record => this.toDomain(record));
  }

  async findById(id: number): Promise<Note | null> {
    const records = await this.db.select().from(notes).where(eq(notes.id, id)).limit(1);

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  async create(note: Note): Promise<Note> {
    const noteObj = note.toObject();

    const records = await this.db
      .insert(notes)
      .values({
        userId: noteObj.userId,
        title: noteObj.title,
        content: noteObj.content,
        color: noteObj.color,
        positionX: noteObj.positionX,
        positionY: noteObj.positionY,
      })
      .returning();

    return this.toDomain(records[0]);
  }

  async update(id: number, note: Note): Promise<Note | null> {
    const noteObj = note.toObject();

    const records = await this.db
      .update(notes)
      .set({
        title: noteObj.title,
        content: noteObj.content,
        color: noteObj.color,
        positionX: noteObj.positionX,
        positionY: noteObj.positionY,
        updatedAt: noteObj.updatedAt,
      })
      .where(eq(notes.id, id))
      .returning();

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  async delete(id: number): Promise<Note | null> {
    const records = await this.db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  /**
   * Maps database record to domain entity
   */
  private toDomain(record: NoteRecord): Note {
    return Note.create({
      id: record.id,
      userId: record.userId,
      title: record.title,
      content: record.content,
      color: record.color,
      positionX: record.positionX,
      positionY: record.positionY,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
