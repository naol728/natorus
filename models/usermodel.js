const mongoose = require('mongoose');
const validator = require('validator');
//  name email password conformpasword

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please proveide email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'please provide vaild email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please enter a password'],
    minlength: 8,
  },
  conformpassword: {
    type: String,
    required: [true, 'please conform the password'],

    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same ',
    },
  },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
