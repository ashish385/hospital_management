// opdBooking.js
const mongoose = require("mongoose");

const opdBookingSchema = new mongoose.Schema(
  {
    patientUHID: { type: String, required: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    // patientProfile: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    doctorSpeciality: { type: String, required: true },
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

module.exports = mongoose.model("OPDBooking", opdBookingSchema);
