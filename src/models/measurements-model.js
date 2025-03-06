import promisePool from '../utils/database.js';

// Hae kaikki mittaukset
const listAllMeasurements = async () => {
  try {
    const sql = 'SELECT * FROM Measurements';
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (error) {
    console.error('listAllMeasurements', error);
    return { error: 500, message: 'Database error' };
  }
};

// Hae mittaus ID:n perusteella
const selectMeasurementById = async (id) => {
  try {
    const sql = 'SELECT * FROM Measurements WHERE measurement_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);

    if (rows.length === 0) {
      return { error: 404, message: 'Measurement not found' };
    }

    return rows[0];
  } catch (error) {
    console.error('selectMeasurementById', error);
    return { error: 500, message: 'Database error' };
  }
};

// Hae mittaus ID:n perusteella
const selectMeasurementByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM Measurements WHERE user_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);

    if (rows.length === 0) {
      return { error: 404, message: 'Measurement not found' };
    }

    return rows;
  } catch (error) {
    console.error('selectMeasurementByUserId', error);
    return { error: 500, message: 'Database error' };
  }
};

// Lisää uusi mittaus
const insertMeasurement = async (measurement) => {
  try {
    const sql =
      'INSERT INTO Measurements (user_id, metric_date, heart_rate, blood_pressure, blood_sugar, notes) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [
      measurement.user_id,
      measurement.metric_date,
      measurement.heart_rate,
      measurement.blood_pressure,
      measurement.blood_sugar,
      measurement.notes,
    ];
    const [result] = await promisePool.query(sql, params);
    return { message: 'New measurement created', measurement_id: result.insertId };
  } catch (error) {
    console.error('insertMeasurement', error);
    return { error: 409, message: 'Measurement already exists or invalid data' };
  }
};

// Päivitä mittaus
const updateMeasurementById = async (measurement) => {
  try {
    const sql =
      'UPDATE Measurements SET user_id=?, metric_date=?, heart_rate=?, blood_pressure=?, blood_sugar=?, notes=? WHERE measurement_id=?';
    const params = [
      measurement.user_id,
      measurement.metric_date,
      measurement.heart_rate,
      measurement.blood_pressure,
      measurement.blood_sugar,
      measurement.notes,
      measurement.measurement_id,
    ];
    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'Measurement not found' };
    }

    return { message: 'Measurement updated', measurement_id: measurement.measurement_id };
  } catch (error) {
    console.error('updateMeasurementById', error);
    return { error: 500, message: 'Database error' };
  }
};

// Poista mittaus
const deleteMeasurementById = async (id) => {
  try {
    const sql = 'DELETE FROM Measurements WHERE measurement_id = ?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'Measurement not found' };
    }

    return { message: 'Measurement deleted', measurement_id: id };
  } catch (error) {
    console.error('deleteMeasurementById', error);
    return { error: 500, message: 'Database error' };
  }
};

export {
  listAllMeasurements,
  selectMeasurementById,
  selectMeasurementByUserId,
  insertMeasurement,
  updateMeasurementById,
  deleteMeasurementById,
};
