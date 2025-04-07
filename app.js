const express = require('express');
const app = express();

const tourRouter = require('./route/tourRoute');
const userRouter = require('./route/userRoute');
const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');
// MIDDLEWARE

app.use(express.static(`${__dirname}/public`)); // ADDING A STATIC FILES

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // ADDING REQUEST TIME STAMP
  next();
});

// ROUTING
app.use(express.json()); // PARSING THE JSON DATA
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
