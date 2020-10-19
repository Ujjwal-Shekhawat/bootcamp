const Bootcamp = require('../models/Bootcamp');
const bootcampdb = require(`../models/Bootcamp`);
const path = require('path');
const { all } = require('../routes/bootcamps');
const errorres = require('../utils/errorres');
const geocoder = require('../utils/geocoder');

// GET
// public
// get all bootcamps
exports.getBootcamps = async (req, res, next) => {
  try {
    // const removeFeilds = ['select', 'sort', 'page', 'limit'];
    // const req_query = { ...req.query };
    // removeFeilds.forEach((param) => delete req_query[param]);

    // let query = JSON.stringify(req_query);

    // query = query.replace(/\b(lt|lte|gt|gte|in)\b/g, (match) => `$${match}`);
    // let result = bootcampdb
    //   .find(JSON.parse(query))
    //   .populate({ path: 'Courses', select: 'scholarShipAvalable' });

    // // Selecting specific feilds
    // if (req.query.select) {
    //   const feilds = req.query.select.split(',').join(' ');
    //   result = result.select(feilds);
    // }

    // // Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   result = result.sort(sortBy);
    // } else {
    //   result = result.sort('-createdAt');
    // }

    // // Pagination
    // const page = parseInt(req.query.page, 10) || 1;
    // const limit = parseInt(req.query.limit, 10) || 10;
    // const start = (page - 1) * limit;
    // const end = page * limit;
    // const total = await Bootcamp.countDocuments();

    // result = result.skip(start).limit(limit);

    // const allbootcamps = await result;

    // let pagination = {};

    // if (end < total) {
    //   pagination.next = {
    //     page: page + 1,
    //     limit,
    //   };
    // }
    // if (start > 0) {
    //   pagination.prev = {
    //     page: page - 1,
    //     limit,
    //   };
    // }

    // res.status(200).json({
    //   message: `get all bootcamps`,
    //   count: allbootcamps.length,
    //   pagination: pagination,
    //   data: allbootcamps,
    // });

    res.status(200).json(res.advancedQuerying);
  } catch (error) {
    next(error);
  }
};

// GET
// public
// get bootcamp by its id
exports.getBootcamp = async (req, res, next) => {
  try {
    // const bootcampbyid = await bootcampdb.findById(req.params.id);
    // if (bootcampbyid === null) {
    //   next(error);
    // }
    // res.status(200).json({
    //   message: `get bootcamp by id ${req.params.id}`,
    //   data: bootcampbyid,
    // });

    res.status(200).json(res.advancedQuerying);
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
    // Add user to request body
    req.body.user = req.user.id;
    // Check for published bootcamps
    const publishedBootcampsCount = await Bootcamp.findOne({
      user: req.user.id,
    });
    if (publishedBootcampsCount && req.user.role !== 'admin') {
      return next(
        new errorres(
          `User with id ${req.user.id} and role ${req.user.role} has already published a bootcamp`,
          401
        )
      );
    }

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
    let data = await Bootcamp.findById(req.params.id);

    if (!data) {
    }

    // Check if the user is the creator this bootcamp
    if (data.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new errorres(
          `User ${req.user.id} is not authorized to update this bootcamp : Not the creator`,
          401
        )
      );
    }

    data = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

    // Check if the user is the creator this bootcamp
    if (result.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new errorres(
          `User ${req.user.id} is not authorized to update this bootcamp : Not the creator`,
          401
        )
      );
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

// PUT
// private
// Upload image for bootcamp by its id
exports.uploadPhotoforBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (bootcamp === null) {
    return next(
      new errorres(`No bootcamp found with id : ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new errorres(`User ${req.user.id} is not auth`, 401));
  }

  if (!req.files) {
    return next(new errorres(`Please select a file to upload`, 400));
  }

  const file = req.files.image;
  if (!file.mimetype.startsWith('image')) {
    return next(new errorres(`please upload a image`, 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new errorres(
        `cannot upload file. File too large : File size ${
          (file.size / 1024) * 1024
        } Mb. Allowed file size id upto 1 Mb`,
        400
      )
    );
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) {
      return next(
        new errorres(
          `Something went wrong while uploading file : Error ${error.message}`,
          500
        )
      );
    }
  });

  const light_information = ['data'];
  const req_file = { ...req.files.image };
  light_information.forEach((param) => delete req_file[param]);

  res.status(200).json({
    message: `Upload a photo for bootcamp`,
    file_information: req_file,
    data: `Alert still in progress`,
  });
};
