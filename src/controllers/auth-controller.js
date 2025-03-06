import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import {selectUserByUsername} from '../models/user-model.js';
import {customError} from '../middlewares/error-handler.js';

/**
 * User login
 * @async
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {object} user if username & password match
 */
// user authentication (login)
const login = async (req, res, next) => {
  const {username, password} = req.body;
  if (!username) {
    return next(customError('Username missing.', 400));
    //return res.status(401).json({message: 'Username missing.'});
  }
  const user = await selectUserByUsername(username);
  // jos käyttäjä löytyi tietokannasta verrataan kirjautumiseen syötettyä sanaa tietokannan
  // salasanatiivisteeseen
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return res.json({message: 'login ok', user, token, user_id:user.user_id});
    }
  }
  //res.status(401).json({message: 'Bad username/password.'});
  next(customError('Bad username/password.', 401));
};

/**
 * Get user info from token
 * NOTE! user info is extracted from the token
 * => it is not necessary up to date info (should be refreshed from db)
 * @async
 * @param {object} req
 * @param {object} res
 * @return {object} user info
 */
const getMe = async (req, res) => {
  res.json({user: req.user});
};

export {login, getMe};
