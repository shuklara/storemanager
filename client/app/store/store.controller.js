'use strict';

angular.module('productsSelectionApp')
  .controller('StoreCtrl', function ($scope, $http, socket, $filter, $uibModal, $stateParams) {

    $scope.loading = true;

    $http.get('/api/stores/' + $stateParams.id).success(function (store) {
      $scope.store = store;
    });
    $scope.awesomeThings = [];
    $http.get('/assets/categories.json').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings.categories;
      $scope.loading = false;
    });

    $scope.updateStore = function (store) {
      $http.put('/api/stores/'+store._id, store);
    };

    $scope.getProducts = function (cat) {
      $scope.fetchingProduct = true;
      var url = 'api/things/products/' + cat.id;
      $http.get(url).success(function (result) {
        if (!cat.products) {
          cat.products = result.items;
        } else {
          cat.products.concat(result.items)
        }
        open(result.items, result.nextPage);
        $scope.fetchingProduct = false;

      })
    };

    $scope.deleteThing = function (parent, thing) {
      var arr = [];
      if (!parent) {
        arr = $scope.awesomeThings;
      }
      else {
        arr = parent.children;
      }
      var index = arr.indexOf(thing);
      arr.splice(index, 1);
      //  $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.initCheckbox = function (item, parentItem) {
      return item.selected = parentItem && parentItem.selected || item.selected || false;
    };


    function open(products, nextPage) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          items: function () {
            return products;
          },
          nextUrl: function () {
            return nextPage;
          },
          store : function(){
            return $scope.store;
          }
        }
      });

      modalInstance.result.then(function (selectedItems) {
        if (!$scope.store.products) {
          $scope.store.products =[] ;
        }

        for (var key in selectedItems) {
          $scope.store.products.push(selectedItems[key]);
        }
        $scope.updateStore($scope.store);

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    return $scope.$on('changeParent', function (event, parentScope) {
    });


  }
)
;


angular.module('productsSelectionApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, nextUrl,store) {
  $scope.nextUrl = nextUrl;
  var itemsArray = [];
  $scope.items = items;
  itemsArray.push($scope.items);
  $scope.selectedProducts = {};
  $scope.loadMore = function () {
    var currIndex = itemsArray.indexOf($scope.items);
    if (currIndex < itemsArray.length - 1) {
      $scope.items = itemsArray[currIndex + 1];
    } else {
      var url = 'api/things/load/' + nextUrl;
      $http.get(url).success(function (result) {
        $scope.items = result.items;
        itemsArray.push($scope.items);
        $scope.nextUrl = result.nextPage;
      })
    }


  };
  $scope.ok = function () {
    $uibModalInstance.close($scope.selectedProducts);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


  $scope.addProduct = function (p) {
    $scope.selectedProducts[p.upc] = p;
  };
  $scope.removeProduct = function (p) {
    delete $scope.selectedProducts[p.upc];
  };
  $scope.isProductAdded = function (p) {
    return $scope.selectedProducts[p.upc];
  };
});
