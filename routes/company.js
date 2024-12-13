const express = require("express");
const {
  registerCompany,
  allCompaines,
  removeCompany,
  getCompanyData,
  updateCompanyData,
  login,
} = require("../controllers/companyController");
const { cAuth } = require("../middlewares/auth");
const router = express.Router();

router.route("/").get(allCompaines).post(registerCompany);
router
  .route("/:id")
  .get(getCompanyData)
  .delete(removeCompany)
  .put(updateCompanyData);

router.get('/:id/jobs')

module.exports = router;
