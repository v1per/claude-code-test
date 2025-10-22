/**
 * User Entity Unit Tests
 * Tests business logic and validation rules
 */

import { describe, it, expect } from 'vitest';
import { User } from '../../../src/domain/user/user.entity.js';
import { InvalidEmailError, InvalidPasswordError } from '../../../src/domain/user/user.errors.js';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user with valid data', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
      });

      expect(user.id).toBeUndefined();
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword123');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create user with id when provided', () => {
      const user = User.create({
        id: 42,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
      });

      expect(user.id).toBe(42);
    });

    it('should create user with custom timestamps when provided', () => {
      const now = new Date('2024-01-01');
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
        createdAt: now,
        updatedAt: now,
      });

      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });
  });

  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.org',
      ];

      validEmails.forEach((email) => {
        const user = User.create({
          email,
          passwordHash: 'hashedpassword123',
          name: 'Test User',
        });
        expect(user.email).toBe(email);
      });
    });

    it('should throw InvalidEmailError when email is empty', () => {
      expect(() =>
        User.create({
          email: '',
          passwordHash: 'hashedpassword123',
          name: 'Test User',
        })
      ).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError when email is only whitespace', () => {
      expect(() =>
        User.create({
          email: '   ',
          passwordHash: 'hashedpassword123',
          name: 'Test User',
        })
      ).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError when email format is invalid', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@@example.com',
        'user@example',
        'user example@test.com',
      ];

      invalidEmails.forEach((email) => {
        expect(() =>
          User.create({
            email,
            passwordHash: 'hashedpassword123',
            name: 'Test User',
          })
        ).toThrow(InvalidEmailError);
      });
    });

    it('should throw error with message "Email must be a valid email address"', () => {
      expect(() =>
        User.create({
          email: 'invalid-email',
          passwordHash: 'hashedpassword123',
          name: 'Test User',
        })
      ).toThrow('Email must be a valid email address');
    });
  });

  describe('name validation', () => {
    it('should accept valid names', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'John Doe',
      });

      expect(user.name).toBe('John Doe');
    });

    it('should throw error when name is empty', () => {
      expect(() =>
        User.create({
          email: 'test@example.com',
          passwordHash: 'hashedpassword123',
          name: '',
        })
      ).toThrow(InvalidPasswordError);
    });

    it('should throw error when name is only whitespace', () => {
      expect(() =>
        User.create({
          email: 'test@example.com',
          passwordHash: 'hashedpassword123',
          name: '   ',
        })
      ).toThrow(InvalidPasswordError);
    });

    it('should throw error when name exceeds 255 characters', () => {
      const longName = 'a'.repeat(256);
      expect(() =>
        User.create({
          email: 'test@example.com',
          passwordHash: 'hashedpassword123',
          name: longName,
        })
      ).toThrow(InvalidPasswordError);
    });

    it('should accept name with exactly 255 characters', () => {
      const maxName = 'a'.repeat(255);
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: maxName,
      });

      expect(user.name).toBe(maxName);
    });
  });

  describe('password hash validation', () => {
    it('should accept valid password hash', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
        name: 'Test User',
      });

      expect(user.passwordHash).toBe('$2a$10$abcdefghijklmnopqrstuvwxyz123456');
    });

    it('should throw InvalidPasswordError when password hash is empty', () => {
      expect(() =>
        User.create({
          email: 'test@example.com',
          passwordHash: '',
          name: 'Test User',
        })
      ).toThrow(InvalidPasswordError);
    });

    it('should throw InvalidPasswordError when password hash is only whitespace', () => {
      expect(() =>
        User.create({
          email: 'test@example.com',
          passwordHash: '   ',
          name: 'Test User',
        })
      ).toThrow(InvalidPasswordError);
    });
  });

  describe('updateName', () => {
    it('should update name successfully', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Original Name',
      });

      user.updateName('Updated Name');

      expect(user.name).toBe('Updated Name');
    });

    it('should update updatedAt timestamp', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Original Name',
      });

      const originalUpdatedAt = user.updatedAt;

      setTimeout(() => {
        user.updateName('Updated Name');
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should throw error when new name is invalid', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Original Name',
      });

      expect(() => user.updateName('')).toThrow(InvalidPasswordError);
    });
  });

  describe('updatePasswordHash', () => {
    it('should update password hash successfully', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'original-hash',
        name: 'Test User',
      });

      user.updatePasswordHash('new-hash');

      expect(user.passwordHash).toBe('new-hash');
    });

    it('should update updatedAt timestamp', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'original-hash',
        name: 'Test User',
      });

      const originalUpdatedAt = user.updatedAt;

      setTimeout(() => {
        user.updatePasswordHash('new-hash');
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should throw error when new password hash is invalid', () => {
      const user = User.create({
        email: 'test@example.com',
        passwordHash: 'original-hash',
        name: 'Test User',
      });

      expect(() => user.updatePasswordHash('')).toThrow(InvalidPasswordError);
    });
  });

  describe('toObject', () => {
    it('should return a plain object representation', () => {
      const now = new Date();
      const user = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
        createdAt: now,
        updatedAt: now,
      });

      const obj = user.toObject();

      expect(obj).toEqual({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('getters', () => {
    it('should expose all properties via getters', () => {
      const now = new Date();
      const user = User.create({
        id: 42,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
        createdAt: now,
        updatedAt: now,
      });

      expect(user.id).toBe(42);
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword123');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });
  });
});
