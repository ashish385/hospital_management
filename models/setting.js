const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    caption: { type: String },
    key: { type: String },
    value:{type:String}
});

const Setting = mongoose.model("setting", settingSchema);
module.exports = Setting;
