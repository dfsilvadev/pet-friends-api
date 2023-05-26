const express = require("express");
const router = express();

const { login, register } = require("../controllers/User");

const validate = require("../middlewares/handleValidation");
const {
  loginValidation,
  validateUserCreation,
} = require("../middlewares/userValidation");

router.post("/register", validateUserCreation(), validate, register);
router.post("/login", loginValidation(), validate, login);

module.exports = router;
