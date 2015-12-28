'use strict';

var _ = require('lodash');
var Category = require('./category.model');

var http = require('http');

var fs = require('fs');

Category.count(function (err, count) {
  if (count <= 0) {
    var obj = require('./category.json');
    createNodes(undefined, obj.categories);
  }
});

function createNodes(parent, nodes) {
  nodes.forEach(function (node) {
    var n = new Category({catId: node.id, name: node.name, path: node.path});
    if (!!parent) {
      n.parent = parent;
    }
    n.save(function (err, result) {
      if (!!node.children) {
        createNodes(result._id, node.children);
      }
    });

  });
}

// Get list of categorys
exports.index = function (req, res) {
  Category.find({parent: {$exists: false}}, function (err, categories) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(categories);
  });
};

// Get a single category
exports.show = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.status(404).send('Not Found');
    }
    return res.json(category);
  });
};

// Creates a new category in the DB.
exports.create = function (req, res) {
  Category.create(req.body, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(category);
  });
};

exports.children = function (req, res) {

  Category.findById(req.params.id, function (err, parent) {
    if (err) {
      return handleError(res, err);
    }
    if (!parent) {
      return res.status(404).send('Not Found');
    }
    Category.find({parent: parent._id}, function (err, children) {
      if (err) {
        return handleError(res, err);
      }
      if (!children) {
        return res.status(404).send('Not Found');
      }
      return res.status(200).json(children);
    })
  });
};


// Updates an existing category in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(category, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(category);
    });
  });
};

// Deletes a category from the DB.
exports.destroy = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.status(404).send('Not Found');
    }
    category.remove(function (err) {
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
