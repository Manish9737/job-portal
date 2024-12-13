const express = require("express");
const {
  markAsRead,
  getNotificationById,
  deleteNotificationById,
  allNotifications,
  createNotification,
} = require("../controllers/notificationController");
const router = express.Router();

router.route("/").get(allNotifications).post(createNotification);
router.route("/:id").get(getNotificationById).delete(deleteNotificationById);
router.put("/:id/read", markAsRead);

module.exports = router;
