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

// Generate Random Image Name
exports.generateImageName = async() => {
  // Define the prefix for the image name
  const prefix = "Imgrnd";

  // Generate a random number (for example, 5 digits)
  const randomNumber =  Math.floor(Math.random() * 100000); 

  // Combine the prefix with the random number
  const imageName = `${prefix}${randomNumber}`;

  return imageName;
}

// Function for Response helper
exports.responseHelper = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300, 
    message: message,
    data: data,
  });
};

// Function Parse To Float
exports.parseToFloat = (value) => {
  return parseFloat(
    value
      .toString()
      .trim()
      .replace(/[^0-9.-]+/g, "")
  );
}

// Function to return error message if respone empty
exports.returnErrorMessage = (respone,res,statusCode,message,data=null) => {
  if (!respone || respone.length === 0) {
    console.log("No unvisited bookings to extend to the next day");
    return this.responseHelper(res, statusCode, message,data);
  }
}





