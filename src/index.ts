/**
 * Application Entry Point
 * Bootstraps the Express application with DDD architecture
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { container } from './config/container.js';
import { createNoteRouter } from './presentation/routes/note.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Notes API is running',
    version: '2.0.0',
    architecture: 'Domain-Driven Design',
    endpoints: {
      notes: '/api/notes',
    },
  });
});

// Routes - Inject dependencies through container
const noteRouter = createNoteRouter(container.noteController);
app.use('/api/notes', noteRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/notes`);
  console.log('Architecture: Domain-Driven Design');
});
