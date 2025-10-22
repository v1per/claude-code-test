/**
 * Note Use Cases Unit Tests
 * Tests application logic with mocked repositories
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateNoteUseCase } from '../../../../src/application/note/use-cases/create-note.use-case.js';
import { UpdateNoteUseCase } from '../../../../src/application/note/use-cases/update-note.use-case.js';
import { DeleteNoteUseCase } from '../../../../src/application/note/use-cases/delete-note.use-case.js';
import { GetNoteUseCase } from '../../../../src/application/note/use-cases/get-note.use-case.js';
import { GetAllNotesUseCase } from '../../../../src/application/note/use-cases/get-all-notes.use-case.js';
import { INoteRepository } from '../../../../src/domain/note/note.repository.js';
import { Note } from '../../../../src/domain/note/note.entity.js';
import {
  NoteNotFoundError,
  UnauthorizedNoteAccessError,
  InvalidNoteTitleError,
} from '../../../../src/domain/note/note.errors.js';

describe('Note Use Cases', () => {
  let mockNoteRepository: INoteRepository;

  beforeEach(() => {
    // Create a fresh mock repository before each test
    mockNoteRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe('CreateNoteUseCase', () => {
    it('should create a note successfully', async () => {
      const useCase = new CreateNoteUseCase(mockNoteRepository);
      const createdNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      vi.mocked(mockNoteRepository.create).mockResolvedValue(createdNote);

      const result = await useCase.execute(42, {
        title: 'Test Note',
        content: 'Test content',
      });

      expect(mockNoteRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should assign userId from the authenticated user', async () => {
      const useCase = new CreateNoteUseCase(mockNoteRepository);
      const createdNote = Note.create({
        id: 1,
        userId: 99,
        title: 'Test Note',
        content: 'Test content',
      });

      vi.mocked(mockNoteRepository.create).mockResolvedValue(createdNote);

      await useCase.execute(99, {
        title: 'Test Note',
        content: 'Test content',
      });

      // Verify the repository was called with a Note that has userId 99
      const callArg = vi.mocked(mockNoteRepository.create).mock.calls[0][0];
      expect(callArg.toObject().userId).toBe(99);
    });

    it('should throw InvalidNoteTitleError when title is empty', async () => {
      const useCase = new CreateNoteUseCase(mockNoteRepository);

      await expect(
        useCase.execute(42, {
          title: '',
          content: 'Test content',
        })
      ).rejects.toThrow(InvalidNoteTitleError);

      expect(mockNoteRepository.create).not.toHaveBeenCalled();
    });

    it('should accept title and content with whitespace', async () => {
      const useCase = new CreateNoteUseCase(mockNoteRepository);
      const createdNote = Note.create({
        id: 1,
        userId: 42,
        title: '  Test Note  ',
        content: '  Test content  ',
      });

      vi.mocked(mockNoteRepository.create).mockResolvedValue(createdNote);

      await useCase.execute(42, {
        title: '  Test Note  ',
        content: '  Test content  ',
      });

      const callArg = vi.mocked(mockNoteRepository.create).mock.calls[0][0];
      expect(callArg.toObject().title).toBe('  Test Note  ');
      expect(callArg.toObject().content).toBe('  Test content  ');
    });
  });

  describe('UpdateNoteUseCase', () => {
    it('should update a note successfully', async () => {
      const useCase = new UpdateNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Original Title',
        content: 'Original Content',
      });
      const updatedNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Updated Title',
        content: 'Updated Content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
      vi.mocked(mockNoteRepository.update).mockResolvedValue(updatedNote);

      const result = await useCase.execute(1, 42, {
        title: 'Updated Title',
        content: 'Updated Content',
      });

      expect(mockNoteRepository.findById).toHaveBeenCalledWith(1);
      expect(mockNoteRepository.update).toHaveBeenCalledWith(1, expect.any(Note));
      expect(result.title).toBe('Updated Title');
      expect(result.content).toBe('Updated Content');
    });

    it('should throw NoteNotFoundError when note does not exist', async () => {
      const useCase = new UpdateNoteUseCase(mockNoteRepository);

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

      await expect(
        useCase.execute(999, 42, {
          title: 'Updated Title',
          content: 'Updated Content',
        })
      ).rejects.toThrow(NoteNotFoundError);

      expect(mockNoteRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedNoteAccessError when user is not the author', async () => {
      const useCase = new UpdateNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Original Title',
        content: 'Original Content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

      await expect(
        useCase.execute(1, 99, {
          // Different userId (99 instead of 42)
          title: 'Updated Title',
          content: 'Updated Content',
        })
      ).rejects.toThrow(UnauthorizedNoteAccessError);

      expect(mockNoteRepository.update).not.toHaveBeenCalled();
    });

    it('should update only title when content is undefined', async () => {
      const useCase = new UpdateNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Original Title',
        content: 'Original Content',
      });
      const updatedNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Updated Title',
        content: 'Original Content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
      vi.mocked(mockNoteRepository.update).mockResolvedValue(updatedNote);

      const result = await useCase.execute(1, 42, {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
      expect(result.content).toBe('Original Content');
    });

    it('should throw NoteNotFoundError when update returns null', async () => {
      const useCase = new UpdateNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Original Title',
        content: 'Original Content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
      vi.mocked(mockNoteRepository.update).mockResolvedValue(null);

      await expect(
        useCase.execute(1, 42, {
          title: 'Updated Title',
        })
      ).rejects.toThrow(NoteNotFoundError);
    });
  });

  describe('DeleteNoteUseCase', () => {
    it('should delete a note successfully', async () => {
      const useCase = new DeleteNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
      vi.mocked(mockNoteRepository.delete).mockResolvedValue(existingNote);

      const result = await useCase.execute(1, 42);

      expect(mockNoteRepository.findById).toHaveBeenCalledWith(1);
      expect(mockNoteRepository.delete).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Note');
    });

    it('should throw NoteNotFoundError when note does not exist', async () => {
      const useCase = new DeleteNoteUseCase(mockNoteRepository);

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

      await expect(useCase.execute(999, 42)).rejects.toThrow(NoteNotFoundError);

      expect(mockNoteRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedNoteAccessError when user is not the author', async () => {
      const useCase = new DeleteNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

      await expect(useCase.execute(1, 99)).rejects.toThrow(UnauthorizedNoteAccessError);

      expect(mockNoteRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NoteNotFoundError when delete returns null', async () => {
      const useCase = new DeleteNoteUseCase(mockNoteRepository);
      const existingNote = Note.create({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
      vi.mocked(mockNoteRepository.delete).mockResolvedValue(null);

      await expect(useCase.execute(1, 42)).rejects.toThrow(NoteNotFoundError);
    });
  });

  describe('GetNoteUseCase', () => {
    it('should get a note by id successfully', async () => {
      const useCase = new GetNoteUseCase(mockNoteRepository);
      const note = Note.create({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
      });

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(note);

      const result = await useCase.execute(1);

      expect(mockNoteRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NoteNotFoundError when note does not exist', async () => {
      const useCase = new GetNoteUseCase(mockNoteRepository);

      vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

      await expect(useCase.execute(999)).rejects.toThrow(NoteNotFoundError);
    });
  });

  describe('GetAllNotesUseCase', () => {
    it('should get all notes successfully', async () => {
      const useCase = new GetAllNotesUseCase(mockNoteRepository);
      const notes = [
        Note.create({
          id: 1,
          userId: 42,
          title: 'Note 1',
          content: 'Content 1',
        }),
        Note.create({
          id: 2,
          userId: 43,
          title: 'Note 2',
          content: 'Content 2',
        }),
        Note.create({
          id: 3,
          userId: 42,
          title: 'Note 3',
          content: 'Content 3',
        }),
      ];

      vi.mocked(mockNoteRepository.findAll).mockResolvedValue(notes);

      const result = await useCase.execute();

      expect(mockNoteRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });

    it('should return empty array when no notes exist', async () => {
      const useCase = new GetAllNotesUseCase(mockNoteRepository);

      vi.mocked(mockNoteRepository.findAll).mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });

    it('should return all note properties correctly', async () => {
      const useCase = new GetAllNotesUseCase(mockNoteRepository);
      const notes = [
        Note.create({
          id: 1,
          userId: 42,
          title: 'Test Note',
          content: 'Test content',
        }),
      ];

      vi.mocked(mockNoteRepository.findAll).mockResolvedValue(notes);

      const result = await useCase.execute();

      expect(result[0]).toEqual({
        id: 1,
        userId: 42,
        title: 'Test Note',
        content: 'Test content',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
