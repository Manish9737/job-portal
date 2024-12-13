const db = require("../DB/conn");
const bcrypt = require("bcrypt");

exports.createUser = async (name, email, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [name, email, hashedPassword, role]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findUserById = async (id) => {
  try {
    const sql = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findAllUsers = async () => {
  try {
    const sql = "SELECT * FROM users";
    const [rows] = await db.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.findByIdAndUpdate = async (id, updateData) => {
  try {
    let setClause = [];
    let values = [];

    for (let [key, value] of Object.entries(updateData)) {
      if (key === "password") {
        value = await bcrypt.hash(value, 10);
      }
      setClause.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id);

    const sql = `UPDATE users SET ${setClause.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findByIdAndDelete = async (id) => {
  try {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};
