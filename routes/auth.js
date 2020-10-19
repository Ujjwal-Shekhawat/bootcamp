const express = require('express');
const {
  createUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateUser,
  updatePassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/regester').post(createUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/updatedetails').put(protect, updateUser);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;
