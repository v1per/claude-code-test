/**
 * User Repository Interface (Port)
 * Defines contract for User persistence
 */

import { User } from './user.entity.js';

export interface IUserRepository {
  /**
   * Find user by ID
   */
  findById(id: number): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user
   */
  update(id: number, user: User): Promise<User | null>;

  /**
   * Delete a user
   */
  delete(id: number): Promise<User | null>;
}
