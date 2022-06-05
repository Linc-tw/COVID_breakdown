
    //-----------------------------//
    //--  test_positive_rate.js  --//
    //--  Chieh-An Lin           --//
    //--  2022.06.05             --//
    //-----------------------------//

function TPR_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function TPR_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('test_positive_rate_title', '檢驗陽性率');
    
    LS_AddHtml('test_positive_rate_description', '\
      檢驗陽性率的定義為確診人數除以檢驗人次。\
      <br><br>\
      陽性率越高代表篩檢族群中的傳播鍊越多，尚未揪出之潛在確診者也可能越多。\
      <br><br>\
      這裡所呈現之陽性率為7日平均。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('test_positive_rate_title', 'Taux de positivité');
    
    LS_AddHtml('test_positive_rate_description', '\
      Le taux de positivité ou la positivité est défini comme le nombre de cas confirmés sur le nombre de tests conduits.\
      <br><br>\
      Plus la positivité est élevée, plus il y a des transmissions au sein de la population examinée\
      et plus il est possible qu\'il y a des patients non identifiés.\
      <br><br>\
      Ici, la moyenne glissante sur 7 jours est présentée.\
    ');
  }
  
  else { //-- En
    LS_AddStr('test_positive_rate_title', 'Test Positive Rate');
    
    LS_AddHtml('test_positive_rate_description', '\
      The test positive rate or positivity is defined as the number of confirmed cases over the number of tests.\
      <br><br>\
      The higher the positivity, the more there are transmissions among the targeted population,\
      and the more likely there are unidentified patients.\
      <br><br>\
      Here, the 7-day moving average is shown.\
    ');
  }
}

function TPR_FormatData(wrap, data) {
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

function TPR_FormatData2(wrap, data2) {
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
  GP_MakeXLim(wrap);
}

//-- Tooltip
function TPR_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['檢驗陽性率'];
  else if (LS_lang == 'fr')
    col_label_list = ['Positivité'];
  else
    col_label_list = ['Positivity'];
  
  //-- Define tooltip texts
  var fct_format = d3.format('.2%');
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

function TPR_Plot(wrap) {
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
  wrap.color_list = [GP_wrap.c_list[11]];
  
  //-- Define mouse-move
  wrap.mouse_move = TPR_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot line
  GP_PlotLine(wrap);
  
  //-- Plot dot
  GP_PlotDot(wrap);
}

function TPR_Replot(wrap) {
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
    wrap.legend_label = ['檢驗陽性率'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Taux de positivité'];
  else
    wrap.legend_label = ['Test positive rate'];
    
  //-- Update legend title
  legend_title_dict = {en: 'Latest value', fr: 'Derniers chiffres', 'zh-tw': '最新統計'};
  GP_UpdateLegendTitle(wrap, legend_title_dict[LS_lang]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', wrap.legend_size);
}

//-- Load
function TPR_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      TPR_FormatData(wrap, data);
      TPR_FormatData2(wrap, data2);
      TPR_Plot(wrap);
      TPR_Replot(wrap);
    });
}

function TPR_ButtonListener(wrap) {
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
    TPR_ResetText();
    TPR_Replot(wrap);
  });
}

//-- Main
function TPR_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  TPR_InitFig(wrap);
  TPR_ResetText();
  TPR_Load(wrap);
  
  //-- Setup button listeners
  TPR_ButtonListener(wrap);
}
