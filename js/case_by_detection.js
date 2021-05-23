
//-- Filename:
//--   case_by_detection.js
//--
//-- Author:
//--   Chieh-An Lin

function CBD_Make_Canvas(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 90, top: 2};
  
  GS_Make_Canvas(wrap);
}

function CBD_Format_Data(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var nb_col = col_tag_list.length;
  var date_list = [];
  var formatted_data = [];
  
  //-- Other variables
  var y_max = 0;
  var i, j, x, y, height, block;
  
  //-- Convert data form
  if (wrap.do_cumul == 1)
    GS_CumSum(data, col_tag_list);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    y = 0;
    x = data[i]["date"];
    date_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(GS_ISO_Date_To_MD_Date(x));
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      //-- Current value
      height = +data[i][col_tag_list[j]];
      
      //-- Make data block
      block = {
        'x': x,
        'y0': y,
        'y1': y + height,
        'height': height,
        'h1': +data[i][col_tag_list[nb_col-1]],
        'h2': +data[i][col_tag_list[nb_col-2]],
        'h3': +data[i][col_tag_list[nb_col-3]],
        'h4': +data[i][col_tag_list[nb_col-4]],
        'h5': +data[i][col_tag_list[nb_col-5]],
        'h6': +data[i][col_tag_list[nb_col-6]],
        'h7': +data[i][col_tag_list[nb_col-7]],
        'col': col_tag_list[j]
      };
        
      //-- Update total height
      y += height;
      
      //-- Stock
      formatted_data.push(block);
    }
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Choose y_max & y_path
  var y_path;
  if (wrap.do_cumul == 1) {
    if (wrap.do_onset == 1) {
      if (wrap.y_max_fix_1_1 > 0)
        y_max = wrap.y_max_fix_1_1;
      y_path = wrap.y_path_1_1;
    }
    else {
      if (wrap.y_max_fix_1_0 > 0)
        y_max = wrap.y_max_fix_1_0;
      y_path = wrap.y_path_1_0;
    }
  }
  else {
    if (wrap.do_onset == 1) {
      if (wrap.y_max_fix_0_1 > 0)
        y_max = wrap.y_max_fix_0_1;
      y_path = wrap.y_path_0_1;
    }
    else {
      if (wrap.y_max_fix_0_0 > 0)
        y_max = wrap.y_max_fix_0_0;
      y_path = wrap.y_path_0_0;
    }
  }
  
  //-- Calculate y_path
  //-- If string, use it as nb of ticks
  var log_precision, precision;
  if (typeof y_path === 'string') {
    log_precision = Math.floor(Math.log10(y_max)) - 1;
    precision = Math.pow(10, log_precision);
    precision = Math.max(1, precision); //-- precision at least 1
    y_path = y_max / (+y_path + 0.5);
    y_path = Math.round(y_path / precision) * precision;
  }
  //-- Otherwise, do nothing
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Calculate respective sum
  var air, qt, iso, moni, hosp, over, no_data;
  if (wrap.do_cumul == 1) {
    air = d3.max(formatted_data, function (d) {if (d.col == 'airport') return +d.height;});
    qt = d3.max(formatted_data, function (d) {if (d.col == 'quarantine') return +d.height;});
    iso = d3.max(formatted_data, function (d) {if (d.col == 'isolation') return +d.height;});
    moni = d3.max(formatted_data, function (d) {if (d.col == 'monitoring') return +d.height;});
    hosp = d3.max(formatted_data, function (d) {if (d.col == 'hospital') return +d.height;});
    over = d3.max(formatted_data, function (d) {if (d.col == 'overseas') return +d.height;});
    no_data = d3.max(formatted_data, function (d) {if (d.col == 'no_data') return +d.height;});
  }
  else {
    air = d3.sum(formatted_data, function (d) {if (d.col == 'airport') return +d.height;});
    qt = d3.sum(formatted_data, function (d) {if (d.col == 'quarantine') return +d.height;});
    iso = d3.sum(formatted_data, function (d) {if (d.col == 'isolation') return +d.height;});
    moni = d3.sum(formatted_data, function (d) {if (d.col == 'monitoring') return +d.height;});
    hosp = d3.sum(formatted_data, function (d) {if (d.col == 'hospital') return +d.height;});
    over = d3.sum(formatted_data, function (d) {if (d.col == 'overseas') return +d.height;});
    no_data = d3.sum(formatted_data, function (d) {if (d.col == 'no_data') return +d.height;});
  }
  var legend_value = [air, qt, iso, moni, hosp, over, no_data];
  
  //-- Save to wrapper
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

function CBD_Format_Data_2(wrap, data2) {
  var n_tot = 0;
  var i;
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if (wrap.n_tot_key == data2[i]['key']) {
      n_tot = +data2[i]['value'];
      break;
    }
  }
  
  //-- Save to wrapper
  wrap.n_tot = n_tot;
}

