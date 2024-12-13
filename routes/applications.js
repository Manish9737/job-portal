const express = require("express");
const {
  getAllApplications,
  createApplication,
  getApplicationById,
  deleteApplicationById,
  filterApplications,
} = require("../controllers/applicationController");
const upload = require("../utils/multerConfig");
const router = express.Router();

router
  .route("/")
  .get(filterApplications)
  .post(
    upload("applications").fields([
      { name: "resume", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
    ]),
    createApplication
  );
router.route("/:id").get(getApplicationById).delete(deleteApplicationById);

module.exports = router;
