
//-- Filename:
//--   difference_by_transmission.js
//--
//-- Author:
//--   Chieh-An Lin

function DBT_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 5, bottom: 75, top: 5};
  wrap.margin_['fr'] = {left: 90, right: 5, bottom: 75, top: 5};
  wrap.margin_['en'] = {left: 90, right: 5, bottom: 75, top: 5};
  
  GP_InitFig(wrap);
}

function DBT_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('difference_by_transmission_title', '發現個案所需時間分布');
    LS_AddStr('difference_by_transmission_button_1', '全部');
    LS_AddStr('difference_by_transmission_button_2', '境外移入');
    LS_AddStr('difference_by_transmission_button_3', '本土');
    LS_AddStr('difference_by_transmission_button_4', '其他');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('difference_by_transmission_title', "Délai avant d'identifier une transmission");
    LS_AddStr('difference_by_transmission_button_1', 'Tous');
    LS_AddStr('difference_by_transmission_button_2', 'Importés');
    LS_AddStr('difference_by_transmission_button_3', 'Locaux');
    LS_AddStr('difference_by_transmission_button_4', 'Divers');
  }
  
  else { //-- En
    LS_AddStr('difference_by_transmission_title', 'Delay Before Identifying a Transmission');
    LS_AddStr('difference_by_transmission_button_1', 'All');
    LS_AddStr('difference_by_transmission_button_2', 'Imported');
    LS_AddStr('difference_by_transmission_button_3', 'Local');
    LS_AddStr('difference_by_transmission_button_4', 'Others');
  }
}

