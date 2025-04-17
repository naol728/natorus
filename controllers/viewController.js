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
  //  1 )get the tour data
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'user rating review',
  });

  //  2) build the templeate
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginform = catchAsync(async (req, res) => {
  //  1 )get the tour data

  //  2) build the templeate
  res.status(200).render('login', {
    title: 'login ',
  });
});
