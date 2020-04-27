const express = require("express");
const cors = require("cors");

const contactRouter = require("./routers/contactsRouters");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.get("/", (req, res) => res.send("Hello from API contacts DB"));

app.use("/", contactRouter);

app.listen(3001, () => {
  console.log("API app started!!!!!!");
});
