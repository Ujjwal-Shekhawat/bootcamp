const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const errorres = require('../utils/errorres');

// GET
// public
// get all courses in bootcamp by its id if id is not there get all the courses
exports.getCourses = async (req, res, next) => {
  try {
    let query;
    if (req.params.bootcampid) {
      query = Course.find({ bootcamp: req.params.bootcampid }).populate({
        path: 'bootcamp',
        select: 'name _id description',
      });
    } else {
      query = Course.find().populate({
        path: 'bootcamp',
        select: 'name _id description',
      });
    }

    const courses = await query;

    res
      .status(200)
      .json({ message: `Get courses`, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
};

// GET
// public
// get course by its id
exports.getCoursebyId = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course === null) {
      return res
        .status(404)
        .json({ messahe: `no course found with id : ${req.params.id}` });
    }
    res.status(200).json({
      message: `Found course with id : ${req.params.id}`,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// POST
// private
// Create a new course under exsisting bootcamp
exports.createCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampid;

    const bootcamp = await Bootcamp.findById(req.params.bootcampid);
    if (bootcamp === null) {
      // Nice way
      return next(
        new errorres(
          `No bootcamp found, Cannot create course under non-exsistent bootcamp`,
          400
        )
      );
    }

    const course = await Course.create(req.body);
    if (course === null) {
      // An okiedokie way
      return res
        .status(400)
        .json({ message: `Error occured while creating new course` });
    }
    res.status(200).json({ message: `Create a new course`, data: course });
  } catch (error) {
    next(error);
  }
};

// PUT
// privcate
// update a course
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new errorres(`Cannot find course by id : ${req.params.id}`, 404)
      );
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: `update course`, data: course });
  } catch (error) {}
};
