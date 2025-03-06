import express from 'express';
import { body } from 'express-validator';
import {
  postEntry,
  getEntries,
  getEntryById,
  putEntry,
  deleteEntry,
} from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { errorHandler, validationErrorHandler } from '../middlewares/error-handler.js';

const entryRouter = express.Router();

// /entries endpoint
entryRouter
  .route('/')
  .get(authenticateToken, getEntries, errorHandler)
  .post(
    authenticateToken,
    body('entry_date').isDate(),
    body('mood').isString(),
    body('sleep_hours').isFloat(),
    body('notes').isString(),
    validationErrorHandler, //validaatiovirheiden käsittely
    postEntry,
    errorHandler //virheenkäsittelymiddleware
  )
  .put(
    authenticateToken,
    body('entry_id').isString(),
    body('entry_date').isDate(),
    body('mood').isString(),
    body('sleep_hours').isFloat(),
    body('notes').isString(),
    validationErrorHandler, //validaatiovirheiden käsittely
    putEntry,
    errorHandler //virheenkäsittelymiddleware
  );

  // /entries/:id endpoint
  entryRouter.route('/:id').get(authenticateToken, getEntryById, errorHandler)
  .delete(
    authenticateToken,
    deleteEntry,
    errorHandler //virheenkäsittelymiddleware
  );
export default entryRouter;
