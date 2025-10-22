/**
 * User Use Cases Unit Tests
 * Tests application logic with mocked repositories and external dependencies
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SignUpUseCase } from '../../../../src/application/user/use-cases/sign-up.use-case.js';
import { SignInUseCase } from '../../../../src/application/user/use-cases/sign-in.use-case.js';
import { IUserRepository } from '../../../../src/domain/user/user.repository.js';
import { User } from '../../../../src/domain/user/user.entity.js';
import {
  DuplicateEmailError,
  InvalidCredentialsError,
  InvalidPasswordError,
} from '../../../../src/domain/user/user.errors.js';

// Mock external dependencies
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('User Use Cases', () => {
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    // Create a fresh mock repository before each test
    mockUserRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('SignUpUseCase', () => {
    it('should create a new user successfully', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      const createdUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 1,
          email: 'test@example.com',
        },
        expect.any(String),
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: expect.any(Date),
        },
        token,
      });
    });

    it('should normalize email to lowercase and trim whitespace', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      const createdUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      await useCase.execute({
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
        name: '  Test User  ',
      });

      // Verify the User entity was created with normalized email
      const createCall = vi.mocked(mockUserRepository.create).mock.calls[0][0];
      expect(createCall.email).toBe('test@example.com');
      expect(createCall.name).toBe('Test User');
    });

    it('should throw DuplicateEmailError when email already exists', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);
      const existingUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        name: 'Existing User',
      });

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);

      await expect(
        useCase.execute({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow(DuplicateEmailError);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidPasswordError when password is too short', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        useCase.execute({
          email: 'test@example.com',
          password: '12345', // Only 5 characters
          name: 'Test User',
        })
      ).rejects.toThrow(InvalidPasswordError);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error with message about password length', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        useCase.execute({
          email: 'test@example.com',
          password: 'short',
          name: 'Test User',
        })
      ).rejects.toThrow('Password must be at least 6 characters long');
    });

    it('should accept password with exactly 6 characters', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      const createdUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      await expect(
        useCase.execute({
          email: 'test@example.com',
          password: '123456', // Exactly 6 characters
          name: 'Test User',
        })
      ).resolves.not.toThrow();
    });

    it('should hash password with correct salt rounds', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      const createdUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      await useCase.execute({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should generate JWT token with correct payload and expiration', async () => {
      const useCase = new SignUpUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      const createdUser = User.create({
        id: 42,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      await useCase.execute({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 42,
          email: 'test@example.com',
        },
        expect.any(String),
        { expiresIn: '7d' }
      );
    });
  });

  describe('SignInUseCase', () => {
    it('should authenticate user successfully with valid credentials', async () => {
      const useCase = new SignInUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      const existingUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 1,
          email: 'test@example.com',
        },
        expect.any(String),
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: expect.any(Date),
        },
        token,
      });
    });

    it('should normalize email to lowercase and trim whitespace', async () => {
      const useCase = new SignInUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      const existingUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      await useCase.execute({
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw InvalidCredentialsError when user does not exist', async () => {
      const useCase = new SignInUseCase(mockUserRepository);

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        useCase.execute({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(InvalidCredentialsError);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsError when password is incorrect', async () => {
      const useCase = new SignInUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';

      const existingUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        useCase.execute({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(InvalidCredentialsError);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', hashedPassword);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should verify password with bcrypt.compare', async () => {
      const useCase = new SignInUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      const existingUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      await useCase.execute({
        email: 'test@example.com',
        password: 'myplainpassword',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('myplainpassword', hashedPassword);
    });

    it('should generate JWT token with correct payload and expiration', async () => {
      const useCase = new SignInUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';
      const token = 'jwt.token.here';

      const existingUser = User.create({
        id: 99,
        email: 'user@example.com',
        passwordHash: hashedPassword,
        name: 'User Name',
      });

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue(token as never);

      await useCase.execute({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 99,
          email: 'user@example.com',
        },
        expect.any(String),
        { expiresIn: '7d' }
      );
    });

    it('should not reveal whether email or password is wrong', async () => {
      const useCase = new SignInUseCase(mockUserRepository);
      const hashedPassword = '$2a$10$hashedpassword';

      const existingUser = User.create({
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      // Test with non-existent email
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      const errorPromise1 = useCase.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      // Test with wrong password
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      const errorPromise2 = useCase.execute({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      // Both should throw the same error type
      await expect(errorPromise1).rejects.toThrow(InvalidCredentialsError);
      await expect(errorPromise2).rejects.toThrow(InvalidCredentialsError);
    });
  });
});
