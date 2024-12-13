

/**
 * Validate email format.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



/**
 * Validate password strength.
 * Must contain at least one uppercase letter, one lowercase letter, one number, and be 8-20 characters long.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
exports.validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};



/**
 * Validate role to ensure it's either "user", "admin", etc.
 * @param {string} role - The role to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
exports.validateRole = (role) => {
  const validRoles = ["job-seeker", "recruiter"];
  return validRoles.includes(role);
};



/**
 * Validate website URL format.
 * Accepts URLs starting with http://, https://, or www.
 * @param {string} website - The website URL to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
exports.validateWebsite = (website) => {
  const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return websiteRegex.test(website);
};