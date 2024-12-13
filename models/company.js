const db = require("../DB/conn");

exports.createCompany = async (name, industry, location, website, size, description) => {
  try {
    const sql = "INSERT INTO companies (name, industry, location, website, size, description) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [name, industry, location, website, size, description]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findAllCompanies = async () => {
  try {
    const sql = "SELECT * FROM companies";
    const [rows] = await db.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.findCompanyById = async (id) => {
  try {
    const sql = "SELECT * FROM companies WHERE id = ?";
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findCompanyByName = async (name) => {
  try {
    const sql = "SELECT * FROM companies WHERE name = ?";
    const [rows] = await db.execute(sql, [name]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findCompanyByIdAndDelete = async (id) => {
  try {
    const sql = "DELETE FROM companies WHERE id = ?";
    const [result] = await db.execute(sql, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findCompanyByIdAndUpdate = async (id, updateData) => {
  try {
    let setClause = [];
    let values = [];

    for (let [key, value] of Object.entries(updateData)) {
      setClause.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id);

    const sql = `UPDATE companies SET ${setClause.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};
