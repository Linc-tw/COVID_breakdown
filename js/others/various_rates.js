
//-- Filename:
//--   various_rates.js
//--
//-- Author:
//--   Chieh-An Lin

function VR_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 400;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 85, right: 5, bottom: 90, top: 5};
  wrap.margin_['fr'] = {left: 85, right: 5, bottom: 90, top: 5};
  wrap.margin_['en'] = {left: 85, right: 5, bottom: 90, top: 5};
  
  GP_InitFig(wrap);
}

function VR_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('various_rates_title', '各種比率之七日平均');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('various_rates_title', 'Taux en moyenne glissante sur 7 jours');
  }
  
  else { //-- En
    LS_AddStr('various_rates_title', '7-day Average of Various Rates');
  }
}

function VR_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Other variables
  var formatted_data = [];
  var y_list_list = [];
  var y_max = 0;
  var i, j, x, y, y_list, block;
  
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
  
  //-- Loop over column
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
      
      //-- Update y_max
      if (!isNaN(y))
        y_max = Math.max(y_max, y);
      
      //-- Stock
      block2.push(block);
    }
    
    //-- Stock
    formatted_data.push(block2);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var log_precision = Math.floor(Math.log10(y_max)) - 1;
  var precision = Math.pow(10, log_precision);
  var y_path = y_max / (wrap.nb_yticks + 0.5);
  y_path = Math.round(y_path / precision) * precision;
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Calculate last row which is not NaN
  var legend_value = [];
  var last, value;
  for (j=0; j<nb_col; j++) {
    last = data.length - 1;
    value = data[last][col_tag_list[j]];
    while ('' == value) {
      last -= 1;
      value = data[last][col_tag_list[j]];
    }
    
    //-- Get latest value as legend value
    legend_value.push(value);
  }
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function VR_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.7;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['陽性率', '入境盛行率', '本土盛行率/1000', '致死率'];
  else if (LS_lang == 'fr')
    col_label_list = ['Taux de positivité', "Taux d'inci. front.", "Taux d'inci. local/1000", 'Taux de létalité'];
  else
    col_label_list = ['Positive rate', 'Arrival incidence', 'Local incidence/1000', 'Fatality rate'];
  
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

function VR_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(3, 3+wrap.nb_col);
  
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Define dummy line
  var draw_line = d3.line()
    .defined(d => !isNaN(d.y))//-- Don't show line if NaN
    .x(function (d) {return xscale(d.x);})
    .y(yscale(0));
    
  //-- Add line
  var line = wrap.svg.selectAll('.content.line')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line')
    .attr('d', function (d) {return draw_line(d);})
    .style('stroke', function (d, i) {return color_list[i];})
    .style('stroke-width', '2.5px')
    .style('fill', 'none');
      
  //-- Add dot
  var dot_list = [];
  var i, dot;
  for (i=0; i<wrap.nb_col; i++) {
    dot = wrap.svg.append('g')
      .style('fill', color_list[i]);
    
    //-- Update dot with dummy details
    dot.selectAll('.content.dot')
      .data(wrap.formatted_data[i])
      .enter()
      .append('circle')
      .attr('class', 'content dot')
        .attr('cx', function (d) {return xscale(d.x);})
        .attr('cy', yscale(0))
        .attr('r', 0)
          .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
          .on('mousemove', function (d) {VR_MouseMove(wrap, d);})
          .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);});
  
    dot_list.push(dot);
  }
  
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.line = line;
  wrap.dot_list = dot_list;
}

function VR_Replot(wrap) {
  //-- Replot xaxis
  GP_ReplotDateAsX(wrap);
  
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('.1%'));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis);
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Rate', fr: 'Taux', 'zh-tw': '比率'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define line
  var draw_line = d3.line()
    .defined(d => !isNaN(d.y))//-- Don't show line if NaN
    .x(function (d) {return xscale(d.x);})
    .y(function (d) {return yscale(d.y);});
  
  //-- Update line
  wrap.line.selectAll('.content.line')
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_line(d);});
    
  //-- Update dot
  var i;
  for (i=0; i<wrap.nb_col; i++) {
    wrap.dot_list[i]
      .selectAll('.content.dot')
      .data(wrap.formatted_data[i])
      .transition()
      .duration(wrap.trans_delay)
        .attr('cy', function (d) {return yscale(d.y);})
        .attr('r', function (d) {if (!isNaN(d.y)) return wrap.r; return 0;}); //-- Don't show dots if NaN
  }

  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 12, dy: 27};
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  var legend_value = wrap.legend_value.slice();
      
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['陽性率', '入境盛行率（逐月更新）', '本土盛行率（乘以1000）', '致死率（累計）'];
  else if (LS_lang == 'fr')
    legend_label = ['Taux de positivité', "Taux d'incidence frontalier (mise à jour mensuellement)", "Taux d'incidence local (multiplié par 1000)", 'Taux de létalité (cumulé)'];
  else
    legend_label = ['Positive rate', 'Arrival incidence (updated monthly)', 'Local incidence (multiplied by 1000)', 'Fatality rate (cumulative)'];
    
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label.splice(0, 0, LS_GetLegendTitle_Last(wrap));
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', legend_pos.x)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'end')
      .style('fill', function (d, i) {return legend_color[i];})
      .style('font-size', '1.2rem')
      .text(function (d, i) {if (0 == i) return ''; return (+d*100).toFixed(2)+'%';});
    
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'start')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', function (d, i) {return legend_color[i];})
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
}

//-- Load
function VR_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VR_FormatData(wrap, data);
      VR_Plot(wrap);
      VR_Replot(wrap);
    });
}

function VR_ButtonListener(wrap) {
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
    VR_ResetText();
    VR_Replot(wrap);
  });
}

//-- Main
function VR_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VR_InitFig(wrap);
  VR_ResetText();
  VR_Load(wrap);
  
  //-- Setup button listeners
  VR_ButtonListener(wrap);
}
