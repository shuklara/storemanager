'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StoreSchema = new Schema({
  name: String,
  products: Object,
  categories: Object
});

module.exports = mongoose.model('Store', StoreSchema);
