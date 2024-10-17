// utils/validateFields.js

/**
 * Validate required fields in the request body.
 * @param {object} fields - An object of the fields to be validated.
 * @returns {array} - An array of missing field names.
 */
exports.validateFields = (fields) => {
  return Object.keys(fields).filter((key) => !fields[key]);
};



