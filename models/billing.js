const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  opdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OPDBooking",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  fee: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  date: { type: Date, default: Date.now },
});

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
