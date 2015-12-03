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
var urlResolver = require('url');

// Get list of things
exports.index = function (req, res) {
  var url = '/v1/paginated/items?apiKey=2m8deby4zfjte77t73e44r2v&format=json&category=' + req.params.id;
  if (!!req.query.maxId) {
    url = url + '&maxId=' + req.query.maxId;
  }

  var request = require("request");
  request("http://api.walmartlabs.com" + url, function (error, response, body) {
    // Data reception is done, do whatever with it!
    var parsed = JSON.parse(body);
    body = '';
    var result = {"category": parsed.category, items: []};

    if (!!parsed.nextPage) {
      var queryData = urlResolver.parse(parsed.nextPage, true).query;
      result.maxId = queryData.maxId;

      parsed.items.forEach(function (p) {
        result.items.push({
          itemId: p.itemId,
          name: p.name,
          salePrice: p.salePrice,
          upc: p.upc,
          categoryPath: p.categoryPath,
          shortDescription: p.shortDescription,
          brandName: p.brandName,
          thumbnailImage: p.thumbnailImage,
          modelNumber: p.modelNumber,
          productUrl: p.productUrl,
          categoryNode: p.categoryNode
        });
      })
    }
    return res.status(200).json(result);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
