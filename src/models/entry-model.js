import promisePool from '../utils/database.js';

// Get all entries in db - FOR ADMIN
const listAllEntries = async () => {
  try {
    const sql = 'SELECT * FROM diaryentries';
    const [rows] = await promisePool.query(sql);
    if (rows.length === 0) {
      // If there is no entries in db
      return { error: 404, message: 'No entries found' };
    } else {
      // return all found entries
      return rows;
    }
  } catch (error) {
    console.error('listAllEntries', error);
    return { error: 500, message: 'db error' };
  }
};

// Get specific entry in db - FOR ADMIN
const selectEntryById = async (id) => {
  try {
    const sql = 'SELECT * FROM diaryentries WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return { error: 404, message: `no entries found with user_id = ${id}` };
    }
    // return all found entries
    return rows;
  } catch (error) {
    console.error('selectUserById', error);
    return { error: 500, message: 'db error' };
  }
};

// Get all entries in db - FOR USER
const listAllEntriesByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('listAllEntriesByUserId', error);
    return { error: 500, message: 'db error' };
  }
};

const addEntry = async (user, entry) => {
  const { entry_date, mood, sleep_hours, notes } = entry;
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, sleep_hours, notes)
  VALUES (?, ?, ?, ?, ?)`;
  const params = [user.user_id, entry_date, mood, sleep_hours, notes];
  try {
    const [result] = await promisePool.query(sql, params);
    return { message: 'Entry added', entry_id: result.insertId };
  } catch (error) {
    console.log('addEntry', error);
    return { error: 500, message: 'db error' };
  }
};

// update entry in db
const updateEntryById = async (user) => {
  try {
    const sql =
      'UPDATE diaryentries SET entry_date=?, mood=?, sleep_hours=?, notes=? WHERE user_id=? AND entry_id=?';
    const params = [
      user.entry_date,
      user.mood,
      user.sleep_hours,
      user.notes,
      user.userId,
      user.entry_id,
    ];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    return { message: 'user data updated', user_id: user.userId };
  } catch (error) {
    console.error('updateEntryById', error);
    return { error: 500, message: 'db error' };
  }
};

// delete entries in db
const deleteEntryByIdUser = async (userId, entryId) => {
  try {
    const sql = 'DELETE FROM diaryentries WHERE entry_id=? and user_id=?';
    const params = [entryId, userId];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    if (result.affectedRows === 0) {
      return { error: 404, message: 'entry not found' };
    }
    return { message: 'Entry deleted', user_id: userId };
  } catch (error) {
    console.error('deleteEntryById', error);
    return { error: 500, message: 'db error' };
  }
};

const deleteEntryByIdAdmin = async (entryId) => {
  try {
    const sql = 'DELETE FROM diaryentries WHERE entry_id=?';
    const params = [entryId];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    if (result.affectedRows === 0) {
      return { error: 404, message: 'entry not found' };
    }
    return { message: 'Entry deleted' };
  } catch (error) {
    console.error('deleteEntryByIdAdmin', error);
    return { error: 500, message: 'db error' };
  }
};

export {
  addEntry,
  listAllEntries,
  deleteEntryByIdAdmin,
  selectEntryById,
  updateEntryById,
  deleteEntryByIdUser,
  listAllEntriesByUserId,
};
