const express = require("express");
const router = express();

const { register } = require("../controllers/User");

const validate = require("../middlewares/handleValidation");
const { validateUserCreation } = require("../middlewares/userValidation");

router.post("/register", validateUserCreation(), validate, register);

module.exports = router;
