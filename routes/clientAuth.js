const express = require("express"),
   router = express.Router(),
   clientAuth = require("../controller/clientAuth");

//Getting the request for the sign up of a new client
router.post("/register", clientAuth.register);

//Getting the client request for login
router.post("/login", clientAuth.login);

//route for getting the loggedIn user for updating the navbar and other purposes
router.get("/getUser", clientAuth.getUser);

//route for confirming the user using the token coming through the conformation email
router.get("/verifyEmail/:emailToken", clientAuth.confirmUser)

//Exporting the Clients Authentication Routes
module.exports = router;
