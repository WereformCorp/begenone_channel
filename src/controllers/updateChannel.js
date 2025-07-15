const Channel = require("../models/channelModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const updateChannel = catchAsync(async (req, res, next) => {
  try {
    // // Create the update object
    // const updateObject = { ...req.body };
    // if (req.files) {
    //   // Loop through each uploaded file
    //   Object.keys(req.files).forEach((fieldname) => {
    //     const uploadedFile = req.files[fieldname][0];

    //     // Check if the file is a displayImage or bannerImage
    //     if (fieldname === "displayImage" || fieldname === "bannerImage") {
    //       // Remove the old file before saving the new one
    //       if (req.user.channel[fieldname]) {
    //         const oldFilePath = `public/imgs/users/${req.user._id}/${fieldname}s/${req.user.channel[fieldname]}`;
    //         fs.unlinkSync(oldFilePath);
    //       }

    //       // Update the corresponding field in updateObject
    //       updateObject[fieldname] = uploadedFile.filename;
    //     }
    //   });
    // }

    console.log(`Requested User: `, req.user);
    console.log(`Requested Channel: `, req.user.channel);

    const reqBodyObj = req.body.dataObj;
    console.log(`Requested Body from channel Update: `, reqBodyObj);

    const updateObj = {};

    // Push video ID if provided in dataObj.videos
    if (reqBodyObj?.videos) {
      updateObj.$push = { videos: reqBodyObj.videos };
      delete reqBodyObj.videos; // Remove to avoid double handling
    }

    // Set any remaining fields as normal updates
    if (
      reqBodyObj &&
      typeof reqBodyObj === "object" &&
      Object.keys(reqBodyObj).length > 0
    ) {
      updateObj.$set = reqBodyObj;
    }

    const channelData = await Channel.findByIdAndUpdate(
      req.user.channel,
      updateObj,
      {
        new: true,
        runValidators: true,
      },
    );

    console.log(`Channel DATA: `, channelData);

    if (!channelData)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: "Success",
      data: channelData,
    });
  } catch (err) {
    console.log(`UPDATE CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateChannel;
