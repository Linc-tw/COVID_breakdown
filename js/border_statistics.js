
//-- Filename:
//--   border_statistics.js
//--
//-- Author:
//--   Chieh-An Lin

function BS_Make_Canvas(wrap) {
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
  
  var margin = {left: 90, right: 2, bottom: bottom, top: 2};
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

function BS_Format_Data(wrap, data) {
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
    y = 0;
    x = data[i]["date"];
    date_list.push(x);
    
    for (j=0; j<nb_col; j++) {
      height = +data[i][col_tag_list[j]];
      block = {
        'x': x,
        'y0': y,
        'y1': y + height,
        'height': height,
        'h1': +data[i][col_tag_list[nb_col-1]],
        'h2': +data[i][col_tag_list[nb_col-2]],
        'h3': +data[i][col_tag_list[nb_col-3]],
        'col': col_tag_list[j]
      };
        
      y += height;
      formatted_data.push(block);
    }
    
    y_max = Math.max(y_max, y);
    
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(GS_ISO_Date_To_MD_Date(x));
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  var y_path;
  if (wrap.do_exit == 0)      y_path = wrap.y_path_0;
  else if (wrap.do_exit == 1) y_path = wrap.y_path_1;
  else                        y_path = wrap.y_path_2;
  
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) ytick.push(i)
  
  //-- Calculate separate sum
  var last = data.length - 1;
  var air = +data[last]['airport'];
  while (air == 0) {
    last -= 1;
    air   = +data[last]['airport'];
  }
  
  var sea = +data[last]['seaport'];
  var ns  = +data[last]['not_specified'];
  var last_date = data[last]['date'];
  var legend_value = [air, sea, ns];
  
  wrap.formatted_data = formatted_data;
  wrap.date_list = date_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.last_date = last_date;
  wrap.legend_value = legend_value;
}

function BS_Mouse_Over(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function BS_Get_Tooltip_Pos(wrap, d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - wrap.corner[i][0])**2 + (d[1] - wrap.corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place the caption somewhere on the longest arm, parametrizaed by x_alpha & y_alpha
  var x_alpha = 0.1;
  var y_alpha = 0.5;
  var x_pos = d[0] * (1-x_alpha) + wrap.corner[i_max][0] * x_alpha;
  var y_pos = d[1] * (1-y_alpha) + wrap.corner[i_max][1] * y_alpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var card_hdr = 3.125*16; //-- Offset caused by card-header
  var svg_dim = d3.select(wrap.id).node().getBoundingClientRect();
  var x_aspect = (svg_dim.width - 2*buffer) / wrap.tot_width;
  var y_aspect = (svg_dim.height - 2*buffer) / wrap.tot_height;
  
  x_pos = (x_pos + wrap.margin.left) * x_aspect + buffer;
  y_pos = (y_pos + wrap.margin.top) * y_aspect + buffer + card_hdr + button;
  
  return [x_pos, y_pos];
}

function BS_Mouse_Move(wrap, d) {
  var new_pos = BS_Get_Tooltip_Pos(wrap, d3.mouse(d3.event.target));
  var tooltip_text;
  
  if (GS_lang == 'zh-tw')
    tooltip_text = d.x + "<br>機場 = " + d.h1+ "<br>港口 = " + d.h2 + "<br>無細節 = " + d.h3 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3)
  else if (GS_lang == 'fr')
    tooltip_text = d.x + "<br>Aéroports = " + d.h1+ "<br>Ports maritimes = " + d.h2 + "<br>Sans précisions = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  else
    tooltip_text = d.x + "<br>Airports = " + d.h1+ "<br>Seaports = " + d.h2 + "<br>Not specified = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function BS_Mouse_Leave(wrap, d) {
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function BS_Initialize(wrap) {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, wrap.width])
    .domain(wrap.date_list)
    .padding(0.2);
    
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
    .tickFormat(d3.format("d"));
  
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
  if (GS_lang == 'zh-tw') ylabel = '旅客人數';
  else if (GS_lang == 'fr') ylabel = 'Nombre de voyageurs';
  else ylabel = 'Number of people';
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var color_list = GS_var.c_list.slice(0, wrap.nb_col);
  var col_tag_list = wrap.col_tag_list.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return color(d.col);})
    .attr('x', function (d) {return x(d.x);})
    .attr('y', function (d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {BS_Mouse_Over(wrap, d);})
    .on("mousemove", function (d) {BS_Mouse_Move(wrap, d);})
    .on("mouseleave", function (d) {BS_Mouse_Leave(wrap, d);})

  wrap.color_list = color_list;
  wrap.bar = bar;
}

function BS_update(wrap) {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(".2s"));
  
  wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(y_axis);
  
  //-- Update bars
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(transDuration)
    .attr('y', function (d) {return y(d.y1);})
    .attr('height', function (d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  color_list = wrap.color_list.slice();
  color_list.push('#000000');
  
  //-- Legend - value
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  legend_value.push(sum);
  
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", legend_pos.x)
      .attr("y", function (d,i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
  
  //-- Legend - label
  var legend_label;
  if (GS_lang == 'zh-tw') {
    legend_label = ["機場", "港口", "無細節", "合計"];
  }
  else if (GS_lang == 'fr') {
    legend_label = ["Aéroports", "Ports maritimes", "Sans précisions", "Total"];
  }
  else {
    legend_label = ["Airports", "Seaports", "Not specified", 'Total'];
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
  
  //-- Legend - title
  var legend_title;
  if (GS_lang == 'zh-tw') {
    legend_title = ['於' + wrap.last_date];
  }
  else if (GS_lang == 'fr') {
    legend_title = ['Au ' + wrap.last_date];
  }
  else {
    legend_title = ['On ' + wrap.last_date];
  }
  
  wrap.svg.selectAll(wrap.id+'_legend_title')
    .remove()
    .exit()
    .data(legend_title)
    .enter()
    .append("text")
      .attr("id", wrap.tag+"_legend_title")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", legend_pos.y+4.25*legend_pos.dy)
      .style("fill", '#000000')
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}
