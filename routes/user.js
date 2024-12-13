const express = require("express");
const {
  register,
  allUsers,
  updateUserById,
  getUserbyId,
  removeUser,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getApplications,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const upload = require("../utils/multerConfig")

router
  .route("/")
  .get(allUsers)
  .post(register)
  // .patch(auth, upload('images').single('profileImg'), updateUserById)
  .delete(auth, removeUser);
router.post("/login", login);
router.patch("/:id", upload('images').single('profileImg'), updateUserById)
router.route("/:id").get(
  // auth, 
  getUserbyId);
router.route("/:id/applications").get(auth, getApplications);
router.post("/forgot-password", forgotPassword);
router.post("/verifyOtp", auth, verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
