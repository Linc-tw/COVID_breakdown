
    //--------------------------------//
    //--  death_delay.js            --//
    //--  Chieh-An Lin              --//
    //--  2022.12.05                --//
    //--------------------------------//

function DD_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  //-- No GP_InitFig_Overall because it doesn't change axis
  else
    GP_InitFig_SimpleBar(wrap);
}

function DD_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('death_delay_title', '確診至死亡所需時間分布');
    LS_AddStr('death_delay_button_total', '合計');
    LS_AddStr('death_delay_button_2020', '2020');
    LS_AddStr('death_delay_button_2021', '2021');
    LS_AddStr('death_delay_button_2022', '2022');
    LS_AddStr('death_delay_button_2023', '2023');
    
    LS_AddHtml('death_delay_description', '\
      當個案死亡時，其「確診到死亡所需時間」為確診通報日與死亡通報日間相隔天數。\
      <br><br>\
      確診通報日未必等同於採檢日或發病日，同理死亡通報日也未必等同於死亡日。\
      <br><br>\
      此分佈圖有助於估計確診高峰與死亡高峰間之時間差。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('death_delay_title', 'Délai entre l\'infection et le décès');
    LS_AddStr('death_delay_button_total', 'Totaux');
    LS_AddStr('death_delay_button_2020', '2020');
    LS_AddStr('death_delay_button_2021', '2021');
    LS_AddStr('death_delay_button_2022', '2022');
    LS_AddStr('death_delay_button_2023', '2023');
    
    LS_AddHtml('death_delay_description', '\
      Le « Délai entre l\'infection et le décès » est, lorsque un patient est mort,\
      le nombre de jours entre la date du signalement de son diagnosis et celle du signalement de son décès.\
      <br><br>\
      La date du signalement de diagnosis n\'est pas nécessairement celle de dépistage, ni nécessairement celle d\'apparision des symptômes.\
      De même, la date du signalement de décès n\'est pas nécessairement celle de décès.\
      <br><br>\
      Cette distribution aide à caractériser le délai entre les pics d\'une vague des cas et celle des décès.\
    ');
  }
  
  else { //-- En
    LS_AddStr('death_delay_title', 'Delay between Case and Death Reports');
    LS_AddStr('death_delay_button_total', 'Total');
    LS_AddStr('death_delay_button_2020', '2020');
    LS_AddStr('death_delay_button_2021', '2021');
    LS_AddStr('death_delay_button_2022', '2022');
    LS_AddStr('death_delay_button_2023', '2023');
    
    LS_AddHtml('death_delay_description', '\
      The "Delay between Case and Death Reports" is, when a patient dies,\
      the number of days between the report date of diagnosis and that of death.\
      <br><br>\
      The report date of diagnosis is not necessarily the testing date, nor necessarily the onset date.\
      Similarly, the death report date is not necessarily the date of death.\
      <br><br>\
      This distribution helps characterizing the delay between the peaks of a case wave and a death wave.\
    ');
  }
}

function DD_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'difference';
  var x_list = []; //-- For age
  
  //-- Variables for xaxis
  var xtick = [];
  var xticklabel = [];
  var xlabel_path = 10; //-- Hard-coded
  var r = 0;
  
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
    if (!wrap.tag.includes('mini') && i % xlabel_path == r) {
      xtick.push(i)
      xticklabel.push(x);
    }
    
    //-- Update y_sum
    y_sum[0] += +row[col_tag_list[0]];
    y_sum[1] += y;
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Last tick
  x_list.push('dummy');
  x = xticklabel.pop();
  xticklabel.push(x+'+');
  
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
  wrap.y_sum = y_sum;
}

function DD_FormatData2(wrap, data2) {
  var col_tag_list = data2.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  
  //-- Loop over row
  var i, value, value_0;
  for (i=0; i<data2.length; i++) {
    //-- Get value of `avg`
    if ('avg' == data2[i]['key']) {
      value_0 = data2[i][col_tag_list[0]];
      value = data2[i][col_tag];
      wrap.legend_value_raw = [d3.format('.2f')(value_0), d3.format('.2f')(value)];
    }
  }
}

