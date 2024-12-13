const db = require("../DB/conn");

exports.createApplication = async (jobId, userId, resume, coverLetter) => {
  try {
    const sql =
      "INSERT INTO applications (job_id, user_id, resume, cover_letter) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [jobId, userId, resume, coverLetter]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.allApplications = async () => {
  try {
    const sql = `
      SELECT applications.*, 
             users.name AS user_name, users.email AS user_email, users.role AS user_role,
             jobs.title AS job_title, jobs.description AS job_description,
             companies.name AS company_name, companies.industry AS company_industry,
             companies.location AS company_location, companies.website AS company_website
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
    `;
    const [rows] = await db.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.findApplicationById = async (id) => {
  try {
    if (!id) {
      throw new Error("Application ID is undefined!");
    }
    const sql = `
      SELECT applications.*, 
             users.name AS user_name, users.email AS user_email, users.role AS user_role,
             jobs.title AS job_title, jobs.description AS job_description,
             companies.name AS company_name, companies.industry AS company_industry,
             companies.location AS company_location, companies.website AS company_website
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      WHERE applications.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);

    if (!rows || rows.length === 0) {
      throw new Error("Application not found");
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findApplicationByJobAndUser = async (jobId, userId) => {
    try {
      const sql = "SELECT * FROM applications WHERE job_id = ? AND user_id = ?";
      const [rows] = await db.execute(sql, [jobId, userId]);
  
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  };

exports.removeApplication = async (id) => {
  try {
    const sql = "DELETE FROM applications WHERE id = ?";
    const result = await db.execute(sql, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getApplicationsByUserId = async(id) => {
  try {
    if (!id) {
      throw new Error("User ID is undefined!");
    }
    const sql =`
      SELECT applications.*, 
             users.name AS user_name, users.email AS user_email, users.role AS user_role,
             jobs.title AS job_title, jobs.description AS job_description,
             companies.name AS company_name, companies.industry AS company_industry,
             companies.location AS company_location, companies.website AS company_website
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      WHERE users.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);

    if (!rows || rows.length === 0) {
      throw new Error("No applications found for this user");
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
}

exports.findApplicationsByJobId = async (jobId) => {
  try {
    const sql = `
      SELECT applications.*, 
             users.name AS user_name, users.email AS user_email, users.role AS user_role,
             jobs.title AS job_title, jobs.description AS job_description,
             companies.name AS company_name, companies.industry AS company_industry,
             companies.location AS company_location, companies.website AS company_website
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      WHERE applications.job_id = ?
    `;
    const [rows] = await db.execute(sql, [jobId]);
    return rows;
  } catch (error) {
    throw error;
  }
};