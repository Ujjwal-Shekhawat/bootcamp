const express = require('express');
const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsinRadius,
  uploadPhotoforBootcamp,
} = require('../controllers/bootcamps');

const { protect } = require('../middleware/auth');

const Bootcamp = require('../models/Bootcamp');
const advancedQuerying = require('../middleware/advancedquerying');

router
  .route('/')
  .get(advancedQuerying(Bootcamp, 'Courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(advancedQuerying(Bootcamp, 'Courses'), getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route('/location/:zipcode/:distance').get(getBootcampsinRadius);

router.route('/:id/uploadimage').put(protect, uploadPhotoforBootcamp);

module.exports = router;
