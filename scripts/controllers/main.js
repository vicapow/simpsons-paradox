'use strict';

app.controller('MainCtrl',function ($scope, $http, parsing){
	$scope.database = 'beartransit';
  $scope.collection = 'status';
  $scope.daysBack = 7;
  $scope.query = JSON.stringify({'start':  { $gt: moment().subtract('days', $scope.daysBack).startOf('day').valueOf() }})

	$scope.getMyData = function () {
	  $http({
	    method: 'GET',
	    url:'https://api.mongolab.com/api/1/databases/'
	      + $scope.database
	      + '/collections/'
	      + $scope.collection,
      params: {
      	'q': $scope.query,
      	'apiKey': '50d9ea8ae4b0a5a5a6891f38'
      }
	  }).
	  success(function (data) {
	    // attach this data to the scope
	    $scope.data = data;
    	console.log($scope.data)
	    // clear the error messages
	    $scope.error = '';
	  }).
	  error(function (data, status) {
	    if (status === 404) {
	      $scope.error = 'That data don\'t exist yall' ;
	    } else {
	      $scope.error = 'Error: ' + status;
	    }
	  });
	};
	$scope.getMyData();

})