const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cookie_parser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limiter');
const hpp = reuire('hpp');
const cors = require('cors');
const serverindex = require('serve-index');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect with Database
connectDB();

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const reviews = require('./routes/reviews');
const { connect } = require('mongoose');
const fileUpload = require('express-fileupload');

const app = express();

// Cookie Parser
app.use(cookie_parser());

// Middleware
// body-parser

app.use(express.json());

// Logging middleware (I'm using morgan as it is light weight and saves the trouble for writing my custom middleware)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express middleware for file uploads
app.use(fileupload());

// Security middlewares
// sanitize data to prevent noSql attacks
app.use(mongoSanitize());

// Use helmet for more secure and efficient headers
app.use(helmet());

// Prevent cross site scripting
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMS: 10 * 60 * 1000 /* 10 minutes */,
  max: 100,
});
app.use(limiter);

// hpp (Hyper paramater pollution)
app.use(hpp());

// CORS
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve index
app.use(`/public`, serverindex(path.join(__dirname, `public`)));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
