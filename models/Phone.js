const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema({
   name: { type: String, required: true },
   price: { type: Number, required: true },
   image: { type: String, required: true },
   seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   isSold : { type : Boolean , default : false },
   soldAt : {type : Date}
});

module.exports = mongoose.model("Phone", PhoneSchema);
