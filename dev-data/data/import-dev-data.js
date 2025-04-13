const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourmodel');
const User = require('../../models/usermodel');
const Review = require('../../models/reviewmodel');

dotenv.config({ path: './../../config.env' });
// PROCESS TO CONECT TO THE REMOTE DATABASE
const DB = process.env.DATABASELOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASEPASSWORD,
);
// CREATE A CONNCETION TO THE DATABASE

mongoose
  .connect(process.env.DATABASELOCAL)
  .then((con) => {
    console.log('DB connected succsusfuly');
  })
  .catch((err) => {
    console.log(err);
  });

// READ JSON FILE
const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const review = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
// IMPORT DATA INTO THE DATABASE FROM LOCAL
const importdata = async () => {
  try {
    await User.create(user, { validateBeforeSave: false });
    await Tour.create(tour);
    await Review.create(review);
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL THE DATA FROM DATABASE
const deletetour = async () => {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    await Review.deleteMany();
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
