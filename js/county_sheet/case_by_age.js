
//-- Filename:
//--   case_by_age.js
//--
//-- Author:
//--   Chieh-An Lin

function CBA_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 80, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 80, top: 2};
  
  GP_InitFig(wrap);
}

function CBA_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('case_by_age_title', '確診個案年齡分布');
    LS_AddStr('case_by_age_text', '資料遲一日更新');
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
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('case_by_age_title', 'Cas confirmés par âge');
    LS_AddStr('case_by_age_text', 'Mise à jour avec 1 jour de retard');
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
  }
  
  else { //-- En
    LS_AddStr('case_by_age_title', 'Confirmed Cases by Age');
    LS_AddStr('case_by_age_text', 'Updated typically with 1 day delay');
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
  }
}

function CBA_FormatData(wrap, data) {
  //-- Variables for xtick
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.period];
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For age
  var row;
  
  //-- Other variables
  var y_sum = [0, 0]; //-- For legend, 0 (total) & period
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['age'];
    y = +row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    xtick.push(i);
    xticklabel.push(i*5);
    
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
  
  //-- Choose y_path
  var y_path = wrap.y_path;
  
  //-- Calculate y_path
  //-- If string, use it as nb of ticks
  var log_precision, precision;
  if (typeof y_path === 'string') {
    log_precision = Math.floor(Math.log10(y_max)) - 1;
    precision = Math.pow(10, log_precision);
    precision = Math.max(1, precision); //-- precision at least 1
    y_path = y_max / (+y_path + 0.5);
    y_path = Math.round(y_path / precision) * precision;
  }
  //-- Otherwise, do nothing
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.col_tag_list = col_tag_list;
  wrap.col_tag = col_tag;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_sum;
}

//-- Tooltip
function CBA_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.35;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  if (LS_lang == 'fr')
    month_label = ['Total', 'de janvier', 'de février', 'de mars', "d'avril", 'de mai', 'de juin', 'de juillet', "d'août", 'de septembre', "d'octobre", 'de novembre', 'de décembre'];
  else
    month_label = ['Total', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
  //-- Generate column label
  var col_label;
  if (wrap.tag.includes('latest'))
    col_label = (7*(wrap.period-1)) + '-' + (7*wrap.period-1);
  else
    col_label = month_label[wrap.period];
  
  //-- Generate tooltip text
  var tooltip_text;
  
  if (LS_lang == 'zh-tw') {
    if (wrap.period == 0)
      tooltip_text = '全部案例中有';
    else if (wrap.tag.includes('latest'))
      tooltip_text = col_label + '天前之案例中有';
    else
      tooltip_text = wrap.period + '月案例中有';
    
    tooltip_text += d[wrap.col_tag];
    
    if (d['age'] == '70+')
      tooltip_text += '位<br>年齡在70歲以上';
    else
      tooltip_text += '位<br>年齡在' + d['age'] + '歲之間';
  }
  
  else if (LS_lang == 'fr') {
    tooltip_text = d[wrap.col_tag];
    
    if (wrap.period == 0)
      tooltip_text += " de l'ensemble des cas";
    else if (wrap.tag.includes('latest'))
      tooltip_text += " cas confirmés<br>de " + col_label + ' jours plus tôt';
    else
      tooltip_text += " cas " + col_label;
    
    tooltip_text += '<br>sont âgés de ' + d['age'] + ' ans';
  }
  
  else {
    tooltip_text = d[wrap.col_tag];
    
    if (wrap.period == 0)
      tooltip_text += ' of all confirmed cases';
    else if (wrap.tag.includes('latest'))
      tooltip_text += ' confirmed cases<br>of ' + col_label + ' days ago';
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
  //-- Plot x
  GP_PlotBandX(wrap);
  
  //-- Plot y
  GP_PlotLinearY(wrap);
    
  //-- Make tooltip
  GP_MakeTooltip(wrap);
    
  //-- Define color
  var color_list = GP_wrap.c_list.slice(7).concat(GP_wrap.c_list.slice(0, 7));
  color_list = color_list.concat(color_list.slice(1));
  var color = d3.scaleOrdinal()
    .domain(wrap.col_tag_list)
    .range(color_list);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', color(wrap.col_tag))
    .attr('x', function (d) {return wrap.xscale(d.age);})
    .attr('y', wrap.yscale(0))
    .attr('width', wrap.xscale.bandwidth())
    .attr('height', 0)
      .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
      .on('mousemove', function (d) {CBA_MouseMove(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function CBA_Replot(wrap) {
  //-- Replot y
  GP_ReplotCountAsY(wrap);
  
  //-- Define xlabel
  var xlabel;
  if (LS_lang == 'zh-tw')
    xlabel = '年齡';
  else if (LS_lang == 'fr')
    xlabel = "Âge";
  else
    xlabel = "Age";
  
  //-- Update xlabel
  wrap.svg.select(".xlabel")
    .text(xlabel);
    
  //-- Define ylabel
  var ylabel;
  if (LS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (LS_lang == 'fr')
    ylabel = 'Nombre de cas';
  else
    ylabel = 'Number of cases';
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel);
    
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GP_wrap.trans_delay)
    .attr('fill', wrap.color(wrap.col_tag))
    .attr('y', function (d) {return yscale(d[wrap.col_tag]);})
    .attr('height', function (d) {return yscale(0)-yscale(d[wrap.col_tag]);});
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  var i, label_list;
  if (wrap.tag.includes('latest')) {
    if (LS_lang == 'zh-tw')
      label_list = ['合計 '+LS_GetYearLabel(wrap), '', '到', '天前之確診個案'];
    else if (LS_lang == 'fr')
      label_list = ['Total '+LS_GetYearLabel(wrap), '', ' & ', ' jours plus tôt'];
    else 
      label_list = ['Total '+LS_GetYearLabel(wrap), 'Between ', ' & ', ' days ago'];
    
    legend_label = [label_list[0]];
    for (i=1; i<wrap.nb_col; i++)
      legend_label.push(label_list[1] + (7*(i-1)) + label_list[2] + (7*i-1) + label_list[3]);
  }
  else {
    if (LS_lang == 'zh-tw')
      legend_label = ['合計 '+LS_GetYearLabel(wrap), '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    else if (LS_lang == 'fr')
      legend_label = ['Total '+LS_GetYearLabel(wrap), 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    else
      legend_label = ['Total '+LS_GetYearLabel(wrap), 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }
  
  //-- Update legend color, label, & value
  var legend_color_list = [];
  var legend_label_2 = [];
  var legend_value_2 = [];
  if (wrap.period > 0) {
    legend_color_list.push(wrap.color_list[wrap.period]);
    legend_label_2.push(legend_label[wrap.period]);
    legend_value_2.push(wrap.legend_value[1]);
  }
  legend_color_list.push(wrap.color_list[0]);
  legend_label_2.push(legend_label[0]);
  legend_value_2.push(wrap.legend_value[0]);
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(legend_value_2)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', legend_pos.x)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'end')
    
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label_2)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start')
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
    wrap.period = this.value;
    CBA_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.period == 0)
      tag1 = 'total';
    else if (wrap.tag.includes('latest'))
      tag1 = 'w' + (-wrap.period);
    else
      tag1 = 'm' + wrap.period;
    
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
  wrap.period = document.getElementById(wrap.tag + "_period").value;
  
  //-- Load
  CBA_InitFig(wrap);
  CBA_ResetText();
  CBA_Load(wrap);
  
  //-- Setup button listeners
  CBA_ButtonListener(wrap);
}
