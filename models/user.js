const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/doctor-surgeon-pharmacist-therapist-with-stethoscope-smiling-medic-worker-medical-staff_458444-338.jpg",
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    accountType: {
      type: String,
      enum: ["admin", "doctor", "patient", "nurse"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  {
    discriminatorKey: "accountType",
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
     return next(); // If the password field is not modified, skip hashing
   }

   try {
     const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
     this.password = await bcrypt.hash(this.password, salt); // Hash password
     next();
   } catch (error) {
     next(error);
   }
});

// Method to check password validity
userSchema.methods.matchPassword = async function (enteredPassword) {
  const correctPassword = await bcrypt.compare(enteredPassword, this.password);
  return correctPassword; 
};

const User = mongoose.model("User", userSchema);

module.exports = User;
