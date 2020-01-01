const mongoose = require('mongoose');
const validator = require('validator');

function validateEmail(email) {
  return validator.isEmail(email);
}

//Mongo schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 255, unique: true },
  email: { type: String, required: true, minlength: 4, maxlength: 255, lowercase: true, unique: true, validate: validateEmail },
  password: { type: String, required: true, minlength: 4, maxlength: 255 },
  date: { type: Date, default: Date.now },
});
const User = mongoose.model('user', UserSchema);
module.exports = User;