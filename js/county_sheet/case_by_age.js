
//-- Filename:
//--   case_by_age.js
//--
//-- Author:
//--   Chieh-An Lin

function CBA_InitFig(wrap) {
  //-- No GP_InitFig_Overall because it doesn't change axis
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
    LS_AddStr('case_by_age_button_2020_01', '2020年1月');
    LS_AddStr('case_by_age_button_2020_02', '2020年2月');
    LS_AddStr('case_by_age_button_2020_03', '2020年3月');
    LS_AddStr('case_by_age_button_2020_04', '2020年4月');
    LS_AddStr('case_by_age_button_2020_05', '2020年5月');
    LS_AddStr('case_by_age_button_2020_06', '2020年6月');
    LS_AddStr('case_by_age_button_2020_07', '2020年7月');
    LS_AddStr('case_by_age_button_2020_08', '2020年8月');
    LS_AddStr('case_by_age_button_2020_09', '2020年9月');
    LS_AddStr('case_by_age_button_2020_10', '2020年10月');
    LS_AddStr('case_by_age_button_2020_11', '2020年11月');
    LS_AddStr('case_by_age_button_2020_12', '2020年12月');
    LS_AddStr('case_by_age_button_2021_01', '2021年1月');
    LS_AddStr('case_by_age_button_2021_02', '2021年2月');
    LS_AddStr('case_by_age_button_2021_03', '2021年3月');
    LS_AddStr('case_by_age_button_2021_04', '2021年4月');
    LS_AddStr('case_by_age_button_2021_05', '2021年5月');
    LS_AddStr('case_by_age_button_2021_06', '2021年6月');
    LS_AddStr('case_by_age_button_2021_07', '2021年7月');
    LS_AddStr('case_by_age_button_2021_08', '2021年8月');
    LS_AddStr('case_by_age_button_2021_09', '2021年9月');
    LS_AddStr('case_by_age_button_2021_10', '2021年10月');
    LS_AddStr('case_by_age_button_2021_11', '2021年11月');
    LS_AddStr('case_by_age_button_2021_12', '2021年12月');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('case_by_age_title', 'Cas confirmés par âge');
    LS_AddStr('case_by_age_button_total', 'Total');
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
    LS_AddStr('case_by_age_button_2020_01', 'Janv 2020');
    LS_AddStr('case_by_age_button_2020_02', 'Févr 2020');
    LS_AddStr('case_by_age_button_2020_03', 'Mars 2020');
    LS_AddStr('case_by_age_button_2020_04', 'Avr 2020');
    LS_AddStr('case_by_age_button_2020_05', 'Mai 2020');
    LS_AddStr('case_by_age_button_2020_06', 'Juin 2020');
    LS_AddStr('case_by_age_button_2020_07', 'Juil 2020');
    LS_AddStr('case_by_age_button_2020_08', 'Août 2020');
    LS_AddStr('case_by_age_button_2020_09', 'Sept 2020');
    LS_AddStr('case_by_age_button_2020_10', 'Oct 2020');
    LS_AddStr('case_by_age_button_2020_11', 'Nov 2020');
    LS_AddStr('case_by_age_button_2020_12', 'Déc 2020');
    LS_AddStr('case_by_age_button_2021_01', 'Janv 2021');
    LS_AddStr('case_by_age_button_2021_02', 'Févr 2021');
    LS_AddStr('case_by_age_button_2021_03', 'Mars 2021');
    LS_AddStr('case_by_age_button_2021_04', 'Avr 2021');
    LS_AddStr('case_by_age_button_2021_05', 'Mai 2021');
    LS_AddStr('case_by_age_button_2021_06', 'Juin 2021');
    LS_AddStr('case_by_age_button_2021_07', 'Juil 2021');
    LS_AddStr('case_by_age_button_2021_08', 'Août 2021');
    LS_AddStr('case_by_age_button_2021_09', 'Sept 2021');
    LS_AddStr('case_by_age_button_2021_10', 'Oct 2021');
    LS_AddStr('case_by_age_button_2021_11', 'Nov 2021');
    LS_AddStr('case_by_age_button_2021_12', 'Déc 2021');
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
    LS_AddStr('case_by_age_button_2020_01', 'Jan 2020');
    LS_AddStr('case_by_age_button_2020_02', 'Feb 2020');
    LS_AddStr('case_by_age_button_2020_03', 'Mar 2020');
    LS_AddStr('case_by_age_button_2020_04', 'Apr 2020');
    LS_AddStr('case_by_age_button_2020_05', 'May 2020');
    LS_AddStr('case_by_age_button_2020_06', 'Jun 2020');
    LS_AddStr('case_by_age_button_2020_07', 'Jul 2020');
    LS_AddStr('case_by_age_button_2020_08', 'Aug 2020');
    LS_AddStr('case_by_age_button_2020_09', 'Sep 2020');
    LS_AddStr('case_by_age_button_2020_10', 'Oct 2020');
    LS_AddStr('case_by_age_button_2020_11', 'Nov 2020');
    LS_AddStr('case_by_age_button_2020_12', 'Dec 2020');
    LS_AddStr('case_by_age_button_2021_01', 'Jan 2021');
    LS_AddStr('case_by_age_button_2021_02', 'Feb 2021');
    LS_AddStr('case_by_age_button_2021_03', 'Mar 2021');
    LS_AddStr('case_by_age_button_2021_04', 'Apr 2021');
    LS_AddStr('case_by_age_button_2021_05', 'May 2021');
    LS_AddStr('case_by_age_button_2021_06', 'Jun 2021');
    LS_AddStr('case_by_age_button_2021_07', 'Jul 2021');
    LS_AddStr('case_by_age_button_2021_08', 'Aug 2021');
    LS_AddStr('case_by_age_button_2021_09', 'Sep 2021');
    LS_AddStr('case_by_age_button_2021_10', 'Oct 2021');
    LS_AddStr('case_by_age_button_2021_11', 'Nov 2021');
    LS_AddStr('case_by_age_button_2021_12', 'Dec 2021');
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

//-- Tooltip
function CBA_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  if (LS_lang == 'fr')
    month_label = ['Total', 'de janvier', 'de février', 'de mars', "d'avril", 'de mai', 'de juin', 'de juillet', "d'août", 'de septembre', "d'octobre", 'de novembre', 'de décembre'];
  else
    month_label = ['Total', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
  //-- Generate column label
  var m, yyyy, col_label;
  if (wrap.tag.includes('latest'))
    col_label = (7*(wrap.col_ind-1)) + '-' + (7*wrap.col_ind-1);
  else if (wrap.tag.includes('overall')) {
    yyyy = 2020 + Math.floor((wrap.col_ind-1) / 12);
    m = (wrap.col_ind - 1) % 12 + 1;
    col_label = month_label[m];
  }
  else
    col_label = month_label[wrap.col_ind];
  
  //-- Generate tooltip text
  var tooltip_text;
  
  if (LS_lang == 'zh-tw') {
    if (wrap.col_ind == 0)
      tooltip_text = '全部案例中有';
    else if (wrap.tag.includes('latest'))
      tooltip_text = col_label + '天前之案例中有';
    else if (wrap.tag.includes('overall'))
      tooltip_text = yyyy + '年' + m + '月案例中有';
    else
      tooltip_text = wrap.col_ind + '月案例中有';
    
    tooltip_text += d[wrap.col_tag];
    
    if (d['age'] == '70+')
      tooltip_text += '位<br>年齡在70歲以上';
    else
      tooltip_text += '位<br>年齡在' + d['age'] + '歲之間';
  }
  
  else if (LS_lang == 'fr') {
    tooltip_text = d[wrap.col_tag];
    
    if (wrap.col_ind == 0)
      tooltip_text += " de l'ensemble des cas";
    else if (wrap.tag.includes('latest'))
      tooltip_text += ' cas confirmés<br>de ' + col_label + ' jours plus tôt';
    else if (wrap.tag.includes('overall'))
      tooltip_text += ' cas ' + col_label + ' ' + yyyy;
    else
      tooltip_text += ' cas ' + col_label;
    
    tooltip_text += '<br>sont âgés de ' + d['age'] + ' ans';
  }
  
  else {
    tooltip_text = d[wrap.col_tag];
    
    if (wrap.col_ind == 0)
      tooltip_text += ' of all confirmed cases';
    else if (wrap.tag.includes('latest'))
      tooltip_text += ' confirmed cases<br>of ' + col_label + ' days ago';
    else if (wrap.tag.includes('overall'))
      tooltip_text += ' cases from ' + col_label + ' ' + yyyy;
    else
      tooltip_text += ' cases from ' + col_label;
    
    tooltip_text += '<br>are ' + d['age'] + ' years old';
  }
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
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
  
  //-- Update xlabel
  var xlabel_dict = {en: 'Age', fr: 'Âge', 'zh-tw': '年齡'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_case);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  var i, label_list, legend_label_sum, legend_label_list;
  if (wrap.tag.includes('latest')) {
    if (LS_lang == 'zh-tw')
      label_list = ['', '到', '天前之確診個案'];
    else if (LS_lang == 'fr')
      label_list = ['', ' & ', ' jours plus tôt'];
    else 
      label_list = ['Between ', ' & ', ' days ago'];
    
    legend_label_list = [];
    for (i=1; i<wrap.nb_col; i++)
      legend_label_list.push(label_list[0] + (7*(i-1)) + label_list[1] + (7*i-1) + label_list[3]);
  }
  else if (wrap.tag.includes('overall')) {
    if (LS_lang == 'zh-tw')
      legend_label_list = [
        '2020年1月', '2020年2月','2020年3月', '2020年4月','2020年5月', '2020年6月',
        '2020年7月', '2020年8月','2020年9月', '2020年10月','2020年11月', '2020年12月',
        '2021年1月', '2021年2月','2021年3月', '2021年4月','2021年5月', '2021年6月',
        '2021年7月', '2021年8月','2021年9月', '2021年10月','2021年11月', '2021年12月'
      ];
    else if (LS_lang == 'fr')
      legend_label_list = [
        'Janvier 2020', 'Février 2020', 'Mars 2020', 'Avril 2020', 'Mai 2020', 'Juin 2020', 
        'Juillet 2020', 'Août 2020', 'Septembre 2020', 'Octobre 2020', 'Novembre 2020', 'Décembre 2020', 
        'Janvier 2021', 'Février 2021', 'Mars 2021', 'Avril 2021', 'Mai 2021', 'Juin 2021', 
        'Juillet 2021', 'Août 2021', 'Septembre 2021', 'Octobre 2021', 'Novembre 2021', 'Décembre 2021', 
      ];
    else
      legend_label_list = [
        'January 2020', 'February 2020', 'March 2020', 'April 2020', 'May 2020', 'June 2020', 
        'July 2020', 'Auguest 2020', 'September 2020', 'October 2020', 'November 2020', 'December 2020', 
        'January 2021', 'February 2021', 'March 2021', 'April 2021', 'May 2021', 'June 2021', 
        'July 2021', 'Auguest 2021', 'September 2021', 'October 2021', 'November 2021', 'December 2021', 
      ]; 
  }
  else {
    if (LS_lang == 'zh-tw')
      legend_label_list = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    else if (LS_lang == 'fr')
      legend_label_list = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    else
      legend_label_list = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }
  if (LS_lang == 'zh-tw')
    legend_label_sum = '合計';
  else if (LS_lang == 'fr')
    legend_label_sum = 'Totaux';
  else 
    legend_label_sum = 'Total';
  
  wrap.legend_label = [legend_label_list[wrap.col_ind], legend_label_sum];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(0, 1);
    wrap.legend_label = wrap.legend_label.slice(0, 1);
  }
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', 'normal');
}

//-- Load
function CBA_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      CBA_FormatData(wrap, data);
      CBA_Plot(wrap);
      CBA_Replot(wrap);
    });
}

function CBA_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      CBA_FormatData(wrap, data);
      CBA_Replot(wrap);
    });
}

function CBA_ButtonListener(wrap) {
  //-- Period
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
    else
      tag1 = 'm' + wrap.col_ind;
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
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
  else
    wrap.col_ind = document.getElementById(wrap.tag + "_period").value;
  
  //-- Load
  CBA_InitFig(wrap);
  CBA_ResetText();
  CBA_Load(wrap);
  
  //-- Setup button listeners
  CBA_ButtonListener(wrap);
}
