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

    // Token
    // const token = user.getSignedToken();

    // res.status(200).json({
    //   message: `Successfully registered user`,
    //   data: user,
    //   token: token,
    // });
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new errorres(`Please enter email and password`, 400));
    }

    const user = await User.findOne({ email: email }).select('+password');

    // Check if user exists
    if (!user) {
      return next(new errorres(`Invalid credentials`, 401));
    }

    // Check if the entered password is correct
    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      return next(new errorres(`Invalid credentials`, 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = (user, statusCode, response) => {
  const token = user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIR_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === `produnction`) {
    options.secure = true;
  }

  response
    .status(statusCode)
    .cookie('token', token, options)
    .json({ message: `Cookies`, token: token });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({ message: `Get current user`, data: user });
  } catch (error) {
    next(error);
  }
};
