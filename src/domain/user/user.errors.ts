/**
 * Domain-specific errors for User entity
 */

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User ${identifier} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidEmailError extends Error {
  constructor(message: string = 'Invalid email address') {
    super(message);
    this.name = 'InvalidEmailError';
  }
}

export class InvalidPasswordError extends Error {
  constructor(message: string = 'Invalid password') {
    super(message);
    this.name = 'InvalidPasswordError';
  }
}

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'DuplicateEmailError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}
