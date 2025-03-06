import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator';
import {
  deleteUserById,
  insertUser,
  listAllUsers,
  selectUserById,
  updateUserById,
} from '../models/user-model.js';
import {customError} from '../middlewares/error-handler.js';
import { login } from './auth-controller.js';

// Get a list of all users
const getUsers = async (req, res, next) => {
  // Check if token is linked to admin user_level
  if (req.user.user_level === 'admin') {
    const result = await listAllUsers();
    // Check for error in db
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    // Request ok
    return res.json(result);
  } else {
    // Unauthorized user
    const error = new Error('Unauthorized');
    error.status = 401;
    return next(error);
  }
};

// Get specific user using request params
const getUserById = async (req, res, next) => {
  // Admin can see every user by id
  if (req.user.user_level === 'admin') {
    const result = await selectUserById(req.params.id);
    // Check for error in db
    if (result.error) {
      const error = new Error(result.message);
      error.status = result.error;
      return next(error);
    }
    // Request ok
    return res.json(result);
  } else {
    // Unauthorized user
    const error = new Error('Unauthorized');
    error.status = 401;
    return next(error);
  }
};

// käyttäjän lisäys (rekisteröinti)
const addUser = async (req, res, next) => {
  console.log('addUser request body', req.body);
  // esitellään 3 uutta muuttujaa, johon sijoitetaan req.body:n vastaavien propertyjen arvot
  const {username, password, email, autoLogin} = req.body;
  // luodaan selväkielisestä sanasta tiiviste, joka tallennetaan kantaan
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // luodaan uusi käyttäjä olio ja lisätään se tietokantaa käyttäen modelia
  const newUser = {
    username,
    password: hashedPassword,
    email,
  };
  try {
    const result = await insertUser(newUser);
    res.status(201);
    if (autoLogin) {
      login(req, res, next)
      return
    }
    return res.json({message: 'User added. id: ' + result.user_id, ...result});
  } catch (error) {
    return next(customError(error.message, 400));
  }
};

// Päivitä käyttäjä (sekä admin että käyttäjä itse)
const editUser = async (req, res, next) => {
  try {
    // Tarkista validaatiovirheet
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw customError('Bad Request: Validation failed.', 400, {
        errors: validationErrors.array(), // Lisää validaatiovirheet virheeseen
      });
    }

    // Hae käyttäjän ID ja päivitettävät tiedot
    const user_id = req.user.user_id;
    const {username, password, email} = req.body;

    // Hashataan salasana, jos se on annettu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Päivitä käyttäjä tietokannassa
    const result = await updateUserById({
      user_id,
      username,
      password: hashedPassword,
      email,
    });

    // Tarkista tietokantavirhe
    if (result.error) {
      throw customError(result.message || 'Database error', result.error);
    }

    // Palauta onnistunut vastaus
    return res
      .status(200)
      .json({message: 'User updated successfully.', data: result});
  } catch (error) {
    // Lähetä virhe eteenpäin virheenkäsittelymiddlewarelle
    return next(error);
  }
};

// Delete user using request params
const deleteUser = async (req, res, next) => {
  try {
    // Tarkista, onko käyttäjä admin
    if (req.user.user_level !== 'admin') {
      throw customError('Unauthorized: Only admins can delete users.', 401);
    }

    // Yritä poistaa käyttäjä tietokannasta
    const result = await deleteUserById(req.params.id);

    // Tarkista, onko tietokantatoiminnossa tapahtunut virhe
    if (result.error) {
      throw customError(result.message || 'Database error', result.error);
    }

    // Käyttäjä poistettiin onnistuneesti
    return res
      .status(200)
      .json({message: 'User deleted successfully.', data: result});
  } catch (error) {
    // Lähetä virhe eteenpäin virheenkäsittelymiddlewarelle
    return next(error);
  }
};

export {getUsers, getUserById, addUser, editUser, deleteUser};
