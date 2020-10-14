const express = require('express');
const {
  getCourses,
  createCourse,
  getCoursebyId,
} = require('../controllers/courses');

const router = express.Router();

// Temporary fix
router.route('/').get(getCourses);
router.route('/id/:id').get(getCoursebyId);
router.route('/:bootcampid').get(getCourses).post(createCourse);

module.exports = router;
