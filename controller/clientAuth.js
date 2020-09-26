const validator = require("validator");
const sendMail = require("../middleware/sendMail"),
   bcrypt = require("bcrypt"),
   jwt = require("jsonwebtoken"),
   User = require("../models/User");

//Registering a Client
module.exports.register = async (req, res) => {
   try {
      //Validating the email
      const isValidEmail = validator.isEmail(req.body.email);
      if (!isValidEmail)
         throw new Error("Please provide with a valid Email Adress");

      //Searching the database to check if a user exists with the same Email
      const ExistingUser = await User.findOne({ email: req.body.email });

      if (ExistingUser) {
         return res.sendStatus(400).end();
      }
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const createdUser = await User.create({
         ...req.body,
         password: hashedPassword,
      });
      const token = jwt.sign({ id: createdUser._id }, process.env.TOKEN_KEY, {
         expiresIn: "30m",
      });

      //Emitting the Register activity for the fornt end to adjust accordingly
      req.io.emit("userLoggedIn", createdUser);

      //Send the conformation email to the client
      sendMail(createdUser);

      res.json(token);
   } catch (err) {
      console.log(err);
   }
};

//Getting the user request for login
module.exports.login = async (req, res) => {
   try {
      const foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
         return res
            .sendStatus(400)
            .send({ message: "No user found with this email address" });
      }
      const didMatch = bcrypt.compareSync(
         req.body.password,
         foundUser.password
      );
      if (!didMatch) {
         return res.sendStatus(401).send({ message: "Password Incorrect!" });
      }

      if (!foundUser.isVerified) {
         res.sendStatus(403).send({
            message: "Please verify your account to continue",
         });
      }

      const token = jwt.sign({ id: foundUser._id }, process.env.TOKEN_KEY, {
         expiresIn: "30m",
      });

      //Emiting the Login activity for front end to do some particular changes
      req.io.emit("userLoggedIn", foundUser);
      res.json(token);
   } catch (error) {
      console.log(error);
   }
};

//Getting the loggedIn user to update the navbar and other stuffs
module.exports.getUser = async (req, res) => {
   try {
      let loggedInUser;
      const bearerToken = req.headers.authorisation.split(" ")[1];
      const payload = jwt.verify(bearerToken, process.env.TOKEN_KEY);
      loggedInUser = await User.findById(payload.id);
      res.json(loggedInUser);
   } catch (error) {
      console.log(error.message);
      if (error.message === "jwt expired") {
         res.sendStatus(401).end();
      } else if (error.message === "invalid token") {
         res.sendStatus(403).end();
      } else {
         res.sendStatus(500).end();
      }
   }
};

//Checking the token coming from the conformation mail
module.exports.confirmUser = async (req, res) => {
   try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, process.env.TOKEN_KEY);

      //Setting the isVerified property of user to true
      await User.findByIdAndUpdate(payload.id, { isVerified : true })

      //Redirecting back to the home page
      res.sendStatus(200).redirect("http://localhost:4000/")  

   } catch (error) {
      console.log(error.message);
      if (error.message === "jwt expired") {
         res.sendStatus(401).end();
      } else if (error.message === "invalid token") {
         res.sendStatus(403).end();
      } else {
         res.sendStatus(500).end();
      }
   }
};
