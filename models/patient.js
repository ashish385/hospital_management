const mongoose = require("mongoose");
const User = require("./user");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const patientSchema = new mongoose.Schema({
  patientUHID: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
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
    this.patientUHID = `M-${paddedNumber}`;
    console.log(`Generated patientUHID: ${this.patientUHID}`); 
    next();
  } catch (error) {
    next(error);
  }
});




const Patient = User.discriminator("patient", patientSchema);

module.exports = {
  Patient,
  Counter,
};
