const OPDBooking = require("../models/opdBooking");
const { Patient } = require("../models/patient");
const Doctor = require("../models/doctor")
const { responseHelper, parseToFloat } = require("../utils/validateFields");
const Billing = require("../models/billing");

exports.saveOPDBooking = async (req, res) => {
  try {
    const {
      patientUHID,
      doctorId,
      fee,
      discount,
      paymentMode,
      remark,
    } = req.body;

    let sanitizeFee = parseToFloat(fee);
    let sanitizeDiscount = parseToFloat(discount);

    if (sanitizeDiscount > 100) {
      return responseHelper(res, 401, "Discount cannot be more than 100");
    }

    const discountFee = sanitizeFee - (sanitizeFee * sanitizeDiscount) / 100;

    const todayDate = new Date().toISOString().split("T")[0];

    // Retrieve last booking of the day to increment token
    const lastBooking = await OPDBooking.findOne({ date: todayDate }).sort({
      tokenNumber: -1,
    });
    let newToken = lastBooking ? lastBooking.tokenNumber + 1 : 1;

    // find patient profile by patient UHID
    let patientProfile = await Patient.findOne({ patientUHID: patientUHID });
    console.log("patientProfile", patientProfile);
    
    if (!patientProfile || patientProfile.length === 0) {
      return responseHelper(res, 401, "Patient profile not found");
    }

    // find doctor profile by id 
    let doctorProfile = await Doctor.findOne({ _id: doctorId });
    console.log("doctorProfile", doctorProfile);
    if (!doctorProfile || doctorProfile.length === 0) {
      return responseHelper(res, 401, "Doctor profile not found");
    }

    // Create new booking with sanitized inputs
    const newBooking = new OPDBooking({
      patientUHID,
      patientProfile: patientProfile._id,
      doctorProfile:doctorProfile._id,
      fee: sanitizeFee,
      discount: sanitizeDiscount,
      paymentMode,
      remark,
      tokenNumber: newToken,
      feeAfterDiscount:discountFee,
      date: todayDate,
    });

    // Save booking and check if successful
    const savedBooking = await newBooking.save();
    if (!savedBooking) {
      return responseHelper(res, 401, "Failed to save OPD booking");
    }

    // Send success response with discountFee included
    return responseHelper(res, 200, "OPD booking saved successfully", {savedBooking});
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
    const opdBookings = await OPDBooking.find({ date: todayDate })
      .populate("patientProfile","-password")
      .populate("doctorProfile","-password")
      .exec();

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
    const opdDetails = await OPDBooking.findById({ _id: opdBookingId })
      .populate("patientProfile", "fullName contactNumber gender age address")
      .populate("doctorProfile", "fullName speciality about  ")
      .exec();
    if (!opdDetails) return responseHelper(res, 404, "No OPD bookings found for this Id");
    return responseHelper(res, 200, "OPD booking details", opdDetails);
  } catch (error) {
     console.error("Error fetching today's bookings:", error);
     return responseHelper(res, 500, "Error fetching today's bookings");
  }
}

