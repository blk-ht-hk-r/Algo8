const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http")
const SocketIO = require("socket.io")
const app = express();

const phoneRoutes = require("./routes/phones")
const clientAuthRoutes = require("./routes/clientAuth")
const adminRoutes = require("./routes/admin")
const getLocationRoute = require("./routes/getLocation")
const paymentRoute = require("./routes/payment")

require("dotenv").config();

//Setting up the mongoose connection url
let url = process.env.DATABASE_URL || "mongodb://localhost:27017/algo8";

//Connecting to the mongoose database
mongoose
   .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("Connected to DB!"))
   .catch((err) => console.log(err.message));

//Setting up all the socket.io stuff
const server = http.createServer(app)
const io = SocketIO(server)

//Getting our socket available on all routes by attaching to the req object
app.use((req, res, next) => {
    req.io = io
    next()
})

//Allowing anyone to make request to our API
app.use(cors());
app.use(express.json())

app.use("/", phoneRoutes)
app.use("/client", clientAuthRoutes)
app.use("/admin", adminRoutes)
app.use("/getLocation", getLocationRoute)
app.use("/payment", paymentRoute)


//configuring the port domain
let port = process.env.PORT || 3000;

//Start the server
server.listen(port, () => {
   console.log("Server has started on port 3000!");
});
