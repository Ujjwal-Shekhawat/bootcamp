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

exports.createReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampid;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampid);

    if (!bootcamp) {
      return next(
        new errorres(
          `No such bootcamp found with id ${req.params.bootcampid}`,
          404
        )
      );
    }

    const review = await Review.create(req.body);

    res.status(200).json({ message: `Create review`, data: review });
  } catch (error) {}
};
