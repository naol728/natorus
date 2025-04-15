const Tour = require('../models/tourmodel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tour',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // req.body;
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
});
