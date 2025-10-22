/**
 * User Controller
 * Presentation concern - handles HTTP requests and responses for authentication
 */

import { Request, Response } from 'express';
import { SignUpUseCase } from '../../application/user/use-cases/sign-up.use-case.js';
import { SignInUseCase } from '../../application/user/use-cases/sign-in.use-case.js';
import {
  DuplicateEmailError,
  InvalidCredentialsError,
  InvalidEmailError,
  InvalidPasswordError,
} from '../../domain/user/user.errors.js';

export class UserController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase
  ) {}

  /**
   * POST /api/auth/signup - Register a new user
   */
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.signUpUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /api/auth/signin - Authenticate user
   */
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.signInUseCase.execute(req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(error: unknown, res: Response): void {
    console.error('User controller error:', error);

    if (error instanceof DuplicateEmailError) {
      res.status(409).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (error instanceof InvalidCredentialsError) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (error instanceof InvalidEmailError || error instanceof InvalidPasswordError) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
