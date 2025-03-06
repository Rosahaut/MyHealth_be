import express from 'express';
import {
  getMeasurements,
  getMeasurementById,
  getMeasurementByUserId,
  postMeasurement,
  putMeasurement,
  deleteMeasurement,
} from '../controllers/measurements-controller.js';
import { body } from 'express-validator';
import { errorHandler, validationErrorHandler } from '../middlewares/error-handler.js';
import { authenticateToken } from '../middlewares/authentication.js';

const measurementRouter = express.Router();

// /measurements endpoint
measurementRouter
  .route('/')
  .get(authenticateToken, getMeasurements, errorHandler)
  .post(
    authenticateToken,
    body('user_id').isInt(),
    body('metric_date').isDate(),
    body('heart_rate').isInt(),
    body('blood_pressure').isString(),
    body('blood_sugar').isFloat(),
    body('notes').isString(),
    validationErrorHandler,
    postMeasurement,
    errorHandler
  );

// /measurements/user/:id endpoint
measurementRouter
  .route('/user/:id')
  .get(authenticateToken, getMeasurementByUserId, errorHandler)

// /measurements/:id endpoint
measurementRouter
  .route('/:id')
  .get(authenticateToken, getMeasurementById, errorHandler)
  .put(
    authenticateToken,
    body('user_id').isInt(),
    body('metric_date').isDate(),
    body('heart_rate').isInt(),
    body('blood_pressure').isString(),
    body('blood_sugar').isFloat(),
    body('notes').isString(),
    validationErrorHandler,
    putMeasurement,
    errorHandler
  )
  .delete(authenticateToken, deleteMeasurement, errorHandler);

export default measurementRouter;
