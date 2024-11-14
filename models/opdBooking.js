// opdBooking.js
const mongoose = require("mongoose");

const opdBookingSchema = new mongoose.Schema(
  {
    patientUHID: { type: String, required: true },
    patientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
    // doctorSpeciality: { type: String, required: true }, // doctor ki id
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    fee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    feeAfterDiscount: { type: Number },
    paymentMode: { type: String, required: true },
    remark: { type: String },
    visited: { type: Boolean, default: false },
    tokenNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OPDBooking = mongoose.model("OPDBooking", opdBookingSchema);
module.exports = OPDBooking;
