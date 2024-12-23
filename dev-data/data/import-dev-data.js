const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourmodel');

dotenv.config({ path: './config.env' });

// PROCESS TO CONECT TO THE REMOTE DATABASE
const DB = process.env.DATABASELOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASEPASSWORD,
);

// CREATE A CONNCETION TO THE DATABASE
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

// READ JSON FILE
const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATA INTO THE DATABASE FROM LOCAL
const importdata = async () => {
  try {
    await Tour.create(tour);
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL THE DATA FROM DATABASE
const deletetour = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == '--import') {
  importdata();
  console.log('data successfuly imported');
} else if (process.argv[2] == '--delete') {
  deletetour();
  console.log('data successfuly deleted');
}
