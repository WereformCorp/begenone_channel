const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const getAllSubscriptions = catchAsync(async () => {
  try {
    const subscriptions = await axios.get(
      `${process.env.LOCALHOST_SUBSCRIPTION_URL}/api/v1/subscription/route-subscriptions/`,
    );

    console.log(`Raw Subscription Data: `, subscriptions);

    const subscriptionsData = subscriptions?.data?.data;

    console.log(
      `Subscriptions Data from getAllSubscriptions API CALL: `,
      subscriptionsData,
    );

    return subscriptionsData;
  } catch (err) {
    console.log(`GET SUBSCRIPTION | SUBSCRIPTION SERVICE | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllSubscriptions;
