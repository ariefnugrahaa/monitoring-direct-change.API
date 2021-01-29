const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { authentication } = require("../middleware/auth.middleware");

router
  .post("/login", AuthController.login)
  .post("/signup", AuthController.signup);

router.post("/change-password", AuthController.changepassword);

module.exports = router;
