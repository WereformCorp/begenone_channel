const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const isProd = process.env.NODE_ENV === "production";

const videoUrlPath = isProd
  ? process.env.PRODUCTION_APP_VIDEO_API_URL_PRODUCTION
  : process.env.LOCALHOST_VIDEO_URL;

const getVideo = catchAsync(async (videoID) => {
  try {
    const video = await axios.get(
      `${videoUrlPath}/api/v1/videos/route-video/${videoID}`,
    );

    console.log(`Data from Get One Video API CALL: `, video);

    if (!video)
      throw new Error(`No Video Was Found! -- Get Video API CALL 💥💥💥`);

    return video;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = getVideo;
