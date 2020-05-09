const userModel = require("./userModel");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

//require("dotenv").config();

async function registerNewUser(req, res) {
  try {
    const { password, email } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      email,
      password: passwordHash,
    });
    return res.status(201).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send({
        message: "Incorrect login or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Incorrect login or password" });
    }

    const newToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    user.token = newToken;
    user.save();

    return res.status(200).send({
      token: user.token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function logout(req, res) {
  try {
    const user = req.user;
    await userModel.findByIdAndUpdate(user._id, { token: null });
    return res.status(200).send({ message: "Logout success" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function getCurrentUser(req, res) {
  const authorizationHeader = req.get("Authorization");
  const token = authorizationHeader.replace("Bearer ", "");
  try {
    const userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    const user = await userModel.findById(userId);
    return res.status(200).send({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function authorize(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  const token = authorizationHeader.replace("Bearer ", "");

  try {
    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (error) {
      next(res.status(401).send({ message: "Not authorized" }));
    }

    const user = await userModel.findById(userId);

    if (!user || user.token !== token) {
      return res.status(401).send({ message: "Not authorized" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
}

function checkRegistrationFields(req, res, next) {
  const registrationInfo = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = registrationInfo.validate(req.body);
  if (validationResult.error) {
    return res.status(422).json({ message: "Missing required fields" });
  }

  next();
}

module.exports = {
  registerNewUser,
  login,
  logout,
  getCurrentUser,
  authorize,
  checkRegistrationFields,
};
