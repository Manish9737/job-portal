const db = require("../DB/conn");

exports.createNotification = async (userId, message) => {
  try {
    const sql = "INSERT INTO notifications ( user_id, message) VALUES (?, ?)";
    const [result] = await db.execute(sql, [userId, message]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.allNotifications = async () => {
  try {
    const sql = "SELECT * FROM notifications";
    const [rows] = await db.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.findNotificationById = async (id) => {
  try {
    const sql = "SELECT * FROM notifications WHERE id = ?";
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.removeNotification = async (id) => {
  try {
    const sql = "DELETE FROM notifications WHERE id = ?";
    const result = await db.execute(sql, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.updateNotification = async (id, updateData) => {
  try {
    let setClause = [];
    let values = [];

    for (let [key, value] of Object.entries(updateData)) {
      setClause.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id);

    const sql = `UPDATE notifications SET ${setClause.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("Notification not found or no changes made");
    }

    const [updatedJob] = await db.execute("SELECT * FROM notifications WHERE id = ?", [id]);

    return updatedJob[0];
  } catch (error) {
    throw error;
  }
};
