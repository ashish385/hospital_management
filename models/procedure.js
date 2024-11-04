const mongoose = require("mongoose");

const procedureSchema = new mongoose.Schema(
  {
    procedureName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Procedure = mongoose.model("Procedure", procedureSchema);

module.exports = Procedure;
