const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./route/tourRoute');
const userRouter = require('./route/userRoute');

// midelware
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// routhing

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
