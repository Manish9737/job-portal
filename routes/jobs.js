const express = require("express");
const {
  createJob,
  allJobs,
  findJobById,
  updateJobById,
  deleteJobById,
  filterJobs,
} = require("../controllers/jobsController");
const router = express.Router();

router.route("/").get(filterJobs).post(createJob);

router.route("/:id").get(findJobById).put(updateJobById).delete(deleteJobById);

module.exports = router;
