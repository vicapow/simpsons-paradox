var blue = '#3498DB',
 red = '#E74C3C',
 black = '#2C3E50'


var w = window.innerWidth*.7
  , h = 600
  , tempo = 500
  , data = {
    'Men' : {
      'A' : [51, 82]
      , 'B' : [35, 56]
      , 'C' : [12, 33]
      , 'D' : [14, 42]
      , 'E' : [5, 19]
      , 'F' : [2, 27]
    }
    , 'Women' : {
      'A' : [9, 11]
      , 'B' : [2, 3]
      , 'C' : [20, 59]
      , 'D' : [13, 38]
      , 'E' : [9, 39]
      , 'F' : [2, 34]
    }
  }
  // return the combined ration for a row in the data
  , combined = function(row){
    return _.reduce(_.toArray(data)[row], function(m, n){
      return _.zip(m, n).map(function(a){ return a[0] + a[1] })
    }, [0, 0])
  }
  , rows = _.keys(data)
  , cols = _.keys(_.first(_.toArray(data)))
  // max for each column
  , col_maxs = (function(){
      var maxs = _.map(cols, function(col){
        var max_row = 0
        _.reduce(_.toArray(data), function(max, row, row_ind){
          var t = row[col][0] / row[col][1]
          if(t > max){
            max_row = row_ind
            max = t
          }
          return max
        }, 0)
        return max_row
      })
      var max_combined_index = -1
      var max_combined = _.reduce(rows, function(max, row, i){
        var t = combined(i)
        t = t[0] / t[1]
        if(t > max){
          max_combined_index = i
          max = t
        }
        return max
      }, 0)
      maxs.push(max_combined_index)
      return maxs
    })()
  , num_nodes = _.chain(data).map(function(row){
    return _.map(row, function(col){
      return _.last(col)
    }).reduce(function(m, n){ return m + n })
  }).reduce(function(m, n){ return m + n}, 0).value()
  , max_nodes_per_ratio = d3.max(_.map(data, function(row){
    return d3.max( _.map(row, function(col){ return _.last(col) } ) )
  }))
  , fill = function(d){
    if(d) return red
    else return blue
  }
  , svg = d3.select('.vis').append('svg')
      .attr('width', w)
      .attr('height', h)
  , createForce = function(){
    return d3.layout.force()
      .nodes([])
      .links([])
      .gravity(0)
      .size([w, h])
      .linkDistance(0)
      .linkStrength(2)
      .friction(0.2)
      .charge(function(d, i){ return d.charge })
  }
  , forces = _.map(rows, createForce)
  , linktoFoci = function(nodes, foci){
    return nodes.map(function(node){
      return { source : node, target : foci }
    })
  }
  , createNodes = function(num, denom, name){
    return d3.range(denom).map(function(d){
      return {
        id : d < num ? 0 : 1
        , x : d < num ? 0 : w
        , y : Math.random() * h
        , charge : -1 * 10000 / max_nodes_per_ratio
        , name : name
      }
    })
  }
  , createFoci = function(x, y, name){
    return { x : x, y : y, charge : 0, fixed : true, name : name }
  }
  , focis = {}
  , rowClass = function(row){
    return 'row-' + row.replace(/ /g, '').toLowerCase()
  }
  , colClass = function(col){
    return 'col-' + col.replace(/ /g, '').toLowerCase()
  }
  

// create all the focal points for the different nodes
_.each(rows, function(row_val, row){
  _.each(cols, function(col_val, col){
    var row_class = rowClass(rows[row])
      , col_class = colClass(cols[col])
      , x = w / (cols.length + 2) * (col + 1)
      , y = h / (rows.length + 1) * ( row + 1)
      , foci1 = createFoci( x,  y, row_class + ' ' + col_class + ' foci foci-0')
      , foci2 = createFoci( x,  y, row_class + ' ' + col_class + ' foci foci-1')
    if(!focis[rows[row]]) focis[rows[row]] = {}
    focis[rows[row]][cols[col]] = [foci1, foci2]
    forces[row].nodes().push(foci1, foci2)
  })
})

// hide the foci
svg.selectAll('circle.foci')
  .style('display', 'none');



