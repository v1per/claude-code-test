/**
 * User Domain Entity
 * Contains business logic and invariants for User
 */

import { InvalidEmailError, InvalidPasswordError } from './user.errors.js';

export interface UserProps {
  id?: number;
  email: string;
  passwordHash: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(
    private readonly _id: number | undefined,
    private _email: string,
    private _passwordHash: string,
    private _name: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method to create a new User
   */
  static create(props: UserProps): User {
    return new User(
      props.id,
      props.email,
      props.passwordHash,
      props.name,
      props.createdAt || new Date(),
      props.updatedAt || new Date()
    );
  }

  /**
   * Business rule validation
   */
  private validate(): void {
    // Email validation
    if (!this._email || this._email.trim().length === 0) {
      throw new InvalidEmailError('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._email)) {
      throw new InvalidEmailError('Email must be a valid email address');
    }

    // Name validation
    if (!this._name || this._name.trim().length === 0) {
      throw new InvalidPasswordError('Name cannot be empty');
    }

    if (this._name.length > 255) {
      throw new InvalidPasswordError('Name cannot exceed 255 characters');
    }

    // Password hash validation
    if (!this._passwordHash || this._passwordHash.trim().length === 0) {
      throw new InvalidPasswordError('Password hash cannot be empty');
    }
  }

  /**
   * Update user name
   */
  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
    this.validate();
  }

  /**
   * Update user password hash
   */
  updatePasswordHash(passwordHash: string): void {
    this._passwordHash = passwordHash;
    this._updatedAt = new Date();
    this.validate();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Convert to plain object
   */
  toObject(): UserProps {
    return {
      id: this._id,
      email: this._email,
      passwordHash: this._passwordHash,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
