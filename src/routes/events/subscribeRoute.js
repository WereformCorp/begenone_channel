// MULTER & EXPRESS
const express = require("express");

const subscribe = require("../../controllers/subscribe");
const unsubscribe = require("../../controllers/unsubscribe");
const protect = require("../../middlewares/protectMiddleware");

const router = express.Router({ mergeParams: true });

// Subscribe Channel
router.post("/:id/subscribe", protect, subscribe);

// Unsubscribe Channel
router.post("/:id/unsubscribe", protect, unsubscribe);

module.exports = router;
