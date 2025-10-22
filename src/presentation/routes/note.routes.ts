/**
 * Note Routes
 * Presentation concern - defines HTTP endpoints
 */

import { Router } from 'express';
import { NoteController } from '../controllers/note.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { createNoteSchema, updateNoteSchema, noteIdSchema } from '../validators/note.validator.js';

export function createNoteRouter(noteController: NoteController): Router {
  const router = Router();

  // GET /api/notes - Get all notes
  router.get('/', (req, res) => noteController.getAll(req, res));

  // GET /api/notes/:id - Get a single note by ID
  router.get('/:id', validateParams(noteIdSchema), (req, res) => noteController.getById(req, res));

  // POST /api/notes - Create a new note
  router.post('/', validateBody(createNoteSchema), (req, res) => noteController.create(req, res));

  // PUT /api/notes/:id - Update a note
  router.put(
    '/:id',
    validateParams(noteIdSchema),
    validateBody(updateNoteSchema),
    (req, res) => noteController.update(req, res)
  );

  // DELETE /api/notes/:id - Delete a note
  router.delete('/:id', validateParams(noteIdSchema), (req, res) => noteController.delete(req, res));

  return router;
}
