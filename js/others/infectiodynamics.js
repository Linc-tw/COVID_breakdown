
//-- Filename:
//--   infectiodynamics.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- Function declarations - initialization & data

function ID_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 600;
  wrap.tot_height_['fr'] = 600;
  wrap.tot_height_['en'] = 600;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 70, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 70, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 70, top: 2};
  
  GP_InitFig(wrap);
}

function ID_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('infectiodynamics_title', '感染相位變化');
    LS_AddStr('infectiodynamics_button_all', '完整疫情');
    LS_AddStr('infectiodynamics_button_2020_1st', '2020 上半年');
    LS_AddStr('infectiodynamics_button_2020_2nd', '2020 下半年');
    LS_AddStr('infectiodynamics_button_2021_1st', '2021 上半年');
    LS_AddStr('infectiodynamics_button_2021_2nd', '2021 下半年');
    
    LS_AddHtml('infectiodynamics_description', '\
      動態系統是個物理概念，\
      代表其系統狀態可完整由位置和速度來描述，\
      而位置和速度對時間的關係圖被稱為相位圖。\
      <br><br>\
      如果我們將住院人數視為位置，\
      那新增確診人數就是一種改變位置的速度，\
      如此一來疫情即可被視為一感染動態系統，\
      而此系統的相位圖即為住院人數與新增病例的狀態變化。\
      <br><br>\
      這裡我們用本土確診數取代總確診人數，\
      因為本土病例數較有辦法反映台灣實際的疫情動態。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('infectiodynamics_title', "Dynamique d'infection");
    LS_AddStr('infectiodynamics_button_all', 'Toute la pandémie');
    LS_AddStr('infectiodynamics_button_2020_1st', '2020 1er semestre');
    LS_AddStr('infectiodynamics_button_2020_2nd', '2020 2nd semestre');
    LS_AddStr('infectiodynamics_button_2021_1st', '2021 1er semestre');
    LS_AddStr('infectiodynamics_button_2021_2nd', '2021 2nd semestre');
    
    LS_AddHtml('infectiodynamics_description', "\
      Dans la physique, un système dont l'état peut être entièrement décrit par sa position et sa vitesse est appelé un système dynamique.\
      Lorsqu'on dessine la vitesse contre la position en fonction du temps dans un même plan,\
      on parle alors d'un diagramme d'états.\
      <br><br>\
      On peut appliquer ce concept à la pandémie de la COVID-19.\
      Si l'on considère le nombre d'hospitalisation comme une position,\
      le nombre de nouveaux cas peut alors être assimilé à une vitesse avec laquelle la position change.\
      Par conséquent, la dynamique ici est celle d'infection,\
      dont le diagramme d'états est représenté par l'hospitalisation et le nombre de nouveaux cas.\
      <br><br>\
      Dans cette figure, au lieu d'utiliser le nombre de cas confirmés totaux,\
      nous choisissons celui de cas locaux,\
      car ce dernier décrit mieux la dynamique dans la territoire taïwanaise.\
    ");
  }
  
  else { //-- En
    LS_AddStr('infectiodynamics_title', 'Infection Dynamics');
    LS_AddStr('infectiodynamics_button_all', 'All time');
    LS_AddStr('infectiodynamics_button_2020_1st', '2020 1st half year');
    LS_AddStr('infectiodynamics_button_2020_2nd', '2020 2nd half year');
    LS_AddStr('infectiodynamics_button_2021_1st', '2021 1st half year');
    LS_AddStr('infectiodynamics_button_2021_2nd', '2021 2nd half year');
    
    LS_AddHtml('infectiodynamics_description', '\
      In physics, a system of which the state can be fully described by its position & speed is called a dynamical system.\
      When we plot the speed against the position in the same plane and as a function of time,\
      we call this a "phase plot" or a "phase diagram".\
      <br><br>\
      We can apply this concept to the COVID-19 pandemic.\
      If we consider the number of hospitalization as a position,\
      then the number of new cases can be a proxy for the speed affecting the position.\
      Therefore, the dynamics becomes the one for infection,\
      whose phase diagram can be represented by hospitalization & new case counts.\
      <br><br>\
      In this plot, we use local case counts instead of total confirmed cases,\
      since it describes better the dynamics in Taiwan.\
    ');
  }
}

