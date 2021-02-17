const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/auth.middleware");
const DashboardController = require("../controllers/dashboard.controller");

router.get("/getamountmaterial", DashboardController.getamountmaterial);
router.get("/getsumamountmaterial", DashboardController.getsumamountmaterial);

module.exports = router;
