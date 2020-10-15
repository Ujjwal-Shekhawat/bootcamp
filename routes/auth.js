const express = require('express');
const { createUser } = require('../controllers/auth');

const router = express.Router();

router.route('/regester').post(createUser);

module.exports = router;
