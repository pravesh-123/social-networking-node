const { Validator } = require("node-input-validator");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const v = new Validator(req.body, {
    first_name: "required|minLength:2|maxLength:100",
    last_name: "required|minLength:2|maxLength:100",
    email: "required|email",
    password: "required",
  });
  const matched = await v.check();
  if (!matched) {
    return res.status(422).json(v.errors);
  }
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.json({
      message: "User already exists",
    });
  }
  try {
    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });
    let userData = await newUser.save();
    res.status(201).json({
      status: "success",
      message: "User register successfully",
      userData,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.send({ message: "email or password required" });
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user,
        },
        "mysecret",
        { expiresIn: "12h" }
      );
      res.status(200).json({
        status: "success",
        message: "login successfully",
        user,
        token,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Error to login user",
    });
  }
};
