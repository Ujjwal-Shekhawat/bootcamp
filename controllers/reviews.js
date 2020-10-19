const Bootcamp = require('../models/Bootcamp');
const errorres = require('../utils/errorres');
const Review = require('../models/Review');

exports.getReviews = async (req, res, next) => {
  try {
    let query;
    if (req.params.bootcampid) {
      query = await Review.find({ bootcamp: req.params.bootcampid });

      return res
        .status(200)
        .json({ message: `Get reviews`, count: query.length, data: query });
    } else {
      return res.status(200).json(res.advancedQuerying);
    }
  } catch (error) {
    next(error);
  }
};
