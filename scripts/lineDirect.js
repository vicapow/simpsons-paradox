app.directive('lineChart', function(){

  var margin = { top: 20, right: 20, bottom: 45, left: 45 }
    , width = 380 - margin.left - margin.right
    , height = 300 - margin.top - margin.bottom
    //flatui colors
    , blue = '#3498DB'
    , black = '#2C3E50'
    , red = '#E74C3C'

    , x = d3.scale.linear()
      .domain([0,100])
      .range([0, width])

    , y = d3.scale.linear()
      .domain([0,100])
      .range([height, 0])

    , xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

    , yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

    , line = d3.svg.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.y) })

  // Runs during compile
  return {
    restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
    , link: function(scope, elem, attrs) {
      var rates = scope.rates
        , proportions = scope.proportions

      d3.select(elem[0]).select("svg").remove()

      var svg = d3.select(elem[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class","svg-line")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var gYAxis = svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)

      gYAxis.append("text")
        .attr("transform", " translate(" + (-35) + "," + (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .attr("font-size","18px")
        .text("percent admitted")

      var gXAxis = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

      gXAxis.append("text")
        .attr("transform", " translate(" + (width / 2) + "," + (40) +  ")")
        .style("text-anchor", "middle")
        .attr("font-size","18px")
        .text('percent easy dept')
        .classed('x-axis-label')

      var combinedSlope = svg.append('path')
        .datum([
          { x: 0, y: 0 }
          , { x: 100, y: 100 }
        ]).attr('class','line')
        .attr('d', line)
        .attr('stroke', black)
        .attr('stroke-width', '1.5px')
        .attr('stroke-dasharray', '5,5')

      // women line
      svg.append("path")
        .datum([
          { x: 0, y: rates.female.hard * 100 }
          , { x: 100, y: rates.female.easy * 100 }
        ])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke",red)
        .attr("stroke-width","1.5px")

      // men line
      svg.append("path")
        .datum([
          { x: 0, y: rates.male.hard * 100 }
          , { x: 100, y: rates.male.easy * 100 }
        ])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", blue)
        .attr("stroke-width", "1.5px")

      // men ball
      svg.append("g")
        .attr("class","g-blue-circles")
        .selectAll("blue circles")
        .data([proportions.easy])
        .enter()
        .append('circle')
        .attr({
          'class': 'blue-circles'
          , r: 6
          , fill: blue
          , stroke: '#2C3E50'
        })

      // women ball
      svg.append("g")
        .attr("class","g-red-circles")
        .selectAll("red circles")
        .data([proportions.easy])
        .enter()
        .append("circle")
        .attr({
          class: "red-circles",
          r: 6
          , fill: red
          , stroke: '#2C3E50'
        })

      scope.$watch("proportions.easy.female + proportions.easy.male", function (val){
        var proportions = scope.proportions
          , svg = d3.select(elem[0])
          , admitted, applied
          , depts = scope.departments

        // women
        admitted = depts.easy.female.admitted + depts.hard.female.admitted
        applied = depts.easy.female.applied + depts.hard.female.applied

        var redBallData = {
          x: proportions.easy.female * 100
          , y: (admitted / applied) * 100
        }
        svg.select(".red-circles")
          .data([redBallData])
          .attr({
            cx: function(d){ return x(d.x) }
            , cy: function(d){ return y(d.y) }
          })

        // men
        admitted = depts.easy.male.admitted + depts.hard.male.admitted
        applied = depts.easy.male.applied + depts.hard.male.applied
        var blueBallData = {
          x: proportions.easy.male * 100
          , y: (admitted / applied) * 100
        }
        svg.select(".blue-circles")
          .data([blueBallData])
          .attr({
            cx: function(d){ return x(d.x) }
            , cy: function(d){ return y(d.y) }
          })

        var m = (blueBallData.y - redBallData.y ) / ( blueBallData.x - redBallData.x )
          , b = blueBallData.y - m * blueBallData.x
          , x1, x2 = { x: 100, y: 50 }
        if(m === Infinity || m === -Infinity){
          x1 = { x: blueBallData.x , y: 0}
          x2 = { x: blueBallData.x , y: 100}
        }else{
          if( b >= 0 ) {
            if( b <= 100 ) x1 = { x: 0, y: b }
            else x1 = { x: (100 - b) / m, y: 100 }
          }else{
            x1 = { x: (-b / m), y: 0}
          }
          var yint = 100 * m + b // y value at 100=x
          if( yint <= 100 && yint >= 0){
            x2 = { x: 100, y: yint }
          }else{
            if(m > 0) x2 = { x: (100 - b) /m, y: 100}
            else x2 = { x: (0 - b) /m, y: 0}
          }
        }
        combinedSlope
          .datum([x1, x2])
          .attr('d', line)
      })
    }
  }
})