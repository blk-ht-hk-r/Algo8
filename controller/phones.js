const jwt = require("jsonwebtoken"),
   User = require("../models/User");
const Phone = require("../models/Phone");

//Get all the phones to display on the home page
module.exports.getPhones = async (req, res) => {
   try {
      const phones = await Phone.find({ isSold : false });
      res.json(phones);
   } catch (err) {
      console.log(err);
   }
};

//post request handling of new phone creation
module.exports.createNewPhone = async (req, res) => {
   try {
      const phoneData = {
         ...req.body,
         seller: req.user.id,
      };
      const createdPhone = await Phone.create(phoneData);

      //Adding the phone id to the clients phoneOnsale db
      const userWhocreated = await User.findById(req.user.id)
      userWhocreated.phonesOnSale.push(createdPhone._id)
      userWhocreated.save()

      res.json(createdPhone);
   } catch (error) {
      console.log(error);
      res.sendStatus(404).end();
   }
};

//phones show page
module.exports.getPhone = async (req, res) => {
   try {
      let loggedInUser;
      let statusCode;

      //extracting the bearer token from the header
      const bearerToken = req.headers.authorisation.split(" ")[1];
      const isToken = bearerToken !== "null";

      //Finding the phone with the given Id
      const foundPhone = await Phone.findById(req.params.phoneId);

      //conditional paths for the having or not, a token
      if (isToken) {
         try {
            const payload = jwt.verify(bearerToken, process.env.TOKEN_KEY);
            loggedInUser = await User.findById(payload.id);
         } catch (error) {
            statusCode = 403;
         }
         res.json({
            foundPhone,
            loggedInUser,
            statusCode,
         });
      } else {
         res.json({
            foundPhone,
         });
      }
   } catch (error) {
      console.log(error);
   }
};

//edit phone route
module.exports.editPhone = async (req, res) => {
   try {
      foundPhone = await Phone.findById(req.params.phoneId);
      res.json(foundPhone);
   } catch (err) {
      console.log(err);
   }
};

//Update phone route
module.exports.updatePhone = async (req, res) => {
   try {
      await Phone.findByIdAndUpdate(req.params.phoneId, req.body);
      res.sendStatus(200).end();
   } catch (err) {
      console.log(err);
   }
};

//Destroy phone Route
module.exports.deletePhone = async (req, res) => {
   try {
      let foundPhone = await Phone.findById(req.params.phoneId);
      await foundPhone.remove();
      res.sendStatus(200).end();
   } catch (err) {
      console.log(err);
   }
};
