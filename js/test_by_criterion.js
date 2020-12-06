
//-- Filename:
//--   test_by_criterion.js
//--
//-- Author:
//--   Chieh-An Lin

function TBC_Make_Canvas(wrap) {
  var tot_width = 800;
  var tot_height;
  if (lang == 'zh-tw') {
    tot_height = 415;
    bottom = 105;
  }
  else if (lang == 'fr') {
    tot_height = 400;
    bottom = 90;
  }
  else {
    tot_height = 400;
    bottom = 90;
  }
  
  var margin = {left: 110, right: 2, bottom: bottom, top: 2};
  var width = tot_width - margin.left - margin.right;
  var height = tot_height - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(TBC_latest_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + tot_width + " " + tot_height)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  TBC_latest_wrap.tot_width = tot_width;
  TBC_latest_wrap.tot_height = tot_height;
  TBC_latest_wrap.margin = margin;
  TBC_latest_wrap.width = width;
  TBC_latest_wrap.height = height;
  TBC_latest_wrap.corner = corner;
  TBC_latest_wrap.svg = svg;
}

function TBC_Format_Data(wrap, data) {
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

  if (TBC_latest_wrap.doCumul == 1) {
    GS_CumSum(data, col_tag_list);
  }
  
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
      xticklabel.push(ISODateToMDDate(x));
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  var y_path;
  if (TBC_latest_wrap.doCumul == 1) y_path = wrap.y_path_1;
  else                              y_path = wrap.y_path_0;
  
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) ytick.push(i)
  
  //-- Calculate seperate sum
  var ext, qt, clin;
  if (TBC_latest_wrap.doCumul == 1) {
    ext = d3.max(formatted_data, function (d) {if (d.col == 'extended') return +d.height;});
    qt = d3.max(formatted_data, function (d) {if (d.col == 'quarantine') return +d.height;});
    clin = d3.max(formatted_data, function (d) {if (d.col == 'clinical') return +d.height;});
  }
  else {
    ext = d3.sum(formatted_data, function (d) {if (d.col == 'extended') return +d.height;});
    qt = d3.sum(formatted_data, function (d) {if (d.col == 'quarantine') return +d.height;});
    clin = d3.sum(formatted_data, function (d) {if (d.col == 'clinical') return +d.height;});
  }
  var legend_value = [ext, qt, clin];
  
  TBC_latest_wrap.formatted_data = formatted_data;
  TBC_latest_wrap.date_list = date_list;
  TBC_latest_wrap.col_tag_list = col_tag_list;
  TBC_latest_wrap.nb_col = nb_col;
  TBC_latest_wrap.y_max = y_max;
  TBC_latest_wrap.xtick = xtick;
  TBC_latest_wrap.xticklabel = xticklabel;
  TBC_latest_wrap.ytick = ytick;
  TBC_latest_wrap.legend_value = legend_value;
}

function TBC_Mouse_Over(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function TBC_Get_Tooltip_Pos(wrap, d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - TBC_latest_wrap.corner[i][0])**2 + (d[1] - TBC_latest_wrap.corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place the caption somewhere on the longest arm, parametrizaed by x_alpha & y_alpha
  var x_alpha = 0.1;
  var y_alpha = 0.5;
  var x_pos = d[0] * (1-x_alpha) + TBC_latest_wrap.corner[i_max][0] * x_alpha;
  var y_pos = d[1] * (1-y_alpha) + TBC_latest_wrap.corner[i_max][1] * y_alpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var card_hdr = 3.125*16; //-- Offset caused by card-header
  var svg_dim = d3.select(TBC_latest_wrap.id).node().getBoundingClientRect();
  var x_aspect = (svg_dim.width - 2*buffer) / TBC_latest_wrap.tot_width;
  var y_aspect = (svg_dim.height - 2*buffer) / TBC_latest_wrap.tot_height;
  
  x_pos = (x_pos + TBC_latest_wrap.margin.left) * x_aspect + buffer;
  y_pos = (y_pos + TBC_latest_wrap.margin.top) * y_aspect + buffer + card_hdr + button;
  
  return [x_pos, y_pos];
}

function TBC_Mouse_Move(wrap, d) {
  var new_pos = TBC_Get_Tooltip_Pos(wrap, d3.mouse(d3.event.target));
  var tooltip_text;
  
  if (lang == 'zh-tw')
    tooltip_text = d.x + "<br>法定通報 = " + d.h3 + "<br>居家檢疫 = " + d.h2 + "<br>擴大監測 = " + d.h1 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3)
  else if (lang == 'fr')
    tooltip_text = d.x + "<br>Clinique = " + d.h3 + "<br>Quarantine = " + d.h2 + "<br>Clusters locaux = " + d.h1 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  else
    tooltip_text = d.x + "<br>Clinical = " + d.h3 + "<br>Quarantine = " + d.h2 + "<br>Community = " + d.h1 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function TBC_Mouse_Leave(wrap, d) {
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function TBC_Initialize(wrap) {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, TBC_latest_wrap.width])
    .domain(TBC_latest_wrap.date_list)
    .padding(0.2);
    
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return TBC_latest_wrap.xticklabel[i]});
  
  TBC_latest_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + TBC_latest_wrap.height + ')')
    .call(x_axis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x_2 = d3.scaleLinear()
    .domain([0, TBC_latest_wrap.date_list.length])
    .range([0, TBC_latest_wrap.width])
  
  var x_axis_2 = d3.axisBottom(x_2)
    .tickValues(TBC_latest_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function (d, i) {return ""});
  
  TBC_latest_wrap.svg.append("g")
    .attr("transform", "translate(0," + TBC_latest_wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, TBC_latest_wrap.y_max])
    .range([TBC_latest_wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-TBC_latest_wrap.width)
    .tickValues(TBC_latest_wrap.ytick)
  
  TBC_latest_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis)

  //-- Add a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  TBC_latest_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + TBC_latest_wrap.width + ",0)")
    .call(y_axis_2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '檢驗數';
  else if (lang == 'fr') ylabel = 'Nombre de tests';
  else ylabel = 'Number of tests';
  TBC_latest_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-TBC_latest_wrap.margin.left*0.75).toString() + ", " + (TBC_latest_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var color_list = GS_var.c_list.slice(0, TBC_latest_wrap.nb_col);
  var col_tag_list = TBC_latest_wrap.col_tag_list.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list.slice().reverse());
  
  //-- Bar
  var bar = TBC_latest_wrap.svg.selectAll('.content.bar')
    .data(TBC_latest_wrap.formatted_data)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return color(d.col);})
    .attr('x', function (d) {return x(d.x);})
    .attr('y', function (d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {TBC_Mouse_Over(wrap, d);})
    .on("mousemove", function (d) {TBC_Mouse_Move(wrap, d);})
    .on("mouseleave", function (d) {TBC_Mouse_Leave(wrap, d);})

  TBC_latest_wrap.color_list = color_list;
  TBC_latest_wrap.bar = bar;
}

