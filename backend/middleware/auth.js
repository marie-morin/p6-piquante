const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      // Making sure user in loged in by looking for authorization headers
      throw "Merci de vous connecter";
    }

    const token = req.headers.authorization.split(" ")[1]; // Finding the token part of the authorization headers
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); // Ckecking if it matchs the secret token key
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "userId non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error || "Requête non authentifiée !" });
  }
};
