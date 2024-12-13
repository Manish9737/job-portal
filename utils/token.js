const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET_KEY || "jwt_secret_token_mk73";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Generates a JWT token for a given user.
 *
 * @param {Object} user - The user object. Should contain at least the user's ID.
 * @returns {string} - The generated JWT token.
 */

const generateToken = (user) => {
  if (!user || !user.id) {
    throw new Error("Invalid user object.");
  }

  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, JWT_SECRET);
};

module.exports = generateToken;
