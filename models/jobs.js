const db = require("../DB/conn");

exports.addJob = async (
  title,
  description,
  company_id,
  salary_range,
  location,
  job_type,
  skills_required,
  experience_level
) => {
  try {
    const sql =
      "INSERT INTO jobs (title, description, company_id, salary_range, location, job_type, skills_required, experience_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [
      title,
      description,
      company_id,
      salary_range,
      location,
      job_type,
      skills_required,
      experience_level,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findJobById = async (id) => {
  try {
    const sql = `SELECT jobs.*, companies.name as company_name, companies.industry, companies.location as company_location, 
             companies.website, companies.size, companies.description as company_description
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      WHERE jobs.id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.allJobs = async (id, updateData) => {
  try {
    const sql = `
      SELECT jobs.*, 
             companies.name as company_name, 
             companies.industry, 
             companies.location as company_location, 
             companies.website, 
             companies.size, 
             companies.description as company_description
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
    `;
    const [rows] = await db.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.updateJob = async () => {
  try {
    let setClause = [];
    let values = [];

    for (let [key, value] of Object.entries(updateData)) {
      setClause.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id);

    const sql = `UPDATE jobs SET ${setClause.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("Job not found or no changes made");
    }

    const [updatedJob] = await db.execute("SELECT * FROM jobs WHERE id = ?", [
      id,
    ]);

    return updatedJob[0];
  } catch (error) {
    throw error;
  }
};

exports.removeJob = async (id) => {
  try {
    const sql = "DELETE FROM jobs WHERE id = ?";
    const result = db.execute(sql, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findJobsByFilters = async (title, location, salary_min) => {
  try {
    let sql = `
      SELECT jobs.*, 
             companies.name as company_name, 
             companies.industry, 
             companies.location as company_location, 
             companies.website, 
             companies.size, 
             companies.description as company_description
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      WHERE 1=1
    `;

    const params = [];

    if (title) {
      sql += ` AND title LIKE ?`;
      params.push(`%${title}%`);
    }

    if (location) {
      sql += ` AND location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (salary_min) {
      sql += ` AND salary_range >= ?`;
      params.push(salary_min);
    }

    const [rows] = await db.execute(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
};
