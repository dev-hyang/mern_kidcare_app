const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys.js");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User.model");

/**
Pull in validator and is-empty dependencies
Export the function validateRegisterInput, which takes in data as a parameter (sent from our frontend registration form, which we’ll build in Part 2)
Instantiate our errors object
Convert all empty fields to an empty string before running validation checks (validator only works with strings)
Check for empty fields, valid email formats, password requirements and confirm password equality using validator functions
Return our errors object with any and all errors contained as well as an isValid boolean that checks to see if we have any errors
*/
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

/** Pull the errors and isValid variables from our validateLoginInput(req.body) function and check input validation
If valid input, use MongoDB’s User.findOne() to see if the user exists
If user exists, use bcryptjs to compare submitted password with hashed password in our database
If passwords match, create our JWT Payload
Sign our jwt, including our payload, keys.secretOrKey from keys.js, and setting a expiresIn time (in seconds)
*/
// If successful, append the token to a Bearer string (remember in our passport.js file, we setopts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();)
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});
module.exports = router;
