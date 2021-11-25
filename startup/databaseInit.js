const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    mongoose.connect(config.get('db'),{useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => winston.info('Connected to MongoDB...'))
  .catch(err => winston.error('Could not connect to MongoDB...'));
}