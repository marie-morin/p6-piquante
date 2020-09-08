// Express Application

// Requires
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
var hpp = require("hpp");

const sauceRoutes = require("./routes/sauceRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Content-Type, Access-Control-Allow-Headers"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("combined"));
app.use(hpp());

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    name: "userSession",
    cookie: {
      maxAge: 60000,
      secure: true,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
