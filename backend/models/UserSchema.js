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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Making every email adress unique
userSchema.plugin(uniqueValidator);

// Exporting User Schema
module.exports = mongoose.model("User", userSchema);
