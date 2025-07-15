const express = require("express");
const multer = require("multer");

const uploadPfp = require("../../controllers/s3UploadPfp");
const authMiddleware = require("../../middlewares/authMiddleware");
const protect = require("../../middlewares/protectMiddleware");

const router = express.Router({ mergeParams: true });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Channel Picture
router
  .route("/profilepic")
  .post(protect, authMiddleware, upload.single("profilepic"), uploadPfp);

module.exports = router;
