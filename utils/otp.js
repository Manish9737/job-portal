/**
 * Function to generate a random OTP of a given length
 * @param {number} length - The length of the OTP to be generated
 * @returns {string} - The generated OTP as a string
 */

const generateOTP = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

module.exports = generateOTP;
