const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTES@_API";

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Existing User Check
    const existingUSer = await User.findOne({ username: username });
    if (existingUSer) {
      return res.status(400).json({ message: "User already exists." });
    }
    // Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // User Creation
    const result = new User({
      username: username,
      password: hashedPassword,
    });

    const user = await result.save();
    // Token Generate
    const token = jwt.sign(
      { username: user.username, id: user._id },
      SECRET_KEY
    );
    res.status(200).json({ user: user, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Existing User Check
    const existingUSer = await User.findOne({ username: username });
    if (!existingUSer) {
      return res.status(404).json({ message: "User not Found." });
    }

    // Matching Credentials
    const matchPassword = await bcrypt.compare(password, existingUSer.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials." });
    }

    // Token Generation
    const token = jwt.sign(
      { username: existingUSer.username, id: existingUSer._id },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUSer, token: token });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.userGet = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Populating Posts and using projection for username.
exports.userData = async (req, res) => {
  const Data = await User.findById(req.userId).populate("posts.postItems.postId");
  res.send(Data);
};
