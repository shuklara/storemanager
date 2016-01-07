'use strict';

angular.module('productsSelectionApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', '$state', 'Auth', function ($scope, $http, socket, $state, Auth) {
    $scope.stores = [];
    $scope.isAdmin = Auth.isAdmin;
    $http.get('/api/stores').success(function (stores) {
      $scope.stores = stores;
      socket.syncUpdates('store', $scope.stores);
    });

    $scope.create = function () {
      if ($scope.newStore === '') {
        return;
      }
      $http.post('/api/stores', {name: $scope.newStore}).success(function (store) {
        $state.go('store', {id: store._id});
      });
      $scope.newStore = '';
    };

    $scope.update = function (store) {
      $state.go('store', {id: store._id});
    };

    $scope.delete = function (store) {
      $http.delete('/api/stores/' + store._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('store');
    });
  }]);
