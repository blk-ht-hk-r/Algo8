const phones = require("../controller/phones");
const verifyClient = require("../middleware/verifyClient");

const express     = require("express"),
      router      = express.Router();

//Get the home page of the website displatying all the phones
router.get("/", phones.getPhones);

//post request handling of new phone creation
router.post("/", verifyClient, phones.createNewPhone)

//Phones show page
router.get("/:phoneId", phones.getPhone);

//Edit phone route
router.get("/:phoneId/edit", verifyClient, phones.editPhone);

//Update phone route
router.put("/:phoneId", verifyClient, phones.updatePhone );

//Destroy phone Route
router.delete("/:phoneId", verifyClient, phones.deletePhone);

//Exporting all the phone Routes
module.exports = router;
