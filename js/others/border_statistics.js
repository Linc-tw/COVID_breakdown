
//-- Filename:
//--   border_statistics.js
//--
//-- Author:
//--   Chieh-An Lin

function BS_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function BS_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('border_statistics_title', '入出境人數統計');
    LS_AddStr('border_statistics_text', '逐月更新');
    LS_AddStr('border_statistics_button_entry', '入境');
    LS_AddStr('border_statistics_button_exit', '出境');
    LS_AddStr('border_statistics_button_total', '合計');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('border_statistics_title', 'Statistiques frontalières');
    LS_AddStr('border_statistics_text', 'Mise à jour mensuellement');
    LS_AddStr('border_statistics_button_entry', 'Arrivées');
    LS_AddStr('border_statistics_button_exit', 'Départs');
    LS_AddStr('border_statistics_button_total', 'Totaux');
  }
  
  else { //-- En
    LS_AddStr('border_statistics_title', 'Border Crossing');
    LS_AddStr('border_statistics_text', 'Updated monthly');
    LS_AddStr('border_statistics_button_entry', 'Arrival');
    LS_AddStr('border_statistics_button_exit', 'Departure');
    LS_AddStr('border_statistics_button_total', 'Total');
  }
}

function BS_FormatData(wrap, data) {
  //-- Variables for xtick
  var x_key = 'date';
  var q, r;
  if (!wrap.tag.includes('overall') && !wrap.tag.includes('mini')) {
    q = data.length % wrap.xlabel_path;
    r = wrap.r_list[q];
  }
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 4); //-- 0 = date
  var col_tag = col_tag_list[wrap.col_ind];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var y_last = []; //-- For legend
  var y_max = 4.5;
  
  //-- Other variables
  var i, j, x, y, avg;

  //-- Initialize y_last
  for (j=0; j<nb_col; j++)
    y_last.push(0);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = +row[col_tag];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (!wrap.tag.includes('overall') && !wrap.tag.includes('mini')) {
      if (i % wrap.xlabel_path == r)
        xticklabel.push(x);
    }
    
    //-- Update y_last
    if (y != '') {
//     if (+row[col_tag_list[2]] > 0) { //-- If both > 0
      for (j=0; j<nb_col; j++)
        y_last[j] = +row[col_tag_list[j]];
    }
    
    //-- Update moving avg
    if ('' == avg)
      row[col_tag_avg] = NaN;
    else if (wrap.cumul == 1)
      row[col_tag_avg] = y;
    else
      row[col_tag_avg] = +avg;
    
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
  wrap.formatted_data = data;
  wrap.col_tag = col_tag;
  wrap.col_tag_avg = col_tag_avg;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_last;
}

function BS_FormatData2(wrap, data2) {
  if (!wrap.tag.includes('overall'))
    return;
  
  var i, timestamp;
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      timestamp = data2[i]['value'];
  }
  
  //-- Calculate x_min
  var x_min = (new Date(wrap.iso_begin) - new Date(GP_wrap.iso_ref)) / 86400000;
  x_min -= 0.2; //-- For edge
  
  //-- Calculate x_max
  var iso_today = timestamp.slice(0, 10);
  var x_max = (new Date(iso_today) - new Date(GP_wrap.iso_ref)) / 86400000;
  x_max += 1; //-- For edge
  
  //-- Half day correction
  var hour = timestamp.slice(11, 13);
  if (+hour < 12)
    x_max -= 1;
  
  //-- Save to wrapper
  wrap.iso_end = iso_today;
  wrap.x_min = x_min;
  wrap.x_max = x_max;
}

//-- Tooltip
function BS_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw') {
    col_label_list = ['入境', '出境', '合計'];
    avg_text = '過去七日平均';
  }
  else if (LS_lang == 'fr') {
    col_label_list = ['Arrivées', 'Départs', 'Totaux'];
    avg_text = 'Moyenne sur 7 jours';
  }
  else {
    col_label_list = ['Arrival', 'Departure', 'Total'];
    avg_text = '7-day average';
  }
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[wrap.col_ind] + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag]);
  tooltip_text += '<br>' + avg_text + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function BS_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[10];
  
  //-- Define mouse-move
  wrap.mouse_move = BS_MouseMove;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function BS_Replot(wrap) {
  //-- Replot bar
  GP_ReplotFaintSingleBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap);
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap);
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of people', fr: 'Nombre de voyageurs', 'zh-tw': '旅客人數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = [];
  var i;
  for (i=0; i<wrap.nb_col; i++)
    legend_color.push(GP_wrap.gray);
  legend_color[wrap.col_ind] = wrap.color;
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['入境', '出境', '合計'];
  else if (LS_lang == 'fr')
    legend_label = ['Arrivées', 'Départs', 'Totaux'];
  else
    legend_label = ['Arrival', 'Departure', 'Total'];
  
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
  legend_label.splice(0, 0, LS_GetLegendTitle_Last(wrap));
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', legend_pos.x)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'end')
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;});
  
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'start')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;});
}

//-- Load
function BS_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      BS_FormatData(wrap, data);
      BS_FormatData2(wrap, data2);
      BS_Plot(wrap);
      BS_Replot(wrap);
    });
}

function BS_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
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
    GP_PressRadioButton(wrap, 'exit', wrap.col_ind, this.value);
    wrap.col_ind = this.value;
    BS_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.col_ind == 0)
      tag1 = 'arrival';
    else if (wrap.col_ind == 1)
      tag1 = 'departure';
    else
      tag1 = 'both';

    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    BS_ResetText();
    BS_Replot(wrap);
  });
}

//-- Main
function BS_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini'))
    wrap.col_ind = 0;
  else {
    wrap.col_ind = document.querySelector("input[name='" + wrap.tag + "_exit']:checked").value;
    GP_PressRadioButton(wrap, 'exit', 0, wrap.col_ind); //-- 0 from .html
  }

  //-- Load
  BS_InitFig(wrap);
  BS_ResetText();
  BS_Load(wrap);
  
  //-- Setup button listeners
  BS_ButtonListener(wrap);
}
