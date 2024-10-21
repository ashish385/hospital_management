const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: {
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
  }
}, {
    timestamps:true,
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;