
//-- Filename:
//--   case_counts.js
//--
//-- Author:
//--   Chieh-An Lin

function CC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function CC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr("case_counts_title", "各感染源確診人數");
    LS_AddStr("case_counts_button_daily", "逐日");
    LS_AddStr("case_counts_button_cumul", "累計");
    LS_AddStr("case_counts_button_total", "合計");
    LS_AddStr("case_counts_button_imported", "境外移入");
    LS_AddStr("case_counts_button_local", "本土");
    LS_AddStr("case_counts_button_others", "其他");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr("case_counts_title", "Nombre de cas confirmés");
    LS_AddStr("case_counts_button_daily", "Quotidiens");
    LS_AddStr("case_counts_button_cumul", "Cumulés");
    LS_AddStr("case_counts_button_total", "Totaux");
    LS_AddStr("case_counts_button_imported", "Importés");
    LS_AddStr("case_counts_button_local", "Locaux");
    LS_AddStr("case_counts_button_others", "Divers");
  }
  
  else { //-- En
    LS_AddStr("case_counts_title", "Confirmed Case Counts");
    LS_AddStr("case_counts_button_daily", "Daily");
    LS_AddStr("case_counts_button_cumul", "Cumulative");
    LS_AddStr("case_counts_button_total", "Total");
    LS_AddStr("case_counts_button_imported", "Imported");
    LS_AddStr("case_counts_button_local", "Local");
    LS_AddStr("case_counts_button_others", "Others");
  }
}

function CC_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 5); //-- 0 = date
  var col_tag = col_tag_list[wrap.col_ind];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var x_list = [];
  var avg;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_sum = []; 
  for (j=0; j<nb_col; j++) //-- Initialize with 0
    y_sum.push(0);
  
  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
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
    
    //-- Update y_sum
    for (j=0; j<nb_col; j++) {
      if (wrap.cumul == 0)
        y_sum[j] += +row[col_tag_list[j]];
      else 
        y_sum[j] = Math.max(y_sum[j], +row[col_tag_list[j]]);
    }
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
    
    //-- Update moving avg
    if ('' == avg) {
      row[col_tag] = NaN;
      row[col_tag_avg] = NaN;
    }
    else if (wrap.cumul == 1)
      row[col_tag_avg] = y;
    else
      row[col_tag_avg] = +avg;
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
  wrap.legend_value_raw = y_sum;
}

function CC_FormatData2(wrap, data2) {
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
function CC_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
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

function CC_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[0];
  
  //-- Define mouse-move
  wrap.mouse_move = CC_MouseMove;
  wrap.plot_opacity = GP_wrap.faint_opacity;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);
  
  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function CC_Replot(wrap) {
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
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_case);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 10, dy: 27, x1: wrap.legend_pos_x1_[LS_lang]};
  
  //-- Define legend color
  var i;
  wrap.legend_color = [];
  for (i=0; i<wrap.nb_col; i++)
    wrap.legend_color.push(GP_wrap.gray);
  i = (wrap.nb_col + wrap.col_ind - 1) % wrap.nb_col;
  wrap.legend_color[i] = wrap.color;
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice(1, wrap.nb_col);
  wrap.legend_value.push(wrap.legend_value_raw[0]); //-- Move last to first
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['境外移入', '本土', '其他', '合計'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Importés', 'Locaux', 'Divers', 'Total'];
  else
    wrap.legend_label = ['Imported', 'Local', 'Others', 'Total'];
  
  //-- Remove from legend if value = 0
  for (i=wrap.legend_value.length-1; i>=0; i--) {
    if (0 == wrap.legend_value[i]) {
      wrap.legend_color.splice(i, 1);
      wrap.legend_value.splice(i, 1);
      wrap.legend_label.splice(i, 1);
    }
  }
  
  //-- Update legend title
  GP_UpdateLegendTitle_Standard(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count_fold', '1.2rem');
}

//-- Load
function CC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      CC_FormatData(wrap, data);
      CC_FormatData2(wrap, data2);
      CC_Plot(wrap);
      CC_Replot(wrap);
    });
}

function CC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      CC_FormatData(wrap, data);
      CC_Replot(wrap);
    });
}

function CC_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    CC_Reload(wrap);
  });
  
  //-- Transmission type
  d3.select(wrap.id +'_trans').on('change', function() {
    wrap.col_ind = this.value;
    CC_Reload(wrap);
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
    CC_ResetText();
    CC_Replot(wrap);
  });
}

//-- Main
function CC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini')) {
    wrap.cumul = 0;
    wrap.col_ind = 0;
  }
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
    wrap.col_ind = document.getElementById(wrap.tag + "_trans").value;
  }
  
  //-- Load
  CC_InitFig(wrap);
  CC_ResetText();
  CC_Load(wrap);
  
  //-- Setup button listeners
  CC_ButtonListener(wrap);
}
