const express = require('express');
const { reviews, getReviews } = require('../controllers/reviews');

const Review = require('../models/Review');
const advancedQuerying = require('../middleware/advancedquerying');

const router = express.Router();

router
  .route('/')
  .get(
    advancedQuerying(Review, { path: 'bootcamp', select: 'name description' }),
    getReviews
  );

router.route('/id/:bootcampid').get(advancedQuerying(Review), getReviews);

module.exports = router;
