'use strict';

angular.module('productsSelectionApp')
  .controller('MainCtrl', function ($scope, $http, socket, $filter, $uibModal) {



    $scope.awesomeThings = [];

    $http.get('/assets/categories.json').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings.categories;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function () {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: $scope.newThing});
      $scope.newThing = '';
    };

    $scope.getProducts = function (cat) {
      var url = 'api/things/products/' + cat.id;
      $http.get(url).success(function (result) {
        if (!cat.products) {
          cat.products = result.items;
        } else {
          cat.products.concat(result.items)
        }
        open(result.items, result.nextPage);
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

    $scope.toggleAllCheckboxes = function ($event) {
    };
    $scope.initCheckbox = function (item, parentItem) {
      return item.selected = parentItem && parentItem.selected || item.selected || false;
    };
    $scope.toggleCheckbox = function (item, parentScope) {
      if (item.children != null) {
        $scope.$broadcast('changeChildren', item);
      }
      if (parentScope.item != null) {
        return $scope.$emit('changeParent', parentScope);
      }
    };
    $scope.$on('changeChildren', function (event, parentItem) {
    });


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
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    return $scope.$on('changeParent', function (event, parentScope) {
    });


  }
)
;


angular.module('productsSelectionApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, nextUrl) {
  $scope.nextUrl = nextUrl;
  var itemsArray = [];
  $scope.items = items;
  itemsArray.push($scope.items);
  $scope.selected = {
    item: $scope.items[0]
  };

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
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