function setupNodeAndLinks(force, row){
  cols.forEach(function(col){
    var fociSet = focis[row][col]
      , num = data[row][col][0]
      , den = data[row][col][1]
      , row_class = rowClass(row)
      , col_class = colClass(col)
      , nodes = createNodes(num, den, row_class + ' ' + col_class)
    force.nodes().push.apply(force.nodes(), nodes)
    force.links().push.apply(force.links(), linktoFoci(nodes.filter(function(d){ 
      return d.id === 0 
    }), fociSet[0] ))
    force.links().push.apply(force.links(), linktoFoci(nodes.filter(function(d){ 
      return d.id === 1
    }), fociSet[1] ))
  })
}

_.each(forces, function(force, i){
  setupNodeAndLinks(force, rows[i] )
  force.on('tick', function(e){
    svg.selectAll('circle.' + rowClass(rows[i]))
      .attr('cx', function(d) { return d.x })
      .attr('cy', function(d) { return d.y })
  })
})

svg.selectAll('circle' + '.node')
  .data(_.reduce(forces
    , function(nodes, force) { return nodes.concat(force.nodes()); }, []))
  .enter().append('circle')
    .attr('class', function(d){ return 'node ' + d.name})
    .attr('cx', function(d) { return d.x })
    .attr('cy', function(d) { return d.y })
    .attr('r', 3 + 100 / num_nodes )
    .style('fill', function(d) { return fill(d.id) })
    .style('stroke', black)
    .style('stroke-width', 1)

_.each(forces, function(force){ force.start() })



