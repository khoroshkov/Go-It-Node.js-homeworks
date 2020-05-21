const userModel = require("./userModel");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const Avatar = require("avatar-builder");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  sendVerificationEmail,
} = require("../../homework-06-email/mailExample");

const avatar = Avatar.male8bitBuilder(128);

const saltRounds = 10;

async function registerNewUser(req, res) {
  try {
    const { password, email } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    avatar.create("gabriel").then((buffer) => {
      fs.writeFileSync(
        "./public/images/gabriel-avatar_" + Date.now() + ".png",
        buffer
      );
    });

    const oldPath = "./temp/";
    const newPath = "./public/images/gabriel-avatar_" + Date.now() + ".png";

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
      console.log("File moved!");
    });

    const user = await userModel.create({
      email,
      password: passwordHash,
      avatarURL: newPath,
      verificationToken: uuidv4(),
    });

    await sendVerificationEmail(user.email, user.verificationToken);

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

    next(req.user);
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

async function updateAvatar(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    await userModel.findByIdAndUpdate(userId, { avatarURL: req.file.path });

    return res.status(200).send({ avatarURL: req.file.path });
  } catch (error) {
    return res.status(401).send(error.message);
  }
}

async function checkVerificationToken(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const user = await userModel.findOneAndUpdate(
      { verificationToken },
      { verificationToken: null }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Verification completed" });
    
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  registerNewUser,
  login,
  logout,
  getCurrentUser,
  authorize,
  checkRegistrationFields,
  updateAvatar,
  checkVerificationToken,
};
