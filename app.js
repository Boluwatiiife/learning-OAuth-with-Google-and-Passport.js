const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const passport = require("passport");

const app = express();

//set up view engine
app.set("view engine", "ejs");

// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.session.cookieKey],
//   })
// );

app.use(
  expressSession({
    secret: keys.session.cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose
  .connect(keys.mongodb.dbURL)
  .then(() => {
    console.log("connected to mongodb....");
  })
  .catch((error) => {
    console.error(error);
  });

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// port
app.listen(3002, () => {
  console.log(`app now listening for requests on port 3000`);
});
