const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
  fromCountry: String,
  toCountry: String,
  transferAmount: Number,
  convertedAmount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transfer", TransferSchema);
