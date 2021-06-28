
//-- Filename:
//--   case_by_detection.js
//--
//-- Author:
//--   Chieh-An Lin

function CBD_InitFig(wrap) {
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

function CBD_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr('case_by_detection_title', '各檢驗管道之每日確診人數');
    TT_AddStr('case_by_detection_button_1', '逐日');
    TT_AddStr('case_by_detection_button_2', '累計');
    TT_AddStr('case_by_detection_button_3', '確診日');
    TT_AddStr('case_by_detection_button_4', '發病日');
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr('case_by_detection_title', 'Cas confirmés par canal de détection');
    TT_AddStr('case_by_detection_button_1', 'Quotidiens');
    TT_AddStr('case_by_detection_button_2', 'Cumulés');
    TT_AddStr('case_by_detection_button_3', 'Date du diagnostic');
    TT_AddStr('case_by_detection_button_4', 'Date du début des sympt.');
  }
  
  else { //-- En
    TT_AddStr('case_by_detection_title', 'Confirmed Cases by Detection Channel');
    TT_AddStr('case_by_detection_button_1', 'Daily');
    TT_AddStr('case_by_detection_button_2', 'Cumulative');
    TT_AddStr('case_by_detection_button_3', 'Report date');
    TT_AddStr('case_by_detection_button_4', 'Onset date');
  }
}

function CBD_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var h_sum = []; //-- For legend
  var y_max = 0;
  var h, h_list;
  
  //-- Other variables
  var formatted_data = [];
  var i, j, x, y, block;
  
  //-- Convert data form
  if (wrap.cumul == 1)
    GS_CumSum(data, col_tag_list);
  
  //-- Initialize h_sum
  for (j=0; j<nb_col; j++)
    h_sum.push(0);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    h_list = [];
    x = row['date'];
    y = 0;
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++)
      h_list.push(+row[col_tag_list[j]]);
    
    //-- Loop over column again (reversed order)
    for (j=nb_col-1; j>=0; j--) {
      //-- Current value
      h = h_list[j];
      
      //-- Make data block
      block = {
        'x': x,
        'y0': y,
        'y1': y+h,
        'h_list': h_list.slice(),
        'col': col_tag_list[j]
      };
        
      //-- Update total height
      y += h;
      
      //-- Update sum
      if (wrap.cumul == 1)
        h_sum[j] = Math.max(h, h_sum[j]);
      else
        h_sum[j] += h;
      
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
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = h_sum;
}

function CBD_FormatData2(wrap, data2) {
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
function CBD_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.7;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (GS_lang == 'zh-tw')
    col_label_list = ['機場', '檢疫', '隔離', '自主健康管理', '自費或自行就醫', '外國檢驗', '無管道資料']
  else if (GS_lang == 'fr')
    col_label_list = ['Aéroports', 'Quarantaine', 'Isolation', 'Auto-contrôle', 'Hôpitaux', "À l'étranger", 'Pas annoncés']
  else
    col_label_list = ['Airports', 'Quarantine', 'Isolation', 'Monitoring', 'Hospitals', 'Overseas', 'Not announced']
  
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

function CBD_Plot(wrap) {
  //-- Define xscale
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- Define xscale_2 for xtick & xticklabel
  var eps = 0.1
  var xscale_2 = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Define xaxis & update xtick or xticklabel later
  var xaxis = d3.axisBottom(xscale_2)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis);
    
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yaxis for ytick & yticklabel
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('d'));
  
  //-- Add yaxis
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .call(yaxis);

  //-- Define yaxis_2 for the frameline at right
  var yaxis_2 = d3.axisRight(yscale)
    .ticks(0)
    .tickSize(0);
  
  //-- Add yaxis_2 & adjust position (no yaxis class)
  wrap.svg.append('g')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_2);
  
  //-- Add ylabel & update value later
  wrap.svg.append('text')
    .attr('class', 'ylabel')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (wrap.height/2).toString() + ')rotate(-90)');
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GS_wrap.c_list.slice(0, wrap.nb_col-1);
  color_list.push('#CCAAAA');
  var color = d3.scaleOrdinal()
    .domain(wrap.col_tag_list)
    .range(color_list);
    
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return color(d.col);})
    .attr('x', function (d) {return xscale(d.x);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0)
      .on('mouseover', function (d) {GS_MouseOver(wrap, d);})
      .on('mousemove', function (d) {CBD_MouseMove(wrap, d);})
      .on('mouseleave', function (d) {GS_MouseLeave(wrap, d);});
  
  //-- Save to wrapper
  wrap.xscale_2 = xscale_2;
  wrap.color_list = color_list;
  wrap.bar = bar;
}

function CBD_Replot(wrap) {
  //-- Define new xaxis for xticklabel
  var xaxis = d3.axisBottom(wrap.xscale_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-20,15) rotate(-90)')
      .style('text-anchor', 'end');
  
  //-- Define new yscale
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yticklabel format
  var yticklabel_format;
  if (wrap.ytick[wrap.ytick.length-1] > 9999) 
    yticklabel_format = '.2s';
  else
    yticklabel_format = 'd';
  
  //-- Define new yaxis for ytick
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(yticklabel_format));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis);
  
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
    .attr('y', function (d) {return yscale(d.y1);})
    .attr('height', function (d) {return yscale(d.y0)-yscale(d.y1);});
    
  //-- Define legend position
  var legend_pos = {x: 70, y: 40, dx: 10, dy: 30, x1: 190};
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
    legend_label = ['機場', '居家或集中檢疫', '居家隔離', '自主健康管理', '自費或自行就醫', '外國檢驗', '無檢驗管道資料', '合計 '+TT_GetYearLabel(wrap)];
    legend_label_plus = '無發病日資料';
  }
  else if (GS_lang == 'fr') {
    legend_label = ['Aéroports', 'Quarantaine', 'Isolation', 'Auto-contrôle', 'Hôpitaux', "À l'étranger", 'Pas annoncés', 'Total '+TT_GetYearLabel(wrap)];
    legend_label_plus = "Sans date début sympt.";
  }
  else {
    legend_label = ["Airports", "Quarantine", "Isolation", "Monitoring", "Hospitals", 'Overseas', 'Not announced', 'Total '+TT_GetYearLabel(wrap)];
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
      .style("font-size", '20px')
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
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .style("font-size", '20px')
      .attr("text-anchor", "start")
}

//-- Load
function CBD_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.onset])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      CBD_FormatData(wrap, data);
      CBD_FormatData2(wrap, data2);
      CBD_Plot(wrap);
      CBD_Replot(wrap);
    });
}

function CBD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.onset])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      CBD_FormatData(wrap, data);
      CBD_Replot(wrap);
    });
}

function CBD_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GS_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    CBD_Reload(wrap);
  });

  //-- Report date or onset date
  $(document).on("change", "input:radio[name='" + wrap.tag + "_onset']", function (event) {
    GS_PressRadioButton(wrap, 'onset', wrap.onset, this.value);
    wrap.onset = this.value
    CBD_Reload(wrap);
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
    CBD_ResetText();
    CBD_Replot(wrap);
  });
}

//-- Main
function CBD_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
  wrap.onset = document.querySelector("input[name='" + wrap.tag + "_onset']:checked").value;
  GS_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  GS_PressRadioButton(wrap, 'onset', 0, wrap.onset); //-- 0 from .html
  
  //-- Load
  CBD_InitFig(wrap);
  CBD_ResetText();
  CBD_Load(wrap);
  
  //-- Setup button listeners
  CBD_ButtonListener(wrap);
}
