const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./route/tourRoute');
const userRouter = require('./route/userRoute');

// MIDDLEWARE

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`)); // ADDING A STATIC FILES 

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // ADDING REQUEST TIME STAMP 
  next();
});
// ROUTING

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
module.exports = app;
