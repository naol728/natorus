const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const filterObj = (obj, ...allowedFields) => {
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      obj[el];
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'sucssus',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('invalid email or password', 401));
  }

  const token = signToken(user._id);
  res.status(201).json({
    status: 'sucssus',
    token,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('you are not logged in! please log in to get access', 401),
    );
  }

  // 2)varification of token

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'the user belonging to this token does no longer exist',
        401,
      ),
    );
  }

  // 4)check the user if not chnaged password

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password! please log in again', 401),
    );
  }
  // 5) garant the access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new next(
          new AppError(
            'you do not have permission to perform this action',
            403,
          ),
        ),
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1)get the user with email
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('ther is no user with that email', 404));
  }
  // 2)generate the random token
  const resetToken = await user.createPasswordResetToken();

  user.save({ validateBeforeSave: false });

  // 3)send it to the user email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forgot your password? submit a patch request with your new password and password confirm to: ${resetURL}.\n if you didn't forget your password please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending the email. try again later!'),
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  const hashedtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedtoken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.conformpassword = req.body.conformpassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
};

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

  const upadatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'sucess',
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
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
