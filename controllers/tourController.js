const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(val);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id no',
    });
  }
  next();
};
exports.checkBody=(req,res,next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      staus:"fail",
      message:"missing of name or price"
    })

  }
  next();
}
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
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
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
