const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const upload = multer();
const Phone = require("../models/phone");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.post("/register", upload.none(), async (req, res) => {
  const phoneNo = new Phone({
    phoneNo: req.body.phoneNo,
  });
  try {
    const addPhone = await phoneNo.save();
    var message = "Phone number " + addPhone.phoneNo + " added";
  } catch (err) {
    var message = "Unable to add phone number";
  }
  res.render("index.ejs", { isSuccess: true, message: message });
});

module.exports = router;
