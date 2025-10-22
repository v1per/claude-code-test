/**
 * Data Transfer Object for authentication response
 */

export interface AuthResponseDTO {
  user: {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
  };
  token: string;
}
