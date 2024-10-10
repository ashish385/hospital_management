const mongoose = require("mongoose");

const opdBookingSchema = new mongoose.Schema({
  patientUHID: { type: String, required: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  doctorSpeciality: { type: String, required: true },
  fees: { type: Number },
  discount: { type: Number },
  paymentMode: { type: String, required: true },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OPDBooking", opdBookingSchema);
