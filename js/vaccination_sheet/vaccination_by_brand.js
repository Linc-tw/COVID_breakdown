
    //--------------------------------//
    //--  vaccination_by_brand.js   --//
    //--  Chieh-An Lin              --//
    //--  2022.05.08                --//
    //--------------------------------//

function VBB_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VBB_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_brand_title', '各廠牌疫苗接種數');
    LS_AddStr('vaccination_by_brand_button_daily', '逐日');
    LS_AddStr('vaccination_by_brand_button_cumul', '累計');
    LS_AddStr('vaccination_by_brand_button_total', '合計');
    LS_AddStr('vaccination_by_brand_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_brand_button_Moderna', '莫德納');
    LS_AddStr('vaccination_by_brand_button_Medigen', '高端');
    LS_AddStr('vaccination_by_brand_button_Pfizer', 'BNT');
    
    LS_AddHtml('vaccination_by_brand_description', '\
      除週日外，衛服部每日公佈前一日之疫苗接種人數，\
      因此無星期六資料。\
      其他日資料則偶有缺陷，原因不詳。\
      <br><br>\
      由於原始資料為累計施打人數，\
      因此只有接連兩日資料完整時才能計算每日施打人數，\
      這解釋了為何逐日人數缺資料比累計人數多。\
      <br><br>\
      單日施打劑數可能為負（BNT），此乃資料來源之錯誤，原因不詳。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_brand_title', 'Vaccination par marque');
    LS_AddStr('vaccination_by_brand_button_daily', 'Quotidiens');
    LS_AddStr('vaccination_by_brand_button_cumul', 'Cumulés');
    LS_AddStr('vaccination_by_brand_button_total', 'Totaux');
    LS_AddStr('vaccination_by_brand_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_brand_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_by_brand_button_Medigen', 'Medigen');
    LS_AddStr('vaccination_by_brand_button_Pfizer', 'Pfizer');
    
    LS_AddHtml('vaccination_by_brand_description', '\
      Tous les jours sauf dimanche le résultat de la veille est publié.\
      C\'est pour cela que les données de samedi est toujours manquées.\
      Parfois les données d\'autres jours sont manquées pour une raison inconnue.\
      <br><br>\
      Comme les résultats sont publiés en nombres cumulés,\
      il faut que les données de 2 jours consécutifs sont connues pour pouvoir calculer le nombre de doses quotidien.\
      Ceci explique pourquoi il y a plus de données manquantes pour le comptage quotidien que pour le compage cumulé.\
      <br><br>\
      Le nombre d\'injection par jour peut tomber négatif (pour Pfizer).\
      Cette erreur provient de la source des données.\
      La raison est inconnue.\
    ');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_brand_title', 'Vaccination by Brand');
    LS_AddStr('vaccination_by_brand_button_daily', 'Daily');
    LS_AddStr('vaccination_by_brand_button_cumul', 'Cumulative');
    LS_AddStr('vaccination_by_brand_button_total', 'Total');
    LS_AddStr('vaccination_by_brand_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_brand_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_by_brand_button_Medigen', 'Medigen');
    LS_AddStr('vaccination_by_brand_button_Pfizer', 'Pfizer');
    
    LS_AddHtml('vaccination_by_brand_description', '\
      Everyday except for Sunday the result of the previous day is released .\
      Therefore Saturday\'s data are always missing.\
      Some days\' data are also missing for unknown reasons.\
      <br><br>\
      As the data are released under cumulative counts,\
      daily counts are only available when cumulative counts are known for two consecutive days.\
      This explains why there are more missing data in daily counts.\
      <br><br>\
      The number of injections by day can become negative (for Pfizer).\
      This error comes from the data source.\
      The reason is unknown.\
    ');
  }
}

function VBB_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2, 7); //-- 0 = date, 1 = interpolated
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
  
  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Loop over row
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
    
    //-- Update to exclude interpolation
    if ((0 < wrap.cumul && 0 < +row['interpolated']) || (0 == wrap.cumul && 0 != +row['interpolated'])) {
      for (j=0; j<nb_col; j++)
        row[col_tag_list[j]] = 0;
    }
    else {
      //-- Update last date
      last_date = x;
    
      //-- Update y_last
      for (j=0; j<nb_col; j++) {
        if (wrap.cumul == 0)
          y_last[j] = +row[col_tag_list[j]];
        else 
          y_last[j] = Math.max(y_last[j], +row[col_tag_list[j]]);
      }
    }
    
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

function VBB_FormatData2(wrap, data2) {
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
  wrap.iso_begin = GP_wrap.iso_ref_vacc;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap);
}

//-- Tooltip
function VBB_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw') {
    col_label_list = ['合計', 'AZ', '莫德納', '高端', 'BNT'];
    avg_text = '過去七日平均';
  }
  else if (LS_lang == 'fr') {
    col_label_list = ['Totaux', 'AZ', 'Moderna', 'Medigen', 'Pfizer'];
    avg_text = 'Moyenne sur 7 jours';
  }
  else {
    col_label_list = ['Total', 'AZ', 'Moderna', 'Medigen', 'Pfizer'];
    avg_text = '7-day average';
  }
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[wrap.col_ind] + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag]);
  if (wrap.cumul == 0)
    tooltip_text += '<br>' + avg_text + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function VBB_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[1];
  
  //-- Define mouse-move
  wrap.mouse_move = VBB_MouseMove;
  wrap.plot_opacity = GP_wrap.faint_opacity;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function VBB_Replot(wrap) {
  //-- Replot bar
  GP_ReplotFaintSingleBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
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
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_dose);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'small');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy, x1: wrap.legend_pos_x1_[LS_lang]};
  
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
    wrap.legend_label = ['AZ', '莫德納', '高端', 'BNT', '合計'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['AZ', 'Moderna', 'Medigen', 'Pfizer', 'Totaux'];
  else
    wrap.legend_label = ['AZ', 'Moderna', 'Medigen', 'Pfizer', 'Total'];
  
  //-- Update legend title
  GP_UpdateLegendTitle_Standard(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count_fold', wrap.legend_size);
}

//-- Load
function VBB_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      VBB_FormatData(wrap, data);
      VBB_FormatData2(wrap, data2);
      VBB_Plot(wrap);
      VBB_Replot(wrap);
    });
}

function VBB_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBB_FormatData(wrap, data);
      VBB_Replot(wrap);
    });
}

function VBB_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on('change', "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    VBB_Reload(wrap);
  });

  //-- Brand
  d3.select(wrap.id +'_brand').on('change', function() {
    wrap.col_ind = this.value;
    VBB_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    var tag1, tag2;
    
    if (wrap.col_ind == 1)
      tag1 = 'AZ';
    else if (wrap.col_ind == 2)
      tag1 = 'Moderna';
    else if (wrap.col_ind == 3)
      tag1 = 'Medigen';
    else if (wrap.col_ind == 4)
      tag1 = 'Pfizer';
    else
      tag1 = 'total';
    
    if (wrap.cumul == 1)
      tag2 = 'cumulative';
    else
      tag2 = 'daily';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Replot
    VBB_ResetText();
    VBB_Replot(wrap);
  });
}

//-- Main
function VBB_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini')) {
    wrap.cumul = 0;
    wrap.col_ind = 0;
  }
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
    wrap.col_ind = document.getElementById(wrap.tag + '_brand').value;
  }
  
  //-- Load
  VBB_InitFig(wrap);
  VBB_ResetText();
  VBB_Load(wrap);
  
  //-- Setup button listeners
  VBB_ButtonListener(wrap);
}
