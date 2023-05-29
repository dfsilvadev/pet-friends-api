const express = require("express");
const router = express.Router();

const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
} = require("../controllers/Photo");

const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");

const { photoInsertValidation } = require("../middlewares/photoValidation");
const { imageUpload } = require("../middlewares/imageUpload");

router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);
router.delete("/:id", authGuard, deletePhoto);
router.get("/", getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);
router.get("/:id", authGuard, getPhotoById);

module.exports = router;
