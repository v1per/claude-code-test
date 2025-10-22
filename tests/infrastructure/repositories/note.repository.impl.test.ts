/**
 * Integration Tests for NoteRepositoryImpl
 * Tests against real PostgreSQL database
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  setupTestDatabase,
  dropTestDatabase,
  cleanTestDatabase,
  getTestDbClient,
} from '../../helpers/test-db-setup.js';
import { NoteRepositoryImpl } from '../../../src/infrastructure/repositories/note.repository.impl.js';
import { UserRepositoryImpl } from '../../../src/infrastructure/repositories/user.repository.impl.js';
import { Note } from '../../../src/domain/note/note.entity.js';
import { User } from '../../../src/domain/user/user.entity.js';
import * as schema from '../../../src/infrastructure/database/schema.js';

describe('NoteRepositoryImpl Integration Tests', () => {
  let client: postgres.Sql;
  let db: ReturnType<typeof drizzle>;
  let noteRepository: NoteRepositoryImpl;
  let userRepository: UserRepositoryImpl;
  let testUser: User;

  // Setup: Create database and run migrations once before all tests
  beforeAll(async () => {
    await setupTestDatabase();
    client = getTestDbClient();
    db = drizzle(client, { schema });
    noteRepository = new NoteRepositoryImpl(db);
    userRepository = new UserRepositoryImpl(db);
  });

  // Cleanup: Drop test database after all tests
  afterAll(async () => {
    await client.end();
    await dropTestDatabase();
  });

  // Clean tables and create a test user before each test
  beforeEach(async () => {
    await cleanTestDatabase(client);

    // Create a test user for foreign key references
    const user = User.create({
      email: 'testuser@example.com',
      passwordHash: 'hashedpassword',
      name: 'Test User',
    });
    testUser = await userRepository.create(user);
  });

  describe('create', () => {
    it('should create a new note in the database', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Test Note',
        content: 'This is a test note',
      });

      // Act
      const createdNote = await noteRepository.create(note);

      // Assert
      expect(createdNote).toBeDefined();
      expect(createdNote.id).toBeDefined();
      expect(createdNote.userId).toBe(testUser.id);
      expect(createdNote.title).toBe('Test Note');
      expect(createdNote.content).toBe('This is a test note');
      expect(createdNote.createdAt).toBeInstanceOf(Date);
      expect(createdNote.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist note data correctly', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Persist Test',
        content: 'Testing persistence',
      });

      // Act
      const createdNote = await noteRepository.create(note);
      const foundNote = await noteRepository.findById(createdNote.id!);

      // Assert
      expect(foundNote).toBeDefined();
      expect(foundNote?.title).toBe('Persist Test');
      expect(foundNote?.content).toBe('Testing persistence');
      expect(foundNote?.userId).toBe(testUser.id);
    });
  });

  describe('findById', () => {
    it('should find an existing note by id', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Find By ID',
        content: 'Testing findById',
      });
      const createdNote = await noteRepository.create(note);

      // Act
      const foundNote = await noteRepository.findById(createdNote.id!);

      // Assert
      expect(foundNote).toBeDefined();
      expect(foundNote?.id).toBe(createdNote.id);
      expect(foundNote?.title).toBe('Find By ID');
      expect(foundNote?.content).toBe('Testing findById');
      expect(foundNote?.userId).toBe(testUser.id);
    });

    it('should return null when note does not exist', async () => {
      // Act
      const foundNote = await noteRepository.findById(99999);

      // Assert
      expect(foundNote).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all notes ordered by createdAt', async () => {
      // Arrange
      const note1 = Note.create({
        userId: testUser.id!,
        title: 'First Note',
        content: 'Content 1',
      });
      const note2 = Note.create({
        userId: testUser.id!,
        title: 'Second Note',
        content: 'Content 2',
      });
      const note3 = Note.create({
        userId: testUser.id!,
        title: 'Third Note',
        content: 'Content 3',
      });

      await noteRepository.create(note1);
      await noteRepository.create(note2);
      await noteRepository.create(note3);

      // Act
      const allNotes = await noteRepository.findAll();

      // Assert
      expect(allNotes).toHaveLength(3);
      expect(allNotes[0].title).toBe('First Note');
      expect(allNotes[1].title).toBe('Second Note');
      expect(allNotes[2].title).toBe('Third Note');
    });

    it('should return empty array when no notes exist', async () => {
      // Act
      const allNotes = await noteRepository.findAll();

      // Assert
      expect(allNotes).toEqual([]);
    });

    it('should return notes from different users', async () => {
      // Arrange - Create another user
      const user2 = User.create({
        email: 'user2@example.com',
        passwordHash: 'hash2',
        name: 'User 2',
      });
      const secondUser = await userRepository.create(user2);

      // Create notes for both users
      const note1 = Note.create({
        userId: testUser.id!,
        title: 'User 1 Note',
        content: 'Content',
      });
      const note2 = Note.create({
        userId: secondUser.id!,
        title: 'User 2 Note',
        content: 'Content',
      });

      await noteRepository.create(note1);
      await noteRepository.create(note2);

      // Act
      const allNotes = await noteRepository.findAll();

      // Assert
      expect(allNotes).toHaveLength(2);
      expect(allNotes.find((n) => n.userId === testUser.id)).toBeDefined();
      expect(allNotes.find((n) => n.userId === secondUser.id)).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update an existing note', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Original Title',
        content: 'Original Content',
      });
      const createdNote = await noteRepository.create(note);

      // Modify the note
      createdNote.update('Updated Title', 'Updated Content');

      // Act
      const updatedNote = await noteRepository.update(createdNote.id!, createdNote);

      // Assert
      expect(updatedNote).toBeDefined();
      expect(updatedNote?.title).toBe('Updated Title');
      expect(updatedNote?.content).toBe('Updated Content');
      expect(updatedNote?.userId).toBe(testUser.id); // userId should remain unchanged
    });

    it('should update only title', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Original Title',
        content: 'Original Content',
      });
      const createdNote = await noteRepository.create(note);

      // Modify only title
      createdNote.updateTitle('New Title');

      // Act
      const updatedNote = await noteRepository.update(createdNote.id!, createdNote);

      // Assert
      expect(updatedNote?.title).toBe('New Title');
      expect(updatedNote?.content).toBe('Original Content');
    });

    it('should update only content', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Original Title',
        content: 'Original Content',
      });
      const createdNote = await noteRepository.create(note);

      // Modify only content
      createdNote.updateContent('New Content');

      // Act
      const updatedNote = await noteRepository.update(createdNote.id!, createdNote);

      // Assert
      expect(updatedNote?.title).toBe('Original Title');
      expect(updatedNote?.content).toBe('New Content');
    });

    it('should return null when updating non-existent note', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Fake Note',
        content: 'Content',
      });

      // Act
      const result = await noteRepository.update(99999, note);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing note', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Delete Me',
        content: 'This note will be deleted',
      });
      const createdNote = await noteRepository.create(note);

      // Act
      const deletedNote = await noteRepository.delete(createdNote.id!);

      // Assert
      expect(deletedNote).toBeDefined();
      expect(deletedNote?.id).toBe(createdNote.id);

      // Verify note is actually deleted
      const foundNote = await noteRepository.findById(createdNote.id!);
      expect(foundNote).toBeNull();
    });

    it('should return null when deleting non-existent note', async () => {
      // Act
      const result = await noteRepository.delete(99999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('foreign key constraints', () => {
    it('should enforce foreign key constraint on userId', async () => {
      // This test verifies that we cannot create a note with an invalid userId
      // In a real database, this would throw a foreign key constraint error

      // We'll verify by trying to create a note with a non-existent userId
      const note = Note.create({
        userId: 99999, // Non-existent user
        title: 'Invalid User Note',
        content: 'This should fail',
      });

      // Act & Assert
      await expect(async () => {
        await noteRepository.create(note);
      }).rejects.toThrow();
    });
  });

  describe('domain entity mapping', () => {
    it('should correctly map database records to domain entities', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Mapping Test',
        content: 'Testing entity mapping',
      });
      const createdNote = await noteRepository.create(note);

      // Act
      const foundNote = await noteRepository.findById(createdNote.id!);

      // Assert - Verify it's a proper domain entity
      expect(foundNote).toBeInstanceOf(Note);
      expect(foundNote?.toObject()).toEqual({
        id: createdNote.id,
        userId: testUser.id,
        title: 'Mapping Test',
        content: 'Testing entity mapping',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should preserve domain entity behavior after retrieval', async () => {
      // Arrange
      const note = Note.create({
        userId: testUser.id!,
        title: 'Behavior Test',
        content: 'Original',
      });
      const createdNote = await noteRepository.create(note);

      // Act
      const foundNote = await noteRepository.findById(createdNote.id!);

      // Assert - Domain entity should have all methods
      expect(foundNote?.isAuthor(testUser.id!)).toBe(true);
      expect(foundNote?.isAuthor(999)).toBe(false);

      // Should be able to call domain methods
      foundNote?.update('New Title');
      expect(foundNote?.title).toBe('New Title');
    });
  });
});
