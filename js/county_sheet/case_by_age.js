
    //--------------------------------//
    //--  case_by_age.js            --//
    //--  Chieh-An Lin              --//
    //--  2022.12.05                --//
    //--------------------------------//

function CBA_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  //-- No GP_InitFig_Overall because it doesn't change axis
  else
    GP_InitFig_SimpleBar(wrap);
}

function CBA_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('case_by_age_title', '確診個案年齡分布');
    LS_AddStr('case_by_age_button_total', '合計');
    LS_AddStr('case_by_age_button_w-1', '0-6天前');
    LS_AddStr('case_by_age_button_w-2', '7-13天前');
    LS_AddStr('case_by_age_button_w-3', '14-20天前');
    LS_AddStr('case_by_age_button_w-4', '21-27天前');
    LS_AddStr('case_by_age_button_w-5', '28-34天前');
    LS_AddStr('case_by_age_button_w-6', '35-41天前');
    LS_AddStr('case_by_age_button_w-7', '42-48天前');
    LS_AddStr('case_by_age_button_w-8', '49-55天前');
    LS_AddStr('case_by_age_button_w-9', '56-62天前');
    LS_AddStr('case_by_age_button_w-10', '63-69天前');
    LS_AddStr('case_by_age_button_w-11', '70-76天前');
    LS_AddStr('case_by_age_button_w-12', '77-83天前');
    LS_AddStr('case_by_age_button_2020', '2020');
    LS_AddStr('case_by_age_button_2021', '2021');
    LS_AddStr('case_by_age_button_2022', '2022');
    LS_AddStr('case_by_age_button_2023', '2023');
    LS_AddStr('case_by_age_button_all_year', '全年');
    LS_AddStr('case_by_age_button_m1', '1月');
    LS_AddStr('case_by_age_button_m2', '2月');
    LS_AddStr('case_by_age_button_m3', '3月');
    LS_AddStr('case_by_age_button_m4', '4月');
    LS_AddStr('case_by_age_button_m5', '5月');
    LS_AddStr('case_by_age_button_m6', '6月');
    LS_AddStr('case_by_age_button_m7', '7月');
    LS_AddStr('case_by_age_button_m8', '8月');
    LS_AddStr('case_by_age_button_m9', '9月');
    LS_AddStr('case_by_age_button_m10', '10月');
    LS_AddStr('case_by_age_button_m11', '11月');
    LS_AddStr('case_by_age_button_m12', '12月');
    
    LS_AddHtml('case_by_age_description', '\
      在2020疫情剛開始時，確診個案平均年齡偏低，\
      但2021年5月所爆發的感染則是老人多於年輕人，\
      2022年後又回到年輕人多於老人的情況。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('case_by_age_title', 'Cas confirmés par âge');
    LS_AddStr('case_by_age_button_total', 'Totaux');
    LS_AddStr('case_by_age_button_w-1', '0-6 jours plus tôt');
    LS_AddStr('case_by_age_button_w-2', '7-13 jours plus tôt');
    LS_AddStr('case_by_age_button_w-3', '14-20 jours plus tôt');
    LS_AddStr('case_by_age_button_w-4', '21-27 jours plus tôt');
    LS_AddStr('case_by_age_button_w-5', '28-34 jours plus tôt');
    LS_AddStr('case_by_age_button_w-6', '35-41 jours plus tôt');
    LS_AddStr('case_by_age_button_w-7', '42-48 jours plus tôt');
    LS_AddStr('case_by_age_button_w-8', '49-55 jours plus tôt');
    LS_AddStr('case_by_age_button_w-9', '56-62 jours plus tôt');
    LS_AddStr('case_by_age_button_w-10', '63-69 jours plus tôt');
    LS_AddStr('case_by_age_button_w-11', '70-76 jours plus tôt');
    LS_AddStr('case_by_age_button_w-12', '77-83 jours plus tôt');
    LS_AddStr('case_by_age_button_2020', '2020');
    LS_AddStr('case_by_age_button_2021', '2021');
    LS_AddStr('case_by_age_button_2022', '2022');
    LS_AddStr('case_by_age_button_2023', '2023');
    LS_AddStr('case_by_age_button_all_year', 'Toute l\'année');
    LS_AddStr('case_by_age_button_m1', 'Janvier');
    LS_AddStr('case_by_age_button_m2', 'Février');
    LS_AddStr('case_by_age_button_m3', 'Mars');
    LS_AddStr('case_by_age_button_m4', 'Avril');
    LS_AddStr('case_by_age_button_m5', 'Mai');
    LS_AddStr('case_by_age_button_m6', 'Juin');
    LS_AddStr('case_by_age_button_m7', 'Juillet');
    LS_AddStr('case_by_age_button_m8', 'Août');
    LS_AddStr('case_by_age_button_m9', 'Septembre');
    LS_AddStr('case_by_age_button_m10', 'Octobre');
    LS_AddStr('case_by_age_button_m11', 'Novembre');
    LS_AddStr('case_by_age_button_m12', 'Décembre');
    
    LS_AddHtml('case_by_age_description', '\
      Au début de la pandémie, la plupart des cas étaient les jeunes qui sont retournés à Taïwan.\
      Pendant la vague de mai 2021, les plus âgés ont été beaucoup plus infectés,\
      tandis qu\'à partir de 2022 ce sont les jeunes patients qui dominent les infections.\
    ');
  }
  
  else { //-- En
    LS_AddStr('case_by_age_title', 'Confirmed Cases by Age');
    LS_AddStr('case_by_age_button_total', 'Total');
    LS_AddStr('case_by_age_button_w-1', '0-6 days ago');
    LS_AddStr('case_by_age_button_w-2', '7-13 days ago');
    LS_AddStr('case_by_age_button_w-3', '14-20 days ago');
    LS_AddStr('case_by_age_button_w-4', '21-27 days ago');
    LS_AddStr('case_by_age_button_w-5', '28-34 days ago');
    LS_AddStr('case_by_age_button_w-6', '35-41 days ago');
    LS_AddStr('case_by_age_button_w-7', '42-48 days ago');
    LS_AddStr('case_by_age_button_w-8', '49-55 days ago');
    LS_AddStr('case_by_age_button_w-9', '56-62 days ago');
    LS_AddStr('case_by_age_button_w-10', '63-69 days ago');
    LS_AddStr('case_by_age_button_w-11', '70-76 days ago');
    LS_AddStr('case_by_age_button_w-12', '77-83 days ago');
    LS_AddStr('case_by_age_button_2020', '2020');
    LS_AddStr('case_by_age_button_2021', '2021');
    LS_AddStr('case_by_age_button_2022', '2022');
    LS_AddStr('case_by_age_button_2023', '2023');
    LS_AddStr('case_by_age_button_all_year', 'All year');
    LS_AddStr('case_by_age_button_m1', 'January');
    LS_AddStr('case_by_age_button_m2', 'February');
    LS_AddStr('case_by_age_button_m3', 'March');
    LS_AddStr('case_by_age_button_m4', 'April');
    LS_AddStr('case_by_age_button_m5', 'May');
    LS_AddStr('case_by_age_button_m6', 'June');
    LS_AddStr('case_by_age_button_m7', 'July');
    LS_AddStr('case_by_age_button_m8', 'August');
    LS_AddStr('case_by_age_button_m9', 'September');
    LS_AddStr('case_by_age_button_m10', 'October');
    LS_AddStr('case_by_age_button_m11', 'November');
    LS_AddStr('case_by_age_button_m12', 'December');
    
    LS_AddHtml('case_by_age_description', '\
      At the beginning of the pandemic, most patients were young people returning from overseas.\
      However, during the May 2021 outbreak, aged people were more infected.\
      Since 2022, it has switched back to a scenario dominated by young patients.\
    ');
  }
}

