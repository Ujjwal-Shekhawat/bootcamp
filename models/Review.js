const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
    maxlength: 100,
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'Pleasde add som text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating'],
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

ReviewSchema.statics.getAverageRating = async function (bootcampid) {
  console.log(`Calculating average rating`);

  const object = await this.aggregate([
    {
      $match: { bootcamp: bootcampid },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(object);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
      averageRating: object[0].averageRating,
    });
  } catch (error) {
    console.log(error.message);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
