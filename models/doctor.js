// models/doctor.js
const mongoose = require("mongoose");
const User = require("./user");

const doctorSchema = new mongoose.Schema({
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  speciality: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  opConsultationFee: {
    type: Number,
    // required: true,
  },
  consultationDays: {
    type: String, // may be string array
    // required: true,
  },
  feeConsultationVisits: {
    type: Number,
  },
  ipVisitFee: {
    type: Number,
  },
  casualtyFee: {
    type: Number,
  },
  icuFee: {
    type: Number,
  },
  experience: {
    type: Number,
    required: true,
  },
  generalFee: {
    type: Number,
  },
  about: {
    type: String,
    maxlength: 1000,
  },
});

const Doctor = User.discriminator("doctor", doctorSchema);

module.exports = Doctor;
