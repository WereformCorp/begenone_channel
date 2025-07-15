const express = require("express");
const multer = require("multer");

const uploadBanner = require("../../controllers/s3UploadBanner");
const authMiddleware = require("../../middlewares/authMiddleware");
const protect = require("../../middlewares/protectMiddleware");

const router = express.Router({ mergeParams: true });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Channel Banner
router
  .route("/banner")
  .post(protect, authMiddleware, upload.single("banner"), uploadBanner);

module.exports = router;
