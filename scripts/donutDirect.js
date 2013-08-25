app.directive('donut', function(){

  var width = 200
    , height = 200
    , radius = 80

    //flatui colors
    , blue = '#3498DB'
    , black = '#2C3E50'
    , red = '#E74C3C'
    , labelSize = 16
    , middleText = 18

    , color = d3.scale.ordinal()
      .domain(['accepted', 'rejected'])
      .range([red, blue])

    , arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 50)

    , pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.percent })


  // Runs during compile
  return {
    restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
    , link: function(scope, elem, attrs) {
      var gender = attrs.gender
        , rates = scope.rates
        , depts = scope.departments
      scope.$watch("departments.easy." + gender + ".admitted + departments.hard." + gender + ".admitted", function(val){
      d3.select(elem[0]).select("svg").remove()
      var admitted = depts.easy[gender].admitted + depts.hard[gender].admitted
      var applied = depts.easy[gender].applied + depts.hard[gender].applied
      var data = [{ 
          accepted: 'accepted'
          , percent: admitted / applied * 100
        }
        , { 
          accepted: 'rejected'
          , percent: (applied - admitted) / applied * 100
        }]
        , svg = d3.select(elem[0]).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        , group = svg.selectAll("arc")
          .data(pie(data)).enter().append("g")
           .attr("class", "arc")

       group.append("path")
           .attr("d", arc)
           .style("fill", function(d) { return color(d.data.accepted) })
           .attr("stroke",black)

       group.append("text")
           .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
           .attr("dy", ".35em")
           .attr("fill",'white')
           .attr("font-size",labelSize)
           .style("text-anchor", "middle")
           .text(function(d) { return d.data.percent + "%" ; })

        group.append('text')
          .text(gender)
          .attr("dy", ".35em")
          .attr({
            fill: black,
            "font-size": middleText
            , "text-anchor": "middle"
          })

      legend.append("rect")
          .attr("x", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color)

      legend.append("text")
          .attr("x", -6 )
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d })
      })
    }
  }
})