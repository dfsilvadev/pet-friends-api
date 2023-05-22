const express = require("express");
const router = express();

const { register } = require("../controllers/User");

router.post("/register", register);

module.exports = router;
