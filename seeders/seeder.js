const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../config/config.env' });

const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    console.log(`Data imported`);
    process.exit();
  } catch (error) {
    console.log(`Error importing data : message : ${error.message}`);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    // await Course.deleteMany();
    console.log(`Deleted data`);
    process.exit();
  } catch (error) {
    console.log(`Error deleting data : message : ${error.message}`);
  }
};

if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-delete') {
  deleteData();
} else {
  console.log(`Something went wrong`);
  process.exit();
}
