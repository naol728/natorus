const express = require('express');
const fs = require('fs');
const { stringify } = require('querystring');
const app = express();

app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const getAlltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    tours,
  });
};

const getTour = (req, res) => {
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
const updateTour = (req, res) => {
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
const deleteTour = (req, res) => {
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
const addTour = (req, res) => {
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

app.route('/api/v1/tours').get(getAlltours).post(addTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`server starts at ${port} port number`);
});
