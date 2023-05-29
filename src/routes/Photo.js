const express = require("express");
const router = express.Router();

const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
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

module.exports = router;
