/**
 * Data Transfer Object for note response
 */

export interface NoteResponseDTO {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
