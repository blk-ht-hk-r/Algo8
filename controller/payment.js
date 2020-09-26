const Phone = require("../models/Phone");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET;

// Stimulating a coupon creation which user will send with the request
const createCoupon = async () => {
   const coupon1 = await stripe.coupons.create({
      amount_off: 500,
      duration: "once",
      name: "Algo8",
      currency: "inr",
   });
};

//-------Setting up the session for payment
const createSession = async (req, res) => {
   let couponCode;

   // If the user enters a cuopon code then retrieve it
   if (req.body.couponCode) {
      couponCode = req.body.couponCode;
   }
   // Find the matching coupon
   const coupon = await stripe.coupons.retrieve(couponCode);
   if (!coupon) {
      return res.sendStatus(404).send({ message: "Coupon Invalid!" });
   }

   const product = req.body.phone; // Getting the, phone to be bought, details from the req body
   const loggedInUser = User.findById(req.user.id); //Getting the buyer details

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: loggedInUser._id,
      customer_email: loggedInUser.email,
      line_items: [
         {
            price_data: {
               currency: "inr",
               product_data: {
                  name: product.name,
                  id: product._id,
               },
               amount_subtotal: product.price,
               discounts: {
                  amount: coupon.amount_off, // Deducting the amount as per the coupon
               },
            },
            quantity: 1,
         },
      ],
      mode: "payment",
      success_url: "https://localhost:8080/success",
      cancel_url: "https://localhost:8080/cancel",
   });

   res.json({ id: session.id });
};

// Function to handle all the changes after a product is sold through successful payment
const afterPaymentSuccess = async (req, res) => {
   const payload = request.body;
   const sig = request.headers["stripe-signature"];

   let event;

   try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
   } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
   }

   // Handle the checkout.session.completed event
   if (event.type === "checkout.session.completed") {
      const session = event.data.object; // Now we have the session object
   }

   const productSold = await Phone.findById(
      session.line_items.price_data.product_data.id
   );
   const seller = await User.findById(productSold.seller);
   const buyer = await User.findById(session.client_reference_id);

   const currentTime = new Date();

   // Updating the prouductSold
   await productSold.update({
      isSold: true,
      soldAt: currentTime,
      buyer: buyer._id,
   });

   // Updating the buyer
   buyer.phonesBought.push(productSold._id);
   await buyer.save();

   // Updating the seller
   seller.phonesOnSale.remove(productSold_id);
   seller.phoneSold.push(productSold._id);
   await seller.save();
};

module.exports = {
   createSession,
   afterPaymentSuccess,
};
