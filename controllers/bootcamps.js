const Bootcamp = require('../models/Bootcamp');
const bootcampdb = require(`../models/Bootcamp`);
const { all } = require('../routes/bootcamps');
const geocoder = require('../utils/geocoder');

// GET
// public
// get all bootcamps
exports.getBootcamps = async (req, res, next) => {
  try {
    const removeFeilds = ['select', 'sort', 'page', 'limit'];
    const req_query = { ...req.query };
    removeFeilds.forEach((param) => delete req_query[param]);

    let query = JSON.stringify(req_query);

    query = query.replace(/\b(lt|lte|gt|gte|in)\b/g, (match) => `$${match}`);
    let result = bootcampdb
      .find(JSON.parse(query))
      .populate({ path: 'Courses', select: 'scholarShipAvalable' });

    // Selecting specific feilds
    if (req.query.select) {
      const feilds = req.query.select.split(',').join(' ');
      result = result.select(feilds);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      result = result.sort(sortBy);
    } else {
      result = result.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const start = (page - 1) * limit;
    const end = page * limit;
    const total = await Bootcamp.countDocuments();

    result = result.skip(start).limit(limit);

    const allbootcamps = await result;

    let pagination = {};

    if (end < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (start > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      message: `get all bootcamps`,
      count: allbootcamps.length,
      pagination: pagination,
      data: allbootcamps,
    });
  } catch (error) {
    next(error);
  }
};

// GET
// public
// get bootcamp by its id
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcampbyid = await bootcampdb.findById(req.params.id);
    if (bootcampbyid === null) {
      next(error);
    }
    res.status(200).json({
      message: `get bootcamp by id ${req.params.id}`,
      data: bootcampbyid,
    });
  } catch (error) {
    next(error);
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
    next(error);
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
    next(error);
  }
};

// DELETE
// private
// delete bootcamp by its id
exports.deleteBootcamp = async (req, res, next) => {
  try {
    // Remove is neede for triggering middleware in bootcamp model
    const result = await Bootcamp.findById(req.params.id);
    if (result === null) {
      return res.status(400).json({ message: `No such bootcamp found` });
    }
    result.remove();
    res.status(200).json({
      message: `delete bootcamp with id ${req.params.id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET
// public
// get all bootcamps in radius
exports.getBootcampsinRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;
    const location = await geocoder.geocode(zipcode);
    const latitude = location[0].latitude;
    const longitude = location[0].longitude;

    const radius = distance / 3963;
    const bootcampsinRadius = await Bootcamp.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
      },
    });

    res
      .status(200)
      .json({ count: bootcampsinRadius.length, data: bootcampsinRadius });
  } catch (error) {
    next(error);
  }
};
