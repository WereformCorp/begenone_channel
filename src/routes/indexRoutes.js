// MULTER & EXPRESS
const express = require("express");

const channelsRoutes = require("./channel_routes/channelRoutes");
const bannerRoute = require("./events/bannerRoute");
const pfpRoute = require("./events/pfpRoute");
const subscribeRoute = require("./events/subscribeRoute");

// ---------------- ROUTING START HERE ---------------- //
const router = express.Router({ mergeParams: true });

router.use("/channel-routes", channelsRoutes);
router.use("/banner-routes", bannerRoute);
router.use("/pfp-routes", pfpRoute);
router.use("/subscribe-routes", subscribeRoute);

module.exports = router;
