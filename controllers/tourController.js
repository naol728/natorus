const fs = require('fs');
const Tour = require('./../models/tourmodel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      staus: 'fail',
      message: 'missing of name or price',
    });
  }
  next();
};
exports.getAlltours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      requestedtime: req.requestTime,
      tours,
    });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      error: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      error: err,
    });
  }
};

exports.updateTour = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: ' <updated tour/>',
  //   },
  // });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id no',
    });
  }
  // res.status(204).json({
  //   status: 'success',
  //   data: {
  //     tour: null,
  //   },
  // });
};

exports.addTour = async (req, res) => {
  try {
    console.log(req.body);
    const newtour = await Tour.create(req.body);

    res.status(201).json({
      status: 'succsus',
      data: {
        tours: newtour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      error: err,
    });
  }
};
