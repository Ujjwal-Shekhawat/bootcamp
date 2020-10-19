const jwt = require('jsonwebtoken');
const errorres = require('../utils/errorres');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Will be implementing later in production mode
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new errorres(`Not authorized to access this route`), 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECERET);

    console.log(`${decoded}`);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};

exports.roleAuthorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorres(
          `User with role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
