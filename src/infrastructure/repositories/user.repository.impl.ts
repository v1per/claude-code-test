/**
 * User Repository Implementation (Adapter)
 * Infrastructure concern - implements the domain repository interface
 */

import { eq } from 'drizzle-orm';
import { User } from '../../domain/user/user.entity.js';
import { IUserRepository } from '../../domain/user/user.repository.js';
import { Database } from '../database/connection.js';
import { users, UserRecord } from '../database/schema.js';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: number): Promise<User | null> {
    const records = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const records = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  async create(user: User): Promise<User> {
    const userObj = user.toObject();

    const records = await this.db
      .insert(users)
      .values({
        email: userObj.email,
        passwordHash: userObj.passwordHash,
        name: userObj.name,
      })
      .returning();

    return this.toDomain(records[0]);
  }

  async update(id: number, user: User): Promise<User | null> {
    const userObj = user.toObject();

    const records = await this.db
      .update(users)
      .set({
        email: userObj.email,
        passwordHash: userObj.passwordHash,
        name: userObj.name,
        updatedAt: userObj.updatedAt,
      })
      .where(eq(users.id, id))
      .returning();

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  async delete(id: number): Promise<User | null> {
    const records = await this.db.delete(users).where(eq(users.id, id)).returning();

    if (records.length === 0) {
      return null;
    }

    return this.toDomain(records[0]);
  }

  /**
   * Maps database record to domain entity
   */
  private toDomain(record: UserRecord): User {
    return User.create({
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
