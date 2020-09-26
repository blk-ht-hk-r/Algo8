const express = require("express")
const router = express.Router()
const admin = require("../controller/admin")
const verifyAdmin = require("../middleware/verifyAdmin")

router.post("/login", admin.login)

//--------adding the routes for admin to see the reports

// Getting all the sale reports of Today
router.get("/saleReport", verifyAdmin, admin.getSalesReport)

// Getting all the clients that Registered Today
router.get("/userReport", verifyAdmin, admin.getUserReport )

// Getting all the new Phones created Today
router.get("/phoneReport", verifyAdmin, admin.getNewPhonesReport)


module.exports = router