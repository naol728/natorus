const fs = require('fs');
const Tour = require('./../models/tourmodel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      staus: 'fail',
      message: 'error from checkbody midleware',
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

exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      error: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      error: err,
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newtour = await Tour.create(req.body);
    console.log(newtour);
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
