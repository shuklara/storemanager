'use strict';

angular.module('productsSelectionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('store', {
        url: '/store/:id',
        templateUrl: 'app/store/store.create.html',
        controller: 'StoreCtrl'
      });
  });
