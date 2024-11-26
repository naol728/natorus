const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAlltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedtime: req.requestTime,
    tours,
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);

  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id no',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id no',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: ' <updated tour/>',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id no',
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};

exports.addTour = (req, res) => {
  const tourid = tours[tours.length - 1].id + 1;
  const newtour = Object.assign({ id: tourid }, req.body);

  tours.push(newtour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'succsus',
        data: {
          tours: newtour,
        },
      });
    }
  );
};
