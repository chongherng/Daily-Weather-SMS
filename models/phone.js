const mongoose = require("mongoose");

const phoneSchema = mongoose.Schema({
  phoneNo: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
});

module.exports = mongoose.model("Phone", phoneSchema);
