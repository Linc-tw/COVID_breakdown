
//-- Filename:
//--   border_statistics.js
//--
//-- Author:
//--   Chieh-An Lin

function BS_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 90, top: 2};
  
  GS_InitFig(wrap);
}

function BS_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr("border_statistics_title", "入出境人數統計");
    TT_AddStr("border_statistics_text", "逐月更新");
    TT_AddStr("border_statistics_button_1", "入境");
    TT_AddStr("border_statistics_button_2", "出境");
    TT_AddStr("border_statistics_button_3", "合計");
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr("border_statistics_title", "Statistiques frontalières");
    TT_AddStr("border_statistics_text", "Mise à jour mensuellement");
    TT_AddStr("border_statistics_button_1", "Arrivée");
    TT_AddStr("border_statistics_button_2", "Départ");
    TT_AddStr("border_statistics_button_3", "Total");
  }
  
  else { //-- En
    TT_AddStr("border_statistics_title", "Border Crossing");
    TT_AddStr("border_statistics_text", "Updated monthly");
    TT_AddStr("border_statistics_button_1", "Arrival");
    TT_AddStr("border_statistics_button_2", "Departure");
    TT_AddStr("border_statistics_button_3", "Both");
  }
}

function BS_FormatData(wrap, data) {
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
  var i, j, x, y, height, h_list, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    h_list = [];
    x = data[i]["date"];
    y = 0;
    date_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++)
      h_list.push(+data[i][col_tag_list[j]]);
    
    //-- Loop over column again
    for (j=0; j<nb_col; j++) {
      //-- Current value
      height = h_list[j];
      
      //-- Make data block
      block = {
        'x': x,
        'y0': y,
        'y1': y+height,
        'h_list': h_list.slice().reverse(),
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
  
  //-- Choose y_path
  var y_path;
  if (wrap.do_exit == 0)
    y_path = wrap.y_path_0;
  else if (wrap.do_exit == 1)
    y_path = wrap.y_path_1;
  else
    y_path = wrap.y_path_2;
  
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
  
  //-- Calculate last row which is not zero
  var last = data.length - 1;
  while (+data[last][col_tag_list[2]] == 0)
    last -= 1;
  
  //-- Get latest value as legend value
  var legend_value = [];
  for (j=0; j<nb_col; j++)
    legend_value.push(+data[last][col_tag_list[j]]);
    
  //-- Calculate latest value as legend value
  var air = +data[last]['airport'];
  while (air == 0) { //-- Avoid trailing 0 in `airport` column
    last -= 1;
    air = +data[last]['airport'];
  }
  var sea = +data[last]['seaport'];
  var ns  = +data[last]['not_specified'];
  var last_date = data[last]['date'];
  var legend_value = [air, sea, ns];
  
  //-- Save to wrapper
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

//-- Tooltip
function BS_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (GS_lang == 'zh-tw')
    col_label_list = ['機場', '港口', '無細節']
  else if (GS_lang == 'fr')
    col_label_list = ['Aéroports', 'Ports maritimes', 'Sans précisions']
  else
    col_label_list = ['Airports', 'Seaports', 'Not specified']
  
  //-- Define tooltip texts
  var tooltip_text = d.x;
  var sum = 0;
  var i, h;
  
  for (i=0; i<wrap.nb_col; i++) {
    h = d.h_list[i];
    if (h > 0) {
      tooltip_text += "<br>" + col_label_list[i] + " = " + h;
      sum += h;
    }
  }
  
  //-- Add text for sum
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

function BS_Plot(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.date_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- No xtick or xticklabel 
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat("");
  
  //-- Add x-axis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    
  //-- Define a 2nd x-axis for xtick & xticklabel
  var eps = 0.1
  var x_2 = d3.scaleLinear()
    .domain([-eps, wrap.date_list.length+eps])
    .range([0, wrap.width])
  
  //-- Define xtick & update xticklabel later
  var x_axis_2 = d3.axisBottom(x_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat("");
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + wrap.height + ")")
    .call(x_axis_2);
  
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
    .ticks(0)
    .tickSize(0);
  
  //-- Add 2nd y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2);
    
  //-- Add ylabel & update value later
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)");
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GS_wrap.c_list.slice(0, wrap.nb_col);
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
    .attr('y', y(0))
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {GS_MouseOver(wrap, d);})
    .on("mousemove", function (d) {BS_MouseMove(wrap, d);})
    .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.x_2 = x_2;
  wrap.color_list = color_list;
  wrap.bar = bar;
}

function BS_Replot(wrap) {
  //-- Define new xticklabel
  var x_axis_2 = d3.axisBottom(wrap.x_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update 2nd x-axis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(x_axis_2)
    .selectAll("text")
      .attr("transform", "translate(-20,15) rotate(-90)")
      .style("text-anchor", "end");
  
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Decide yticklabel format
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
    .duration(wrap.trans_delay)
    .call(y_axis);
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '旅客人數';
  else if (GS_lang == 'fr')
    ylabel = 'Nombre de voyageurs';
  else
    ylabel = 'Number of people';
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel);
    
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
    .attr('y', function (d) {return y(d.y1);})
    .attr('height', function (d) {return y(d.y0)-y(d.y1);});
    
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color_list = wrap.color_list.slice();
  legend_color_list.push('#000000');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  legend_value.push(sum);
  
  //-- Define legend label
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
      .attr("x", legend_pos.x)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "end")
  
  //-- Update legend label
  wrap.svg.selectAll(wrap.id+'_legend_label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("id", wrap.tag+"_legend_label")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "start")
  
  //-- Define legend title
  var legend_title;
  if (GS_lang == 'zh-tw')
    legend_title = ['於' + wrap.last_date];
  else if (GS_lang == 'fr')
    legend_title = ['Au ' + wrap.last_date];
  else
    legend_title = ['On ' + wrap.last_date];
  
  //-- Update legend title
  wrap.svg.selectAll(wrap.id+'_legend_title')
    .remove()
    .exit()
    .data(legend_title)
    .enter()
    .append("text")
      .attr("id", wrap.tag+"_legend_title")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", legend_pos.y+(legend_value.length+0.25)*legend_pos.dy)
      .style("fill", '#000000')
      .text(function (d) {return d;})
      .attr("text-anchor", "start")
}

//-- Load
function BS_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.do_exit])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      BS_FormatData(wrap, data);
      BS_Plot(wrap);
      BS_Replot(wrap);
    });
}

function BS_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.do_exit])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      BS_FormatData(wrap, data);
      BS_Replot(wrap);
    });
}

function BS_ButtonListener(wrap) {
  //-- Entry or exit or both
  $(document).on("change", "input:radio[name='" + wrap.tag + "_exit']", function (event) {
    GS_PressRadioButton(wrap, 'exit', wrap.do_exit, this.value);
    wrap.do_exit = this.value;
    BS_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.do_exit == 0)
      tag1 = 'arrival';
    else if (wrap.do_exit == 1)
      tag1 = 'departure';
    else
      tag1 = 'both';

    name = wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Replot
    BS_ResetText();
    BS_Replot(wrap);
  });
}

//-- Main
function BS_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.do_exit = document.querySelector("input[name='" + wrap.tag + "_exit']:checked").value;
  GS_PressRadioButton(wrap, 'exit', 0, wrap.do_exit); //-- 0 from .html

  //-- Load
  BS_InitFig(wrap);
  BS_ResetText();
  BS_Load(wrap);
  
  //-- Setup button listeners
  BS_ButtonListener(wrap);
}
