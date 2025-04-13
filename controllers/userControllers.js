const User = require('./../models/usermodel');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'use /signup route to add ',
  });
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
