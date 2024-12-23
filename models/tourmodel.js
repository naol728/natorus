const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },
  rating: {
    type: Number,
    default: 4.7,
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
  },
  pricediscount: Number,
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
  },
  startDate: [Date],
  description: {
    type: String,
  },
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
