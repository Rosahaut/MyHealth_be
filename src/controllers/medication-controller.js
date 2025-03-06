import {
  listAllMedications,
  listAllMedicationsByUserId,
  selectMedicationById,
  insertMedication,
  updateMedicationById,
  deleteMedicationById,
} from '../models/medication-model.js';
import { validationResult } from 'express-validator';

// Hae kaikki lääkkeet
const getMedications = async (req, res, next) => {
  try {
    const result = await listAllMedications();
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

// Hae lääke ID:n perusteella
const getMedicationById = async (req, res, next) => {
  try {
    const result = await selectMedicationById(req.params.id);
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

// Hae lääke ID:n perusteella
const getMedicationByUserId = async (req, res, next) => {
  try {
    const result = await listAllMedicationsByUserId(req.params.id);
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

// Lisää uusi lääke
const postMedication = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = validationErrors.array();
    return next(error);
  }

  try {
    const result = await insertMedication(req.body);
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

// Päivitä lääke
const putMedication = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = validationErrors.array();
    return next(error);
  }

  try {
    const result = await updateMedicationById({ ...req.body, medication_id: req.params.id });
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

// Poista lääke
const deleteMedication = async (req, res, next) => {
  try {
    const result = await deleteMedicationById(req.params.id);
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
  getMedications,
  getMedicationById,
  getMedicationByUserId,
  postMedication,
  putMedication,
  deleteMedication,
};
