'use strict';

var _ = require('lodash');
var Store = require('./store.model');

// Get list of stores
exports.index = function (req, res) {
  Store.find(function (err, stores) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(stores);
  });
};

// Get a single store
exports.show = function (req, res) {
  Store.findById(req.params.id, function (err, store) {
    if (err) {
      return handleError(res, err);
    }
    if (!store) {
      return res.status(404).send('Not Found');
    }
    return res.json(store);
  });
};

// Creates a new store in the DB.
exports.create = function (req, res) {
  Store.create(req.body, function (err, store) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(store);
  });
};

// Updates an existing store in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Store.findById(req.params.id, function (err, store) {
    if (err) {
      return handleError(res, err);
    }
    if (!store) {
      return res.status(404).send('Not Found');
    }
    var updated =  req.body
    store.categories = updated.categories;
    store.freq=updated.freq;
    store.anonymousCustomer=updated.anonymousCustomer;
    store.minTranSize=updated.minTranSize;
    store.maxTranSize=updated.maxTranSize;
    store.name=updated.name;
    store.markModified('categories');
    store.markModified('freq');
    store.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(store);
    });
  });
};

// Deletes a store from the DB.
exports.destroy = function (req, res) {
  Store.findById(req.params.id, function (err, store) {
    if (err) {
      return handleError(res, err);
    }
    if (!store) {
      return res.status(404).send('Not Found');
    }
    store.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
