const express = require("express");
const router = express();

const {
  login,
  getCurrentUser,
  getUserById,
  register,
  update,
} = require("../controllers/User");

const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");

const {
  loginValidation,
  validateUserCreation,
  userUpdateValidation,
} = require("../middlewares/userValidation");
const { imageUpload } = require("../middlewares/imageUpload");

router.get("/profile", authGuard, getCurrentUser);

router.post("/register", validateUserCreation(), validate, register);
router.post("/login", loginValidation(), validate, login);

router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

router.get("/:id", getUserById);

module.exports = router;
