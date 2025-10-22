/**
 * Authentication Routes
 * Presentation concern - defines HTTP endpoints for authentication
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { signUpSchema, signInSchema } from '../validators/user.validator.js';

export function createAuthRouter(userController: UserController): Router {
  const router = Router();

  // POST /api/auth/signup - Register a new user
  router.post('/signup', validateBody(signUpSchema), (req, res) => userController.signUp(req, res));

  // POST /api/auth/signin - Authenticate user
  router.post('/signin', validateBody(signInSchema), (req, res) => userController.signIn(req, res));

  return router;
}
