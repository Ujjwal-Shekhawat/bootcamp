const express = require('express');
const {
  createUser,
  loginUser,
  getMe,
  forgotPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/regester').post(createUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);

module.exports = router;
