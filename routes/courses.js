const express = require('express');
const {
  getCourses,
  createCourse,
  getCoursebyId,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const { protect } = require('../middleware/auth');

const Course = require('../models/Course');
const advancedQuerying = require('../middleware/advancedquerying');

const router = express.Router();

// Temporary fix
router
  .route('/')
  .get(
    advancedQuerying(Course, { path: 'bootcamp', select: 'name description' }),
    getCourses
  );
router
  .route('/id/:id')
  .get(getCoursebyId)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);
router.route('/:bootcampid').get(getCourses).post(protect, createCourse);

module.exports = router;
