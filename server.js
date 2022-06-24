const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv/config");
var cron = require("node-cron");
const fetch = require("cross-fetch");

const home = require("./routes/home");
const phone = require("./models/phone");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.set("view engine", "ejs");

// static files
app.set("views", path.join(__dirname, "/public"));
app.use(express.static(__dirname + '/public'));
app.use("/", home);

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("Connected to DB");
});

cron.schedule("* * 12 * * *", async () => {
  try {
    // Get daily weather data
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=1.3521&lon=103.8198&exclude=minutely,hourly,&appid=31d647c3fceac5a1d146d2653fd579fa"
    );
    const dailyWeather = await res.json();
    var phoneMessage = "Expect no rain today";
    // Check if it is raining today
    await dailyWeather.daily.forEach((weatherData) => {
      if (weatherData.weather[0].description.includes("rain")) {
        phoneMessage = "Expect Rain today";
      }
    });
    // Get user's phone
    const usersPhone = await phone.find();
    usersPhone.forEach((user) => {
      client.messages.create({
        body: phoneMessage,
        from: "+19704595930",
        to: "+65" + user.phoneNo,
      });
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3000);
