const express = require("express");
const authController = require("../controllers/auth");
const { isAuthenticated } = require("../middleware/is-authenticated");

const router = express.Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get("/logout", authController.logout);

module.exports = router;
