const Review = require('./../models/reviewmodel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      review,
    },
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'sucess',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.updatereview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return next(new AppError('no review found with that id', 404));
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      review,
    },
  });
});

exports.getreview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('no review found with that id', 404));
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      review,
    },
  });
});

exports.deletereview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError('no review found with that id', 404));
  }
  res.status(203).json({
    status: 'sucess',
    data: null,
  });
});
