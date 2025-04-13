const Review = require('./../models/reviewmodel');
const factory = require('./handlerFactory');

exports.reviewusertour = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.getAllReview = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updatereview = factory.updateOne(Review);
exports.getreview = factory.getOne(Review);
exports.deletereview = factory.deleteOne(Review);
