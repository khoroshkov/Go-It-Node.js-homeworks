const sgMail = require("@sendgrid/mail");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


async function sendVerificationEmail(email, verificationToken) {
  const msg = {
    to: email,
    from: "nickolaykhoroshkov@gmail.com",
    subject: "Email verification required",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a href='http://localhost:3002/auth/verify/${verificationToken}'>Please verify your email address</a>`,
  };
  const result = await sgMail.send(msg);
  console.log(result);
}

module.exports = { sendVerificationEmail };
