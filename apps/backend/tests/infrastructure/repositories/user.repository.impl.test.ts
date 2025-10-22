/**
 * Integration Tests for UserRepositoryImpl
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
import { UserRepositoryImpl } from '../../../src/infrastructure/repositories/user.repository.impl.js';
import { User } from '../../../src/domain/user/user.entity.js';
import * as schema from '../../../src/infrastructure/database/schema.js';

describe('UserRepositoryImpl Integration Tests', () => {
  let client: postgres.Sql;
  let db: ReturnType<typeof drizzle>;
  let userRepository: UserRepositoryImpl;

  // Setup: Create database and run migrations once before all tests
  beforeAll(async () => {
    await setupTestDatabase();
    client = getTestDbClient();
    db = drizzle(client, { schema });
    userRepository = new UserRepositoryImpl(db);
  });

  // Cleanup: Drop test database after all tests
  afterAll(async () => {
    await client.end();
    await dropTestDatabase();
  });

  // Clean tables before each test for isolation
  beforeEach(async () => {
    await cleanTestDatabase(client);
  });

  describe('create', () => {
    it('should create a new user in the database', async () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
      });

      // Act
      const createdUser = await userRepository.create(user);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe('test@example.com');
      expect(createdUser.name).toBe('Test User');
      expect(createdUser.passwordHash).toBe('hashedpassword123');
      expect(createdUser.createdAt).toBeInstanceOf(Date);
      expect(createdUser.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist user data correctly', async () => {
      // Arrange
      const user = User.create({
        email: 'persist@example.com',
        passwordHash: 'hashed456',
        name: 'Persist Test',
      });

      // Act
      const createdUser = await userRepository.create(user);
      const foundUser = await userRepository.findById(createdUser.id!);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('persist@example.com');
      expect(foundUser?.name).toBe('Persist Test');
    });
  });

  describe('findById', () => {
    it('should find an existing user by id', async () => {
      // Arrange
      const user = User.create({
        email: 'findbyid@example.com',
        passwordHash: 'hashed789',
        name: 'Find By ID Test',
      });
      const createdUser = await userRepository.create(user);

      // Act
      const foundUser = await userRepository.findById(createdUser.id!);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe('findbyid@example.com');
      expect(foundUser?.name).toBe('Find By ID Test');
    });

    it('should return null when user does not exist', async () => {
      // Act
      const foundUser = await userRepository.findById(99999);

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find an existing user by email', async () => {
      // Arrange
      const user = User.create({
        email: 'findbyemail@example.com',
        passwordHash: 'hashed101',
        name: 'Find By Email Test',
      });
      await userRepository.create(user);

      // Act
      const foundUser = await userRepository.findByEmail('findbyemail@example.com');

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('findbyemail@example.com');
      expect(foundUser?.name).toBe('Find By Email Test');
    });

    it('should be case-insensitive when finding by email', async () => {
      // Arrange
      const user = User.create({
        email: 'CaseSensitive@Example.COM',
        passwordHash: 'hashed202',
        name: 'Case Test',
      });
      await userRepository.create(user);

      // Act
      const foundUser = await userRepository.findByEmail('casesensitive@example.com');

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.name).toBe('Case Test');
    });

    it('should return null when user with email does not exist', async () => {
      // Act
      const foundUser = await userRepository.findByEmail('nonexistent@example.com');

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      // Arrange
      const user = User.create({
        email: 'update@example.com',
        passwordHash: 'originalHash',
        name: 'Original Name',
      });
      const createdUser = await userRepository.create(user);

      // Modify the user
      createdUser.updateName('Updated Name');
      createdUser.updatePasswordHash('newHash');

      // Act
      const updatedUser = await userRepository.update(createdUser.id!, createdUser);

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe('Updated Name');
      expect(updatedUser?.passwordHash).toBe('newHash');
      expect(updatedUser?.email).toBe('update@example.com'); // Email should remain
    });

    it('should return null when updating non-existent user', async () => {
      // Arrange
      const user = User.create({
        email: 'fake@example.com',
        passwordHash: 'hash',
        name: 'Fake User',
      });

      // Act
      const result = await userRepository.update(99999, user);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      // Arrange
      const user = User.create({
        email: 'delete@example.com',
        passwordHash: 'hash',
        name: 'Delete Test',
      });
      const createdUser = await userRepository.create(user);

      // Act
      const deletedUser = await userRepository.delete(createdUser.id!);

      // Assert
      expect(deletedUser).toBeDefined();
      expect(deletedUser?.id).toBe(createdUser.id);

      // Verify user is actually deleted
      const foundUser = await userRepository.findById(createdUser.id!);
      expect(foundUser).toBeNull();
    });

    it('should return null when deleting non-existent user', async () => {
      // Act
      const result = await userRepository.delete(99999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('domain entity mapping', () => {
    it('should correctly map database records to domain entities', async () => {
      // Arrange
      const user = User.create({
        email: 'mapping@example.com',
        passwordHash: 'mappedHash',
        name: 'Mapping Test',
      });
      const createdUser = await userRepository.create(user);

      // Act
      const foundUser = await userRepository.findById(createdUser.id!);

      // Assert - Verify it's a proper domain entity
      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.toObject()).toEqual({
        id: createdUser.id,
        email: 'mapping@example.com',
        passwordHash: 'mappedHash',
        name: 'Mapping Test',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
