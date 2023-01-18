require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverRide = require("method-override");
const port = 3000 || process.env.port;
const path = require("path");
const connectDB = require("./server/config/db");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

//session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Build-in express body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverRide("_method"));

// connected to Database
connectDB();

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "./layouts/main");

// Routes
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/dashboard_route"));
app.use("/", require("./server/routes/index"));

// Handle 404 page
app.get("*", (req, res) => {
  res.status(404).render("page404");
});

// Listening on port 3000
app.listen(port, () => console.log(`App listening on port ${port}`));
