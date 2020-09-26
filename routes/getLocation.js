const express = require("express");
const getLocation = require("../controller/getLocation");
const verifyClient = require("../middleware/verifyClient");
const router = express.Router();

router.post("/", verifyClient, getLocation);

module.exports = router;
