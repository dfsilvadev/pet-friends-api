const express = require("express");
const router = express();

const { login, register, getCurrentUser } = require("../controllers/User");

const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");

const {
  loginValidation,
  validateUserCreation,
} = require("../middlewares/userValidation");

router.post("/register", validateUserCreation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);

module.exports = router;
