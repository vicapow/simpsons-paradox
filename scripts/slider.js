app.directive("slider", function(){
  
  return {
    restrict: 'A'
    , link: function(scope, elem, attrs, controller){
      $(elem).slider({
        min: 1
        , max: 100
        , value: scope.proportions.easy[attrs.gender] * 100
        , orientation: "horizontal"
        , range: "min"
      })
      .on("slide", function(event, ui){
        scope.$apply(function(){
          scope.updateProportions(ui.value, attrs.gender)
        })
      })
    }
  }
})

