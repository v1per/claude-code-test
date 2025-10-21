import { Router, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notes } from '../db/schema.js';
import { createNoteSchema, updateNoteSchema, noteIdSchema } from '../validators/notes.js';
import { ZodError } from 'zod';

const router = Router();

// GET /api/notes - Get all notes
router.get('/', async (req: Request, res: Response) => {
  try {
    const allNotes = await db.select().from(notes).orderBy(notes.createdAt);
    res.json({
      success: true,
      data: allNotes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
    });
  }
});

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = noteIdSchema.parse({ id: req.params.id });

    const note = await db.select().from(notes).where(eq(notes.id, id)).limit(1);

    if (note.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({
      success: true,
      data: note[0],
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID',
        details: error.errors,
      });
    }

    console.error('Error fetching note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note',
    });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createNoteSchema.parse(req.body);

    const newNote = await db
      .insert(notes)
      .values({
        title: validatedData.title,
        content: validatedData.content,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newNote[0],
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }

    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create note',
    });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = noteIdSchema.parse({ id: req.params.id });
    const validatedData = updateNoteSchema.parse(req.body);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }

    if (validatedData.content !== undefined) {
      updateData.content = validatedData.content;
    }

    const updatedNote = await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, id))
      .returning();

    if (updatedNote.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({
      success: true,
      data: updatedNote[0],
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }

    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update note',
    });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = noteIdSchema.parse({ id: req.params.id });

    const deletedNote = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();

    if (deletedNote.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote[0],
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID',
        details: error.errors,
      });
    }

    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete note',
    });
  }
});

export default router;
