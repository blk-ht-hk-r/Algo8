const express = require("express");
const bodyParser = require("body-parser");
const payment = require("../controller/payment");
const verifyClient = require("../middleware/verifyClient");
const router = express.Router();

// Creating a session for payment --> "/payment" is the default url
router.post("/create-session", verifyClient, payment.createSession);

router.post(
   "/webhook",
   bodyParser.raw({ type: "application/json" }),
   payment.afterPaymentSuccess
);

module.exports = router;
