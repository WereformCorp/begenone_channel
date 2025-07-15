const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const getAllVideos = catchAsync(async () => {
  try {
    const data = await axios.get(
      `${process.env.LOCALHOST_VIDEO_URL}/api/v1/videos/route-video`,
    );

    console.log(`Data from getAllVideos API CALL: `, data);

    if (!data)
      throw new Error(
        `No Videos Were Found! -- Get All Videos API CALL 💥💥💥`,
      );

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = getAllVideos;
