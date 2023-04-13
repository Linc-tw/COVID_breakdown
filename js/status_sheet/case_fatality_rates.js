
    //--------------------------------//
    //--  case_fatality_rates.js    --//
    //--  Chieh-An Lin              --//
    //--  2023.04.13                --//
    //--------------------------------//

function CFR_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function CFR_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('case_fatality_rates_title', '致死率');
    
    LS_AddHtml('case_fatality_rates_description', '\
      致死率的定義為死亡人數除以確診人數。\
      <br><br>\
      週平均致死率是由7日平均所計算出，\
      為平均死亡人數除以12日前的平均確診人數。\
      <br><br>\
      累計致死率則是從疫情開始到該日的整體比率。\
      <br><br>\
      資料自2023年1月20日起停止更新。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('case_fatality_rates_title', 'Taux de létalité');
    
    LS_AddHtml('case_fatality_rates_description', '\
      Le taux de létalité est défini comme le nombre de décédés sur le nombre de cas confirmés.\
      <br><br>\
      Le taux hebdomadaire est basé sur la moyenne glissante sur 7 jours.\
      C\'est le ratio entre le décès moyen et le nombre moyen des cas d\'il y a 12 jours.\
      <br><br>\
      Le taux cumulé est le ratio global à partir du début de la pandémie jusqu\'au jour concerné.\
      <br><br>\
      La mise à jour s\'est arrêté à partir du 20 janvier 2023.\
    ');
  }
  
  else { //-- En
    LS_AddStr('case_fatality_rates_title', 'Case Fatality Rates');
    
    LS_AddHtml('case_fatality_rates_description', '\
      The case fatality rate (CFR) is defined as the number of deaths over the confirmed case counts.\
      <br><br>\
      The weekly fatality is based on the 7-day lookback average.\
      It is the average death counts over the average confirmed cases of 12 days ago.\
      <br><br>\
      The cumulative fatality is the cumulative result calculated from the beginning of the pandemic to a given day.\
      <br><br>\
      The update of data has stopped since Jan 20th 2023.\
    ');
  }
}

function CFR_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var formatted_data = [];
  var x_list = []; //-- For date
  var y_list_list = [];
  var y_list, block;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 0;
  
  //-- Variables for legend
  var y_last_list = [];
  var y_last;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y_list = [];
    x = row['date'];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == row[col])
        y = NaN;
      else
        y = +row[col];
      
      y_list.push(y);
    }
    
    y_list_list.push(y_list)
  }
  
  //-- Main loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      y_list = y_list_list[i];
      y = y_list[j];
      
      if (y >= 0.25)
        y = NaN;
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]['date'],
        'y': y,
        'y_list': y_list
      };
      
      //-- Update y_last & y_max
      if (!isNaN(y)) {
        y_last = y;
        
        if (wrap.hasOwnProperty('col_ind')) { //-- For SIM
          if (j == wrap.col_ind)
            y_max = Math.max(y_max, y);
        }
        else
          y_max = Math.max(y_max, y);
      }
      
      //-- Stock
      block2.push(block);
    }
    
    //-- Stock
    formatted_data.push(block2);
    y_last_list.push(y_last);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'percentage');
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value_raw = y_last_list;
}

function CFR_FormatData2(wrap, data2) {
  if (!wrap.tag.includes('overall'))
    return;
  
  //-- Loop over row
  var i;
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      wrap.timestamp = data2[i]['value'];
  }
  
  //-- Overwrite timestamp
  wrap.timestamp = '2023-01-19 18:00:00 UTC+0800';
  
  //-- Set iso_begin
  wrap.iso_begin = GP_wrap.iso_ref;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap);
}

//-- Tooltip
function CFR_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['週平均致死率', '累計致死率'];
  else if (LS_lang == 'fr')
    col_label_list = ['Létalité hebdomadaire', 'Létalité cumulée'];
  else
    col_label_list = ['Weekly fatality', 'Cumulative fatality'];
  
  //-- Define tooltip texts
  var fct_format = d3.format('.3%');
  var tooltip_text = d.x;
  var i;
  
  for (i=0; i<wrap.nb_col; i++)
    tooltip_text += '<br>' + col_label_list[i] + ' = ' + fct_format(d.y_list[i]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px');
}

function CFR_Plot(wrap) {
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
  wrap.color_list = [GP_wrap.c_list[8], GP_wrap.c_list[10]];
  
  //-- Define mouse-move
  wrap.mouse_move = CFR_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot line
  GP_PlotLine(wrap);
  
  //-- Plot dot
  GP_PlotDot(wrap);
}

function CFR_Replot(wrap) {
  //-- Replot line
  GP_ReplotLine(wrap);
    
  //-- Replot dot
  GP_ReplotDot(wrap);
  
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
  GP_ReplotCountAsY(wrap, 'percentage');
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_rate);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['週平均致死率', '累計致死率'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Taux de létalité hebdomadaire', 'Taux de létalité cumulé'];
  else
    wrap.legend_label = ['Weekly fatality rate', 'Overall fatality rate'];
    
  //-- Update legend title
  GP_UpdateLegendTitle_Standard(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'per3', wrap.legend_size);
}

//-- Load
function CFR_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      CFR_FormatData(wrap, data);
      CFR_FormatData2(wrap, data2);
      CFR_Plot(wrap);
      CFR_Replot(wrap);
    });
}

function CFR_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Replot
    CFR_ResetText();
    CFR_Replot(wrap);
  });
}

//-- Main
function CFR_Main(wrap) {
  wrap.id = '#' + wrap.tag;
  
  //-- Load
  CFR_InitFig(wrap);
  CFR_ResetText();
  CFR_Load(wrap);
  
  //-- Setup button listeners
  CFR_ButtonListener(wrap);
}
