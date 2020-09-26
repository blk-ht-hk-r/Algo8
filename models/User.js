const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
   email: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
   isAdmin: { type: Boolean, default: false },
   isVerified : {type : Boolean , default : false},
   location : Object,
   phonesBought: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Phone",
      },
   ],
   phonesOnSale: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Phone",
      },
   ],
   phonesSold: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Phone",
      },
   ],
});

module.exports = mongoose.model("User", UserSchema);
