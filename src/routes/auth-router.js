import express from 'express';
import { login, getMe } from '../controllers/auth-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { body } from 'express-validator';
import { errorHandler, validationErrorHandler } from '../middlewares/error-handler.js';

const authRouter = express.Router();

// "/auth/login" endpoint
authRouter.post(
  '/login',
  // Check login with creation parameters.
  body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('password').trim().isLength({ min: 3, max: 60 }),
  validationErrorHandler, //validaatiovirheiden käsittely
  login,
  errorHandler //virheenkäsittelymiddleware
);

// "/auth/me" endpoint
authRouter.get('/me', authenticateToken, getMe, errorHandler);

export default authRouter;
