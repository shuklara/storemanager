'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StoreSchema = new Schema({
  name: String,
  serviceability: {type: Number, default: 85},
  leadTime: {type: Number, default: 3},
  minTranSize: {type: Number, default: 10},
  maxTranSize: {type: Number, default: 500},
  freq: {type: [Number], default: [2, 2, 2, 2, 2, 2, 2]},
  anonymousCustomer: {type: Number, default: 20},
  categories: {type: Object, default: {}}
});

module.exports = mongoose.model('Store', StoreSchema);
