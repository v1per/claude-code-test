import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';

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
    version: '1.0.0',
    endpoints: {
      notes: '/api/notes',
    },
  });
});

// Routes
app.use('/api/notes', notesRouter);

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
});
