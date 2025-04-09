const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    select: false,
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
  passwordChangedAt: Date,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.conformpassword = undefined;
});

UserSchema.methods.correctPassword = async function (
  candidate,
  credentalPassword,
) {
  return await bcrypt.compare(candidate, credentalPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
