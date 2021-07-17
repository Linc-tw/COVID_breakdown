
//-- Filename:
//--   positivity_and_fatality.js
//--
//-- Author:
//--   Chieh-An Lin

function PAF_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function PAF_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('positivity_and_fatality_title', '陽性率與致死率');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('positivity_and_fatality_title', 'Taux de positivité et de létalité');
  }
  
  else { //-- En
    LS_AddStr('positivity_and_fatality_title', 'Positive Rate & Case Fatality Rate');
  }
}

function PAF_FormatData(wrap, data) {
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
  
  //-- Main loop over row
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
      y = y_list_list[i][j];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]['date'],
        'y': y,
        'y_list': y_list_list[i]
      };
      
      //-- Update y_last & y_max
      if (!isNaN(y)) {
        y_last = y;
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
  wrap.legend_value = y_last_list;
}

function PAF_FormatData2(wrap, data2) {
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
  GP_MakeXLim(wrap, 'dot');
}

//-- Tooltip
function PAF_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.7;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['陽性率', '致死率'];
  else if (LS_lang == 'fr')
    col_label_list = ['Taux de positivité', 'Taux de létalité'];
  else
    col_label_list = ['Positive rate', 'Fatality rate'];
  
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

function PAF_Plot(wrap) {
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
  wrap.color_list = GP_wrap.c_list.slice(5, 5+wrap.nb_col);
  
  //-- Define mouse-move
  wrap.mouse_move = PAF_MouseMove;
  
  //-- Plot line
  GP_PlotLine(wrap);
  
  //-- Plot dot
  GP_PlotDot(wrap);
}

function PAF_Replot(wrap) {
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
    GP_ReplotOverallXTick(wrap, 'dot');
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'percentage');
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Rate', fr: 'Taux', 'zh-tw': '比率'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- No need to update legend value
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['陽性率', '致死率（累計）'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Taux de positivité', 'Taux de létalité (cumulé)'];
  else
    wrap.legend_label = ['Positive rate', 'Fatality rate (cumulative)'];
    
  //-- Update legend title
  GP_UpdateLegendTitle(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', 'normal');
}

//-- Load
function PAF_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      PAF_FormatData(wrap, data);
      PAF_FormatData2(wrap, data2);
      PAF_Plot(wrap);
      PAF_Replot(wrap);
    });
}

function PAF_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    PAF_ResetText();
    PAF_Replot(wrap);
  });
}

//-- Main
function PAF_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  PAF_InitFig(wrap);
  PAF_ResetText();
  PAF_Load(wrap);
  
  //-- Setup button listeners
  PAF_ButtonListener(wrap);
}
