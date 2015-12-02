'use strict';

angular.module('productsSelectionApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function (user) {
      User.remove({id: user._id});
      angular.forEach($scope.users, function (u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.enable = function (user) {
      $http.put('/api/users/' + user._id + '/enable', user).success(function (u) {
        user.enabled = u.enabled;
      })
    }
  });
