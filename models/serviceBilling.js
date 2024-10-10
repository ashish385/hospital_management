const mongoose = require("mongoose");

const serviceBillingSchema = new mongoose.Schema({
  patientUHID: { type: String, required: true },
  patientName: { type: String, required: true },
  service: { type: String, required: true },
  serviceFees: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ServiceBilling", serviceBillingSchema);
