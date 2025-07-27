const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const isProd = process.env.NODE_ENV === "production";

const userUrlPath = isProd
  ? process.env.PRODUCTION_APP_USER_API_URL_PRODUCTION
  : process.env.LOCALHOST_USER_URL;

const getUser = catchAsync(async (userId) => {
  try {
    const user = await axios.get(`${userUrlPath}/api/v1/users/user/${userId}`);

    console.log(`User from Get User API CALL: `, user?.data?.data);

    const userData = user?.data || user?.data?.data;

    return userData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getUser;
