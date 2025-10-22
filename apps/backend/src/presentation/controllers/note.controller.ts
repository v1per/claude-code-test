/**
 * Note Controller
 * Presentation concern - handles HTTP requests and responses
 */

import { Request, Response } from 'express';
import { CreateNoteUseCase } from '../../application/note/use-cases/create-note.use-case.js';
import { UpdateNoteUseCase } from '../../application/note/use-cases/update-note.use-case.js';
import { DeleteNoteUseCase } from '../../application/note/use-cases/delete-note.use-case.js';
import { GetNoteUseCase } from '../../application/note/use-cases/get-note.use-case.js';
import { GetAllNotesUseCase } from '../../application/note/use-cases/get-all-notes.use-case.js';
import {
  NoteNotFoundError,
  InvalidNoteTitleError,
  InvalidNoteContentError,
  UnauthorizedNoteAccessError,
} from '../../domain/note/note.errors.js';

export class NoteController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
    private readonly getNoteUseCase: GetNoteUseCase,
    private readonly getAllNotesUseCase: GetAllNotesUseCase
  ) {}

  /**
   * GET /api/notes - Get all notes
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const notes = await this.getAllNotesUseCase.execute();

      res.json({
        success: true,
        data: notes,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * GET /api/notes/:id - Get a single note
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const note = await this.getNoteUseCase.execute(id);

      res.json({
        success: true,
        data: note,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /api/notes - Create a new note
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from JWT (populated by auth middleware)
      const userId = req.user!.userId;
      const note = await this.createNoteUseCase.execute(userId, req.body);

      res.status(201).json({
        success: true,
        data: note,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * PUT /api/notes/:id - Update a note
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      // Get userId from JWT (populated by auth middleware)
      const userId = req.user!.userId;
      const note = await this.updateNoteUseCase.execute(id, userId, req.body);

      res.json({
        success: true,
        data: note,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * DELETE /api/notes/:id - Delete a note
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      // Get userId from JWT (populated by auth middleware)
      const userId = req.user!.userId;
      const note = await this.deleteNoteUseCase.execute(id, userId);

      res.json({
        success: true,
        message: 'Note deleted successfully',
        data: note,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(error: unknown, res: Response): void {
    console.error('Controller error:', error);

    if (error instanceof NoteNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (error instanceof UnauthorizedNoteAccessError) {
      res.status(403).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (error instanceof InvalidNoteTitleError || error instanceof InvalidNoteContentError) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
