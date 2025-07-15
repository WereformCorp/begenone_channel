// --- MODEL
const Channel = require("../models/channelModel");

// --- GET ALL
// const getAllUsers = require("../services/user/getAllUsers");
const getUser = require("../services/user/getUser");
const getAllVideos = require("../services/video/getAllVideos");
// const getAllSubscriptions = require("../services/subscription/getAllSubscriptions");
const getVideo = require("../services/video/getVideo");
const getOneSubscription = require("../services/subscription/getSubscription");
const getAllPricings = require("../services/pricings/getAllPricings");

// --- UPDATE
const { updateUser } = require("../services/user/updateUser");

// --- UTILITIES
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createChannel = catchAsync(async (req, res, next) => {
  try {
    // Step 1: Get the current user
    const userData = await getUser(req.user._id);
    const user = userData.data;
    console.log(`User from create Channel: `, user);
    console.log(
      `USER'S Current Active Subscription: `,
      user.currentActiveSubscription,
    );
    if (user && user.currentActiveSubscription) {
      // Manually populate the currentActiveSubscription
      const curSubscriptions = await getOneSubscription(
        user.currentActiveSubscription,
      );
      console.log(`Current Subscriptions: `, curSubscriptions);

      const updatedUser = await updateUser(
        {
          currentActiveSubscription: curSubscriptions,
        },
        user._id,
      );
      console.log(`Updated User from IF STATEMENT: `, updatedUser);
    }

    console.log(`USER FROM CREATE CHANNEL:`, user);
    if (!user || !user.currentActiveSubscription) {
      return res.status(400).json({
        status: "Failed",
        message: `No active subscription found. Please purchase a subscription to create a channel.`,
      });
    }

    // Step 2: Fetch the subscription based on currentActiveSubscription
    const subscription = await getOneSubscription(
      user.currentActiveSubscription,
    );
    // const subscription = Subscriptions.find(
    //   (sub) => sub.id === user.currentActiveSubscription,
    // );

    console.log(`SUBSCRIPTION FROM CREATE CHANNEL:`, subscription);
    if (!subscription) {
      return res.status(400).json({
        status: "Failed",
        message: `Subscription associated with user is invalid or not found.`,
      });
    }
    // Step 3: Fetch the pricing details associated with the subscription
    const Pricings = await getAllPricings();

    console.log(`Subscription Pricings: `, subscription.pricings);
    const pricing = Pricings.find(
      (singlePricing) => singlePricing._id === subscription.pricings,
    );
    // const pricing = await Pricings.findById(subscription.pricings);
    console.log(`PRICING FROM CREATE CHANNEL:`, pricing);
    if (!pricing) {
      return res.status(400).json({
        status: "Failed",
        message: `Pricing details for the subscription are missing.`,
      });
    }
    // if (
    //   subscription.active === true &&
    //   subscription.status === "active" &&
    //   pricing.features.channelCreation === true
    // ) {
    console.log(
      `USER IS ELIGIBLE TO CREATE A CHANNEL [BECAUSE HE HAS PURCHASED THE EARLY ACCESS SUBSCRIPTION]`,
      { Subscription_ACTIVE: subscription.active },
      { Subscription_STATUS: subscription.status },
    );
    const existingChannel = await Channel.findOne({ user: req.user._id });
    if (existingChannel) {
      // If a channel already exists, send an error response
      return res.status(400).json({
        status: "fail",
        message: "User already has a channel.",
      });
    }
    const channelData = await Channel.create({
      channelUserName: req.body.channelUserName,
      name: req.body.name,
      displayImage: req.body.displayImage,
      bannerImage: req.body.bannerImage,
      about: req.body.about,
      subscribers: req.body.subscribers,
      products: req.body.products,
      reviews: req.body.reviews,
      commentToggle: req.body.commentToggle,
      comments: req.body.comments,
      commentFilters: req.body.commentFilters,
      videos: req.body.videos,
      wires: req.body.wires,
      user: req.user._id,
      sponsors: req.body.sponsors,
      story: req.body.story,
    });
    if (!channelData.displayImage)
      channelData.displayImage = "/imgs/users/default.jpeg";

    console.log(`Channel Data: `, channelData);
    console.log(`Requested User Id Before Update: `, req.user._id);
    console.log(`Channel Data ID `, channelData._id.toString());

    // 1. Call updateTheUser function to update user in the external service
    const updateUser2 = await updateUser(
      { channel: channelData._id.toString() },
      req.user._id,
    );

    console.log(`Updated User after Update: `, updateUser2);
    if (!channelData) await updateUser({ channel: [] }, req.user._id);
    const videoPromises = channelData.videos.map((videoID) =>
      getVideo(videoID),
    );
    const videos = (await Promise.all(videoPromises)).filter(
      (video) => video !== null,
    );

    const sponsorsId = videos.reduce(
      (acc, video) => acc.concat(video.sponsors),
      [],
    );
    const commentId = videos.reduce(
      (acc, video) => acc.concat(video.comments),
      [],
    );
    await Channel.findByIdAndUpdate(
      channelData._id,
      { sponsors: sponsorsId._id, comments: commentId._id },
      { new: true, select: "_id" },
    );
    if (!channelData)
      await Channel.findByIdAndUpdate(channelData._id, { sponsors: [] });
    if (!channelData) return next(new AppError(`Data Not Found!`, 404));
    // if (!channelData.section) channelData.section = [];
    return res.status(201).json({
      status: "Success",
      data: channelData,
    });
    // }
    // console.log(
    //   `⭕⭕⭕ You Cannot Create Channel, You'd need to Purchase Early Access to Get Started. ⭕⭕⭕`,
    // );
    // return res.status(400).json({
    //   status: "failed",
    //   message: `You Cannot Create Channel, You'd need to Purchase Early Access to Get Started.`,
    // });
  } catch (err) {
    console.log(`CREATE CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createChannel;
