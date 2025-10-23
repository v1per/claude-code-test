/**
 * Note Validators
 * Zod schemas for note validation
 */

import { z } from 'zod';
import { VALIDATION, ERROR_MESSAGES } from '../constants/validation';

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.NOTE.TITLE.MIN_LENGTH, ERROR_MESSAGES.NOTE.TITLE.REQUIRED)
    .max(VALIDATION.NOTE.TITLE.MAX_LENGTH, ERROR_MESSAGES.NOTE.TITLE.TOO_LONG),
  content: z
    .string()
    .min(VALIDATION.NOTE.CONTENT.MIN_LENGTH, ERROR_MESSAGES.NOTE.CONTENT.REQUIRED),
});

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .min(VALIDATION.NOTE.TITLE.MIN_LENGTH, ERROR_MESSAGES.NOTE.TITLE.REQUIRED)
      .max(VALIDATION.NOTE.TITLE.MAX_LENGTH, ERROR_MESSAGES.NOTE.TITLE.TOO_LONG)
      .optional(),
    content: z
      .string()
      .min(VALIDATION.NOTE.CONTENT.MIN_LENGTH, ERROR_MESSAGES.NOTE.CONTENT.REQUIRED)
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: ERROR_MESSAGES.NOTE.AT_LEAST_ONE_FIELD,
  });

export const noteIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(Number),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdInput = z.infer<typeof noteIdSchema>;
