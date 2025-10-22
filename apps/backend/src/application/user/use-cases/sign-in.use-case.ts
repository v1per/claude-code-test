/**
 * Sign In Use Case
 * Application service for user authentication
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../domain/user/user.entity.js';
import { IUserRepository } from '../../../domain/user/user.repository.js';
import { InvalidCredentialsError } from '../../../domain/user/user.errors.js';
import { SignInDTO } from '../dtos/sign-in.dto.js';
import { AuthResponseDTO } from '../dtos/auth-response.dto.js';

export class SignInUseCase {
  private readonly JWT_SECRET: string;

  constructor(private readonly userRepository: IUserRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  async execute(dto: SignInDTO): Promise<AuthResponseDTO> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return response
    return this.toAuthResponse(user, token);
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