function ID_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var col_tag = col_tag_list[0];
  var i, x, y, row;
  
  //-- Variables for plot
  var x_list = [];
  var y_list = [];
  var last_date;
  
  //-- Variables for yaxis
  var y_max = -1;
  
  //-- Variables for legend
  var y_last = 0; //-- Initialize with 0
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = row[col_tag];
    x_list.push(x);
    
    if ('' == y) {
      y_list.push(NaN);
      continue;
    }
    
    y = Math.max(+y, 0.1);
    y_list.push(y);
    
    //-- Update last date
    last_date = x;
    
    //-- Update y_last
    y_last = y;
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max = Math.log10(y_max);
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
  //-- Generate yticks
  var ytick = [];
  for (i=-1; i<y_max; i+=y_path)
    ytick.push(Math.pow(10, i));
  
  //-- Save to wrapper
  wrap.x_list_0 = x_list;
  wrap.y_list_0 = y_list;
  wrap.y_max_0 = y_max;
  wrap.ytick_0 = ytick;
  wrap.last_date_0 = last_date;
  wrap.legend_value_raw_0 = y_last;
}

function ID_FormatData2(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 5); //-- 0 = date
  var col_tag = col_tag_list[2]; //-- 'local'
  var col_tag_avg = col_tag + '_avg';
  var i, x, y, row;
  
  //-- Variables for plot
  var x_list = [];
  var y_list = [];
  var last_date;
  
  //-- Variables for yaxis
  var y_max = 0;
  
  //-- Variables for legend
  var y_last = 0; //-- Initialize with 0
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = row[col_tag_avg];
    x_list.push(x);
    
    if ('' == y) {
      y_list.push(NaN);
      continue;
    }
    
    y = Math.max(+y, 0.1);
    y_list.push(y);
    
    //-- Update last date
    last_date = x;
    
    //-- Update y_last
    y_last = y;
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max = Math.log10(y_max);
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
  //-- Generate yticks
  var ytick = [];
  for (i=-1; i<y_max; i+=y_path)
    ytick.push(Math.pow(10, i));
  
  //-- Save to wrapper
  wrap.x_list_1 = x_list;
  wrap.y_list_1 = y_list;
  wrap.y_max_1 = y_max;
  wrap.ytick_1 = ytick;
  wrap.last_date_1 = last_date;
  wrap.legend_value_raw_1 = y_last;
}

//-- Post processing
function ID_FormatData3(wrap) {
  var length = Math.min(wrap.y_list_0.length, wrap.y_list_1.length);
  var formatted_data = [];
  var block2 = [];
  var x, date, last, block;
  
  var cut_list = [366, 547, 731, 912, 1096, 1277, 1461]; //-- 4 years, every half year
  var cut = 182;
  
  //-- Main loop over row
  for (i=0; i<length; i++) {
    date = wrap.x_list_1[i];
    x = GP_DateOrdinal(date);
    
    block = {
      date: date,
      x: x,
      y0: wrap.y_list_0[i],
      y1: wrap.y_list_1[i]
    }
    
    if (!isNaN(block.y0) && !isNaN(block.y1))
      last = block;
    
    if (x >= cut) {
      block2.push(block);
      formatted_data.push(block2);
      cut = cut_list[0];
      cut_list = cut_list.slice(1);
      block2 = [];
    }
    
    block2.push(block);
  }
  
  if (block2.length > 0)
    formatted_data.push(block2);
    
  var formatted_data_2 = [];
  for (i=0; i<formatted_data.length; i++)
    formatted_data_2.push(formatted_data[i][0]);
  formatted_data_2.push(last);
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.formatted_data_2 = formatted_data_2;
  wrap.nb_col = formatted_data.length;
  wrap.last = last;
}

//------------------------------------------------------------------------------
//-- Function declarations - tooltip

function ID_MouseOver(wrap, d) {
  if (wrap.hasOwnProperty('tooltip'))
    wrap.tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
}