function CBA_FormatData(wrap, data) {
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
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_sum = [0, 0]; //-- 0 (total) & period
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = +row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (!wrap.tag.includes('mini')) {
      xtick.push(i);
      xticklabel.push(i*5);
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
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
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

function CBA_FormatData2(wrap, data2) {
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
function CBA_MouseMove(wrap, d) {
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
  var tooltip_text = wrap.ylabel_dict[LS_lang][wrap.col_tag];
  tooltip_text += '<br>' + d['age'] + age_label + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function CBA_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[2];
  
  //-- Define mouse-move
  wrap.mouse_move = CBA_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function CBA_Replot(wrap) {
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
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot xlabel
  var xlabel_dict = {en: 'Age', fr: 'Âge', 'zh-tw': '年齡'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_case);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'small');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  wrap.legend_label = [wrap.ylabel_dict[LS_lang][wrap.col_tag], LS_GetLegendTitle_Page(wrap)];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(1, 2);
    wrap.legend_label = wrap.legend_label.slice(1, 2);
  }
  
  //-- Update legend title
  var legend_title = {en: 'Confirmed cases', fr: 'Cas confirmés', 'zh-tw': '確診人數'}; //-- No time info for title here
  GP_UpdateLegendTitle(wrap, legend_title[LS_lang]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', wrap.legend_size);
}

//-- Load
function CBA_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      CBA_FormatData(wrap, data);
      CBA_FormatData2(wrap, data2);
      CBA_Plot(wrap);
      CBA_Replot(wrap);
    });
}

