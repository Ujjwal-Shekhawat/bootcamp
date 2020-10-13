const Course = require('../models/Course');

// GET
// public
// get all courses in bootcamp by its id
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
