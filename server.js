const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDELED EXCEPTION SERVER IS SHUTINGDOWN💥.....');
  process.exit();
});

dotenv.config({ path: './config.env' });
const app = require('./app');
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// PROCESS TO CONECT TO THE REMOTE DATABASE

const DB = process.env.DATABASELOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASEPASSWORD,
);

// CONNECT TO THE MONGOOSE

mongoose
  .connect(process.env.DATABASELOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connected succsusfuly');
  })
  .catch((err) => {
    console.log(err);
  });

// SERVER LISTEN TO PORT
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server starts at ${port} port number`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDELED REJECTION SERVER IS SHUTINGDOWN💥.....');

  server.close(() => {
    process.exit();
  });
});
