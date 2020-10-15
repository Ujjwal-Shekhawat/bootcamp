const errorres = require('../utils/errorres');
const User = require('../models/User');

// POST
// public
// Register new user
exports.createUser = async (req, res, next) => {
  res
    .status(200)
    .json({
      message: `Successfully registered user`,
      data: `Currently under progess`,
    });
};
