// utils/validateFields.js

const { Counter } = require("../models/patient");

/**
 * Validate required fields in the request body.
 * @param {object} fields - An object of the fields to be validated.
 * @returns {array} - An array of missing field names.
 */
exports.validateFields = (fields) => {
  return Object.keys(fields).filter((key) => !fields[key]);
};

// Function to get the next UHID
 exports.getNextUHID = async()=> {
  const result = await Counter.findOneAndUpdate(
    { _id: "uhidCounter" },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  const paddedNumber = result.sequence.toString().padStart(6, "0");
  return `M-${paddedNumber}`; 
}



