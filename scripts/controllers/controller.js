'use strict';

app.controller('MainCtrl', ['$scope', function($scope) {

  $scope.rates = {
    male: {
      hard: 25.6,
      easy: 62.4
    },
    female: {
      hard: 26.5,
      easy: 79.7
    }
  };

  var rates = $scope.rates,
    mHard = 50,  //initial male value
    fHard = 40; //initial female value

  $scope.proportions = {
    male: {
      pHard: mHard, 
      admitted: (mHard)*rates.male.hard/100 + (100-mHard)*rates.male.easy/100
    },
    female: {
      pHard: fHard, 
      admitted: (fHard)*rates.male.hard/100 + (100-fHard)*rates.female.easy/100
    }
  };

  var pop = { male: 2691, female: 1835 }

  $scope.numbers = { //change this to have the three dimensions
    male: {
      pHard: $scope.proportions.male.pHard * pop.male, 
      admitted: $scope.proportions.male.admitted * pop.male
    },
    female: {
      pHard: $scope.proportions.female.pHard * pop.female, 
      admitted: $scope.proportions.female.admitted * pop.female
    },
  };

  $scope.updateData = function(p, gender){
    var p = Number(p)
    $scope.proportions[gender].pHard = p;
    $scope.proportions[gender].admitted = p*rates[gender].hard/100 + (100-p)*rates[gender].easy/100;

    $scope.numbers = {
      male: {
        pHard: $scope.proportions.male.pHard * pop.male, 
        admitted: $scope.proportions.male.admitted * pop.male
      },
      female: {
        pHard: $scope.proportions.female.pHard * pop.female, 
        admitted: $scope.proportions.female.admitted * pop.female
      },
    };

  };//end updateData

}]);