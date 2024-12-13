const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET_KEY;

exports.auth = (req, res, next) => {
  const token =
    req.cookies.authToken || req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token, Authorization denied." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid." });
  }
};

exports.cAuth = (req, res, next) => {
  const token =
    req.cookies.cauthToken || req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token, Authorization denied." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.company = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid." });
  }
};
