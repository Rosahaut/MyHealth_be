import {
  addEntry,
  listAllEntries,
  selectEntryById,
  updateEntryById,
  deleteEntryByIdUser,
  deleteEntryByIdAdmin,
  listAllEntriesByUserId,
} from '../models/entry-model.js';
import {validationResult} from 'express-validator';

// Get all entries
const getEntries = async (req, res, next) => {
  let result = '';
  // Every entry in db can be accessed with admin token
  if (req.user.user_level === 'admin') {
    console.log('Admin user accessing all entries');
    result = await listAllEntries();
  } else {
    // Regular token only returns user specific entries
    console.log('Regular user accessing all available entries');
    result = await listAllEntriesByUserId(req.user.user_id);
  }
  if (!result.error) {
    res.json(result);
  } else {
    const error = new Error(result.message);
    error.status = result.error;
    return next(error);
  }
};

// Get specific entries - FOR ADMIN
const getEntryById = async (req, res, next) => {
  // Make sure that the request contains admin token
  if (req.user.user_level === 'admin') {
    const result = await selectEntryById(req.params.id);
    if (result.error) {
      // There was a error
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    } else {
      // return found entries
      return res.json(result);
    }
  } else {
    // Unauthorized user
    const error = new Error('Unauthorized');
    error.status = 401;
    return next(error);
  }
};

// Create a new entry to the db
const postEntry = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    // Request didnt pass validation
    const error = new Error('Bad request');
    error.status = 400;
    error.errors = validationErrors.errors;
    return next(error);
  }
  // Try to fetch data from model
  const result = await addEntry(req.user, req.body);
  if (result.error) {
    const error = new Error(result.message);
    error.status = result.error;
    return next(error);
  } else {
    // Result was ok
    res
        .status(201)
        .json(result);
  }
};

// Update existing entry based on entry id
const putEntry = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    // Request didnt pass validation
    const error = new Error('Bad request');
    error.status = 400;
    error.errors = validationErrors.errors;
    return next(error);
  }
  // Request passed the validation
  const userId = req.user.user_id;
  const result = await updateEntryById({userId, ...req.body});
  if (result.error) {
    // There was a error
    const error = new Error(result.message);
    error.status = result.error;
    return next(error);
  } else {
    // Request ok
    return res.status(201).json(result);
  }
};

// Delete entry
const deleteEntry = async (req, res, next) => {
  let result = '';
  console.log('NAKKIPIILO')
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    // Request didnt pass validation
    const error = new Error('Bad request');
    error.status = 400;
    error.errors = validationErrors.errors;
    return next(error);
  }

  if (req.user.user_level === 'admin') {
    console.log('admin deleting entry');
    result = await deleteEntryByIdAdmin(req.params.id);
  } else {
    console.log('User deleting entry');
    result = await deleteEntryByIdUser(req.user.user_id, req.params.id);
  }
  if (result.error) {
    // There was a error
    const error = new Error(result.message);
    error.status = result.error;
    return next(error);
  } else {
    // Request ok
    return res.json(result);
  }
};

export {getEntries, getEntryById, putEntry, deleteEntry, postEntry};