var cl = function(row, col, fociId){
    fociId = (fociId !== undefined) ? '.foci-' + fociId : ''
    return '.' + rowClass(rows[row]) + '.' + colClass(cols[col] + fociId)
  }
  , ratioLabelPos = function(row, col){
    var maxr = 0
      , cx = Number(d3.select(cl(row, col, 0)).attr('cx'))
      , cy = Number(d3.select(cl(row, col, 0)).attr('cy'))
    d3.selectAll('.node' + cl(row, col)).each(function(d){
      var r = Math.sqrt( (d.x - cx) * (d.x - cx) + (d.y - cy) * (d.y - cy))
      maxr = r > maxr ? r : maxr
    })
    return {
      x : cx + Math.cos(45) * maxr
      , y : cy - Math.sin(45) * maxr
    }
  }
  , ratioLabelFormat = function(d){ 
    return d3.format('.0%')(d[0] / d[1]) 
  }
  
  , timeline = [
    tempo * 2
    , function(){
      // show labels
      var labels = []
      for(row in rows){
        for(col in cols){
          labels.push({
            foci: cl(row, col)
            , text : ratioLabelFormat(data[rows[row]][cols[col]])
            , row : Number(row)
            , col : Number(col)
          })
        }
      }
      var ratios = svg.selectAll('text.year-ratio')
      ratios.remove()
      ratios.data(labels)
        .enter().append('text')
          .attr({
            class : 'year-ratio'
            , x : function(d){  
              return ratioLabelPos(d.row, d.col).x
            }
            , y : function(d){ 
              return ratioLabelPos(d.row, d.col).y
            }
          })
          .text(function(d){ return d.text })
          .style('opacity','0.0')
          .transition()
          .style('opacity','1.0')
          .style('font-weight', function(d){
            return col_maxs[d.col] === d.row ? 'bold' : 'normal'
          })
    }
    , tempo * 10
    , function(){
      var dur = 250
      var ratios = svg.selectAll('text.year-ratio')
        .transition()
        .duration(dur)
        .style('opacity','0.0')
        .remove()
      return dur
    }
    , function(){
      var dur = tempo * 2
      for(var row in rows){
        for(var col in cols){
          animFoci( cl(row, col) + '.foci-0', { x : w / (cols.length + 2) * (cols.length + 1) - 500 }, dur)
          // a hack to make the combined edges a bit smoother
          animFoci( cl(row, col) + '.foci-1', { x : w / (cols.length + 2) * (cols.length + 1) }, dur)
        }
      }
      return dur
    }
    , tempo * 1
    , function(){
      var dur = tempo * 2
      for(var row in rows){
        for(var col in cols){
          animFoci( cl(row, col) + '.foci-0', { x : w / (cols.length + 2) * (cols.length + 1) }, dur)
          animFoci( cl(row, col) + '.foci-1', { x : w / (cols.length + 2) * (cols.length + 1) }, dur)
        }
      }
      return dur
    }
    , tempo * 1
    // show the combined ratios
    , function(){
      var labels = rows.map(function(row, i){
        return {
          text : ratioLabelFormat(combined(i))
          , row : i
          , col : cols.length
          , foci: cl(i, 0)
        }
      })
      var ratios = svg.selectAll('text.combined-ratio')
      ratios.remove()
      ratios.data(labels)
        .enter().append('text')
          .attr({
            class : 'combined-ratio'
            , x : function(d){  
              return ratioLabelPos(d.row, 0).x
            }
            , y : function(d){ 
              return ratioLabelPos(d.row, 0).y
            }
          })
          .text(function(d){ return d.text })
          .style('opacity','0.0')
          .transition()
          .style('opacity','1.0')
          .style('font-weight', function(d){
            return col_maxs[d.col] === d.row ? 'bold' : 'normal'
          })
    }
    , tempo * 10
    // hide the combined ration labels
    , function(){
      var dur = 250
      var ratios = svg.selectAll('text.combined-ratio')
        .transition()
        .duration(dur)
        .style('opacity','0.0')
        .remove()
      return dur
    }
    // back to the original configuration
    , function(){
      var dur = tempo
      _.each(rows, function(row_val, row){
        _.each(cols, function(col_val, col){
          animFoci( cl(row, col) + '.foci-0', { x : w / (cols.length + 2) * (1 + col) - 30 }, dur)
          animFoci( cl(row, col) + '.foci-1', { x : w / (cols.length + 2) * (1 + col) + 30 }, dur)
        })
      })
      return dur
    }
    , function(){
      var dur = tempo
      _.each(rows, function(row_val, row){
        _.each(cols, function(col_val, col){
          animFoci( cl(row, col) + '.foci-0', { x : w / (cols.length + 2) * (col + 1) }, dur)
          animFoci( cl(row, col) + '.foci-1', { x : w / (cols.length + 2) * (col + 1) }, dur)
        })
      })
      return dur
    }
  ]
  // loop through the timeline
  , t = -1
  , forward = 1
  , back_and_forth = false // change to play the animation `back-and-forth`
  , loop = function(){
    if(back_and_forth){
      if(t >= timeline.length - 1) forward = -1
      else if (t <= 0) forward = 1
    }
    var now = timeline[t = (t + forward) % timeline.length]
    if(typeof now === 'function'){
      var dur = now()
      if(dur === undefined) dur = tempo
      setTimeout(loop, dur)
    }else setTimeout(loop, now)
  }

loop()

function animFoci(foci, pos, duration){
  if(duration === undefined) duration = 1000
  d3.selectAll(foci + '.foci')
    .transition()
    .duration(duration)
    .ease('cubic-in-out')
    .tween('dataTweet', function(d){
      if(!pos.x) pos.x = d.px
      if(!pos.y) pos.y = d.py
      var ix = d3.interpolate(d.x, pos.x)
      var iy = d3.interpolate(d.y, pos.y)
      return function(t){
        d.x = d.px = ix(t)
        d.y = d.py = iy(t)
      }
    })
  _.each(forces, function(force){
    force.start()
  })
}

// Labels

// todo: change root `em` size depending on window size
// d3.select('body').style('font-size', '1em')

// column headers
svg.selectAll('text.column-label')
  .data(cols.concat(['combined']))
  .enter().append('text')
    .attr({
      x : function(d, i){ return w / (cols.length + 2) * (i + 1) }
      , y : 20
      , anchor : 'middle'
      , class : 'column-label'
    }).text(function(d){ return d})

svg.selectAll('text.row-label')
  .data(rows)
  .enter().append('text')
    .attr({
      x : 70
      , y : function(d, i){ return h / (rows.length + 1) * (i + 1) }
      , anchor : 'right'
      , class : 'row-label'
    }).text(function(d){ return d})

svg.append('text')
  .text('1 ball = 10 people. ')
  .attr({
    x : 10
    , y : h - 10
    , class : 'legend-item1'
  })

