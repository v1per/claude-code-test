/**
 * Sign Up Use Case
 * Application service for user registration
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../domain/user/user.entity.js';
import { IUserRepository } from '../../../domain/user/user.repository.js';
import { DuplicateEmailError, InvalidPasswordError } from '../../../domain/user/user.errors.js';
import { SignUpDTO } from '../dtos/sign-up.dto.js';
import { AuthResponseDTO } from '../dtos/auth-response.dto.js';

export class SignUpUseCase {
  private readonly JWT_SECRET: string;
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly userRepository: IUserRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  async execute(dto: SignUpDTO): Promise<AuthResponseDTO> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new DuplicateEmailError(dto.email);
    }

    // Validate password strength
    if (dto.password.length < 6) {
      throw new InvalidPasswordError('Password must be at least 6 characters long');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user entity
    const user = User.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      name: dto.name.trim(),
    });

    // Persist user
    const createdUser = await this.userRepository.create(user);

    // Generate JWT token
    const token = this.generateToken(createdUser);

    // Return response
    return this.toAuthResponse(createdUser, token);
  }

  private generateToken(user: User): string {
    const userObj = user.toObject();
    return jwt.sign(
      {
        userId: userObj.id,
        email: userObj.email,
      },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  private toAuthResponse(user: User, token: string): AuthResponseDTO {
    const userObj = user.toObject();
    return {
      user: {
        id: userObj.id!,
        email: userObj.email,
        name: userObj.name,
        createdAt: userObj.createdAt!,
      },
      token,
    };
  }
}
