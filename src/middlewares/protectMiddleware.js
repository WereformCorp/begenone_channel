// const axios = require("axios");
// const catchAsync = require("../utils/catchAsync");

// const protect = catchAsync(async (req, res, next) => {
//   console.log(`REQUEST FROM Protect Middleware`, req.method, req.originalUrl);

//   try {
//     // 1) Get the token (similar to your middleware)
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     } else if (req.cookies?.jwt) {
//       token = req.cookies.jwt;
//     }

//     console.log(`Token from PROTECT MIDDLEWARE`, token);

//     if (!token) return next(new Error("No token provided."));

//     // 2) Make the POST request to the authentication middleware in another microservice
//     const response = await axios.post(
//       `${process.env.LOCALHOST_AUTH_URL}/api/v1/authentication/route-auth/authenticate/`,
//       {}, // BODY!
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       },
//     );

//     console.log(`RESPONSE FROM PROTECT MIDDLEWARE`, response.data);

//     // If successful, move to the next middleware
//     req.user = response?.data?.user; // Assuming the response contains the user data

//     return next();
//   } catch (err) {
//     // Handle errors (You can customize error handling)
//     console.error(err);
//     return new Error("Authentication failed.");
//   }
// });

// module.exports = protect;

const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

const isProd = process.env.NODE_ENV === "production";

const authUrlPath = isProd
  ? process.env.PRODUCTION_APP_AUTH_API_URL_PRODUCTION
  : process.env.LOCALHOST_AUTH_URL;

const protect = catchAsync(async (req, res, next) => {
  try {
    // 1) Get the token (similar to your middleware)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    console.log(`Token from Protect Middleware for Videos: `, token);
    console.log(process.env.LOCALHOST_AUTH_URL);

    // 2) Make the POST request to the authentication middleware in another microservice
    if (token) {
      const response = await axios.post(
        `${authUrlPath}/api/v1/authentication/route-auth/authenticate`,
        {}, // You can send the token in the body if needed, or handle this in headers
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        },
      );

      console.log(`Response from Protect Middleware: `, response.data);

      // If successful, move to the next middleware
      req.user = response.data.user; // Assuming the response contains the user data
      res.locals.user = response.data.user; // Assuming the response contains the user data
      return next();
    }

    throw new Error("No token provided.");
  } catch (err) {
    // Handle errors (You can customize error handling)
    console.error(err);
    return next(new Error("Authentication failed."));
  }
});

module.exports = protect;
