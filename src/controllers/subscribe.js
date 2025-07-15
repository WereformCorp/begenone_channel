const Channel = require("../models/channelModel");
const getAllUsers = require("../services/user/getAllUsers");
const getAllVideos = require("../services/video/getAllVideos");

const catchAsync = require("../utils/catchAsync");

const subscribe = catchAsync(async (req, res, next) => {
  try {
    const Users = await getAllUsers();
    const loggedInUser = Users.find((user) => user.id === req.user._id);

    const Videos = await getAllVideos();
    // Find the video manually
    const video = Videos.find((vid) => vid.id === req.params.id);
    let videoChannel;
    if (video)
      videoChannel = {
        _id: video.channel._id,
        name: video.channel.name,
      };

    // const videoChannel = await Video.findById(req.params.id).populate({
    //   path: "channel",
    //   select: "_id name",
    // });
    const requestedChannel = await Channel.findById(videoChannel._id);
    if (loggedInUser.channel)
      if (loggedInUser.channel._id.equals(requestedChannel._id)) {
        return res.status(403).json({
          status: "fail",
          message: "You cannot subscribe to your own channel.",
        });
      }
    if (!loggedInUser.subscribedChannels.includes(videoChannel._id))
      await Users.findByIdAndUpdate(loggedInUser._id, {
        $push: {
          subscribedChannels: videoChannel._id,
        },
      });

    if (!requestedChannel.subscribers.includes(loggedInUser._id)) {
      // If not subscribed, update the channel's subscribers array
      await Channel.findByIdAndUpdate(requestedChannel._id, {
        $push: { subscribers: loggedInUser._id },
      });
      return res.status(200).json({
        status: "success",
        isSubscribed: true,
      });
    }

    res.status(200).json({
      status: "fail",
      message: "THE CHANNEL ALREADY EXISTS",
    });
  } catch (err) {
    console.log(`SUBSCRIBE | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = subscribe;
