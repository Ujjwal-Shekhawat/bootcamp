const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  weeks: {
    type: String,
    required: true,
  },
  tuition: {
    type: Number,
    required: true,
  },
  minimumSkill: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarShipAvalable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

CourseSchema.statics.getAverageCost = async function (bootcampid) {
  console.log(`Calculating average cost`);

  const object = await this.aggregate([
    {
      $match: { bootcamp: bootcampid },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  console.log(object);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
      averageCost: Math.ceil(object[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error.message);
  }
};

CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
