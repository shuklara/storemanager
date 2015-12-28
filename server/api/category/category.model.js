'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  catId: String,
  path: String,
  parent:Schema.Types.ObjectId
});

module.exports = mongoose.model('Category', CategorySchema);
