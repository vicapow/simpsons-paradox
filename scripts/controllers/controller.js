'use strict';

app.controller('MainCtrl', ['$scope', function($scope) {

  // acceptance rate for men who applied to the hard vs easy program
  // constant
  var rates = $scope.rates = {
      male: {
        // only ~25% of men that applied got accepted to the hard program
        hard: .256
        // ~62% of those that applied got accepted to the easy program
        , easy: .624
      }
        // acceptance rate for women who applied to the hard vs easy program
      , female: {
        // only ~26% of women that applied got accepted tot he hard program
        hard: .265
        // ~80% of those that applied got accepted to the easy program
        , easy: .797
      }
    }
    // the proportion of men and women that applied to the easy and hard programs
    // not constant. this data will change with the sliders
    , proportions = $scope.proportions = { 
      female: { easy: 0.2, hard: 0.6 } 
      , male: { easy: 0.8, hard: 0.4 }
      // NOTE: female.easy + male.easy === 1
      // NOTE: female.hard + male.hard === 1
    }
    // total male and female applicants
    // constant
    , pop = { male: 2691, female: 1835 }
    // department data
    // not constant. this will update with the slider and be used in the table
    , departments = $scope.departments = {
      easy: {
        male: {
          applied: pop.male * proportions.male.easy
          , admitted: pop.male * proportions.male.easy * rates.male.easy
          , percentAdmitted: rates.male.easy * 100
        }
        , female: {
          applied: pop.female * proportions.female.easy
          , admitted: pop.female * proportions.female.easy * rates.female.easy
          , percentAdmitted: rates.female.easy * 100
        }
      }
      , hard: {
        male: {
          applied: pop.male * proportions.male.hard
          , admitted: pop.male * proportions.male.hard * rates.male.hard
          , percentAdmitted: rates.male.hard * 100
        }
        , female: {
          applied: pop.female * proportions.female.hard
          , admitted: pop.female * proportions.female.hard * rates.female.hard
          , percentAdmitted: rates.female.hard * 100
        }
      }
    }

  $scope.updateData = function(p, gender){
    var p = Number(p) / 100
      , rate = rates[gender]
      , easy = departments.easy[gender]
      , hard = departments.hard[gender]

    easy.admitted = p * rate.hard
    easy.percentAdmitted = p * 100

    hard.admitted = p * rate.hard + ( 1 - p) * rate.easy
    hard.percentAdmitted = p * 100
  };
}]);