//-- Tooltip
function DD_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  var col_label;
  if (LS_lang == 'zh-tw') {
    if (wrap.tag.includes('latest'))
      col_label = '近90日';
    else if (wrap.col_ind == 0)
      col_label = '所有';
    else
      col_label = wrap.col_tag + '年';
  }
  else if (LS_lang == 'fr') {
    if (wrap.tag.includes('latest'))
      col_label = 'des décès des<br>90 derniers jours sont signalés<br>';
    else if (wrap.col_ind == 0)
      col_label = 'des décès sont signalés<br>';
    else
      col_label = 'des décès en '+wrap.col_tag + ' sont signalés<br>';
  }
  else {
    if (wrap.tag.includes('latest'))
      col_label = 'all deaths from<br>last 90 days are reported<br>';
    else if (wrap.col_ind == 0)
      col_label = 'all deaths are reported<br>';
    else
      col_label = 'deaths in '+wrap.col_tag + ' are reported<br>';
  }
  
  //-- Generate tooltip text
  var tooltip_text;
  if (LS_lang == 'zh-tw')
    tooltip_text = col_label + '死亡通報中有' + d[wrap.col_tag] + '位<br>發生在確診後' + d['difference'] + '天';
  else if (LS_lang == 'fr')
    tooltip_text = d[wrap.col_tag] + ' ' + col_label + d['difference'] + ' jour(s) après leur diagnosis';
  else
    tooltip_text = d[wrap.col_tag] + ' of ' + col_label + d['difference'] + ' day(s) after being diagnosed';
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function DD_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[0];
  
  //-- Define mouse-move
  wrap.mouse_move = DD_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function DD_Replot(wrap) {
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
  var xlabel_dict = {
    en: 'Delay in days between case and death reports', 
    fr: 'Délai en jours entre infection et décès',
    'zh-tw': '確診到死亡所需天數'
  };
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_death);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  var col_tag;
  if (wrap.tag.includes('overall'))
    col_tag = wrap.col_tag + ' all year';
  wrap.legend_label = [col_tag, LS_GetLegendTitle_Page(wrap)];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(1, 2);
    wrap.legend_label = wrap.legend_label.slice(1, 2);
  }
  
  //-- Update legend title
  var legend_title = {en: 'Average delay in days', fr: 'Délai moyen en jours', 'zh-tw': '平均延遲天數'}; //-- No time info for title here
  GP_UpdateLegendTitle(wrap, legend_title[LS_lang]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'string', wrap.legend_size);
  
//   var n_dy;
//   if (wrap.tag.includes('overall') && wrap.col_ind > 0)
//     n_dy = 3.5;
//   else
//     n_dy = 2.5;
//   
//   var legend_value_2 = [wrap.y_sum[1], wrap.y_sum[0]];
//   var legend_label_2 = ['Total', LS_GetLegendTitle_Page(wrap)];
//   if (wrap.col_ind == 0) {
//     legend_value_2 = legend_value_2.slice(1, 2);
//     legend_label_2 = legend_label_2.slice(1, 2);
//   }
//   var mean_title = {en: 'Deaths', fr: 'Décès', 'zh-tw': '死亡人數'};
//   legend_value_2.splice(0, 0, '');
//   legend_label_2.splice(0, 0, mean_title[LS_lang]);
//   
//   //-- Update legend value 2
//   wrap.svg.selectAll('.legend.value2')
//     .remove()
//     .exit()
//     .data(legend_value_2)
//     .enter()
//     .append('text')
//       .attr('class', 'legend value2')
//       .attr('x', wrap.legend_pos.x)
//       .attr('y', function (d, i) {return wrap.legend_pos.y+(n_dy+i)*wrap.legend_pos.dy;})
//       .attr('text-anchor', 'end')
//       .style('fill', function (d, i) {return wrap.legend_color[i];})
//       .text(function (d, i) {if (0 == i) return ''; return d;});
//       
//   //-- Update legend label 2
//   wrap.svg.selectAll('.legend.label2')
//     .remove()
//     .exit()
//     .data(legend_label_2)
//     .enter()
//     .append('text')
//       .attr('class', 'legend label')
//       .attr('x', wrap.legend_pos.x+wrap.legend_pos.dx)
//       .attr('y', function (d, i) {return wrap.legend_pos.y+(n_dy+i)*wrap.legend_pos.dy;})
//       .attr('text-anchor', 'start')
//       .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
//       .style('fill', function (d, i) {return wrap.legend_color[i];})
//       .text(function (d) {return d;});
//       
//   if (wrap.legend_size != 'normal') {
//     wrap.svg.selectAll('.legend.value2')
//         .style('font-size', wrap.legend_size);
//     
//     wrap.svg.selectAll('.legend.label2')
//         .style('font-size', wrap.legend_size);
//   }
}

//-- Load
function DD_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DD_FormatData(wrap, data);
      DD_FormatData2(wrap, data2);
      DD_Plot(wrap);
      DD_Replot(wrap);
    });
}

function DD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DD_FormatData(wrap, data);
      DD_FormatData2(wrap, data2);
      DD_Replot(wrap);
    });
}

function DD_ButtonListener(wrap) {
  //-- Year
  d3.select(wrap.id +'_year').on('change', function() {
    wrap.col_ind = this.value;
    DD_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1 = wrap.col_tag;
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    DD_ResetText();
    DD_Replot(wrap);
  });
}

//-- Main
function DD_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('overall')) {
    wrap.col_ind = document.getElementById(wrap.tag + '_year').value;
  }
  else {
    wrap.col_ind = 0;
  }
  
  //-- Load
  DD_InitFig(wrap);
  DD_ResetText();
  DD_Load(wrap);
  
  //-- Setup button listeners
  DD_ButtonListener(wrap);
}
