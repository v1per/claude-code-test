/**
 * Data Transfer Object for note response
 */

export interface NoteResponseDTO {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
