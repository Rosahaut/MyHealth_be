import {
  listAllMeasurements,
  selectMeasurementById,
  selectMeasurementByUserId,
  insertMeasurement,
  updateMeasurementById,
  deleteMeasurementById,
} from '../models/measurements-model.js';
import { validationResult } from 'express-validator';

// Hae kaikki mittaukset
const getMeasurements = async (req, res, next) => {
  try {
    const result = await listAllMeasurements();
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

// Hae mittaus ID:n perusteella
const getMeasurementByUserId = async (req, res, next) => {
  try {
    const result = await selectMeasurementByUserId(req.params.id);
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

// Hae mittaus ID:n perusteella
const getMeasurementById = async (req, res, next) => {
  try {
    const result = await selectMeasurementById(req.params.id);
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

// Lisää uusi mittaus
const postMeasurement = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = validationErrors.array();
    return next(error);
  }

  try {
    const result = await insertMeasurement(req.body);
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Päivitä mittaus
const putMeasurement = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = validationErrors.array();
    return next(error);
  }

  try {
    const result = await updateMeasurementById({ ...req.body, measurement_id: req.params.id });
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

// Poista mittaus
const deleteMeasurement = async (req, res, next) => {
  try {
    const result = await deleteMeasurementById(req.params.id);
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getMeasurements,
  getMeasurementById,
  getMeasurementByUserId,
  postMeasurement,
  putMeasurement,
  deleteMeasurement,
};
