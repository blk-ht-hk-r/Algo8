const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (user) => {
   const emailToken = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
      expiresIn: "24h",
   });

   const msg = {
      to: user.email,
      from: "2019ucp1420@mnit.ac.in",
      subject: "Verify Your Account",
      text: "Please verify your account to continue",
      html: `<h1>Hello ${user.username}</h1> 
             <a link="http://localhost:3000/client/verifyEmail/${emailToken}">
                 Please click here to confirm your account 
             </a>`,
   };

   sgMail.send(msg);
};

module.exports = sendMail;
