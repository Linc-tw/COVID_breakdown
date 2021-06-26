
//-- Filename:
//--   case_by_transmission.js
//--
//-- Author:
//--   Chieh-An Lin

function CBT_InitFig(wrap) {
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

function CBT_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr("case_by_transmission_title", "各感染源之每日確診人數");
    TT_AddStr("case_by_transmission_button_1", "逐日");
    TT_AddStr("case_by_transmission_button_2", "累計");
    TT_AddStr("case_by_transmission_button_3", "確診日");
    TT_AddStr("case_by_transmission_button_4", "發病日");
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr("case_by_transmission_title", "Cas confirmés par moyen de transmission");
    TT_AddStr("case_by_transmission_button_1", "Quotidiens");
    TT_AddStr("case_by_transmission_button_2", "Cumulés");
    TT_AddStr("case_by_transmission_button_3", "Date du diagnostic");
    TT_AddStr("case_by_transmission_button_4", "Date du début des sympt.");
  }
  
  else { //-- En
    TT_AddStr("case_by_transmission_title", "Confirmed Cases by Transmission Type");
    TT_AddStr("case_by_transmission_button_1", "Daily");
    TT_AddStr("case_by_transmission_button_2", "Cumulative");
    TT_AddStr("case_by_transmission_button_3", "Report date");
    TT_AddStr("case_by_transmission_button_4", "Onset date");
  }
}

function CBT_FormatData(wrap, data) {
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
  var h_sum = [];
  var y_max = 0;
  var i, j, x, y, height, h_list, block;

  //-- Convert data form
  if (wrap.cumul == 1)
    GS_CumSum(data, col_tag_list);
  
  //-- Initialize h_sum
  for (j=0; j<nb_col; j++)
    h_sum.push(0);
  
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
    
      //-- Update sum
      if (wrap.cumul == 1)
        h_sum[j] = Math.max(height, h_sum[j]);
      else
        h_sum[j] += height;
      
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
  if (wrap.cumul == 1) {
    if (wrap.onset == 1) {
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
    if (wrap.onset == 1) {
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
  
  //-- Get respective sum
  var legend_value = h_sum.reverse();
  
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

function CBT_FormatData2(wrap, data2) {
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
function CBT_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (GS_lang == 'zh-tw')
    col_label_list = ['境外移入', '本土已知', '本土未知', '敦睦艦隊', '航空器', '未知']
  else if (GS_lang == 'fr')
    col_label_list = ['Importés', 'Locaux connus', 'Locaux inconnus', 'En bateau', 'En avion', 'Inconnus']
  else
    col_label_list = ['Imported', 'Local linked', 'Local unlinked', 'On boat', 'On plane', 'Unknown']
  
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

function CBT_Plot(wrap) {
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
    .on("mousemove", function (d) {CBT_MouseMove(wrap, d);})
    .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.x_2 = x_2;
  wrap.color_list = color_list;
  wrap.bar = bar;
}

function CBT_Replot(wrap) {
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
    .duration(wrap.trans_delay)
    .call(y_axis);
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (GS_lang == 'fr')
    ylabel = 'Nombre de cas';
  else
    ylabel = 'Number of cases';
  
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
  var legend_pos = {x: 70, y: 45, dx: 12, dy: 30, x1: 240};
  if (wrap.cumul == 0) {
    if (wrap.legend_pos_x_0_i_[GS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_0_i_[GS_lang];
  }
  else {
    if (wrap.legend_pos_x_1_i_[GS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_1_i_[GS_lang];
  }
  if (wrap.legend_pos_x1_[GS_lang] != 0)
    legend_pos.x1 = wrap.legend_pos_x1_[GS_lang];
  
  //-- Define legend color
  var legend_color_list = wrap.color_list.slice();
  if (wrap.onset == 1)
    legend_color_list.push(GS_wrap.gray);
  legend_color_list.push('#000000');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  if (wrap.onset == 1)
    legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label, legend_label_plus;
  if (GS_lang == 'zh-tw') {
    legend_label = ["境外移入", "本土感染源已知", "本土感染源未知", '敦睦艦隊', '航空器', '未知', "合計"];
    legend_label_plus = '無發病日資料';
  }
  else if (GS_lang == 'fr') {
    legend_label = ["Importés", "Locaux & lien connu", "Locaux & lien inconnu", "En bateau", "En avion", "Inconnus", "Total"];
    legend_label_plus = "Sans date début sympt.";
  }
  else {
    legend_label = ["Imported", "Local & linked", "Local & unlinked", 'On boat', "On plane", "Unknown", "Total"];
    legend_label_plus = 'No onset date';
  }
  if (wrap.onset == 1)
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
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "end");
  
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
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "start");
}

//-- Load
function CBT_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.onset])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      CBT_FormatData(wrap, data);
      CBT_FormatData2(wrap, data2);
      CBT_Plot(wrap);
      CBT_Replot(wrap);
    });
}

function CBT_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.onset])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      CBT_FormatData(wrap, data);
      CBT_Replot(wrap);
    });
}

function CBT_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GS_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    CBT_Reload(wrap);
  });

  //-- Report date or onset date
  $(document).on("change", "input:radio[name='" + wrap.tag + "_onset']", function (event) {
    GS_PressRadioButton(wrap, 'onset', wrap.onset, this.value);
    wrap.onset = this.value
    CBT_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function() {
    var tag1, tag2;
    
    if (wrap.cumul == 1)
      tag1 = 'cumulative';
    else
      tag1 = 'daily';
    
    if (wrap.onset == 1)
      tag2 = 'onset';
    else
      tag2 = 'report';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Replot
    CBT_ResetText();
    CBT_Replot(wrap);
  });
}

//-- Main
function CBT_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
  wrap.onset = document.querySelector("input[name='" + wrap.tag + "_onset']:checked").value;
  GS_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  GS_PressRadioButton(wrap, 'onset', 0, wrap.onset); //-- 0 from .html
  
  //-- Load
  CBT_InitFig(wrap);
  CBT_ResetText();
  CBT_Load(wrap);
  
  //-- Setup button listeners
  CBT_ButtonListener(wrap);
}
