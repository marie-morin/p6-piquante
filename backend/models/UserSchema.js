// Requires
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Creating Schema
const userSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
    unique: true, // Using mongoose-unique-validator so two acounts can't be created with the same email
  },
  password: {
    type: String,
    required: true,
  },
});

// Appying mongoose-unique-validator to the schema
userSchema.plugin(uniqueValidator);

// Exporting User Schema
module.exports = mongoose.model("User", userSchema);
