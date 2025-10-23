/**
 * User Validators
 * Zod schemas for user validation
 */

import { z } from 'zod';
import { VALIDATION, ERROR_MESSAGES } from '../constants/validation';

export const signUpSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.USER.EMAIL.INVALID),
  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, ERROR_MESSAGES.PASSWORD.TOO_SHORT),
  name: z
    .string()
    .min(VALIDATION.USER.NAME.MIN_LENGTH, ERROR_MESSAGES.USER.NAME.REQUIRED)
    .max(VALIDATION.USER.NAME.MAX_LENGTH, ERROR_MESSAGES.USER.NAME.TOO_LONG),
});

export const signInSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.USER.EMAIL.INVALID),
  password: z.string().min(1, ERROR_MESSAGES.PASSWORD.REQUIRED),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
