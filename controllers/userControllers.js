const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const pino = require('pino-http')();

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  pino(req, res);
  res.status(200).json({
    status: 'error',
    data: {
      users,
    },
  });
});

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};
