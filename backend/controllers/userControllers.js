// Requires
const User = require("../models/UserSchema");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailValidator = require("email-validator");
const passwordValidator = require("password-validator");

// Creating a validation schema for password
var schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .not()
  .spaces()
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1);

exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email)) {
    throw {
      error: "L'adresse mail n'est pas valide !", // Making sure the amil is an email
    };
  } else if (!schema.validate(req.body.password)) {
    throw {
      error: "Le mot pass n'est pas valide !", // Making sure the password respect the schema
    };
  } else {
    bcrypt
      .hash(req.body.password, 10) // Hashing and salting the password
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        }); // Create new user
        user
          .save() // Save user in DB
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Finding the user in DB
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Aucun compte ne correspond à l'adresse email renseingée !", // Return error if user is not found un DB
        });
      }
      bcrypt
        .compare(req.body.password, user.password) // Compare the hashed tryed password to the hashed stored paswword
        .then((valide) => {
          if (!valide) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" }); // Return error if paswwords don't match
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "24h",
              } // Return user id and authorization token to frontend
            ),
          });
        })
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// exports.signup = (req, res, next) => {
//   bcrypt
//     .hash(req.body.password, 10)
//     .then((hash) => {
//       const user = new User({
//         email: req.body.email,
//         password: hash,
//       });
//       user
//         .save()
//         .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
//         .catch((error) => res.status(400).json({ error }));
//     })
//     .catch((error) => res.status(500).json({ error }));
// };
