'use strict';

var app = angular.module('mainApp', [])
  // .config(function ($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'views/main.html'
  //       // controller: 'MainCtrl'
  //     })
  //     .otherwise({
  //       redirectTo: '/'
  //     });
  // });


app.controller('MainCtrl', ['$scope', function($scope) {
    $scope.proportions = {
      male: 23,
      female: 45
    }
}]);