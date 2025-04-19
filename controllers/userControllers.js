const User = require('./../models/usermodel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const etx = file.mimetype.split('/');
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only image.', 400), false);
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUploadphoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

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
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.conformpassword) {
    return next(
      new AppError(
        'this route is not for password updates. please use /updatepassword',
        400,
      ),
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const upadatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: upadatedUser,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)get the user from th collection
  const user = await User.findOne({ _id: req.user.id }).select('+password');
  // 2) check if the posted password is correct
  console.log(req.body.passwordCurrent);
  const correct = await user.correctPassword(
    req.body.passwordCurrent,
    user.password,
  );
  if (!correct) {
    return next(new AppError('your current password is wrong', 401));
  }

  // 3) if so, update password
  user.password = req.body.password;
  user.conformpassword = req.body.conformpassword;
  await user.save();
  // 4) log the user in, send JWT
  signsendToken(user, res);
});
