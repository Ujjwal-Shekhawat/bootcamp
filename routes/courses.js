const express = require('express');
const {
  getCourses,
  createCourse,
  getCoursebyId,
  updateCourse,
} = require('../controllers/courses');

const router = express.Router();

// Temporary fix
router.route('/').get(getCourses);
router.route('/id/:id').get(getCoursebyId).put(updateCourse);
router.route('/:bootcampid').get(getCourses).post(createCourse);

module.exports = router;
