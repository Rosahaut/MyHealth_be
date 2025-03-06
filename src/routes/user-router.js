import express from 'express';
import { body } from 'express-validator';
import {
  getUserById,
  getUsers,
  addUser,
  editUser,
  deleteUser,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { errorHandler, validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();

// "/user" endpoint
userRouter
  .route('/')
  // list users
  .get(authenticateToken, getUsers, errorHandler)
  // update user
  .put(
    authenticateToken,
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').trim().isLength({ min: 3, max: 60 }),
    body('email').trim().isEmail(),
    validationErrorHandler, //validaatiovirheiden käsittely
    editUser,
    errorHandler //virheenkäsittelymiddleware
  )
  // user registration with validation
  .post(
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').trim().isLength({ min: 3, max: 60 }),
    body('email').trim().isEmail(),
    validationErrorHandler, //validaatiovirheiden käsittely
    addUser,
    errorHandler //virheenkäsittelymiddleware
  );

// "/user/:id" endpoint
userRouter
  .route('/:id')
  // get info of a user
  .get(authenticateToken, getUserById, errorHandler)
  // delete user based on id
  .delete(authenticateToken, deleteUser, errorHandler);

export default userRouter;
