app.directive('lineChart', function(){

	var margin = {top: 20, right: 10, bottom: 40, left: 40},
	    width = 380 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	var blue = '#3498DB', //flatui colors
	  black = '#2C3E50',
		red = '#E74C3C';

	var x = d3.scale.linear()
			.domain([0,100])
	    .range([0, width]);

	var y = d3.scale.linear()
			.domain([0,100])
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .x(function(d) { return x(d.pHard); })
	    .y(function(d) { return y(d.admitted); });

	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function(scope, elem, attrs) {

			var rates = scope.rates;
			var proportions = scope.proportions;

			var femaleLineData = [
			  {pHard: 0, admitted: rates.female.easy},
			  {pHard: 100, admitted: rates.female.hard}
			];

			var maleLineData = [
			  {pHard: 0, admitted: rates.male.easy},
			  {pHard: 100, admitted: rates.male.hard}
			];

			d3.select(elem[0]).select("svg").remove();

			var svg = d3.select(elem[0]).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .attr("class","svg-line")
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var gYAxis = svg.append("g")
			    .attr("class", "y-axis")
			    .call(yAxis)

			gYAxis.append("text")
			  .attr("transform", " translate(" + -28 + "," + height/2 + ") rotate(-90)")
			  .style("text-anchor", "middle")
			  .attr("font-size","18px")
			  .text("y");

			var gXAxis = svg.append("g")
			    .attr("class", "x-axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis)

			gXAxis.append("text")
			  .attr("transform", " translate(" + width/2 + "," + (height + 35) +  ")")
			  .style("text-anchor", "middle")
			  .attr("font-size","18px")
			  .text("x");

			svg.append("path")
			    .datum(femaleLineData)
			    .attr("class", "line")
			    .attr("d", line)
			    .attr("stroke",red)
			    .attr("stroke-width","1.5px")

			svg.append("path")
			    .datum( maleLineData)
			    .attr("class", "trend-line")
			    .attr("d", line)
			    .attr("stroke", '#999')
			    .attr("stroke-width","1.5px")
			    .attr("stroke-dasharray","4, 3");

			svg.append("path")
			    .datum(maleLineData)    
			    .attr("class", "line")
			    .attr("d", line)
			    .attr("stroke",blue)
			    .attr("stroke-width","1.5px");

			svg.append("g")
				.attr("class","g-blue-circles")
				.selectAll("blue circles")
				.data([proportions.male])
				.enter()
				.append("svg:circle")
				.attr({
					class: "blue-circles",
					r: 6,
					cx: function(d, i){
						return x(d.pHard);
					},
					cy: function(d, i){
						return y(d.admitted);
					},
					fill: blue,
					stroke: '#2C3E50'
				});

			svg.append("g")
				.attr("class","g-red-circles")
				.selectAll("red circles")
				.data([proportions.female])
				.enter()
				.append("svg:circle")
				.attr({
					class: "red-circles",
					r: 6,
					cx: function(d, i){
						return x(d.pHard);
					},
					cy: function(d, i){
						return y(d.admitted);
					},
					fill: red,
					stroke: '#2C3E50'
				}); //end attr

			scope.$watch("proportions.male.admitted + proportions.female.admitted", function (val){
				var proportions = scope.proportions;
				var svg = d3.select(elem[0]);


				svg.select(".blue-circles")
					.data([proportions.male])
					.transition().duration()
					.attr({
						cx: function(d, i){
							return x(d.pHard);
						},
						cy: function(d, i){
							return y(d.admitted);
						},
					});

				svg.select(".red-circles")
					.data([proportions.female])
					.transition().duration()
					.attr({
						cx: function(d, i){
							return x(d.pHard);
						},
						cy: function(d, i){
							return y(d.admitted);
						},
					});

//make the circles bounce when updated???

			}); //end $watch
		}//end linking function
	}; //end return
}); //end directive