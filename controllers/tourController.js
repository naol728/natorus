const Tour = require('./../models/tourmodel');
const catchAsync = require('./../utils/catchAsync');
const ApiFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/AppError');
exports.checkBody = (req, res, next) => {
  // if (!req.body.name || !req.body.price) {
  //   return res.status(400).json({
  //     staus: 'fail',
  //     message: 'error from checkbody midleware',
  //   });
  // }
  next();
};

exports.getAlltours = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedtime: req.requestTime,
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('there is no tour with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour: ' <updated tour/>',
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newtour = await Tour.create(req.body);

  res.status(201).json({
    status: 'succsus',
    data: {
      tours: newtour,
    },
  });
});

exports.getTourstat = catchAsync(async (req, res, next) => {
  const stat = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tour: stat,
    },
  });
});

exports.getMonthelyPlan = catchAsync(async (req, res, next) => {
  const year = req.query.year;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: `$startDates` },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: `$_id` },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tour: plan,
    },
  });
});
