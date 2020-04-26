const express = require("express");
const cors = require("cors");

const contactRouter = require("./routers/contactsRouters");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello from API"));

app.use("/", contactRouter);

app.listen(3001, () => {
  console.log("API app started!!!!!!");
});