function ID_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.35;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['住院人數', '本土案例數'];
  else if (LS_lang == 'fr')
    col_label_list = ['Hospitalisation', 'Cas locaux'];
  else
    col_label_list = ['Hospitalization', 'Local cases'];
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[0] + ' = ' + GP_ValueStr_Tooltip(+d.y0);
  tooltip_text += '<br>' + col_label_list[1] + ' = ' + GP_ValueStr_Tooltip(+d.y1);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px');
}

function ID_MouseLeave(wrap, d) {
  if (wrap.hasOwnProperty('tooltip'))
    wrap.tooltip.html('')
      .transition()
      .duration(10)
      .style('opacity', 0);
}

//------------------------------------------------------------------------------
//-- Function declarations - plot

function ID_MakeLogX(wrap) {
  //-- Define xscale
  var xscale = d3.scaleLog()
    .domain([0.095, Math.pow(10, wrap.y_max_0)])
    .range([0, wrap.width]);
  
  return xscale;
}

function ID_MakeLogY(wrap) {
  //-- Define yscale
  var yscale = d3.scaleLog()
    .domain([0.095, Math.pow(10, wrap.y_max_1)])
    .range([wrap.height, 0]);
    
  return yscale;
}

function ID_PlotLine(wrap) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Define dummy line
  var draw_line_0 = d3.line()
    .x(function (d) {return xscale(d.y0);})
    .y(yscale(0.1));
    
  //-- Add line
  var line = wrap.svg.selectAll('.content.line')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line')
    .attr('d', function (d) {return draw_line_0(d);})
    .style('fill', 'none')
    .style('stroke', function (d, i) {return wrap.color_list[i];})
    .style('stroke-width', '2.5px');
    
  //-- Save to wrapper
  wrap.line = line;
}

function ID_PlotDot(wrap) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Add dot
  var dot_list = [];
  var i, dot;
  for (i=0; i<wrap.nb_col; i++) {
    dot = wrap.svg.append('g')
      .style('fill', wrap.color_list[i]);
    
    //-- Update dot with dummy details
    dot.selectAll('.content.dot')
      .data(wrap.formatted_data[i])
      .enter()
      .append('circle')
      .attr('class', 'content dot')
        .attr('cx', function (d) {return xscale(d.y0);})
        .attr('cy', yscale(0.1))
        .attr('r', 0)
          .on('mouseover', function (d) {ID_MouseOver(wrap, d);})
          .on('mousemove', function (d) {wrap.mouse_move(wrap, d);})
          .on('mouseleave', function (d) {ID_MouseLeave(wrap, d);});
    
    dot_list.push(dot);
  }
  
  //-- Save to wrapper
  wrap.dot_list = dot_list;
}

function ID_PlotSymbol(wrap) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Define dummy symbol
  var draw_circle_0 = d3.symbol().type(d3.symbolCircle).size(0);
      
  //-- Add symbol exterior
  var symbol_ext = wrap.svg.selectAll('.content.symbol_ext')
    .data(wrap.formatted_data_2)
    .enter();
  
  //-- Update symbol exterior with dummy details
  symbol_ext.append('path')
    .attr('class', 'content symbol_ext')
    .attr('d', draw_circle_0)
    .attr('transform', function (d) {return 'translate(' + xscale(d.y0) + ',' + yscale(d.y1) + ')';})
    .style('fill', 'none')
    .style('stroke', function (d, i) {if (i == wrap.nb_col) return '#000000'; return wrap.color_list[i];})
    .style('stroke-width', '2.5px');
    
  //-- Add symbol interior
  var symbol_int = wrap.svg.append('g');
  symbol_int.selectAll('.content.symbol_int')
    .data(wrap.formatted_data_2)
    .enter()
    .append('circle')
    .attr('class', 'content symbol_int')
      .attr('cx', function (d) {return xscale(d.y0);})
      .attr('cy', yscale(0.1))
      .attr('r', 0)
      .style('fill', function (d, i) {if (i == wrap.nb_col) return '#000000'; return wrap.color_list[i];})
        .on('mouseover', function (d) {ID_MouseOver(wrap, d);})
        .on('mousemove', function (d) {wrap.mouse_move(wrap, d);})
        .on('mouseleave', function (d) {ID_MouseLeave(wrap, d);});
      
  //-- Save to wrapper
  wrap.symbol_ext = symbol_ext;
  wrap.symbol_int = symbol_int;
}

