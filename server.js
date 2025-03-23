const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

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

app.listen(port, () => {
  console.log(`server starts at ${port} port number`);
});
