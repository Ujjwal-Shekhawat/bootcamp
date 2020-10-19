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

    // Check if the user has submitted a review on this site
    const given = await Review.findOne({
      user: req.user.id,
      bootcamp: req.params.bootcampid,
    });
    if (given) {
      return next(
        new errorres(
          `This user has already submitted a review for this bootcamp cannot submit more than one review`,
          400
        )
      );
    }

    const review = await Review.create(req.body);

    res.status(200).json({ message: `Create review`, data: review });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.bootcampid);

    if (!bootcamp) {
      return next(
        new errorres(
          `No such bootcamp found with id ${req.params.bootcampid}`,
          404
        )
      );
    }

    // Check if the user has submitted a review on this site
    const given = await Review.findOne({
      user: req.user.id,
      bootcamp: req.params.bootcampid,
    });
    if (!given) {
      return next(
        new errorres(
          `There is no review found given by this user for this bootcamp`,
          400
        )
      );
    }

    // Not properly returning new data
    const review = await Review.findOneAndUpdate(
      { user: req.user.id, bootcamp: req.params.bootcampid },
      { title: req.body.title, text: req.body.text, rating: req.body.rating },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: `Update review`, data: review });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.bootcampid);

    if (!bootcamp) {
      return next(
        new errorres(
          `No such bootcamp found with id ${req.params.bootcampid}`,
          404
        )
      );
    }

    // Check if the user has submitted a review on this site
    const given = await Review.findOne({
      user: req.user.id,
      bootcamp: req.params.bootcampid,
    });
    if (!given) {
      return next(
        new errorres(`no reviews found by this user on this bootcamp`, 404)
      );
    }

    given.remove();

    res.status(200).json({ message: `Delete review`, data: {} });
  } catch (error) {
    next(error);
  }
};