exports.setOpdPatientVisitedByDoctor = async (req, res) => {
  const { opdBookingId } = req.params;
  
  try {
    const opdDetails = await OPDBooking.findById({ _id: opdBookingId });
    if (!opdDetails) return responseHelper(res, 404, "No OPD bookings");
    if(opdDetails.visited) return responseHelper(res, 404, "Patient Already Visited");

    const patientStatus = await OPDBooking.findByIdAndUpdate(
      { _id: opdBookingId },
      { $set: { visited: true } },
      { new: true }
    )
      .populate("patientProfile", "fullName contactNumber gender age address")
      .populate("doctorProfile", "fullName speciality about  ")
      .exec();
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

    const nextDayBooking = await OPDBooking.find({ date: nextDayDate })
      .populate("patientProfile", "fullName contactNumber gender age address")
      .populate("doctorProfile", "fullName speciality about  ")
      .exec();;
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


exports.updateBookingIfDoctorIsMissing = async (req, res) => {
  const bookingId = req.params.bookingId;
  const { doctorId } = req.body;
  
   if (!doctorId) {
     return responseHelper(res, 400, "Doctor ID is required");
   }

  try {
    let booking = await OPDBooking.findById(bookingId)
      .populate("patientProfile", "fullName contactNumber gender age address")
      .populate("doctorProfile", "fullName speciality about");
    // console.log("booking",booking);
    
    if (!booking) {
      return responseHelper(res, 404, "No booking found for the given ID");
    }
    
    booking.doctorProfile = doctorId;
    await booking.save();
    await booking.populate("doctorProfile", "fullName speciality about")

    return responseHelper(res, 200, "Booking updated successfully", booking);
  } catch (error) {
    console.error("Error updating booking", error);
    responseHelper(
      res,
      500,
      "Error updating booking",
      error.message
    );
  }

};

// Function to create billing for an OPD booking
exports.createServiceBilling = async (req, res) => {
  const { opdId } = req.params;

  try {
    // Find the OPD booking by ID
    const booking = await OPDBooking.findById(opdId)
      .populate("patientProfile", "fullName contactNumber gender age address")
      .populate("doctorProfile", "fullName speciality consultationFee")
      .exec();
    // console.log("booking",booking);

    if (!booking) {
      return responseHelper(res, 404, "No booking found for the given OPD ID");
    }

    // Calculate the final billing amount after discount
    const fee = booking.fee || booking.doctorProfile.consultationFee || 0;
    const discount = booking.discount || 0;
    const discountAmount = (fee * discount) / 100;
    const finalAmount = fee - discountAmount;

    // Create a new billing entry
    const billingEntry = new Billing({
      opdId: booking._id,
      patientId: booking.patientProfile._id,
      doctorId: booking.doctorProfile._id,
      fee,
      discount,
      discountAmount,
      finalAmount,
      paymentStatus: "Pending", // Set default status; can be updated on payment completion
      date: new Date(),
    });

    // Save the billing entry
    const savedBillingEntry = await billingEntry.save();
    console.log("savedBillingEntry", savedBillingEntry);

    // Populate patient and doctor info for the response
    await savedBillingEntry.populate([
      {
        path: "patientId",
        select: "fullName contactNumber gender age address",
      },
      { path: "doctorId", select: "fullName speciality" },
    ]);
    // Return the created billing entry
    return responseHelper(
      res,
      200,
      "Billing created successfully",
      savedBillingEntry
    );
  } catch (error) {
    console.error("Error creating billing:", error);
    return responseHelper(res, 500, "Error creating billing", error.message);
  }
};


exports.getServiceBillingsByOpdId = async (req, res) => {
  try {
    const { opdId } = req.params; 

    // Find all billing entries associated with the given opdId
    const billingEntries = await Billing.find({ opdId })
      .populate("patientId", "fullName contactNumber gender age address")
      .populate("doctorId", "fullName speciality")
      .exec();

    if (!billingEntries || billingEntries.length === 0) {
      return responseHelper(
        res,
        404,
        "No billing entries found for the specified OPD ID"
      );
    }

    return responseHelper(
      res,
      200,
      "Billing entries retrieved successfully",
      billingEntries
    );
  } catch (error) {
    console.error("Error fetching billing entries:", error);
    return responseHelper(
      res,
      500,
      "Error fetching billing entries",
      error.message
    );
  }
};


exports.payServiceBill = async (req, res) => {
  try {
    const { billingId } = req.params; // Get the billing ID from the URL
    const { paymentMethod, amountPaid, paymentDate } = req.body; // Get payment details from the body

    // Find the billing entry by billingId
    const billingEntry = await Billing.findById(billingId);

    if (!billingEntry) {
      return responseHelper(res, 404, "Billing entry not found");
    }

    // Update billing status to 'paid' and record payment details
    billingEntry.status = "paid"; // Or "Completed", depending on your requirements
    billingEntry.paymentMethod = paymentMethod;
    billingEntry.amountPaid = amountPaid;
    billingEntry.paymentDate = paymentDate || new Date(); // Use current date if no date is provided

    // Save the updated billing entry
    const updatedBillingEntry = await billingEntry.save();

    // Optionally, you can update the patient's account balance or doctor's earnings here

    // Return the updated billing entry with payment info
    return responseHelper(
      res,
      200,
      "Service bill paid successfully",
      updatedBillingEntry
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return responseHelper(res, 500, "Error processing payment", error.message);
  }
};



