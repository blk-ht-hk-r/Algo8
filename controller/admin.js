const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Phone = require("../models/Phone");
const User = require("../models/User");

module.exports.login = async (req, res) => {
   try {
      const foundUser = User.findByOne({ email: req.body.email });

      if (!foundUser) {
         throw new Error("NO user found with this Email");
      }

      const didMatch = bcrypt.compareSync(
         req.body.password,
         foundUser.password
      );

      if (!didMatch) {
         throw new Error("Password Incorrect!");
      }

      if (!foundUser.isAdmin) {
         throw new Error("You are not allowed to access the Admin Control");
      }

      const token = jwt.sign({ id: foundUser._id }, process.env.TOKEN_KEY, {
         expiresIn: "30m",
      });

      //Emitting the login Activity for the front end to display some specific routes
      req.io.emit("UserLoggedIn", foundUser);
      res.json(token);
   } catch (error) {
      console.log(error);
   }
};

module.exports.getSalesReport = async (req, res) => {
   try {
      const phonesSoldToday = await Phone.find({
         $where: () => {
            today = new Date(); //get today's date
            today.setHours(0, 0, 0, 0); //Set the time to be midnight
            return this.soldAt() >= today; // Filtering data for sold at today
         },
         isSold: true, //Filtering all the sold phones
      });

      const phones = phonesSoldToday.forEach((phone) => {
         return phone.populate("seller").populate("buyer");
      });

      res.json(phones);
   } catch (err) {
      console.log(err);
   }
};

module.exports.getUserReport = async (req, res) => {
   try {
      const newClients = User.find({
         $where: () => {
            today = new Date(); //get today's date
            today.setHours(0, 0, 0, 0); //Set the time to be midnight
            return this._id.getTimestamp() >= today; //Getting just today's data
         },
         isAdmin: false, //Newly registered client should not be admin
      });

      res.json(newClients);
   } catch (err) {
      console.log(err);
   }
};

module.exports.getNewPhonesReport = async (req, res) => {
   try {
      const newPhonesOnSale = Phone.find({
         $where: () => {
            today = new Date();
            today.setHours(0, 0, 0, 0);
            return this._id.getTimestamp() >= today;
         },
      });

      res.json(newPhonesOnSale);
   } catch (err) {
      console.log(err);
   }
};
