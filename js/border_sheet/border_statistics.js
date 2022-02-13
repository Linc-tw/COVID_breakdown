
    //--------------------------------//
    //--  border_statistics.js      --//
    //--  Chieh-An Lin              --//
    //--  2022.02.13                --//
    //--------------------------------//

function BS_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function BS_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('border_statistics_title', '入出境人數統計');
    LS_AddStr('border_statistics_button_entry', '入境');
    LS_AddStr('border_statistics_button_exit', '出境');
    LS_AddStr('border_statistics_button_total', '合計');
    
    LS_AddHtml('border_statistics_description', '\
      入出境統計僅於每月初更新。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('border_statistics_title', 'Statistiques frontalières');
    LS_AddStr('border_statistics_text', 'Mise à jour mensuellement');
    LS_AddStr('border_statistics_button_entry', 'Arrivées');
    LS_AddStr('border_statistics_button_exit', 'Départs');
    LS_AddStr('border_statistics_button_total', 'Totaux');
    
    LS_AddHtml('border_statistics_description', '\
      Les statistiques frontalières sont mises à jour uniquement au début du mois.\
    ');
  }
  
  else { //-- En
    LS_AddStr('border_statistics_title', 'Border Crossing');
    LS_AddStr('border_statistics_text', 'Updated monthly');
    LS_AddStr('border_statistics_button_entry', 'Arrival');
    LS_AddStr('border_statistics_button_exit', 'Departure');
    LS_AddStr('border_statistics_button_total', 'Total');
    
    LS_AddHtml('border_statistics_description', '\
      The border statistics are updated only at the beginning of each month.\
    ');
  }
}

function BS_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 4); //-- 0 = date
  var col_tag = col_tag_list[wrap.col_ind];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var x_list = [];
  var avg, last_date;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_last = [];
  for (j=0; j<nb_col; j++) //-- Initialize with 0
    y_last.push(0);
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = +row[col_tag];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Update moving avg
    if ('' == avg) {
      row[col_tag] = NaN;
      row[col_tag_avg] = NaN;
      continue;
    }
    else if (wrap.cumul == 1)
      row[col_tag_avg] = y;
    else
      row[col_tag_avg] = +avg;
    
    //-- Update last date
    last_date = row['date'];
    
    //-- Update y_last
    for (j=0; j<nb_col; j++)
      y_last[j] = +row[col_tag_list[j]];
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
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
  wrap.last_date = last_date;
  wrap.legend_value_raw = y_last;
}

function BS_FormatData2(wrap, data2) {
  if (!wrap.tag.includes('overall'))
    return;
  
  //-- Loop over row
  var i;
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      wrap.timestamp = data2[i]['value'];
  }
  
  //-- Set iso_begin
  wrap.iso_begin = GP_wrap.iso_ref;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap, 'band');
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
  tooltip_text += '<br>' + col_label_list[wrap.col_ind] + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag]);
  tooltip_text += '<br>' + avg_text + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag_avg]);
  
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
  wrap.plot_opacity = GP_wrap.faint_opacity;
  wrap.trans_delay = GP_wrap.trans_delay;
  
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
    GP_ReplotOverallXTick(wrap, 'band');
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of travellers', fr: 'Nombre de voyageurs', 'zh-tw': '人次'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  var i;
  wrap.legend_color = [];
  for (i=0; i<wrap.nb_col; i++)
    wrap.legend_color.push(GP_wrap.gray);
  wrap.legend_color[wrap.col_ind] = wrap.color;
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['入境', '出境', '合計'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Arrivées', 'Départs', 'Totaux'];
  else
    wrap.legend_label = ['Arrival', 'Departure', 'Total'];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, wrap.last_date);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', wrap.legend_size);
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
