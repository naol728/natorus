const express = require('express');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

// const xss = require('xss-clean');
const app = express();

const tourRouter = require('./route/tourRoute');
const userRouter = require('./route/userRoute');
const reviewRouter = require('./route/reviewRoute');
const bookingRoute = require('./route/bookingRoute');
const viewRouter = require('./route/viewRoute');
const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'view'));
// GLOBAL MIDDLEWARE

app.use(express.static(`${__dirname}/public`)); // ADDING A STATIC FILES
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this ip! try again later',
});

app.use('/api', limiter);
app.use(mongoSanitize()); // SANITIZING THE DATA
// app.use(xss()); // SANITIZING THE DATA
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity'], // WHITELISTING THE DATA
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // ADDING REQUEST TIME STAMP
  next();
});

// ROUTING

app.use(express.json({ limit: '10kb' })); // PARSING THE JSON DATA and limiting the parsed data
app.use('/', viewRouter);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
