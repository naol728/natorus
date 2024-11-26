const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const app = express();

// midelware

app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('hello from middleware👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// route handlers

const getAlltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedtime: req.requestTime,
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

const addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is under developmet',
  });
};

// routhing

app.route('/api/v1/tours').get(getAlltours).post(addTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
app.route('/api/v1/users').get(getAllUsers).post(addUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`server starts at ${port} port number`);
});
