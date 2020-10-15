const errorres = require('../utils/errorres');
const User = require('../models/User');

// POST
// public
// Register new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(200).json({
      message: `Successfully registered user`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    res.status(200).json({ message: `Login user`, data: { email, password } });
  } catch (error) {
    next(error);
  }
};
