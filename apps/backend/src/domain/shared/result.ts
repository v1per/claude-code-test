/**
 * Result pattern for handling operations that can succeed or fail
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
