const errorres = require('../utils/errorres');
const User = require('../models/User');
const sendEmail = require('../utils/sendMail');
const sendMail = require('../utils/sendMail');

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

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new errorres(`User not found with emailid : ${req.body.email}`, 404)
      );
    }

    const resetToken = user.getResetPasswordToken();
    console.log(`Reset Token : ${resetToken}`);

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.protocol}://${req.get(
      'host'
    )}/api/v1/auth/forgotpassword/${resetToken}`;

    const message = `You are receving this email because you (or someone else) has requested the reset of a password, please make a PUT request to this url ${resetUrl}`;

    try {
      await sendMail({
        email: user.email,
        subject: `Password reset token`,
        message: message,
      });

      res.status(200).json({ message: `Mail sent` });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
