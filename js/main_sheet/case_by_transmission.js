
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
    LS_AddStr("case_by_transmission_button_total", "合計");
    LS_AddStr("case_by_transmission_button_imported", "境外移入");
    LS_AddStr("case_by_transmission_button_local", "本土");
    LS_AddStr("case_by_transmission_button_others", "其他");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr("case_by_transmission_title", "Cas confirmés par moyen de transmission");
    LS_AddStr("case_by_transmission_button_1", "Quotidiens");
    LS_AddStr("case_by_transmission_button_2", "Cumulés");
    LS_AddStr("case_by_transmission_button_total", "Totaux");
    LS_AddStr("case_by_transmission_button_imported", "Importés");
    LS_AddStr("case_by_transmission_button_local", "Locaux");
    LS_AddStr("case_by_transmission_button_others", "Divers");
  }
  
  else { //-- En
    LS_AddStr("case_by_transmission_title", "Confirmed Cases by Transmission Type");
    LS_AddStr("case_by_transmission_button_1", "Daily");
    LS_AddStr("case_by_transmission_button_2", "Cumulative");
    LS_AddStr("case_by_transmission_button_total", "Total");
    LS_AddStr("case_by_transmission_button_imported", "Imported");
    LS_AddStr("case_by_transmission_button_local", "Local");
    LS_AddStr("case_by_transmission_button_others", "Others");
  }
}

function CBT_FormatData(wrap, data) {
  //-- Variables for xtick
  var x_key = 'date';
  var q, r;
  if (wrap.tag.includes('overall'))
    r = 999;
  else {
    q = data.length % wrap.xlabel_path;
    r = wrap.r_list[q];
  }
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 5); //-- 0 = date
  var col_tag = col_tag_list[wrap.col_ind];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var y_sum = []; //-- For legend
  var y_max = 4.5;
  
  //-- Other variables
  var i, j, x, y, avg;

  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Initialize y_sum
  for (j=0; j<nb_col; j++)
    y_sum.push(0);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    if ('' == avg)
      row[col_tag_avg] = NaN;
    else
      row[col_tag_avg] = +avg;
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Update y_sum
    for (j=0; j<nb_col; j++) {
      if (wrap.cumul == 0)
        y_sum[j] += +row[col_tag_list[j]];
      else 
        y_sum[j] = Math.max(y_sum[j], +row[col_tag_list[j]]);
    }
    
    y = +row[col_tag];
    
    //-- Modify data
    if (wrap.cumul == 1)
      row[col_tag_avg] = y;
      
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
  
  //-- Make legend value
  var legend_value = y_sum.slice(1, nb_col);
  legend_value.push(y_sum[0]);
    
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.col_tag = col_tag;
  wrap.col_tag_avg = col_tag_avg;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

function CBT_FormatData2(wrap, data2) {
  var i, timestamp;
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      timestamp = data2[i]['value'];
  }
  
  //-- Save to wrapper
  wrap.timestamp = timestamp;
}

//-- Tooltip
function CBT_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw') {
    col_label_list = ['合計', '境外移入', '本土', '其他'];
    avg_text = '過去七日平均';
  }
  else if (LS_lang == 'fr') {
    col_label_list = ['Totaux', 'Importés', 'Locaux', 'Divers'];
    avg_text = 'Moyenne sur 7 jours';
  }
  else {
    col_label_list = ['Total', 'Imported', 'Local', 'Others'];
    avg_text = '7-day average';
  }
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[wrap.col_ind] + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag]);
  tooltip_text += '<br>' + avg_text + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function CBT_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
    
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[0];
  
  //-- Define mouse-move
  wrap.mouse_move = CBT_MouseMove;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);
  
  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function CBT_Replot(wrap) {
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap);
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap);
  
  //-- Replot ylabel
  var ylabel_dict = {en: 'Number of cases', fr: 'Nombre de cas', 'zh-tw': '案例數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Replot bar
  GP_ReplotFaintSingleBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 10, dy: 27, x1: wrap.legend_pos_x1_[LS_lang]};
  
  //-- Define legend color
  var legend_color = [];
  var i;
  for (i=0; i<wrap.nb_col; i++)
    legend_color.push(GP_wrap.gray);
  i = (wrap.nb_col + wrap.col_ind - 1) % wrap.nb_col;
  legend_color[i] = wrap.color;
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['境外移入', '本土', '其他', '合計'];
  else if (LS_lang == 'fr')
    legend_label = ['Importés', 'Locaux', 'Divers', 'Total'];
  else
    legend_label = ['Imported', 'Local', 'Others', 'Total'];
  
  //-- Remove from legend if value = 0
  for (i=legend_value.length-1; i>=0; i--) {
    if (0 == legend_value[i]) {
      legend_color.splice(i, 1);
      legend_value.splice(i, 1);
      legend_label.splice(i, 1);
    }
  }
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label.splice(0, 0, LS_GetLegendTitle_Page(wrap));
  var legend_length = legend_color.length;
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', function (d, i) {return GP_GetLegendXPos(legend_pos, legend_length, i);})
      .attr('y', function (d, i) {return GP_GetLegendYPos(legend_pos, legend_length, i);})
      .attr('text-anchor', 'end')
      .style('fill', function (d, i) {return legend_color[i];})
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
  
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', function (d, i) {return GP_GetLegendXPos(legend_pos, legend_length, i) + legend_pos.dx;})
      .attr('y', function (d, i) {return GP_GetLegendYPos(legend_pos, legend_length, i);})
      .attr('text-anchor', 'start')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', function (d, i) {return legend_color[i];})
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
}

//-- Load
function CBT_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
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
    .defer(d3.csv, wrap.data_path_list[0])
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
  
  //-- Transmission type
  d3.select(wrap.id +'_trans').on('change', function() {
    wrap.col_ind = this.value;
    CBT_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function() {
    var tag1, tag2;
    
    if (wrap.col_ind == 0)
      tag1 = 'total';
    else if (wrap.col_ind == 1)
      tag1 = 'imported';
    else if (wrap.col_ind == 2)
      tag1 = 'local';
    else
      tag1 = 'others';
    
    if (wrap.cumul == 1)
      tag2 = 'cumulative';
    else
      tag2 = 'daily';
    
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
  GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  wrap.col_ind = document.getElementById(wrap.tag + "_trans").value;
  
  //-- Load
  CBT_InitFig(wrap);
  CBT_ResetText();
  CBT_Load(wrap);
  
  //-- Setup button listeners
  CBT_ButtonListener(wrap);
}
