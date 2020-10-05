const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const mongoose = require("mongoose");
// Load Record and User models
const Record = require("../../models/Record.model");
const User = require("../../models/User.model");

// Routes will go here
module.exports = router;
