
    //--------------------------------//
    //--  vaccination_by_dose.js    --//
    //--  Chieh-An Lin              --//
    //--  2022.04.28                --//
    //--------------------------------//

function VBD_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VBD_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_dose_title', '疫苗劑次接種進度');
    
    LS_AddHtml('vaccination_by_dose_description', '\
      台灣的接種策略為拉長兩劑間距以提升第一劑覆蓋率，\
      此圖充分反映該措施所致結果。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_dose_title', 'Avancement de vaccination par nombre de doses');
    
    LS_AddHtml('vaccination_by_dose_description', '\
      Taïwan favorise la couverture vaccinale de la 1ère dose à la couverture totale.\
      Cette figure montre la conséquence de cette mesure.\
    ');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_dose_title', 'Vaccination Progress by Dose');
    
    LS_AddHtml('vaccination_by_dose_description', '\
      Taiwan prioritizes the 1st-dose coverage over full vaccination.\
      This plot shows the consequence of this policy.\
    ');
  }
}

function VBD_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var formatted_data = [];
  var y_list_list = [];
  var y_list, block, block2;
  
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
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == row[col])
        y = NaN;
      else
        y = +row[col];
      
      y_list.push(y);
    }
    
    y_list_list.push(y_list) //-- `y_list` contains `nb_col` values
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
        'y': y_list[j],
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
    ytick.push(i);
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value_raw = y_last_list;
  wrap.last_date = x;
}

function VBD_FormatData2(wrap, data2) {
  //-- Do not change these
  //-- Since there are holes of date in data, we need these twigs.
  
  var i;
  for (i=0; i<data2.length; i++) {
    if ('timestamp' == data2[i]['key'])
      wrap.timestamp = data2[i]['value'];
  }
  
  var r, nb_days;
  
  //-- Set time range
  if (wrap.tag.includes('latest')) {
    nb_days = 90;
    wrap.iso_begin = GP_ISODateAddition(wrap.timestamp.slice(0, 10), -nb_days+1);
    r = GP_GetRForTickPos(wrap, nb_days);
    
    //-- Add extrapolated point at left
    if (wrap.iso_begin != wrap.formatted_data[0][0].x) {
      for (i=0; i<wrap.formatted_data.length; i++) {
        var block0 = wrap.formatted_data[i][0];
        var block1 = wrap.formatted_data[i][1];
        var block = {
          'x': wrap.iso_begin,
          'y': 2*block0.y - block1.y,
        };
        wrap.formatted_data[i] = [block].concat(wrap.formatted_data[i]);
      }
    }
  }
  else if (wrap.tag.includes('overall')) {
    wrap.iso_begin = GP_wrap.iso_ref_vacc;
    ord_begin = Math.floor(GP_DateOrdinal(wrap.iso_begin));
    ord_today = Math.floor(GP_DateOrdinal(wrap.timestamp.slice(0, 10))) + 1;
    nb_days = ord_today - ord_begin;
  }
  
  //-- Calculate xlim
  GP_MakeXLim(wrap);
  
  //-- Variables for xaxis
  var xticklabel = [];
  var x_list = [];
  var x;
  
  //-- Make x_list & xticklabel
  for (i=0; i<nb_days; i++) {
    x = GP_ISODateAddition(wrap.iso_begin, i);
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (wrap.tag.includes('latest')) {
      if (i % wrap.xlabel_path == r)
        xticklabel.push(x);
    }
  }
  
  //-- Save to wrapper
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
}

//-- Tooltip
function VBD_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['第一劑', '第兩劑', '第三劑'];
  else if (LS_lang == 'fr')
    col_label_list = ['1er dose ', '2e dose', '3e dose'];
  else
    col_label_list = ['1st dose', '2nd dose', '3rd dose'];
  
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

function VBD_Plot(wrap) {
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
  wrap.color_list = [GP_wrap.c_list[3], GP_wrap.c_list[2], GP_wrap.c_list[6]];
  
  //-- Define mouse-move
  wrap.mouse_move = VBD_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot line
  GP_PlotLine(wrap);
  
  //-- Remove extrapolated point
  var i;
  for (i=0; i<wrap.formatted_data.length; i++)
    wrap.formatted_data[i] = wrap.formatted_data[i].slice(1);
  
  //-- Plot dot
  GP_PlotDot(wrap);
}

function VBD_Replot(wrap) {
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
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Proportion of the population', fr: 'Part de la population', 'zh-tw': '人口比'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Set legend parameters
  if (wrap.tag.includes('overall'))
    GP_SetLegendParam(wrap, 'normal');
  else
    GP_SetLegendParam(wrap, 'small');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy, x1: wrap.legend_pos_x1};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['已施打一劑', '已施打兩劑', '已施打三劑'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['1er dose ', '2e dose', '3e dose'];
  else
    wrap.legend_label = ['1st dose', '2nd dose', '3rd dose'];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, wrap.last_date);
  
  //-- Replot legend
  if (wrap.tag.includes('overall'))
    GP_ReplotLegend(wrap, 'percentage', wrap.legend_size);
  else
    GP_ReplotLegend(wrap, 'percentage_fold', wrap.legend_size);
}

//-- Load
function VBD_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData(wrap, data);
      VBD_FormatData2(wrap, data2);
      VBD_Plot(wrap);
      VBD_Replot(wrap);
    });
}

function VBD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData(wrap, data);
      VBD_Replot(wrap);
    });
}

function VBD_ButtonListener(wrap) {
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
    VBD_ResetText();
    VBD_Reload(wrap);
  });
}

//-- Main
function VBD_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VBD_InitFig(wrap);
  VBD_ResetText();
  VBD_Load(wrap);
  
  //-- Setup button listeners
  VBD_ButtonListener(wrap);
}
