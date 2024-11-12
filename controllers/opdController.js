const OPDBooking = require("../models/opdBooking");
const { responseHelper } = require("../utils/validateFields");

exports.saveOPDBooking = async (req, res) => {
  try {
    const {
      patientUHID,
      patientName,
      phone,
      age,
      gender,
      address,
      doctorSpeciality,
      fee,
      discount,
      paymentMode,
      remark,
      } = req.body;
      
    //   console.log("body",req.body);
      

    // Trim spaces and convert fee and discount to numbers
   let sanitizeFee = parseFloat(
     fee
       .toString()
       .trim()
       .replace(/[^0-9.-]+/g, "")
   ); // Remove non-numeric characters, trim spaces
   let sanitizeDiscount = parseFloat(
     discount
       .toString()
       .trim()
       .replace(/[^0-9.-]+/g, "")
      ); // Similarly, sanitize discount
      
    //   console.log("sani ...",sanitizeFee,sanitizeDiscount);
      

    if (discount > 100) {
      return responseHelper(res, 4001, "Discount cannot be more than 100");
    }

    const discount_fee = sanitizeFee - (sanitizeFee * sanitizeDiscount) / 100;

    const newBooking = new OPDBooking({
      patientUHID,
      patientName,
      phone,
      age,
      gender,
      address,
      doctorSpeciality,
      fee:sanitizeFee,
      discount:sanitizeDiscount,
      paymentMode,
      remark,
    });

      const savedBooking = await newBooking.save();
      console.log("saved booking",{...savedBooking._doc,discount_fee});
      

    if (!savedBooking) {
      return responseHelper(res, 401, "Failed to save OPD booking");
    }

    return responseHelper(res, 200, "OPD booking saved successfully", {
      ...savedBooking._doc,
      discountFee: discount_fee,
    });
  } catch (error) {
    console.error("Error saving OPD booking:", error);
    return responseHelper(
      res,
      500,
      "An error occurred while saving the OPD booking",
      error.message
    );
  }
};