function ID_Plot(wrap) {
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
  wrap.color_list = [GP_wrap.c_list[0], GP_wrap.c_list[6], GP_wrap.c_list[1], GP_wrap.c_list[7], GP_wrap.c_list[2], GP_wrap.c_list[8], GP_wrap.c_list[3], GP_wrap.c_list[9]];
  
  //-- Define mouse-move
  wrap.mouse_move = ID_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot line
  ID_PlotLine(wrap);
  
  //-- Plot dot
  ID_PlotDot(wrap);
  
  //-- Plot symbol
  ID_PlotSymbol(wrap);
}

//------------------------------------------------------------------------------
//-- Function declarations - replot

function ID_AbbreviateValue(value) {
  if (value >= 1e+4)
    return d3.format('.0s')(value);
  return value.toFixed(0);
}

function ID_ReplotCountAsX(wrap) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define xaxis
  var xaxis = d3.axisBottom(xscale)
    .tickSize(-wrap.height) //-- Top & bottom frameline
    .tickValues(wrap.ytick_0)
    .tickFormat(function (d, i) {return ID_AbbreviateValue(d);});
    
  //-- Add xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(0,6)')
      .style('text-anchor', 'middle');
      
  //-- Tick style
  wrap.svg.selectAll('.xaxis line')
    .style('stroke-opacity', '0.4');
}

function ID_ReplotCountAsY(wrap) {
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width) //-- Top & bottom frameline
    .tickValues(wrap.ytick_1)
    .tickFormat(function (d, i) {return ID_AbbreviateValue(d);});
  
  //-- Add yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis)
    .selectAll('text')
      .attr('transform', 'translate(-3,0)');
}

function ID_ReplotLine(wrap, index) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Define line
  var draw_line = d3.line()
    .x(function (d) {return xscale(d.y0);})
    .y(function (d) {return yscale(d.y1);});
  
  //-- Update line
  wrap.line.selectAll('.content.line')
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_line(d);});
}

function ID_ReplotDot(wrap) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Update dot
  var i;
  for (i=0; i<wrap.nb_col; i++) {
    wrap.dot_list[i].selectAll('.content.dot')
      .data(wrap.formatted_data[i])
      .transition()
      .duration(wrap.trans_delay)
        .attr('cy', function (d) {return yscale(d.y1);})
        .attr('r', function (d) {if (!isNaN(d.y0)) return wrap.r; return 0;}); //-- Don't show dots if NaN
  }
}

function ID_ReplotSymbol(wrap) {
  //-- Define xscale
  var xscale = ID_MakeLogX(wrap);
  
  //-- Define yscale
  var yscale = ID_MakeLogY(wrap);
  
  //-- Define symbol
  var draw_circle = d3.symbol().type(d3.symbolCircle).size(180);
  
  //-- Update symbol exterior
  wrap.symbol_ext.selectAll('.content.symbol_ext')
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', draw_circle);
    
  wrap.symbol_int.selectAll('.content.symbol_int')
    .data(wrap.formatted_data_2)
    .transition()
    .duration(wrap.trans_delay)
      .attr('cy', function (d) {return yscale(d.y1);})
      .attr('r', function (d) {if (!isNaN(d.y0)) return wrap.r; return 0;}); //-- Don't show dots if NaN
}

