const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/crud")
  .then(() => console.log("server Connected"))
  .catch((err) => console.log(err));

// EJS for view templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "front", "views"));

app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Connect Flash
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./src/back/routes/index"));
app.use('/users', require('./src/back/routes/users'));
app.use("/snippets", require("./src/back/routes/snippets"))

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