function DBT_FormatData(wrap, data) {
  //-- Variables for xtick
  var x_key = 'difference';
  var xlabel_path = 3; //-- Hard-coded
  var r = 0;
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For difference of days
  var row;
  
  //-- Other variables
  var y_sum = [0, 0]; //-- For legend, 0 (all), col_ind
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Loop over row
  for (i=0; i<31; i++) { //-- Was data.length; now hard-coded to 31 (days)
    row = data[i];
    x = row[x_key];
    y = +row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % xlabel_path == r) {
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
  xtick.push(i);
  xticklabel.push('+');
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Choose y_path
  var y_path;
  if (wrap.col_ind == 0)
    y_path = wrap.y_path_0;
  else if (wrap.col_ind == 1)
    y_path = wrap.y_path_1;
  else if (wrap.col_ind == 2)
    y_path = wrap.y_path_2;
  else
    y_path = wrap.y_path_3;
  
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
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_sum;
}

function DBT_FormatData2(wrap, data2) {
  var n_tot = 0;
  var i;
  
  //-- Read n_tot of series
  for (i=0; i<data2.length; i++) {
    if (wrap.n_tot_key == data2[i]['key']) {
      n_tot = +data2[i]['value'];
      break;
    }
  }
  
  //-- Save to wrapper
  wrap.n_tot = n_tot;
}

//-- Tooltip
function DBT_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.35;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['全部', '境外移入', '本土', '其他']
  else if (LS_lang == 'fr')
    col_label_list = ["de l'ensemble des cas", 'des cas importés', 'des cas locaux', 'des autres cas']
  else
    col_label_list = ["all", 'imported', 'local', 'fleet']
  
  //-- Generate tooltip text
  var tooltip_text;
  if (LS_lang == 'zh-tw')
    tooltip_text = col_label_list[wrap.col_ind] + '案例中有' + d[wrap.col_tag] + '位<br>發病或入境後' + d['difference'] + '日確診';
  else if (LS_lang == 'fr')
    tooltip_text = d[wrap.col_tag] + ' ' + col_label_list[wrap.col_ind] + ' attend(ent)<br>' + d['difference'] + " jour(s) avant d'être identifié(s)";
  else
    tooltip_text = d[wrap.col_tag] + ' of ' + col_label_list[wrap.col_ind] + ' cases required<br>' + d['difference'] + ' day(s) to be identified';
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function DBT_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add xlabel
  GP_PlotXLabel(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
    
  //-- Make tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = [GP_wrap.c_list[8], GP_wrap.c_list[0], GP_wrap.c_list[1], GP_wrap.c_list[3], GP_wrap.gray, '#000000']; 

  //-- Save to wrapper
  wrap.mouse_move = DBT_MouseMove;
  wrap.color_list = color_list;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function DBT_Replot(wrap) {
  //-- Update xaxis
  GP_ReplotBandX(wrap);
  
  //-- Update yaxis
  GP_ReplotCountAsY(wrap);
  
  //-- Update xlabel
  var xlabel_dict = {
    en: 'Delay in number of days before identifying a transmission', 
    fr: "Délai en nombre de jours avant d'identifier une transmission", 
    'zh-tw': '發病或入境後到確診所需天數'
  };
  GP_ReplotXLabel(wrap, xlabel_dict);
    
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of cases', fr: 'Nombre de cas', 'zh-tw': '案例數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
    
  //-- Update bar
  GP_ReplotSingleBar(wrap);
  
  //-- Define legend position
  var legend_pos = {x: 470, y: 45, dx: 12, dy: 30};
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value;
  legend_value.push(wrap.n_tot-legend_value[0]);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['有資料案例數', '境外移入', '本土', '其他', '資料不全', '合計'];
  else if (LS_lang == 'fr')
    legend_label = ['Données complètes', 'Importés', 'Locaux', 'Divers', 'Données incomplètes', 'Total'];
  else 
    legend_label = ['Data complete', 'Imported', 'Local', 'Others', 'Data incomplete', 'Total'];
  
  //-- Update legend color, label, & value
  var legend_color, legend_label_2, legend_value_2;
  if (wrap.col_ind == 0) {
    legend_color = [wrap.color_list[0], wrap.color_list[4]]
    legend_label_2 = [legend_label[0], legend_label[4]]
    legend_value_2 = [legend_value[0], legend_value[2]]
  }
  else {
    legend_color = [wrap.color_list[wrap.col_ind]]
    legend_label_2 = [legend_label[wrap.col_ind]]
    legend_value_2 = [legend_value[1]]
  }
  legend_color.push(wrap.color_list[5]);
  legend_label_2.push(legend_label[5]);
  legend_value_2.push(wrap.legend_value[3]);
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value_2.splice(0, 0, '');
  legend_label_2.splice(0, 0, LS_GetLegendTitle(wrap));
  
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
      .attr('text-anchor', 'end')
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;});
    
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
      .attr('text-anchor', 'start')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;});
}

//-- Load
function DBT_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DBT_FormatData(wrap, data);
      DBT_FormatData2(wrap, data2);
      DBT_Plot(wrap);
      DBT_Replot(wrap);
    });
}

function DBT_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DBT_FormatData(wrap, data);
      DBT_Replot(wrap);
    });
}

function DBT_ButtonListener(wrap) {
  //-- Column index
  $(document).on("change", "input:radio[name='" + wrap.tag + "_ind']", function (event) {
    GP_PressRadioButton(wrap, 'ind', wrap.col_ind, this.value);
    wrap.col_ind = this.value;
    DBT_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.col_ind == 0)
      tag1 = 'all';
    else if (wrap.col_ind == 1)
      tag1 = 'imported';
    else if (wrap.col_ind == 2)
      tag1 = 'local';
    else
      tag1 = 'others';
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    DBT_ResetText();
    DBT_Replot(wrap);
  });
}

//-- Main
function DBT_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.col_ind = document.querySelector("input[name='" + wrap.tag + "_ind']:checked").value;
  GP_PressRadioButton(wrap, 'ind', 0, wrap.col_ind); //-- 0 from .html
  
  //-- Load
  DBT_InitFig(wrap);
  DBT_ResetText();
  DBT_Load(wrap);
  
  //-- Setup button listeners
  DBT_ButtonListener(wrap);
}
