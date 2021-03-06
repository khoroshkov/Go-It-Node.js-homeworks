const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const contactRouters = require("./contacts/contacts.router");
const userRouters = require("../homework-04-auth/users/userRouters");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use(express.static("public"));

app.use("/contacts", contactRouters);
app.use("/auth", userRouters);
app.use("/users", userRouters);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Contacts database connection successful!");

    app.listen(process.env.PORT, (err) => {
      if (err) throw err;
      console.log("Your Contacts app is running on port: " + process.env.PORT);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

startServer();
