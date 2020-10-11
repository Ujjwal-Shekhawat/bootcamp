const node_geocoder = require('node-geocoder');

var options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = node_geocoder(options);

module.exports = geocoder;
