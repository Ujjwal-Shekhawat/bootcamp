const Bootcamp = require('../models/Bootcamp');
const bootcampdb = require(`../models/Bootcamp`);
const { all } = require('../routes/bootcamps');
const errorres = require('../utils/errorres');

// GET
// public
// get all bootcamps
exports.getBootcamps = async (req, res, next) => {
  try {
    const allbootcamps = await bootcampdb.find();
    res.status(200).json({
      message: `get all bootcamps`,
      count: allbootcamps.length,
      data: allbootcamps,
    });
  } catch (error) {
    res.status(400).json({ message: `Cannot get data from database` });
  }
};

// GET
// public
// get bootcamp by its id
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcampbyid = await bootcampdb.findById(req.params.id);
    if (bootcampbyid === null) {
      return res
        .status(400)
        .json({ message: `no bootcamp found with id: ${req.params.id}` });
    }
    res.status(200).json({
      message: `get bootcamp by id ${req.params.id}`,
      data: bootcampbyid,
    });
  } catch (error) {
    next(new errorres(`Data not found`, 404));
    // res.status(400).json({ message: `Cannot get data from database` });
  }
};

// POST
// private
// create bootcamp
exports.createBootcamp = async (req, res, next) => {
  try {
    const result = await bootcampdb.create(req.body);
    res.status(200).json({ message: `create a new bootcamp`, data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT
// private
// update bootcamp by its id
exports.updateBootcamp = async (req, res, next) => {
  try {
    const data = await Bootcamp.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      message: `update bootcamp with id ${req.params.id}`,
      data: data,
    });
  } catch (error) {
    res.status(400).json({ message: `Something went wrong` });
  }
};

// DELETE
// private
// delete bootcamp by its id
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const result = await Bootcamp.findByIdAndDelete(req.params.id);
    if (result === null) {
      return res.status(400).json({ message: `No such bootcamp found` });
    }
    res.status(200).json({
      message: `delete bootcamp with id ${req.params.id}`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: `Something went wrong` });
  }
};
