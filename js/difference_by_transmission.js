
//-- Filename:
//--   difference_by_transmission.js
//--
//-- Author:
//--   Chieh-An Lin

function DBT_Make_Canvas(wrap) {
  var tot_width = 800;
  var tot_height;
  if (GS_lang == 'zh-tw') {
    tot_height = 415;
    bottom = 90;
  }
  else if (GS_lang == 'fr') {
    tot_height = 400;
    bottom = 80;
  }
  else {
    tot_height = 400;
    bottom = 80;
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
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
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

function DBT_Format_Data(wrap, data) {
  //-- Settings for xticklabels
  var xlabel_path = 3;
  var r = 0;
  var xtick = [];
  var xticklabel = [];
  var y_max = 3;
  
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var diff_list = [];
  var i, j, x, y, height, block;
  
  for (i=0; i<31; i++) { //-- Was data.length; hard-coded now
    x = data[i]["difference"];
    y = data[i][col_tag];
    diff_list.push(x);
    
    y_max = Math.max(y_max, y);
    
    if (30 == i) {
      xtick.push(i+0.5)
      xticklabel.push('30+');
    }
    else if (i % xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  var y_path;
  if      (wrap.col_ind == 0) y_path = wrap.y_path_0;
  else if (wrap.col_ind == 1) y_path = wrap.y_path_1;
  else if (wrap.col_ind == 2) y_path = wrap.y_path_2;
  else                        y_path = wrap.y_path_3;
  
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) ytick.push(i)
  
  //-- Calculate separate sum
  var all = d3.sum(data, function (d) {return d['all'];});
  var imported = d3.sum(data, function (d) {return d['imported'];});
  var local = d3.sum(data, function (d) {return d['indigenous'];});
  var other = d3.sum(data, function (d) {return d['other'];});
  var legend_value = [all, imported, local, other];
  
  wrap.formatted_data = data;
  wrap.diff_list = diff_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

function DBT_Format_Data_2(wrap, data2) {
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

function DBT_Mouse_Over(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function DBT_Get_Tooltip_Pos(wrap, d) {
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
  var y_alpha = 0.35;
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

function DBT_Mouse_Move(wrap, d) {
  var new_pos = DBT_Get_Tooltip_Pos(wrap, d3.mouse(d3.event.target));
  var col_tag, col_tag_2, tooltip_text;
  
  if (GS_lang == 'zh-tw') {
    col_tag = wrap.col_tag_list[wrap.col_ind];
    if (col_tag == 'all') col_tag_2 = '全部';
    else if (col_tag == 'imported') col_tag_2 = '境外移入';
    else if (col_tag == 'indigenous') col_tag_2 = '本土';
    else if (col_tag == 'fleet') col_tag_2 = '其他';
    tooltip_text = col_tag_2 + '案例中有' + d[col_tag] + '位<br>發病或入境後' + d['difference'] + '日確診';
  }
  else if (GS_lang == 'fr') {
    col_tag = wrap.col_tag_list[wrap.col_ind];
    if (col_tag == 'all') col_tag_2 = "de l'ensemble des cas";
    else if (col_tag == 'imported') col_tag_2 = 'des cas importés';
    else if (col_tag == 'indigenous') col_tag_2 = 'des cas locaux';
    else if (col_tag == 'fleet') col_tag_2 = 'des autres cas';
    tooltip_text = d[col_tag] + ' ' + col_tag_2 + ' attend(ent)<br>' + d['difference'] + " jour(s) avant d'être identifié(s)";
  }
  else {
    col_tag = wrap.col_tag_list[wrap.col_ind];
    if (col_tag == 'indigenous') col_tag_2 = 'local';
    else col_tag_2 = col_tag;
    tooltip_text = d[col_tag] + ' of ' + col_tag_2 + ' cases required<br>' + d['difference'] + ' day(s) to be identified'
  }
  
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function DBT_Mouse_Leave(wrap, d) {
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function DBT_Initialize(wrap) {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, wrap.width])
    .domain(wrap.diff_list)
    .padding(0.2);
    
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    .selectAll("text")
      .attr("transform", "translate(0,15)")
      .style("text-anchor", "middle")
    
  //-- Add a 2nd x-axis for ticks
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.diff_list.length])
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
    
  //-- xlabel
  var xlabel;
  if (GS_lang == 'zh-tw') xlabel = '發病或入境後到確診所需天數';
  else if (GS_lang == 'fr') xlabel = "Nombre de jours avant identification";
  else xlabel = "Days required for each case to be identified";
  wrap.svg.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "bottom")
    .attr("transform", "translate(" + (wrap.width*0.5).toString() + ", " + (wrap.tot_height-0.2*wrap.margin.bottom).toString() + ")")
    .text(xlabel);
  
  //-- ylabel
  var ylabel;
  if (GS_lang == 'zh-tw') ylabel = '案例數';
  else if (GS_lang == 'fr') ylabel = 'Nombre de cas';
  else ylabel = 'Number of cases';
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var color_list = [GS_var.c_list[4], GS_var.c_list[0], GS_var.c_list[1], GS_var.c_list[3], '#999999', '#000000']; 
  var col_tag_list = wrap.col_tag_list.slice();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return color(col_tag_list[wrap.col_ind]);})
    .attr('x', function (d) {return x(d['difference']);})
    .attr('y', function (d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', function (d) {return 0;})
    .on("mouseover", function (d) {DBT_Mouse_Over(wrap, d);})
    .on("mousemove", function (d) {DBT_Mouse_Move(wrap, d);})
    .on("mouseleave", function (d) {DBT_Mouse_Leave(wrap, d);})

  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function DBT_Update(wrap) {
  var trans_duration = 800;
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format("d"));
  
  wrap.svg.select('.yaxis')
    .transition()
    .duration(trans_duration)
    .call(y_axis);
  
  //-- Update bars
  var col_tag_list = wrap.col_tag_list.slice();
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(trans_duration)
    .attr('fill', function (d) {return wrap.color(col_tag_list[wrap.col_ind]);})
    .attr('y', function (d) {return y(d[col_tag_list[wrap.col_ind]]);})
    .attr('height', function (d) {return y(0)-y(d[col_tag_list[wrap.col_ind]]);});
  
  //-- Legend
  var legend_pos = {x: 450, y: 45, dx: 12, dy: 30};
  var legend_color_list, legend_label, legend_label_2, legend_value_2;
  if (GS_lang == 'zh-tw')
    legend_label = ['有資料案例數', "境外移入", "本土", '其他', '資料不全', '合計'];
  else if (GS_lang == 'fr')
    legend_label = ['Données complètes', "Importés", "Locaux", 'Divers', 'Données incomplètes', 'Total'];
  else 
    legend_label = ['Data complete', 'Imported', 'Local', 'Others', 'Data incomplete', 'Total'];
  var legend_value = wrap.legend_value.slice(0);
  var sum = wrap.legend_value.slice(1).reduce((a, b) => a + b, 0);
  legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  if (wrap.col_ind == 0) {
    legend_color_list = [wrap.color_list[0], wrap.color_list[4], wrap.color_list[5]]
    legend_label_2 = [legend_label[0], legend_label[4], legend_label[5]]
    legend_value_2 = [legend_value[0], legend_value[4], legend_value[5]]
  }
  else {
    legend_color_list = [wrap.color_list[wrap.col_ind], wrap.color_list[5]]
    legend_label_2 = [legend_label[wrap.col_ind], legend_label[5]]
    legend_value_2 = [legend_value[wrap.col_ind], legend_value[5]]
  }
  
  //-- Legend - value
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value_2)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", legend_pos.x)
      .attr("y", function (d,i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return legend_color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
    
  //-- Legend - label
  wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label_2)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return legend_color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}
