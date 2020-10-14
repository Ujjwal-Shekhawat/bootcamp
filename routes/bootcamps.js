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

const Bootcamp = require('../models/Bootcamp');
const advancedQuerying = require('../middleware/advancedquerying');

router
  .route('/')
  .get(advancedQuerying(Bootcamp, 'Courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(advancedQuerying(Bootcamp, 'Courses'), getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/location/:zipcode/:distance').get(getBootcampsinRadius);

router.route('/:id/uploadimage').put(uploadPhotoforBootcamp);

module.exports = router;
