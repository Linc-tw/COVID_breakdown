
//-- Filename:
//--   incidence_rates.js
//--
//-- Author:
//--   Chieh-An Lin

function IR_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function IR_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('incidence_rates_title', '境外移入與本土盛行率');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('incidence_rates_title', "Taux d'incidence frontalier & local");
  }
  
  else { //-- En
    LS_AddStr('incidence_rates_title', 'Arrival & Local Incidence Rates');
  }
}

function IR_FormatData(wrap, data) {
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

function IR_FormatData2(wrap, data2) {
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
function IR_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['入境盛行率', '本土盛行率/1000'];
  else if (LS_lang == 'fr')
    col_label_list = ["Taux d'inci. front.", "Taux d'inci. local/1000"];
  else
    col_label_list = ['Arrival incidence', 'Local incidence/1000'];
  
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

function IR_Plot(wrap) {
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
  wrap.color_list = GP_wrap.c_list.slice(3, 3+wrap.nb_col);
  
  //-- Define mouse-move
  wrap.mouse_move = IR_MouseMove;
  
  //-- Plot line
  GP_PlotLine(wrap);
  
  //-- Plot dot
  GP_PlotDot(wrap);
}

function IR_Replot(wrap) {
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
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_rate);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['入境盛行率', '本土盛行率（乘以1000）'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ["Taux d'incidence frontalier", "Taux d'incidence local (multiplié par 1000)"];
  else
    wrap.legend_label = ['Arrival incidence', 'Local incidence (multiplied by 1000)'];
    
  //-- Update legend title
  GP_UpdateLegendTitle(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', 'normal');
}

//-- Load
function IR_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      IR_FormatData(wrap, data);
      IR_FormatData2(wrap, data2);
      IR_Plot(wrap);
      IR_Replot(wrap);
    });
}

function IR_ButtonListener(wrap) {
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
    IR_ResetText();
    IR_Replot(wrap);
  });
}

//-- Main
function IR_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  IR_InitFig(wrap);
  IR_ResetText();
  IR_Load(wrap);
  
  //-- Setup button listeners
  IR_ButtonListener(wrap);
}
