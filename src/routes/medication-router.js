import express from 'express';
import {
  getMedications,
  getMedicationById,
  getMedicationByUserId,
  postMedication,
  putMedication,
  deleteMedication,
} from '../controllers/medication-controller.js';
import { body } from 'express-validator';
import { errorHandler, validationErrorHandler } from '../middlewares/error-handler.js';
import { authenticateToken } from '../middlewares/authentication.js';

const medicationRouter = express.Router();

// /medications endpoint
medicationRouter
  .route('/')
  .get(authenticateToken, getMedications, errorHandler)
  .post(
    authenticateToken,
    body('user_id').isInt(),
    body('medication_date').isDate(),
    body('name').isString(),
    body('dosage').isString(),
    body('taken_at').isString(),
    body('notes').isString(),
    validationErrorHandler,
    postMedication,
    errorHandler
  );

  // /medications/user/:id endpoint
medicationRouter
  .route('/user/:id')
  .get(authenticateToken, getMedicationByUserId, errorHandler)

// /medications/:id endpoint
medicationRouter
  .route('/:id')
  .get(authenticateToken, getMedicationById, errorHandler)
  .put(
    authenticateToken,
    body('user_id').isInt(),
    body('medication_date').isDate(),
    body('name').isString(),
    body('dosage').isString(),
    body('taken_at').isString(),
    body('notes').isString(),
    validationErrorHandler,
    putMedication,
    errorHandler
  )
  .delete(authenticateToken, deleteMedication, errorHandler);

export default medicationRouter;
