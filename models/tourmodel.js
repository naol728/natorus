const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name length must be less than 40'],
      minlength: [10, 'A tour name length must be greater than 10'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    rating: {
      type: Number,
      default: 4.7,
      min: [1, 'Rating must be above 1.0 '],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have proce'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a dificult'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either:easy,medium,difficult',
      },
    },
    pricediscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `descount price ({VALUE}) should be bellow the regular price`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summery'],
    },
    imageCover: {
      type: String,
      required: [true, 'Atour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: '2024:8:12',
      select: false,
    },
    startDate: [Date],
    description: {
      type: String,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
