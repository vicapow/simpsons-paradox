app.directive('donut', function(){

	var width = 200,
	    height = 200,
	    radius = 80;

	var blue = '#3498DB', //flatui colors
	  black = '#2C3E50',
		red = '#E74C3C';

	var labelSize = 16,
		middleText = 18;

	var color = d3.scale.ordinal()
			.domain(['accepted', 'rejected'])
	    .range([red, blue]);

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 50);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.percent; });
	    
	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function(scope, elem, attrs) {
			var gender = attrs.gender;
			scope.$watch("proportions", function(val){

			d3.select(elem[0]).select("svg").remove();
			
			var data = [
				{accepted: 'accepted', percent: scope.proportions[gender] },
				{accepted: 'rejected', percent: (100 - scope.proportions[gender]) }
			];

			var svg = d3.select(elem[0]).append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var group = svg.selectAll("arc")
			     .data(pie(data))
			   .enter().append("g")
			     .attr("class", "arc");

			 group.append("path")
			     .attr("d", arc)
			     .style("fill", function(d) { return color(d.data.accepted); })
			     .attr("stroke",black);

			 group.append("text")
			     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			     .attr("dy", ".35em")
			     .attr("fill",'white')
			     .attr("font-size",labelSize)
			     .style("text-anchor", "middle")
			     .text(function(d) { return d.data.percent + "%" ; });

				group.append('text')
					.text(gender)
					.attr("dy", ".35em")
					.attr({
						fill: black,
						"font-size": middleText,
						"text-anchor": "middle"
					});

			legend.append("rect")
			    .attr("x", 0)
			    .attr("width", 18)
			    .attr("height", 18)
			    .style("fill", color);

			legend.append("text")
			    .attr("x", -6 )
			    .attr("y", 9)
			    .attr("dy", ".35em")
			    .style("text-anchor", "end")
			    .text(function(d) { return d; });
			})
		}
	};
});