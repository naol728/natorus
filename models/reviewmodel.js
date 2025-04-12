const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review belongs to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review belongs to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
