const express = require('express');
const { reviews, getReviews, createReview } = require('../controllers/reviews');

const Review = require('../models/Review');
const advancedQuerying = require('../middleware/advancedquerying');

const { protect, roleAuthorization } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(
    advancedQuerying(Review, { path: 'bootcamp user', select: 'name description' }),
    getReviews
  );

router
  .route('/id/:bootcampid')
  .get(advancedQuerying(Review), getReviews)
  .post(protect, roleAuthorization('user', 'admin'), createReview);

module.exports = router;
