const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./route/tourRoute');
const userRouter = require('./route/userRoute');

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

// routhing

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`server starts at ${port} port number`);
});
