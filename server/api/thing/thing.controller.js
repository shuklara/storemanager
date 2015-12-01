/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var http = require('http');
var Thing = require('./thing.model');

exports.load = function (req, res) {
  http.get({
    host: 'api.walmartlabs.com',
    path: '/v1/paginated/items?format=json&category=' + req.params.id + '&apiKey=2m8deby4zfjte77t73e44r2v'
  }, function (response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {

      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(body);
      return res.json(parsed)
    });
  });


}

// Get list of things
exports.index = function (req, res) {
  Thing.find(function (err, things) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(things);
  });
};

// Get a single thing
exports.show = function (req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if (err) {
      return handleError(res, err);
    }
    if (!thing) {
      return res.status(404).send('Not Found');
    }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function (req, res) {
  Thing.create(req.body, function (err, thing) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) {
      return handleError(res, err);
    }
    if (!thing) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function (req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if (err) {
      return handleError(res, err);
    }
    if (!thing) {
      return res.status(404).send('Not Found');
    }
    thing.remove(function (err) {
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