function ID_ReplotColor(wrap) {
  //-- Change color of line
  wrap.line.selectAll('.content.line')
    .style('stroke', function (d, i) {if (wrap.period == i+1 || wrap.period == 0) return wrap.color_list[i]; return GP_wrap.gray;})
    .style('opacity', function (d, i) {if (wrap.period == i+1 || wrap.period == 0) return 1; return 0.3;});
    
  //-- Change color of dot
  var i;
  for (i=0; i<wrap.nb_col; i++) {
    if (wrap.period == i+1 || wrap.period == 0) {
      wrap.dot_list[i]
        .style('fill', wrap.color_list[i])
        .style('opacity', 1);
    }
    else {
      wrap.dot_list[i]
        .style('fill', GP_wrap.gray)
        .style('opacity', 0.5);
    }
  }
  
  //-- Change color of legend label
  wrap.svg.selectAll('.legend.label')
    .style('fill', function (d, i) {if (wrap.period == i || wrap.period == 0) return wrap.legend_color[i]; if (i == wrap.nb_col+2) return '#000000'; return GP_wrap.gray;})
    .style('opacity', function (d, i) {if (wrap.period == i || wrap.period == 0 || i > wrap.nb_col) return 1; return wrap.plot_opacity;});
}

function ID_Replot(wrap) {
  //-- Replot line
  ID_ReplotLine(wrap);
  
  //-- Replot dot
  ID_ReplotDot(wrap);
  
  //-- Replot symbol
  ID_ReplotSymbol(wrap)
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  ID_ReplotCountAsX(wrap);
  
  //-- Replot yaxis
  ID_ReplotCountAsY(wrap);
  
  //-- Replot xlabel
  var xlabel_dict = {en: 'Hospitalization', fr: 'Hospitalisation', 'zh-tw': '住院人數'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  var ylabel_dict = {en: 'Local cases (7-day average)', fr: 'Cas locaux (moyenne sur 7 jours)', 'zh-tw': '本土案例數（七日平均）'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define legend position
  wrap.legend_pos = {x: 40, y: 30, dx: 10, dy: 27};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice(0, 4).concat([GP_wrap.gray, '#000000']);
  
  //-- Define legend value
  wrap.legend_value = ['', '', '', ''];
  
  //-- Define legend label
  if (LS_lang == 'zh-tw') { 
    wrap.legend_label = ['2020 上半年', '2020 下半年', '2021 上半年', '2021 下半年'];
    wrap.legend_label = wrap.legend_label.concat(['◉ 起始日', '◉ ' + wrap.last.date]);
  }
  else if (LS_lang == 'fr') {
    wrap.legend_label = ['2020 1er semestre', '2020 2nd semestre', '2021 1er semestre', '2021 2nd semestre'];
    wrap.legend_label = wrap.legend_label.concat(['◉ Début de la période', '◉ ' + wrap.last.date]);
  }
  else {
    wrap.legend_label = ['2020 1st half year', '2020 2nd half year', '2021 1st half year', '2021 2nd half year'];
    wrap.legend_label = wrap.legend_label.concat(['◉ Period start', '◉ ' + wrap.last.date]);
  }
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, '');
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', '1.2rem');
  
  //-- Replot color
  ID_ReplotColor(wrap);
}

//------------------------------------------------------------------------------
//-- Function declarations - load & main

//-- Load
function ID_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      ID_FormatData(wrap, data);
      ID_FormatData2(wrap, data2);
      ID_FormatData3(wrap);
      ID_Plot(wrap);
      ID_Replot(wrap);
    });
}

function ID_ButtonListener(wrap) {
  //-- Period
  d3.select(wrap.id +'_period').on('change', function() {
    wrap.period = this.value;
    ID_Replot(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    var tag1;
    
    if (wrap.period == 1)
      tag1 = '2020_1st';
    else if (wrap.period == 2)
      tag1 = '2020_2nd';
    else if (wrap.period == 3)
      tag1 = '2021_1st';
    else if (wrap.period == 4)
      tag1 = '2021_2nd';
    else if (wrap.period == 5)
      tag1 = '2022_1st';
    else
      tag1 = 'all';
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    ID_ResetText();
    ID_Replot(wrap);
  });
}

//-- Main
function ID_Main(wrap) {
  wrap.id = '#' + wrap.tag;
  wrap.period = document.getElementById(wrap.tag + "_period").value;
  
  //-- Load
  ID_InitFig(wrap);
  ID_ResetText();
  ID_Load(wrap);
  
  //-- Setup button listeners
  ID_ButtonListener(wrap);
}
