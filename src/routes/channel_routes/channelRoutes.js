const express = require("express");

const getAllChannels = require("../../controllers/getAllChannels");
const createChannel = require("../../controllers/createChannel");
const getChannel = require("../../controllers/getChannel");
const updateChannel = require("../../controllers/updateChannel");
const deleteChannel = require("../../controllers/deleteChannel");
const protect = require("../../middlewares/protectMiddleware");

const router = express.Router({ mergeParams: true });

// Get All Channels OR/AND Create Channel
router.route("/").get(getAllChannels).post(protect, createChannel);

// Get Single Channel OR/AND Delete Channel
router
  .route("/:id")
  .get(getChannel)
  .patch(protect, updateChannel)
  .delete(protect, deleteChannel);

module.exports = router;
