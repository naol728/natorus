const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'A tour must have name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.7,
  },
  price: {
    type: Number,
    // required: [true, 'A tour must have proce'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
