'use strict';

angular.module('productsSelectionApp')
  .controller('StoreCtrl', function ($scope, $http, socket, $filter, $uibModal, $stateParams, $log, $state) {


    $http.get('/api/stores/' + $stateParams.id).success(function (store) {
      $scope.store = store;
      $scope.numCategories = _.size(store.categories)
      $scope.numProducts = 0;
      for (var ele in $scope.store.categories) {
        if (!!$scope.store.categories[ele].products) {
          $scope.numProducts += _.size($scope.store.categories[ele].products)
        }
      }
    });
    $scope.active = 'WEIGHT';

    $scope.copy = function (store) {
      delete store._id;
      store.name = 'COPY OF' + store.name;
      $http.post('/api/stores', store).success(function (res) {
        $state.go('store', {id: res._id});
      });
    };

    $scope.canShowCat = function (cat) {
      return _.size(cat.products) > 0;
    };

    $scope.delete = function (cat, upc) {
      delete $scope.store.categories[cat].products[upc];
    };

    $scope.categories = [];
    $scope.loadCategories = function () {
      $scope.loading = true;
      if ($scope.categories.length == 0) {
        $http.get('/api/categories').success(function (result) {
          $scope.addProducts = true;
          $scope.categories = result;
          $scope.loading = false;
        });
      } else {
        $scope.addProducts = true;
        $scope.loading = false;
      }
    };


    $scope.updateStore = function (store) {
      $http.put('/api/stores/' + store._id, store);
    };
    $scope.open = function (cat) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          category: function () {
            return cat;
          },
          store: function () {
            return $scope.store;
          }
        }
      });

      modalInstance.result.then(function (selectedItems) {
        if (!$scope.store.categories) {
          $scope.store.categories = {}
        }

        for (var key in selectedItems) {
          var cat = selectedItems[key].categoryNode;
          if (!$scope.store.categories[cat]) {
            $scope.store.categories[cat] = {
              node: cat,
              path: selectedItems[key].categoryPath,
              products: {}
            };
          }
          $scope.store.categories[cat].products[key] = selectedItems[key]
        }
        $scope.updateStore($scope.store);

        $scope.numCategories = _.size($scope.store.categories)
        $scope.numProducts = 0;
        for (var ele in $scope.store.categories) {
          if (!!$scope.store.categories[ele].products) {
            $scope.numProducts += _.size($scope.store.categories[ele].products)
          }
        }

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.getChildren = function (cat) {
      cat.opened = !cat.opened;
      if (!!cat.opened) {
        $http.get('/api/categories/children/' + cat._id).success(function (result) {
          cat.children = result;
        });
      }
    };

  });

angular.module('productsSelectionApp').controller('ModalInstanceCtrl', ['$http', '$scope', '$uibModalInstance', 'category', 'store', function ($http, $scope, $uibModalInstance, category, store) {
  $scope.selectedProducts = {};
  var itemsArray = [];
  var maxId;
  var currIndex = 0;

  $scope.addProduct = function (p) {
    delete p.parentItemId;
    delete p.mediumImage;
    delete p.largeImage;
    delete p.productTrackingUrl;
    delete p.standardShipRate;
    delete p.marketplace;
    delete p.bundle;
    delete p.clearance;
    delete p.preOrder;
    delete p.stock;
    delete p.addToCartUrl;
    delete p.affiliateAddToCartUrl;
    delete p.freeShippingOver50Dollars;
    delete p.availableOnline;
    delete p.longDescription;
    delete p.ninetySevenCentShipping;
    delete p.twoThreeDayShippingRate;
    delete p.overnightShippingRate;
    delete p.shipToStore;
    delete p.freeShipToStore;
    delete p.rollBack;
    delete p.maxItemsInOrder;
    delete p.variants;
    $scope.selectedProducts[p.upc] = p;
  };
  $scope.removeProduct = function (p) {
    delete $scope.selectedProducts[p.upc];
  };
  $scope.isProductAdded = function (p) {
    return $scope.selectedProducts[p.upc];
  };

  function getProducts(cat, max) {
    $scope.fetchingProduct = true;
    var url = '/api/products/' + cat;
    $http.get(url, {params: {maxId: max}}).success(function (result) {
      maxId = result.maxId;
      $scope.items = result.items;
      itemsArray.push($scope.items);
      currIndex = itemsArray.length - 1;
      $scope.fetchingProduct = false;

    });
  }

  $scope.next = function () {
    if (currIndex + 1 < itemsArray.length) {
      currIndex = currIndex + 1;
      $scope.items = itemsArray[currIndex];
    } else {
      getProducts(category, maxId);
    }
  };

  $scope.previous = function () {
    if (currIndex > 0) {
      currIndex = currIndex - 1;
      $scope.items = itemsArray[currIndex];
    }
  };


  $scope.ok = function () {
    $uibModalInstance.close($scope.selectedProducts);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.hasPrevious = function () {
    return currIndex !== 0;
  };
  $scope.hasNext = function () {
    return currIndex < itemsArray.length - 1 || !!maxId;
  };
  getProducts(category);

}]);
