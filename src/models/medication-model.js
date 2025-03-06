import promisePool from '../utils/database.js';

// Hae kaikki lääkkeet
const listAllMedications = async () => {
  try {
    const sql = 'SELECT * FROM Medications';
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (error) {
    console.error('listAllMedications', error);
    return { error: 500, message: 'Database error' };
  }
};

const listAllMedicationsByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM Medications WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('listAllMedicationsByUserId', error);
    return { error: 500, message: 'db error' };
  }
};

// Hae lääke ID:n perusteella
const selectMedicationById = async (id) => {
  try {
    const sql = 'SELECT * FROM Medications WHERE medication_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);

    if (rows.length === 0) {
      return { error: 404, message: 'Medication not found' };
    }

    return rows[0];
  } catch (error) {
    console.error('selectMedicationById', error);
    return { error: 500, message: 'Database error' };
  }
};

// Lisää uusi lääke
const insertMedication = async (medication) => {
  try {
    const sql =
      'INSERT INTO Medications (user_id, medication_date, name, dosage, taken_at, notes) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [
      medication.user_id,
      medication.medication_date,
      medication.name,
      medication.dosage,
      medication.taken_at,
      medication.notes,
    ];
    const [result] = await promisePool.query(sql, params);
    return { message: 'New medication created', medication_id: result.insertId };
  } catch (error) {
    console.error('insertMedication', error);
    return { error: 409, message: 'Medication already exists or invalid data' };
  }
};

// Päivitä lääke
const updateMedicationById = async (medication) => {
  try {
    const sql =
      'UPDATE Medications SET user_id=?, medication_date=?, name=?, dosage=?, taken_at=?, notes=? WHERE medication_id=?';
    const params = [
      medication.user_id,
      medication.medication_date,
      medication.name,
      medication.dosage,
      medication.taken_at,
      medication.notes,
      medication.medication_id,
    ];
    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'Medication not found' };
    }

    return { message: 'Medication updated', medication_id: medication.medication_id };
  } catch (error) {
    console.error('updateMedicationById', error);
    return { error: 500, message: 'Database error' };
  }
};

// Poista lääke
const deleteMedicationById = async (id) => {
  try {
    const sql = 'DELETE FROM Medications WHERE medication_id = ?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'Medication not found' };
    }

    return { message: 'Medication deleted', medication_id: id };
  } catch (error) {
    console.error('deleteMedicationById', error);
    return { error: 500, message: 'Database error' };
  }
};

export {
  listAllMedications,
  listAllMedicationsByUserId,
  selectMedicationById,
  insertMedication,
  updateMedicationById,
  deleteMedicationById,
};
