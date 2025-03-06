import promisePool from '../utils/database.js';

/**
 * Fetch all userdata except passwords from database
 * @returns
 */
const listAllUsers = async () => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM Users'
    );
    console.log('selectAllUsers result', rows);
    return rows;
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

/**
 * Fetch user by id
 * using prepared statement (recommended way)
 * example of error handling
 * @param {number} userId id of the user
 * @returns {object} user found or undefined if not
 */
const selectUserById = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM Users WHERE user_id=?',
      [userId]
    );
    console.log(rows);
    // return only first item of the result array
    return rows[0];
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

/**
 * User registration
 * @param {*} user
 * @returns
 */
const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
      [user.username, user.password, user.email]
    );
    console.log('insertUser', result);
    // return only first item of the result array
    return { message: 'User added', user_id: result.insertId };
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

// update user in db
const updateUserById = async (user) => {
  try {
    const sql =
      'UPDATE Users SET username=?, password=?, email=? WHERE user_id=?';
    const params = [user.username, user.password, user.email, user.user_id];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    // User id not found
    if (result.affectedRows === 0) {
      return { error: 404, message: 'User id not found in the database.' };
    } else {
      // Request ok
      return { message: 'user data updated', user_id: user.user_id };
    }
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

// delete user in db
const deleteUserById = async (id) => {
  try {
    const sql = 'DELETE FROM Users WHERE user_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    console.log(result);

    // User id not found
    if (result.affectedRows === 0) {
      return { error: 404, message: 'user not found' };
    }
    return { message: 'user deleted', user_id: id };
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

/**
 * UNSAFE login for clear text passwords
 * @param {*} username
 * @param {*} password
 * @returns
 */
const selectUserByNameAndPassword = async (username, password) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM Users WHERE username=? AND password=?',
      [username, password]
    );
    console.log(rows);
    // return only first item of the result array
    return rows[0];
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

/**
 * Fetch all user data based on user's username
 * @param {*} username
 * @returns {object} user data
 */
const selectUserByUsername = async (username) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username=?';
    const params = [username];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the username and password
    if (rows.length === 0) {
      return { error: 401, message: 'invalid username or password' };
    }
    return rows[0];
  } catch (error) {
    console.error(error);
    return { error: 500, message: 'Database error' };
  }
};

export {
  selectUserByUsername,
  selectUserByNameAndPassword,
  listAllUsers,
  selectUserById,
  insertUser,
  updateUserById,
  deleteUserById,
};
