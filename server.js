const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASELOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASEPASSWORD,
);

mongoose
  .connect(process.env.DATABASELOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connected succsusfuly');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server starts at ${port} port number`);
});
