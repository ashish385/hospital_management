const mongoose = require("mongoose");
const User = require("./user");
const Counter = require("./counter");
require("dotenv").config();


const patientSchema = new mongoose.Schema({
  patientUHID: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  medicalHistory: [
    {
      condition: String,
      diagnosedDate: Date,
      treatment: String,
    },
  ],
  allergies: [String],
  createdAt: { type: Date, default: Date.now },
});


patientSchema.pre("save", async function (next) {
  console.log("Pre-save hook executed"); 
  try {
    const result = await Counter.findOneAndUpdate(
      { _id: "uhidCounter" },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );

    const paddedNumber = result.sequence.toString().padStart(6, "0");
    this.patientUHID = `${process.env.UHID_PREFIX}-${paddedNumber}`;
    console.log(`Generated patientUHID: ${this.patientUHID}`); 
    next();
  } catch (error) {
    next(error);
  }
});




const Patient = User.discriminator("patient", patientSchema);

module.exports = {
  Patient,
};