function CBA_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      CBA_FormatData(wrap, data);
      CBA_FormatData2(wrap, data2);
      CBA_Replot(wrap);
    });
}

function CBA_ButtonListener(wrap) {
  //-- Period
  if (wrap.tag.includes('overall')) {
    d3.select(wrap.id +'_year').on('change', function() {
      wrap.year = +this.value;
      if (wrap.year == 0) {
        document.getElementById(wrap.tag + '_month').disabled = true;
        document.getElementById(wrap.tag + '_month').value = 0;
      }
      else
        document.getElementById(wrap.tag + '_month').disabled = false;
      wrap.col_ind = GP_YMToIndex(wrap.year, wrap.month);
      CBA_Reload(wrap);
    });
    d3.select(wrap.id +'_month').on('change', function() {
      wrap.month = +this.value;
      wrap.col_ind = GP_YMToIndex(wrap.year, wrap.month);
      CBA_Reload(wrap);
    });
  }
  else
    d3.select(wrap.id +'_period').on('change', function() {
      wrap.col_ind = this.value;
      CBA_Reload(wrap);
    });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.col_ind == 0)
      tag1 = 'total';
    else if (wrap.tag.includes('latest'))
      tag1 = 'w' + (-wrap.col_ind);
    else if (wrap.tag.includes('overall')) {
      tag1 = '' + (wrap.year + 2019);
      if (wrap.month > 0)
        tag1 += '_m' + wrap.month;
    }
    else
      tag1 = 'm' + wrap.col_ind;
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Replot
    CBA_ResetText();
    CBA_Replot(wrap);
  });
}

//-- Main
function CBA_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Swap active to current value
  if (wrap.tag.includes('mini'))
    wrap.col_ind = 0;
  else if (wrap.tag.includes('overall')) {
    wrap.year = +document.getElementById(wrap.tag + '_year').value;
    if (wrap.year == 0) {
      document.getElementById(wrap.tag + '_month').disabled = true;
      document.getElementById(wrap.tag + '_month').value = 0;
    }
    else
      document.getElementById(wrap.tag + '_month').disabled = false;
    wrap.month = +document.getElementById(wrap.tag + '_month').value;
    wrap.col_ind = GP_YMToIndex(wrap.year, wrap.month);
  }
  else
    wrap.col_ind = document.getElementById(wrap.tag + '_period').value;
  
  //-- Load
  CBA_InitFig(wrap);
  CBA_ResetText();
  CBA_Load(wrap);
  
  //-- Setup button listeners
  CBA_ButtonListener(wrap);
}
