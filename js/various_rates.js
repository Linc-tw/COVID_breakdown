
//-- Filename:
//--   various_rates.js
//--
//-- Author:
//--   Chieh-An Lin

function VR_Make_Canvas(wrap) {
  var tot_width = 800;
  var tot_height;
  if (GS_lang == 'zh-tw') {
    tot_height = 415;
    bottom = 105;
  }
  else if (GS_lang == 'fr') {
    tot_height = 400;
    bottom = 90;
  }
  else {
    tot_height = 400;
    bottom = 90;
  }
  
  var margin = {left: 70, right: 2, bottom: bottom, top: 2};
  var width = tot_width - margin.left - margin.right;
  var height = tot_height - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + tot_width + " " + tot_height)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  wrap.tot_width = tot_width;
  wrap.tot_height = tot_height;
  wrap.margin = margin;
  wrap.width = width;
  wrap.height = height;
  wrap.corner = corner;
  wrap.svg = svg;
}

function VR_Format_Data(wrap, data) {
  //-- Settings for xticklabels
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  var y_max = 0;
  
  var col_tag_list = data.columns.slice(1);
  var nb_col = col_tag_list.length;
  var date_list = [];
  var formatted_data = [];
  var i, j, x, y, height, block;
  
  for (i=0; i<data.length; i++) {
    x = data[i]["date"];
    date_list.push(x);
    
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(GS_ISO_Date_To_MD_Date(x));
    }
    else {
      xticklabel.push("");
    }
  }
  
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    for (i=0; i<data.length; i++) {
      y = +data[i][col];
      block = {
        'x': data[i]["date"],
        'y': y
      };
      
      y_max = Math.max(y_max, y);
      block2.push(block);
    }
    
    formatted_data.push({'col': col, 'values': block2});
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  if (wrap.y_max_fix > 0) y_max = wrap.y_max_fix;
  var y_path = wrap.y_path;
  
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) ytick.push(i)
  
  wrap.formatted_data = formatted_data;
  wrap.date_list = date_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
}

// function VR_Mouse_Over(wrap, d) {
//   wrap.tooltip.transition()
//     .duration(200)
//     .style("opacity", 0.9)
//   d3.select(d3.event.target)
//     .style("opacity", 0.8)
// }
// 
// function VR_Get_Tooltip_Pos(wrap, d) {
//   var l_max = 0;
//   var i_max = -1;
//   var i, l;
//   
//   //-- Look for the furthest vertex
//   for (i=0; i<4; i++) {
//     l = (d[0] - wrap.corner[i][0])**2 + (d[1] - wrap.corner[i][1])**2;
//     if (l > l_max) {
//       l_max = l;
//       i_max = i;
//     }
//   }
//   
//   //-- Place the caption somewhere on the longest arm, parametrizaed by x_alpha & y_alpha
//   var x_alpha = 0.1;
//   var y_alpha = 0.5;
//   var x_pos = d[0] * (1-x_alpha) + wrap.corner[i_max][0] * x_alpha;
//   var y_pos = d[1] * (1-y_alpha) + wrap.corner[i_max][1] * y_alpha;
//   
//   var buffer = 1.25*16; //-- Margin buffer of card-body
//   var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
//   var card_hdr = 3.125*16; //-- Offset caused by card-header
//   var svg_dim = d3.select(wrap.id).node().getBoundingClientRect();
//   var x_aspect = (svg_dim.width - 2*buffer) / wrap.tot_width;
//   var y_aspect = (svg_dim.height - 2*buffer) / wrap.tot_height;
//   
//   x_pos = (x_pos + wrap.margin.left) * x_aspect + buffer;
//   y_pos = (y_pos + wrap.margin.top) * y_aspect + buffer + card_hdr + button;
//   
//   return [x_pos, y_pos];
// }

// function VR_Mouse_Move(wrap, d) {
//   var new_pos = VR_Get_Tooltip_Pos(wrap, d3.mouse(d3.event.target));
//   var tooltip_text;
//   
//   if (GS_lang == 'zh-tw')
//     tooltip_text = d.x + "<br>機場 = " + d.h1+ "<br>港口 = " + d.h2 + "<br>無細節 = " + d.h3 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3)
//   else if (GS_lang == 'fr')
//     tooltip_text = d.x + "<br>Aéroports = " + d.h1+ "<br>Ports maritimes = " + d.h2 + "<br>Sans précisions = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
//   else
//     tooltip_text = d.x + "<br>Airports = " + d.h1+ "<br>Seaports = " + d.h2 + "<br>Not specified = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
//   
//   wrap.tooltip
//     .html(tooltip_text)
//     .style("left", new_pos[0] + "px")
//     .style("top", new_pos[1] + "px")
// }
// 
// function VR_Mouse_Leave(wrap, d) {
//   wrap.tooltip.transition()
//     .duration(10)
//     .style("opacity", 0)
//   d3.select(d3.event.target)
//     .style("opacity", 1)
// }

function VR_Initialize(wrap) {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, wrap.width])
    .domain(wrap.date_list);
    
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.date_list.length])
    .range([0, wrap.width])
  
  var x_axis_2 = d3.axisBottom(x_2)
    .tickValues(wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function (d, i) {return ""});
  
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(".0%"));
  
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis)

  //-- Add a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2)
    
  //-- ylabel
  var ylabel;
  if (GS_lang == 'zh-tw') ylabel = '比率';
  else if (GS_lang == 'fr') ylabel = 'Taux';
  else ylabel = 'Rate';
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var color_list = GS_var.c_list.slice(0, wrap.nb_col);
  var col_tag_list = wrap.col_tag_list.slice();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Line
  var draw_line_0 = d3.line()
    .x(function (d) {return x(d.x);})
    .y(function (d) {return y(0);});
  
  var draw_line = d3.line()
    .x(function (d) {return x(d.x);})
    .y(function (d) {return y(d.y);});
  
  var line = wrap.svg.selectAll('.content.line')
    .data(wrap.formatted_data)
    .enter();
    
  line.append('path')
      .attr('class', 'content line')
      .attr('d', function (d) {return draw_line_0(d.values);})
      .style('stroke', function (d) {return color(d.col);})
      .style('stroke-width', '2.5px')
      .style("fill", 'none');
//       .on("mouseover", function (d) {VR_Mouse_Over(wrap, d);})
//       .on("mousemove", function (d) {VR_Mouse_Move(wrap, d);})
//       .on("mouseleave", function (d) {VR_Mouse_Leave(wrap, d);})

  wrap.color_list = color_list;
  wrap.draw_line = draw_line;
  wrap.line = line;
}

function VR_update(wrap) {
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(".0%"));
  
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_var.trans_duration)
    .call(y_axis);
  
  //-- Update lines
  wrap.line.selectAll('.content.line')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_var.trans_duration)
    .attr('d', function (d) {return wrap.draw_line(d.values);});

  //-- Legend - label
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  var legend_label;
  if (GS_lang == 'zh-tw') {
    legend_label = ["陽性率", "入境盛行率", "本土盛行率"];
  }
  else if (GS_lang == 'fr') {
    legend_label = ["Taux de positivité", "Taux d'incidence frontalier", "Taux d'incidence local"];
  }
  else {
    legend_label = ["Positive rate", "Arrival incidence rate", "Indigenous incidence rate"];
  }
  
  wrap.svg.selectAll(wrap.id+'_legend_label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("id", wrap.tag+"_legend_label")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}
