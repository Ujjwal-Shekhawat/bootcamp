const express = require('express');
const { getCourses } = require('../controllers/courses');

const router = express.Router();

// Temporary fix
router.route('/').get(getCourses);
router.route('/:bootcampid').get(getCourses);

module.exports = router;
