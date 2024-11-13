const OPDBooking = require("../models/opdBooking");
const { responseHelper, parseToFloat, returnErrorMessage } = require("../utils/validateFields");

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

 
    let sanitizeFee = parseToFloat(fee);
    let sanitizeDiscount = parseToFloat(discount);


    if (sanitizeDiscount > 100) {
      return responseHelper(res, 4001, "Discount cannot be more than 100");
    }


    const discountFee = sanitizeFee - (sanitizeFee * sanitizeDiscount) / 100;

    const todayDate = new Date().toISOString().split("T")[0];

    // Retrieve last booking of the day to increment token
    const lastBooking = await OPDBooking.findOne({ date: todayDate }).sort({
      tokenNumber: -1,
    });
    let newToken = lastBooking ? lastBooking.tokenNumber + 1 : 1;

    // Create new booking with sanitized inputs
    const newBooking = new OPDBooking({
      patientUHID,
      patientName,
      phone,
      age,
      gender,
      address,
      doctorSpeciality,
      fee: sanitizeFee,
      discount: sanitizeDiscount,
      paymentMode,
      remark,
      tokenNumber: newToken,
      date: todayDate,
    });

    // Save booking and check if successful
    const savedBooking = await newBooking.save();
    if (!savedBooking) {
      return responseHelper(res, 401, "Failed to save OPD booking");
    }

    // Send success response with discountFee included
    return responseHelper(res, 200, "OPD booking saved successfully", {
      ...savedBooking._doc,
      discountFee: discountFee,
    });
  } catch (error) {
    console.error("Error saving OPD booking:", error);
    return responseHelper(
      res,
      500,
      "An error occurred while saving the OPD booking"
    );
  }
};

exports.getTodayOpdBooking = async (req, res) => {
  try {
    // Set today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split("T")[0];

    // Find all OPD bookings for today
    const opdBookings = await OPDBooking.find({ date: todayDate });

    // Check if bookings were found
    if (!opdBookings || opdBookings.length === 0) {
      return responseHelper(res, 404, "No OPD bookings found for today");
    }

    return responseHelper(res, 200, "Today's OPD bookings", opdBookings);
  } catch (error) {
    console.error("Error fetching today's bookings:", error);
    return responseHelper(res, 500, "Error fetching today's bookings");
  }
};


exports.getOPDDetailsById = async (req, res) => {
  const { opdBookingId } = req.params;
  try {
    const opdDetails = await OPDBooking.findById({ _id: opdId })
    if (!opdDetails) return responseHelper(res, 404, "No OPD bookings found for this Id");
    return responseHelper(res, 200, "OPD booking details", opdDetails);
  } catch (error) {
     console.error("Error fetching today's bookings:", error);
     return responseHelper(res, 500, "Error fetching today's bookings");
  }
}

exports.patientVisitedByDoctor = async (req, res) => {
  const { opdBookingId } = req.params;
  
  try {
    const patientStatus = await OPDBooking.findByIdAndUpdate(
      { _id: opdBookingId },
      { $set: {visited:true} },
      { new: true }
    );
    if (!patientStatus)
      return responseHelper(res, 404, "No OPD bookings found for this Id");
    return responseHelper(res, 200, "OPD booking details", patientStatus);
  } catch (error) {
    console.error("Error fetching  bookings:", error);
    return responseHelper(res, 500, "Error fetching bookings");
  }
}

exports.extendUnvisitedBookingsToNextDay = async (req,res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split("T")[0];

    // Find all unvisited bookings for today
    const unvisitedBookings = await OPDBooking.find({
      date: todayDate,
      visited: false,
    });

     if (!unvisitedBookings || unvisitedBookings.length === 0) {
       return responseHelper(
         res,
         401,
         "No unvisited bookings to extend to the next day"
       );
    }
    
    console.log("unvisitedBookings", unvisitedBookings);
    

    // Calculate the next day's date
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayDate = nextDay.toISOString().split("T")[0];

    // Find the last token number for the next day
    const lastBookingForNextDay = await OPDBooking.findOne({
      date: nextDayDate,
    }).sort({ tokenNumber: -1 });
    let nextDayToken = lastBookingForNextDay
      ? lastBookingForNextDay.tokenNumber + 1
      : 1;

    // Extend each unvisited booking to the next day with a new token number
    for (const booking of unvisitedBookings) {
      booking.date = nextDayDate;
      booking.tokenNumber = nextDayToken++;
      await booking.save();
    }

    const nextDayBooking = await OPDBooking.find({ date: nextDayDate });
    if (!nextDayBooking || nextDayBooking.length === 0) {
      return responseHelper(
        res,
        401,
        "No bookings available to extend to the next day"
      );
    }
    
    responseHelper(
      res,
      200,
      "Extended unvisited bookings to the next day successfully",
      nextDayBooking
    );

  } catch (error) {
    console.error("Error extending unvisited bookings:", error);
    responseHelper(res, 500, "Error extending unvisited bookings:",error.message);
  }
};

