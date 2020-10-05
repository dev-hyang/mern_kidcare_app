const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const mongoose = require("mongoose");
// Load Record and User models
const Baby = require("../../models/Baby.model");
const User = require("../../models/User.model");
//create a baby
// @route POST api/babies/add
// @desc
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_Id = req.user.id;
    const name = req.body.name;
    const mother_name = req.body.motherName;
    const father_name = req.body.fatherName;
    const birth_of_date = req.body.birthOfDate;
    const seq = req.body.seq;
    const init_weight = req.body.initWeight;
    const init_height = req.body.initHeight;
    const is_premature = req.body.isPremature;

    // Check if account already exists for specific user
    Baby.findOne({
      userId: req.user.id,
      name: req.body.name,
      birthOfDate: birth_of_date,
    })
      .then((baby) => {
        if (baby) {
          console.log("Baby already added to the mom's documents");
        } else {
          const newBaby = new Baby({
            userId: user_Id,
            name: name,
            motherName: mother_name,
            fatherName: father_name,
            birthOfDate: birth_of_date,
            seq: seq,
            initWeight: init_weight,
            initHeight: init_height,
            isPremature: is_premature,
          });
          newBaby.save().then((baby) => res.json(baby));
        }
      })
      .catch((err) => console.log(err)); // Mongo Error
  }
);
//Retrieve mom's all babies
// @route GET api/babies
// @desc Get all babies linked with a mom's ID
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Baby.find({ userId: req.user.id })
      .then((babies) => res.json(babies))
      .catch((err) => console.log(err));
  }
);
//Delete a baby record
// @route DELETE api/babies/:id
// @desc Delete account with given id
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Baby.findById(req.params.id).then((baby) => {
      // Delete account
      baby.remove().then(() => res.json({ success: true }));
    });
  }
);
//Update a baby
// @route POST api/plaid/accounts/transactions
// @desc Fetch transactions from past 30 days from all linked accounts
// @access Private
router.post(
  "/records",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD"); // Change this if you want more transactions
    let records = [];
    const babies = req.body;
    if (babies) {
      //do something here
      //read all records by each baby and add them to records array
    }
  }
);
// Routes will go here
module.exports = router;
