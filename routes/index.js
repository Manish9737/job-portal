const express = require("express");
const { index, gpay } = require("../controllers/indexController");
const router = express.Router();

router.get("/", index);
router.get("/gpay", gpay);

module.exports = router;
