const jwt = require("jsonwebtoken");
let jwtToken = (id, username, email) => {
  const user = { id, username, email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10h",
  });
  return { accessToken, refreshToken };
};
//access 50min
//refren 2 days
module.export = { jwtToken };
