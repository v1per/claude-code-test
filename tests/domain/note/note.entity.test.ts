/**
 * Note Entity Unit Tests
 * Tests business logic and validation rules
 */

import { describe, it, expect } from 'vitest';
import { Note } from '../../../src/domain/note/note.entity.js';
import {
  InvalidNoteTitleError,
  InvalidNoteContentError,
  UnauthorizedNoteAccessError,
} from '../../../src/domain/note/note.errors.js';

describe('Note Entity', () => {
  describe('create', () => {
    it('should create a new note with valid data', () => {
      const note = Note.create({
        userId: 1,
        title: 'Test Note',
        content: 'Test content',
      });

      const noteObj = note.toObject();
      expect(noteObj.id).toBeUndefined();
      expect(noteObj.userId).toBe(1);
      expect(noteObj.title).toBe('Test Note');
      expect(noteObj.content).toBe('Test content');
      expect(noteObj.createdAt).toBeInstanceOf(Date);
      expect(noteObj.updatedAt).toBeInstanceOf(Date);
    });

    it('should accept title and content with leading/trailing whitespace', () => {
      const note = Note.create({
        userId: 1,
        title: '  Test Note  ',
        content: '  Test content  ',
      });

      const noteObj = note.toObject();
      expect(noteObj.title).toBe('  Test Note  ');
      expect(noteObj.content).toBe('  Test content  ');
    });

    it('should throw InvalidNoteTitleError when title is empty', () => {
      expect(() =>
        Note.create({
          userId: 1,
          title: '',
          content: 'Test content',
        })
      ).toThrow(InvalidNoteTitleError);
    });

    it('should throw InvalidNoteTitleError when title is only whitespace', () => {
      expect(() =>
        Note.create({
          userId: 1,
          title: '   ',
          content: 'Test content',
        })
      ).toThrow(InvalidNoteTitleError);
    });

    it('should throw InvalidNoteTitleError when title exceeds 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      expect(() =>
        Note.create({
          userId: 1,
          title: longTitle,
          content: 'Test content',
        })
      ).toThrow(InvalidNoteTitleError);
    });

    it('should accept title with exactly 255 characters', () => {
      const maxTitle = 'a'.repeat(255);
      const note = Note.create({
        userId: 1,
        title: maxTitle,
        content: 'Test content',
      });

      expect(note.toObject().title).toBe(maxTitle);
    });

    it('should throw InvalidNoteContentError when content is empty', () => {
      expect(() =>
        Note.create({
          userId: 1,
          title: 'Test Note',
          content: '',
        })
      ).toThrow(InvalidNoteContentError);
    });

    it('should throw InvalidNoteContentError when content is only whitespace', () => {
      expect(() =>
        Note.create({
          userId: 1,
          title: 'Test Note',
          content: '   ',
        })
      ).toThrow(InvalidNoteContentError);
    });

    it('should create note with id when provided', () => {
      const note = Note.create({
        id: 42,
        userId: 1,
        title: 'Test Note',
        content: 'Test content',
      });

      expect(note.toObject().id).toBe(42);
    });

    it('should create note with custom timestamps when provided', () => {
      const now = new Date('2024-01-01');
      const note = Note.create({
        id: 1,
        userId: 5,
        title: 'Test Note',
        content: 'Test content',
        createdAt: now,
        updatedAt: now,
      });

      const noteObj = note.toObject();
      expect(noteObj.createdAt).toBe(now);
      expect(noteObj.updatedAt).toBe(now);
    });
  });

  describe('update', () => {
    it('should update title when provided', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      note.update('Updated Title', undefined);

      const noteObj = note.toObject();
      expect(noteObj.title).toBe('Updated Title');
      expect(noteObj.content).toBe('Original Content');
    });

    it('should update content when provided', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      note.update(undefined, 'Updated Content');

      const noteObj = note.toObject();
      expect(noteObj.title).toBe('Original Title');
      expect(noteObj.content).toBe('Updated Content');
    });

    it('should update both title and content when both provided', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      note.update('Updated Title', 'Updated Content');

      const noteObj = note.toObject();
      expect(noteObj.title).toBe('Updated Title');
      expect(noteObj.content).toBe('Updated Content');
    });

    it('should accept whitespace when updating', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      note.update('  Updated Title  ', '  Updated Content  ');

      const noteObj = note.toObject();
      expect(noteObj.title).toBe('  Updated Title  ');
      expect(noteObj.content).toBe('  Updated Content  ');
    });

    it('should throw InvalidNoteTitleError when updating with empty title', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      expect(() => note.update('', undefined)).toThrow(InvalidNoteTitleError);
    });

    it('should throw InvalidNoteContentError when updating with empty content', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      expect(() => note.update(undefined, '')).toThrow(InvalidNoteContentError);
    });

    it('should update updatedAt timestamp', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      const originalUpdatedAt = note.toObject().updatedAt;

      // Wait a tiny bit to ensure timestamp changes
      setTimeout(() => {
        note.update('Updated Title', undefined);
        const newUpdatedAt = note.toObject().updatedAt;
        expect(newUpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should not change title or content when both parameters are undefined', () => {
      const note = Note.create({
        userId: 1,
        title: 'Original Title',
        content: 'Original Content',
      });

      const originalTitle = note.toObject().title;
      const originalContent = note.toObject().content;

      note.update(undefined, undefined);

      expect(note.toObject().title).toBe(originalTitle);
      expect(note.toObject().content).toBe(originalContent);
    });
  });

  describe('isAuthor', () => {
    it('should return true when userId matches the note author', () => {
      const note = Note.create({
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      expect(note.isAuthor(42)).toBe(true);
    });

    it('should return false when userId does not match the note author', () => {
      const note = Note.create({
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      expect(note.isAuthor(99)).toBe(false);
    });
  });

  describe('verifyAuthorization', () => {
    it('should not throw when userId matches the note author', () => {
      const note = Note.create({
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      expect(() => note.verifyAuthorization(42)).not.toThrow();
    });

    it('should throw UnauthorizedNoteAccessError when userId does not match', () => {
      const note = Note.create({
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      expect(() => note.verifyAuthorization(99)).toThrow(UnauthorizedNoteAccessError);
    });

    it('should throw error with descriptive message', () => {
      const note = Note.create({
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      expect(() => note.verifyAuthorization(99)).toThrow(
        'Only the author can modify or delete this note'
      );
    });
  });

  describe('toObject', () => {
    it('should return a plain object representation', () => {
      const now = new Date();
      const note = Note.create({
        id: 1,
        userId: 5,
        title: 'Test Note',
        content: 'Test content',
        createdAt: now,
        updatedAt: now,
      });

      const obj = note.toObject();

      expect(obj).toEqual({
        id: 1,
        userId: 5,
        title: 'Test Note',
        content: 'Test content',
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('getters', () => {
    it('should expose all properties via getters', () => {
      const now = new Date();
      const note = Note.create({
        id: 1,
        userId: 5,
        title: 'Test Note',
        content: 'Test content',
        createdAt: now,
        updatedAt: now,
      });

      expect(note.id).toBe(1);
      expect(note.userId).toBe(5);
      expect(note.title).toBe('Test Note');
      expect(note.content).toBe('Test content');
      expect(note.createdAt).toBe(now);
      expect(note.updatedAt).toBe(now);
    });
  });
});
