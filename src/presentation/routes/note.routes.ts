/**
 * Note Routes
 * Presentation concern - defines HTTP endpoints
 */

import { Router } from 'express';
import { NoteController } from '../controllers/note.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { createNoteSchema, updateNoteSchema, noteIdSchema } from '../validators/note.validator.js';

export function createNoteRouter(noteController: NoteController): Router {
  const router = Router();

  // All note routes require authentication
  router.use(authenticateJWT);

  // GET /api/notes - Get all notes (any authenticated user)
  router.get('/', (req, res) => noteController.getAll(req, res));

  // GET /api/notes/:id - Get a single note by ID (any authenticated user)
  router.get('/:id', validateParams(noteIdSchema), (req, res) => noteController.getById(req, res));

  // POST /api/notes - Create a new note (authenticated user becomes author)
  router.post('/', validateBody(createNoteSchema), (req, res) => noteController.create(req, res));

  // PUT /api/notes/:id - Update a note (only author)
  router.put(
    '/:id',
    validateParams(noteIdSchema),
    validateBody(updateNoteSchema),
    (req, res) => noteController.update(req, res)
  );

  // DELETE /api/notes/:id - Delete a note (only author)
  router.delete('/:id', validateParams(noteIdSchema), (req, res) => noteController.delete(req, res));

  return router;
}
