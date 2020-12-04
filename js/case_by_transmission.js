
//-- Filename:
//--   case_by_transmission.js
//--
//-- Author:
//--   Chieh-An Lin

function CBT_Make_Canvas(wrap) {
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

function CBT_Format_Data(wrap, data) {
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

  if (wrap.do_cumul == 1) {
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
        'h4': +data[i][col_tag_list[nb_col-4]],
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
  if (wrap.do_cumul == 1) {
    if (wrap.do_onset == 1) {
      if (wrap.y_max_fix_1_1 > 0) y_max = wrap.y_max_fix_1_1;
      y_path = wrap.y_path_1_1;
    }
    else {
      if (wrap.y_max_fix_1_0 > 0) y_max = wrap.y_max_fix_1_0;
      y_path = wrap.y_path_1_0;
    }
  }
  else {
    if (wrap.do_onset == 1) {
      if (wrap.y_max_fix_0_1 > 0) y_max = wrap.y_max_fix_0_1;
      y_path = wrap.y_path_0_1;
    }
    else {
      if (wrap.y_max_fix_0_0 > 0) y_max = wrap.y_max_fix_0_0;
      y_path = wrap.y_path_0_0;
    }
  }
  
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) ytick.push(i)
  
  //-- Calculate separate sum
  var imp, ind_link, ind_unlink, fle;
  
  if (wrap.do_cumul == 1) {
    imp = d3.max(formatted_data, function (d) {if (d.col == 'imported') return +d.height;});
    ind_link = d3.max(formatted_data, function (d) {if (d.col == 'linked') return +d.height;});
    ind_unlink = d3.max(formatted_data, function (d) {if (d.col == 'unlinked') return +d.height;});
    fle = d3.max(formatted_data, function (d) {if (d.col == 'fleet') return +d.height;});
  }
  else {
    imp = d3.sum(formatted_data, function (d) {if (d.col == 'imported') return +d.height;});
    ind_link = d3.sum(formatted_data, function (d) {if (d.col == 'linked') return +d.height;});
    ind_unlink = d3.sum(formatted_data, function (d) {if (d.col == 'unlinked') return +d.height;});
    fle = d3.sum(formatted_data, function (d) {if (d.col == 'fleet') return +d.height;});
  }
  var legend_value = [imp, ind_link, ind_unlink, fle];
  
  wrap.formatted_data = formatted_data;
  wrap.date_list = date_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

function CBT_Format_Data_2(wrap, data2) {
  var n_tot = 0;
  var i;
  
  for (i=0; i<data2.length; i++) {
    if (wrap.n_tot_key == data2[i]['key']) {
      n_tot = +data2[i]['value'];
      break;
    }
  }
  
  wrap.n_tot = n_tot;
}

function CBT_Mouse_Over(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function CBT_Get_Tooltip_Pos(wrap, d) {
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

function CBT_Mouse_Move(wrap, d) {
  var new_pos = CBT_Get_Tooltip_Pos(wrap, d3.mouse(d3.event.target));
  var tooltip_text;
  
  if (lang == 'zh-tw')
    tooltip_text = d.x + "<br>境外移入 = " + d.h1 + "<br>本土已知 = " + d.h2 + "<br>本土未知 = " + d.h3 + "<br>敦睦艦隊 = " + d.h4 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4)
  else if (lang == 'fr')
    tooltip_text = d.x + "<br>Importés = " + d.h1 + "<br>Locaux connus = " + d.h2 + "<br>Locaux inconnus = " + d.h3 + "<br>Flotte = " + d.h4 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4)
  else
    tooltip_text = d.x + "<br>Imported = " + d.h1 + "<br>Local linked = " + d.h2 + "<br>Local unlinked = " + d.h3 + "<br>Fleet = " + d.h4 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4)
  
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function CBT_Mouse_Leave(wrap, d) {
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function CBT_Initialize(wrap) {
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
  if (lang == 'zh-tw') ylabel = '案例數';
  else if (lang == 'fr') ylabel = 'Nombre de cas';
  else ylabel = 'Number of cases';
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
    .on("mouseover", function (d) {CBT_Mouse_Over(wrap, d);})
    .on("mousemove", function (d) {CBT_Mouse_Move(wrap, d);})
    .on("mouseleave", function (d) {CBT_Mouse_Leave(wrap, d);})

  wrap.color_list = color_list;
  wrap.bar = bar;
}

function CBT_Update(wrap) {
  var trans_duration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
  
  wrap.svg.select('.yaxis')
    .transition()
    .duration(trans_duration)
    .call(y_axis);
  
  //-- Update bars
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(trans_duration)
    .attr('y', function (d) {return y(d.y1);})
    .attr('height', function (d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  color_list = wrap.color_list.slice();
  if (wrap.do_onset == 1) color_list.push('#999999');
  color_list.push('#000000');
  
  //-- Legend - value
  var legend_pos = {x: 70, y: 45, dx: 12, dy: 30};
//   if (wrap.do_cumul == 0) {
//     if (lang == 'zh-tw') legend_pos.x = 530;
//     else if (lang == 'fr') legend_pos.x = 480;
//     else legend_pos.x = 410;
//   }
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  if (wrap.do_onset == 1) legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  wrap.svg.selectAll(".legend.value")
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
  var legend_label, legend_label_plus;
  if (lang == 'zh-tw') {
    legend_label = ["境外移入", "本土感染源已知", "本土感染源未知", '敦睦艦隊', "合計"];
    legend_label_plus = '無發病日資料';
  }
  else if (lang == 'fr') {
    legend_label = ["Importés", "Locaux & lien connu", "Locaux & lien inconnu", "Flotte diplomatique", "Total"];
    legend_label_plus = "Sans date début sympt.";
  }
  else {
    legend_label = ["Imported", "Local & linked to known cases", "Local & unlinked", 'Diplomatic fleet cluster', "Total"];
    legend_label_plus = 'No onset date';
  }
  if (wrap.do_onset == 1) legend_label.splice(wrap.nb_col, 0, legend_label_plus);
  
  wrap.svg.selectAll(".legend.label")
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
var CBT_latest_wrap = {};

//-- ID
CBT_latest_wrap.tag = 'case_by_transmission_latest'
CBT_latest_wrap.id = '#' + CBT_latest_wrap.tag

//-- File path
CBT_latest_wrap.data_path_list = [
  "processed_data/case_by_transmission_by_report_day.csv",
  "processed_data/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBT_latest_wrap.tooltip = d3.select(CBT_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBT_latest_wrap.n_tot_key = 'latest_total';
CBT_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
CBT_latest_wrap.r_list = GS_var.r_list_latest;
CBT_latest_wrap.y_max_factor = 1.2;
CBT_latest_wrap.y_max_fix_1_1 = 0;
CBT_latest_wrap.y_max_fix_1_0 = 0;
CBT_latest_wrap.y_max_fix_0_1 = 7.5;
CBT_latest_wrap.y_max_fix_0_0 = 0;
CBT_latest_wrap.y_path_1_1 = 20;
CBT_latest_wrap.y_path_1_0 = 50;
CBT_latest_wrap.y_path_0_1 = 2;
CBT_latest_wrap.y_path_0_0 = 5;

//-- Variables
CBT_latest_wrap.do_cumul = 0;
CBT_latest_wrap.do_onset = 0;

//-- Plot
function CBT_Latest_Plot() {
  d3.csv(CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset], function (error, data) {
    d3.csv(CBT_latest_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBT_Make_Canvas(CBT_latest_wrap);
      CBT_Format_Data(CBT_latest_wrap, data);
      CBT_Format_Data_2(CBT_latest_wrap, data2);
      CBT_Initialize(CBT_latest_wrap);
      CBT_Update(CBT_latest_wrap);
    });
  });
}

CBT_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CBT_latest_wrap.tag + "_doCumul']", function (event) {
  CBT_latest_wrap.do_cumul = this.value;
  data_path = CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_latest_wrap, data);
    CBT_Update(CBT_latest_wrap);
  });
});

$(document).on("change", "input:radio[name='" + CBT_latest_wrap.tag + "_doOnset']", function (event) {
  CBT_latest_wrap.do_onset = this.value
  data_path = CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_latest_wrap, data);
    CBT_Update(CBT_latest_wrap);
  });
});

//-- Save button
d3.select(CBT_latest_wrap.id + '_save').on('click', function() {
  var tag1, tag2;
  
  if (CBT_latest_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBT_latest_wrap.do_onset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBT_latest_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(CBT_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(CBT_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  CBT_Latest_Plot();
});
