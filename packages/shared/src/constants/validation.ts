/**
 * Validation Constants
 * Shared validation rules across frontend and backend
 */

export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
  },
  NOTE: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 255,
    },
    CONTENT: {
      MIN_LENGTH: 1,
    },
  },
  USER: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 255,
    },
  },
} as const;

export const ERROR_MESSAGES = {
  PASSWORD: {
    TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`,
    REQUIRED: 'Password is required',
  },
  NOTE: {
    TITLE: {
      REQUIRED: 'Title is required',
      TOO_LONG: `Title must be less than ${VALIDATION.NOTE.TITLE.MAX_LENGTH} characters`,
    },
    CONTENT: {
      REQUIRED: 'Content is required',
    },
    AT_LEAST_ONE_FIELD: 'At least one field (title or content) must be provided',
  },
  USER: {
    EMAIL: {
      INVALID: 'Invalid email address',
    },
    NAME: {
      REQUIRED: 'Name is required',
      TOO_LONG: `Name must be less than ${VALIDATION.USER.NAME.MAX_LENGTH} characters`,
    },
  },
} as const;
