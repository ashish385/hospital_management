// models/doctor.js
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  fullName: { 
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    speciality: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    opConsultationFee: {
        type: Number,
        required: true
    },
    consultationDays: {
        type: String, // may be string array
        required: true
    }, 
    feeConsultationVisits: {
        type: Number
    },
    ipVisitFee: {
        type: Number
    },
    casualtyFee: {
        type: Number
    },
    icuFee: {
        type: Number
    },
    experience: {
        type: Number, required: true
    },
    generalFee: {
        type: Number
    },
    about: {
        type: String,
        maxlength: 1000
    },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
