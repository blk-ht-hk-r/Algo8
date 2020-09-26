const User = require("../models/User");

const getLocation = async (req, res) => {
   try {
      const location = req.body;
      await User.findByIdAndUpdate(req.user.id, { location: location });
   } catch (err) {
      console.log(err);
   }
};

module.exports = getLocation;
