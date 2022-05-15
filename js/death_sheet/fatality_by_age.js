
    //--------------------------------//
    //--  fatality_by_age.js        --//
    //--  Chieh-An Lin              --//
    //--  2022.05.15                --//
    //--------------------------------//

function FBA_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  //-- No GP_InitFig_Overall because it doesn't change axis
  else
    GP_InitFig_SimpleBar(wrap);
}

function FBA_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('fatality_by_age_title', '致死率年齡分布');
    LS_AddStr('fatality_by_age_button_total', '合計');
    LS_AddStr('fatality_by_age_button_2020', '2020');
    LS_AddStr('fatality_by_age_button_2021', '2021');
    LS_AddStr('fatality_by_age_button_2022', '2022');
    
    LS_AddHtml('fatality_by_age_description', '\
      致死率的定義為死亡人數除以確診人數。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('fatality_by_age_title', 'Létalité par âge');
    LS_AddStr('fatality_by_age_button_total', 'Totaux');
    LS_AddStr('fatality_by_age_button_2020', '2020');
    LS_AddStr('fatality_by_age_button_2021', '2021');
    LS_AddStr('fatality_by_age_button_2022', '2022');
    
    LS_AddHtml('fatality_by_age_description', '\
      Le taux de létalité est défini comme le nombre de décédés sur le nombre de cas confirmés.\
    ');
  }
  
  else { //-- En
    LS_AddStr('fatality_by_age_title', 'Fatality by Age');
    LS_AddStr('fatality_by_age_button_total', 'Total');
    LS_AddStr('fatality_by_age_button_2020', '2020');
    LS_AddStr('fatality_by_age_button_2021', '2021');
    LS_AddStr('fatality_by_age_button_2022', '2022');
    
    LS_AddHtml('fatality_by_age_description', '\
      The case fatality rate (CFR) is defined as the number of deaths over the confirmed case counts.\
    ');
  }
}

function FBA_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'age';
  var x_list = []; //-- For age
  
  //-- Variables for xaxis
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 0.005;
  
  //-- Variables for legend
  var y_sum = [0, 0]; //-- 0 (total) & year
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = +row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (!wrap.tag.includes('mini')) {
      xtick.push(i);
      xticklabel.push(i*10);
    }
    
    //-- Update y_sum
    y_sum[0] += +row[col_tag_list[0]];
    y_sum[1] += y;
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Last tick
  xtick.push(i);
  xticklabel.push('+');
  
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
  wrap.formatted_data = data;
  wrap.col_tag_list = col_tag_list;
  wrap.col_tag = col_tag;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value_raw = y_sum;
}

function FBA_FormatData2(wrap, data2) {
  var ylabel_dict = {'en': {}, 'fr': {}, 'zh-tw': {}};
  var i, key, block; 
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    key = data2[i]['key'];
    ylabel_dict['en'][key] = data2[i]['label'];
    ylabel_dict['fr'][key] = data2[i]['label_fr'];
    ylabel_dict['zh-tw'][key] = data2[i]['label_zh'];
  }
  
  //-- Save to wrapper
  wrap.ylabel_dict = ylabel_dict;
}

//-- Tooltip
function FBA_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  var age_label;
  if (LS_lang == 'zh-tw')
    age_label = '歲';
  else if (LS_lang == 'fr')
    age_label = ' ans';
  else
    age_label = ' years old';
  
  //-- Define tooltip text
  var fct_format = d3.format('.2%');
  var tooltip_text = wrap.ylabel_dict[LS_lang][wrap.col_tag];
  tooltip_text += '<br>' + d['age'] + age_label + ' = ' + fct_format(+d[wrap.col_tag]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function FBA_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add xlabel
  GP_PlotXLabel(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[10];
  
  //-- Define mouse-move
  wrap.mouse_move = FBA_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function FBA_Replot(wrap) {
  //-- Update bar
  GP_ReplotSingleBar(wrap);
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  GP_ReplotBandX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'percentage');
  
  //-- Replot xlabel
  var xlabel_dict = {en: 'Age', fr: 'Âge', 'zh-tw': '年齡'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_rate);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  wrap.legend_label = [wrap.ylabel_dict[LS_lang][wrap.col_tag], wrap.ylabel_dict[LS_lang]['total']];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(0, 1);
    wrap.legend_label = wrap.legend_label.slice(1, 2);
  }
  
  //-- Update legend title
  var legend_title = {en: 'Case fatality rate', fr: 'Létalité', 'zh-tw': '致死率'}; //-- No time info for title here
  GP_UpdateLegendTitle(wrap, legend_title[LS_lang]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', wrap.legend_size);
}

//-- Load
function FBA_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      FBA_FormatData(wrap, data);
      FBA_FormatData2(wrap, data2);
      FBA_Plot(wrap);
      FBA_Replot(wrap);
    });
}

function FBA_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      FBA_FormatData(wrap, data);
      FBA_FormatData2(wrap, data2);
      FBA_Replot(wrap);
    });
}

function FBA_ButtonListener(wrap) {
  //-- Period
  d3.select(wrap.id +'_year').on('change', function() {
    wrap.col_ind = +this.value;
    FBA_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.col_ind == 0)
      tag1 = 'total';
    else
      tag1 = '' + (wrap.year + 2019);
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });
  
  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Replot
    FBA_ResetText();
    FBA_Replot(wrap);
  });
}

//-- Main
function FBA_Main(wrap) {
  wrap.id = '#' + wrap.tag;
  
  //-- Swap active to current value
  wrap.col_ind = document.getElementById(wrap.tag + '_year').value;
  
  //-- Load
  FBA_InitFig(wrap);
  FBA_ResetText();
  FBA_Load(wrap);
  
  //-- Setup button listeners
  FBA_ButtonListener(wrap);
}
