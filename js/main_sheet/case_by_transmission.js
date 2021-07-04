
//-- Filename:
//--   case_by_transmission.js
//--
//-- Author:
//--   Chieh-An Lin

function CBT_InitFig(wrap) {
  GP_InitFig_Standard(wrap);
}

function CBT_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr("case_by_transmission_title", "各感染源之每日確診人數");
    LS_AddStr("case_by_transmission_button_1", "逐日");
    LS_AddStr("case_by_transmission_button_2", "累計");
    LS_AddStr("case_by_transmission_button_3", "確診日");
    LS_AddStr("case_by_transmission_button_4", "發病日");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr("case_by_transmission_title", "Cas confirmés par moyen de transmission");
    LS_AddStr("case_by_transmission_button_1", "Quotidiens");
    LS_AddStr("case_by_transmission_button_2", "Cumulés");
    LS_AddStr("case_by_transmission_button_3", "Date du diagnostic");
    LS_AddStr("case_by_transmission_button_4", "Date du début des sympt.");
  }
  
  else { //-- En
    LS_AddStr("case_by_transmission_title", "Confirmed Cases by Transmission Type");
    LS_AddStr("case_by_transmission_button_1", "Daily");
    LS_AddStr("case_by_transmission_button_2", "Cumulative");
    LS_AddStr("case_by_transmission_button_3", "Report date");
    LS_AddStr("case_by_transmission_button_4", "Onset date");
  }
}

function CBT_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = date, 1 = moving average
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var h_sum = []; //-- For legend
  var y_max = 0;
  var h, h_list;
  
  //-- Other variables
  var formatted_data = [];
  var moving_avg = [];
  var i, j, x, y, avg, block;

  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Initialize h_sum
  for (j=0; j<nb_col; j++)
    h_sum.push(0);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    h_list = [];
    x = row['date'];
    y = 0;
    avg = row['moving_avg'];
    x_list.push(x);
    
    if ('' == avg)
      moving_avg.push({x: x, y: NaN});
    else
      moving_avg.push({x: x, y: +avg});
    
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
        'col_ind': j
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
  
  //-- Calculate y_path
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks);
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.moving_avg = moving_avg;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = h_sum;
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
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['境外移入', '本土已知', '本土未知', '敦睦艦隊', '航空器', '未知']
  else if (LS_lang == 'fr')
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
      tooltip_text += '<br>' + col_label_list[i] + ' = ' + h;
      sum += h;
    }
  }
  
  //-- Add text for sum
  if (LS_lang == 'zh-tw')
    tooltip_text += '<br>合計 = ';
  else if (LS_lang == 'fr')
    tooltip_text += '<br>Total = ';
  else
    tooltip_text += '<br>Total = ';
  tooltip_text += sum;
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function CBT_Plot(wrap) {
  //-- Plot x
  GP_PlotDateAsX(wrap);
  
  //-- Plot y
  GP_PlotLinearY(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(0, wrap.nb_col);
  
  //-- Save to wrapper
  wrap.mouse_move = CBT_MouseMove;
  wrap.color_list = color_list;
  
  //-- Plot bar
  GP_PlotBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function CBT_Replot(wrap) {
  //-- Replot x
  GP_ReplotDateAsX(wrap);
  
  //-- Replot y
  GP_ReplotCountAsY(wrap);
  
  //-- Define ylabel
  var ylabel_dict = {en: 'Number of cases', fr: 'Nombre de cas', 'zh-tw': '案例數'};
  
  //-- Update ylabel
  wrap.svg.select('.ylabel')
    .text(ylabel_dict[LS_lang]);
    
  //-- Replot bar
  GP_ReplotBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
  //-- Define legend position
  var legend_pos = {x: 70, y: 45, dx: 12, dy: 30, x1: 240};
  if (wrap.cumul == 0) {
    if (wrap.legend_pos_x_0_i_[LS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_0_i_[LS_lang];
  }
  else {
    if (wrap.legend_pos_x_1_i_[LS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_1_i_[LS_lang];
  }
  if (wrap.legend_pos_x1_[LS_lang] != 0)
    legend_pos.x1 = wrap.legend_pos_x1_[LS_lang];
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  if (wrap.onset == 1)
    legend_color.push(GP_wrap.gray);
  legend_color.push('#000000');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  if (wrap.onset == 1)
    legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label, legend_label_plus;
  if (LS_lang == 'zh-tw') {
    legend_label = ['境外移入', '本土感染源已知', '本土感染源未知', '敦睦艦隊', '航空器', '未知', '合計 '+LS_GetYearLabel(wrap)];
    legend_label_plus = '無發病日資料';
  }
  else if (LS_lang == 'fr') {
    legend_label = ['Importés', 'Locaux & lien connu', 'Locaux & lien inconnu', 'En bateau', 'En avion', 'Inconnus', 'Total '+LS_GetYearLabel(wrap)];
    legend_label_plus = 'Sans date début sympt.';
  }
  else {
    legend_label = ['Imported', 'Local & linked', 'Local & unlinked', 'On boat', 'On plane', 'Unknown', 'Total '+LS_GetYearLabel(wrap)];
    legend_label_plus = 'No onset date';
  }
  if (wrap.onset == 1)
    legend_label.splice(wrap.nb_col, 0, legend_label_plus);
  
  //-- Remove from legend if value = 0
  var i;
  for (i=legend_value.length-1; i>=0; i--) {
    if (0 == legend_value[i]) {
      legend_color.splice(i, 1);
      legend_value.splice(i, 1);
      legend_label.splice(i, 1);
    }
  }
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', function (d, i) {return legend_pos.x + Math.floor(i/5)*legend_pos.x1;})
      .attr('y', function (d, i) {return legend_pos.y + (i%5)*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'end');
  
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', function (d, i) {return legend_pos.x + legend_pos.dx + Math.floor(i/5)*legend_pos.x1;})
      .attr('y', function (d, i) {return legend_pos.y + (i%5)*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start');
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
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    CBT_Reload(wrap);
  });

  //-- Report date or onset date
  $(document).on("change", "input:radio[name='" + wrap.tag + "_onset']", function (event) {
    GP_PressRadioButton(wrap, 'onset', wrap.onset, this.value);
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
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
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
  GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  GP_PressRadioButton(wrap, 'onset', 0, wrap.onset); //-- 0 from .html
  
  //-- Load
  CBT_InitFig(wrap);
  CBT_ResetText();
  CBT_Load(wrap);
  
  //-- Setup button listeners
  CBT_ButtonListener(wrap);
}
