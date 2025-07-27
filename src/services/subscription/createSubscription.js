const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const isProd = process.env.NODE_ENV === "production";

const subscriptionUrlPath = isProd
  ? process.env.PRODUCTION_APP_SUBSCRIPTION_API_URL_PRODUCTION
  : process.env.LOCALHOST_SUBSCRIPTION_URL;

const createSubscription = catchAsync(
  async (userId, pricingName, pricingId, price = 0, autoRenew = true) => {
    try {
      const subscription = await axios.post(
        `${subscriptionUrlPath}/api/v1/subscription/`,
        {
          userId,
          pricingName,
          pricingId,
          price,
          autoRenew,
        },
      );

      const subscriptionData = subscription || subscription.data;

      return subscriptionData;
    } catch (err) {
      console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
      throw err;
    }
  },
);

module.exports = createSubscription;
