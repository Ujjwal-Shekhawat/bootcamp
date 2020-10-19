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

const { protect, roleAuthorization } = require('../middleware/auth');

const Bootcamp = require('../models/Bootcamp');
const advancedQuerying = require('../middleware/advancedquerying');

router
  .route('/')
  .get(advancedQuerying(Bootcamp, 'Courses'), getBootcamps)
  .post(protect, roleAuthorization('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(advancedQuerying(Bootcamp, 'Courses'), getBootcamp)
  .put(protect, roleAuthorization('publisher', 'admin'), updateBootcamp)
  .delete(protect, roleAuthorization('publisher', 'admin'), deleteBootcamp);

router.route('/location/:zipcode/:distance').get(getBootcampsinRadius);

router
  .route('/:id/uploadimage')
  .put(
    protect,
    roleAuthorization('publisher', 'admin'),
    uploadPhotoforBootcamp
  );

module.exports = router;
