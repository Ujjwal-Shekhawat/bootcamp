const express = require('express');
const { createuser } = require('../controllers/auth');

const router = express.Router();

router.route('/regester').post(createuser);

module.exports = router;
