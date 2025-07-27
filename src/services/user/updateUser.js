const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const isProd = process.env.NODE_ENV === "production";

const userUrlPath = isProd
  ? process.env.PRODUCTION_APP_USER_API_URL_PRODUCTION
  : process.env.LOCALHOST_USER_URL;

const updateUser = catchAsync(async (dataObj, id) => {
  try {
    const userData = await axios.patch(
      `${userUrlPath}/api/v1/users/user/${id}`,
      dataObj,
    );

    const user = userData?.data?.data;

    console.log(`Data from Update User API CALL: `, user);

    if (!user)
      throw new Error(`No User Was Updated! -- API CALL FROM UPDATE USER`);

    return user;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { updateUser };