//-- Tooltip
function CBD_Mouse_Move(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.7;
  var new_pos = GS_Get_Tooltip_Pos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Define tooltip texts
  var tooltip_text = d.x;
  var sum = 0;
  if (+d.h1 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>機場 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>Aéroports = ";
    else
      tooltip_text += "<br>Airports = ";
    tooltip_text += d.h1;
    sum += +d.h1;
  }
  if (+d.h2 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>居家或集中檢疫 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>Quarantaine = ";
    else
      tooltip_text += "<br>Quarantine = ";
    tooltip_text += d.h2;
    sum += +d.h2;
  }
  if (+d.h3 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>居家隔離 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>Isolation = ";
    else
      tooltip_text += "<br>Isolation = ";
    tooltip_text += d.h3;
    sum += +d.h3;
  }
  if (+d.h4 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>自主健康管理 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>Auto-contrôle = ";
    else
      tooltip_text += "<br>Monitoring = ";
    tooltip_text += d.h4;
    sum += +d.h4;
  }
  if (+d.h5 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>自費或自行就醫 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>Hôpitaux = ";
    else
      tooltip_text += "<br>Hospitals = ";
    tooltip_text += d.h5;
    sum += +d.h5;
  }
  if (+d.h6 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>外國檢驗 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>À l'étranger = ";
    else
      tooltip_text += "<br>Overseas = ";
    tooltip_text += d.h6;
    sum += +d.h6;
  }
  if (+d.h7 > 0) {
    if (GS_lang == 'zh-tw')
      tooltip_text += "<br>無管道資料 = ";
    else if (GS_lang == 'fr')
      tooltip_text += "<br>Pas annoncés = ";
    else
      tooltip_text += "<br>Not announced = ";
    tooltip_text += d.h7;
    sum += +d.h7;
  }
  if (GS_lang == 'zh-tw')
    tooltip_text += "<br>合計 = ";
  else if (GS_lang == 'fr')
    tooltip_text += "<br>Total = ";
  else
    tooltip_text += "<br>Total = ";
  tooltip_text += sum;
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function CBD_Initialize(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.date_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- No xtick or xticklabel 
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return ""});
  
  //-- Add x-axis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    
  //-- Define a 2nd x-axis for xtick & xticklabel
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.date_list.length])
    .range([0, wrap.width])
  
  //-- Define xtick & xticklabel
  var x_axis_2 = d3.axisBottom(x_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
    .selectAll("text")
      .attr("transform", "translate(-20,15) rotate(-90)")
      .style("text-anchor", "end")
  
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick & yticklabel
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format("d"));
  
  //-- Add y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis);

  //-- Define a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .tickSize(0);
  
  //-- Add 2nd y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2)
    
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (GS_lang == 'fr')
    ylabel = 'Nombre de cas';
  else
    ylabel = 'Number of cases';
  
  //-- Add ylabel
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Define color
  var color_list = GS_var.c_list.slice(0, wrap.nb_col-1);
  color_list.push('#CCAAAA')
  var col_tag_list = wrap.col_tag_list.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
    
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return color(d.col);})
    .attr('x', function (d) {return x(d.x);})
    .attr('y', function (d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {GS_Mouse_Over(wrap, d);})
    .on("mousemove", function (d) {CBD_Mouse_Move(wrap, d);})
    .on("mouseleave", function (d) {GS_Mouse_Leave(wrap, d);})
  
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.bar = bar;
}

function CBD_Update(wrap) {
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yticklabel format
  var yticklabel_format;
  if (wrap.ytick[wrap.ytick.length-1] > 9999) 
    yticklabel_format = ".2s";
  else
    yticklabel_format = "d";
  
  //-- Define ytick
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(yticklabel_format));
  
  //-- Update y-axis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_var.trans_duration)
    .call(y_axis);
  
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_var.trans_duration)
    .attr('y', function (d) {return y(d.y1);})
    .attr('height', function (d) {return y(d.y0)-y(d.y1);});
    
  //-- Define legend position
  var legend_pos;
  if (GS_lang == 'zh-tw')
    legend_pos = {x: 80, y: 40, dx: 12, dy: 30, x1: 220};
  else
    legend_pos = {x: 80, y: 40, dx: 12, dy: 30, x1: 190};
  if (wrap.do_cumul == 0) {
    if (wrap.legend_pos_x_0__[GS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_0__[GS_lang];
  }
  
  //-- Define legend color
  var legend_color_list = wrap.color_list.slice();
  legend_color_list.push('#000000');
  if (wrap.do_onset == 1)
    legend_color_list.splice(wrap.nb_col, 0, '#999999');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  if (wrap.do_onset == 1)
    legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label, legend_label_plus;
  if (GS_lang == 'zh-tw') {
    legend_label = ['機場', '居家或集中檢疫', '居家隔離', '自主健康管理', '自費或自行就醫', '外國檢驗', '無檢驗管道資料', '合計'];
    legend_label_plus = '無發病日資料';
  }
  else if (GS_lang == 'fr') {
    legend_label = ['Aéroports', 'Quarantaine', 'Isolation', 'Auto-contrôle', 'Hôpitaux', "À l'étranger", 'Pas annoncés', 'Total'];
    legend_label_plus = "Sans date début sympt.";
  }
  else {
    legend_label = ["Airports", "Quarantine", "Isolation", "Monitoring", "Hospitals", 'Overseas', 'Not announced', 'Total'];
    legend_label_plus = 'No onset date';
  }
  if (wrap.do_onset == 1)
    legend_label.splice(wrap.nb_col, 0, legend_label_plus);
  
  //-- Remove from legend if value = 0
  var i;
  for (i=legend_value.length-1; i>=0; i--) {
    if (0 == legend_value[i]) {
      legend_color_list.splice(i, 1);
      legend_value.splice(i, 1);
      legend_label.splice(i, 1);
    }
  }
  
  //-- Update legend value
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", function (d, i) {return legend_pos.x + Math.floor(i/5)*legend_pos.x1;})
      .attr("y", function (d, i) {return legend_pos.y + (i%5)*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
  
  //-- Update legend label
  wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", function (d, i) {return legend_pos.x + legend_pos.dx + Math.floor(i/5)*legend_pos.x1;})
      .attr("y", function (d, i) {return legend_pos.y + (i%5)*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}
