const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const isProd = process.env.NODE_ENV === "production";

const subscriptionUrlPath = isProd
  ? process.env.PRODUCTION_APP_SUBSCRIPTION_API_URL_PRODUCTION
  : process.env.LOCALHOST_SUBSCRIPTION_URL;

const getAllSubscriptions = catchAsync(async () => {
  try {
    const subscriptions = await axios.get(
      `${subscriptionUrlPath}/api/v1/subscription/route-subscriptions/`,
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
