app.directive('bar', function(){

	var width = 40,
	    height = 100;

	var blue = '#3498DB', //flatui colors
	  black = '#2C3E50',
		red = '#E74C3C';
	    
	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function(scope, elem, attrs) {
			var gender = attrs.gender;
			var measure = attr.measure;
			var program = attr.program
			scope.$watch("proportions.male.admitted + proportions.female.admitted", function(val){

			d3.select(elem[0]).select("svg").remove();
			
		  var svg = d3.select(elem[0]).append("svg")
		      .attr("width", width)
		      .attr("height", height)
		    .append("g")
		      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var bar = svg.select("bar")
				.data(scope.numbers[gender][measure])

			group.append()


			}); //end $watch
		}//end linking function
	}; //end return
}); //end directive

// <div bar measure="admitted/applied" gender="male" program = "easy/hard">