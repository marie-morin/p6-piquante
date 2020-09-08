// Requires
const User = require("../models/UserSchema");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailValidator = require("email-validator");
const passwordValidator = require("password-validator");

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

exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email)) {
    throw {
      error: "L'adresse mail n'est pas valide !",
    };
  } else if (!schema.validate(req.body.password)) {
    throw {
      error: "Le mot pass n'est pas valide !",
    };
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Aucun compte ne correspond à l'adresse email renseingée !",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valide) => {
          if (!valide) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
