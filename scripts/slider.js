app.directive("slider", function(){

	
	return {
		restrict: 'A',
		link: function(scope, elem, attrs, controller){
				var gender = attrs.gender;
           $(elem).slider({
             min: 1,
             max: 100,
             value: 1,
             orientation: "horizontal",
             range: "min",
           })
           .on("slidechange", function(event, ui){
           	// scope.updateData(ui.value, gender)
	            scope.$apply(function(){
                scope.updateData(ui.value, gender)
              })
           });
		}
	}; //end return
}) //end directive