function TBC_Update(wrap) {
  var trans_duration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, TBC_latest_wrap.y_max])
    .range([TBC_latest_wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-TBC_latest_wrap.width)
    .tickValues(TBC_latest_wrap.ytick)
  
  TBC_latest_wrap.svg.select('.yaxis')
    .transition()
    .duration(trans_duration)
    .call(y_axis);
  
  //-- Update bars
  TBC_latest_wrap.bar.selectAll('.content.bar')
    .data(TBC_latest_wrap.formatted_data)
    .transition()
    .duration(trans_duration)
    .attr('y', function (d) {return y(d.y1);})
    .attr('height', function (d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  color_list = TBC_latest_wrap.color_list.slice();
  color_list.push('#000000');
  
  //-- Legend - value
  var legend_pos = {x: 95, y: 40, dx: 12, dy: 30};
  if (TBC_latest_wrap.doCumul == 0) {
    if (lang == 'zh-tw') legend_pos.x = 510;
    else if (lang == 'fr') legend_pos.x = 95; //300
    else legend_pos.x = 350;
  }
  var legend_value = TBC_latest_wrap.legend_value.slice().reverse();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  legend_value.push(sum);
  
  TBC_latest_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", legend_pos.x)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
      
  //-- Legend - label
  var legend_label;
  if (lang == 'zh-tw') legend_label = ["法定定義通報", "居家檢疫", "擴大社區監測", "合計"];
  else if (lang == 'fr') legend_label = ["Critères cliniques", "Quarantaine (fusionnée dans clinique)", "Recherche de clusters locaux", "Total"];
  else legend_label = ['Suspicious clinical cases', 'Quarantine (merged into clinical)', 'Community monitoring', "Total"];
  
  TBC_latest_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}

//-- Global variable
var TBC_latest_wrap = {};

//-- ID
TBC_latest_wrap.tag = "test_by_criterion"
TBC_latest_wrap.id = '#' + TBC_latest_wrap.tag

//-- File path
TBC_latest_wrap.dataPath = "processed_data/test_by_criterion.csv";

//-- Tooltip
TBC_latest_wrap.tooltip = d3.select(TBC_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
TBC_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
TBC_latest_wrap.r_list = GS_var.r_list_latest;
TBC_latest_wrap.y_max_factor = 1.3;
TBC_latest_wrap.y_path_1 = 6000;
TBC_latest_wrap.y_path_0 = 250;

//-- Variables
TBC_latest_wrap.doCumul = 0;;

//-- Plot
function TBC_Latest_Plot() {
  d3.csv(TBC_latest_wrap.dataPath, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Make_Canvas(TBC_latest_wrap);
    TBC_Format_Data(TBC_latest_wrap, data);
    TBC_Initialize(TBC_latest_wrap);
    TBC_Update(TBC_latest_wrap);
  });
}

TBC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + TBC_latest_wrap.tag + "_doCumul']", function (event) {
  TBC_latest_wrap.doCumul = this.value;
  
  d3.csv(TBC_latest_wrap.dataPath, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Format_Data(TBC_latest_wrap, data);
    TBC_Update(TBC_latest_wrap);
  });
});

//-- Save button
d3.select(TBC_latest_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (TBC_latest_wrap.doCumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  
  name = TBC_latest_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(TBC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='policy_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(TBC_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  TBC_Latest_Plot();
});
