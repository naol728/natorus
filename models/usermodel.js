const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crtpto = require('crypto');
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
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
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
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.conformpassword = undefined;
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // to make sure the password changed after the token is created
  next();
});

UserSchema.pre(`/find^`, function (next) {
  this.find({ active: { $ne: true } });
  next();
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
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crtpto.randomBytes(32).toString('hex');
  this.passwordResetToken = crtpto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
