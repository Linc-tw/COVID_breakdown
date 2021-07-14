
//-- Filename:
//--   vaccination_by_dose.js
//--
//-- Author:
//--   Chieh-An Lin

function VBD_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 400;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 5, bottom: 70, top: 5};
  wrap.margin_['fr'] = {left: 90, right: 5, bottom: 70, top: 5};
  wrap.margin_['en'] = {left: 90, right: 5, bottom: 70, top: 5};
  
  GP_InitFig(wrap);
}

function VBD_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_dose_title', '疫苗劑次接種進度');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_dose_title', 'Avancement de vaccination par nombre de doses');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_dose_title', 'Vaccination Progress by Dose');
  }
}

function VBD_FormatData(wrap, data) {
  var i, timestamp;
  for (i=0; i<data.length; i++) {
    if ('timestamp' == data[i]['key'])
      timestamp = data[i]['value'];
  }
  
  //-- Calculate x_min
  var x_min = (new Date(wrap.iso_begin) - new Date(wrap.iso_ref)) / 86400000;
  x_min -= 0.5; //-- For edge
  
  //-- Calculate x_max
  var iso_today = timestamp.slice(0, 10);
  var x_max = (new Date(iso_today) - new Date(wrap.iso_ref)) / 86400000;
  x_max += 0.5; //-- For edge
  
  //-- Half day correction
  var hour = timestamp.slice(11, 13);
  if (+hour < 12)
    x_max -= 1;
  
  //-- Save to wrapper
  wrap.iso_end = iso_today;
  wrap.x_min = x_min;
  wrap.x_max = x_max;
}

function VBD_FormatData2(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var nb_col = col_tag_list.length;
  var row;
  
  //-- Other variables
  var formatted_data = [];
  var y_list_list = [];
  var y_last_list = [];
  var y_max = 0;
  var i, j, x, y, y_list, y_last, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y_list = [];
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == row[col])
        y = NaN;
      else
        y = +row[col];
      
      y_list.push(y);
    }
    y_list.push(0);
    
    y_list_list.push(y_list)
  }
  
  //-- Loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      y_list = y_list_list[i];
      y = y_list[j];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]['index'],
        'y0': y_list[j+1],
        'y1': y_list[j],
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
  var log_precision = Math.floor(Math.log10(y_max)) - 1;
  var precision = Math.pow(10, log_precision);
  var y_path = y_max / (wrap.nb_yticks + 0.5);
  y_path = Math.round(y_path / precision) * precision;
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_last_list;
}

function VBD_MakeXTick(wrap) {
  var xticklabel_month_list;
  if (LS_lang == 'zh-tw')
    xticklabel_month_list = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  else if (LS_lang == 'fr')
    xticklabel_month_list = ['', 'Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  else
    xticklabel_month_list = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
  //-- Generate xtick for month
  var yyyymm_begin = +wrap.iso_begin.slice(5, 7) - 1 + 12 * +wrap.iso_begin.slice(0, 4);
  var yyyymm_end = +wrap.iso_end.slice(5, 7) - 1 + 12 * +wrap.iso_end.slice(0, 4);
  var xtick_sep_month = [];
  var xtick_label_month = [];
  var xticklabel_month = [];
  var x_prev = wrap.x_min;
  var i, x, mm, yyyy, iso;
  
  for (i=yyyymm_begin; i<yyyymm_end+1; i++) {
    //-- Get tick date
    yyyy = Math.floor((i+1)/12);
    mm = ((i+1) % 12 + 1).toLocaleString(undefined, {minimumIntegerDigits: 2}); //-- Get next month
    iso = yyyy + '-' + mm +'-01';
    
    //-- Get index
    x = (new Date(iso) - new Date(wrap.iso_ref)); //-- Calculate difference
    x /= 86400000; //-- Convert from ms to day
    x -= 0.5; //-- For edge
    
    //-- If last month, do not draw xtick_sep_month & use x_max to compare
    if (i == yyyymm_end)
      x = wrap.x_max;
    else
      xtick_sep_month.push(x);
      
    //-- Compare with previous x, draw xtick_label_month & xticklabel_month only if wide enough
    if (x-x_prev >= wrap.xticklabel_width_min) {
      xtick_label_month.push(0.5*(x_prev+x));
      mm = i % 12 + 1; //-- Get current month
      xticklabel_month.push(xticklabel_month_list[mm]);
    }
    
    //-- Update x_prev
    x_prev = x;
  }
  
  //-- Generate xtick for year
  var yyyy_begin = +wrap.iso_begin.slice(0, 4);
  var yyyy_end = +wrap.iso_end.slice(0, 4);
  var xtick_sep_year = [];
  var xtick_label_year = [];
  var xticklabel_year = [];
  x_prev = wrap.x_min;
  
  for (i=yyyy_begin; i<yyyy_end+1; i++) {
    //-- Get tick date
    iso = i + '-12-31';
    
    //-- Get index
    x = (new Date(iso) - new Date(wrap.iso_ref)); //-- Calculate difference
    x /= 86400000; //-- Convert from ms to day
    x += 0.5; //-- For edge
    
    //-- If last year, do not draw xtick_sep_year & use x_max to compare
    if (i == yyyy_end)
      x = wrap.x_max;
    else
      xtick_sep_year.push(x);
      
    //-- Compare with previous x, draw xtick_label_year & xticklabel_year only if wide enough
    if (x-x_prev >= wrap.xticklabel_width_min) {
      xtick_label_year.push(0.5*(x_prev+x));
      xticklabel_year.push(i);
    }
    
    //-- Update x_prev
    x_prev = x;
  }
  
  //-- Save to wrapper
  wrap.xtick_sep_month = xtick_sep_month;
  wrap.xtick_label_month = xtick_label_month;
  wrap.xticklabel_month = xticklabel_month;
  wrap.xtick_sep_year = xtick_sep_year;
  wrap.xtick_label_year = xtick_label_year;
  wrap.xticklabel_year = xticklabel_year;
}

//-- Post processing
function VBD_FormatData4(wrap) {
  //-- Make ticks
  VBD_MakeXTick(wrap);
}

//-- Tooltip
function VBD_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['供應量', '施打量'];
  else if (LS_lang == 'fr')
    col_label_list = ['Approvisionnements', 'Injections'];
  else
    col_label_list = ['Supplies', 'Injections'];
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[0] + ' = ' + GP_AbbreviateValue(d.y_delivery);
  tooltip_text += '<br>' + col_label_list[1] + ' = ' + GP_AbbreviateValue(d.y);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px');
}

function VBD_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Placeholders
  GP_PlotBottomOverallEmptyAxis(wrap);
    
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color & linestyle
  var color_list = GP_wrap.c_list.slice(2, 2+wrap.nb_col).reverse();
  
  //-- Define xscale
  var xscale = d3.scaleLinear()
    .domain([wrap.x_min, wrap.x_max])
    .range([0, wrap.width]);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define dummy area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.x);})
    .y0(yscale(0))
    .y1(yscale(0));
    
  //-- Add area
  var area = wrap.svg.selectAll('.content.area')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update area with dummy details
  area.append('path')
    .attr('class', 'content area')
    .attr('d', function (d) {return draw_area(d);})
    .style('fill', function (d, i) {return color_list[i];});
    
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.area = area;
}

function VBD_Replot(wrap) {
  //-- Define xscale
  var xscale = d3.scaleLinear()
    .domain([wrap.x_min, wrap.x_max])
    .range([0, wrap.width]);
  
  //-- Define & update xaxis_tick_month
  var xaxis_tick_month = d3.axisBottom(xscale)
    .tickSize(12)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick_sep_month)
    .tickFormat('');
  wrap.svg.select('.xaxis.tick.month')
    .call(xaxis_tick_month);
    
  //-- Adjust xtick style
  wrap.svg.selectAll('.xaxis.tick.month line')
    .style('stroke-opacity', '0.8');
    
  //-- Define & update xaxis_tick_year
  var xaxis_tick_year = d3.axisBottom(xscale)
    .tickSize(20)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick_sep_year)
    .tickFormat('');
  wrap.svg.select('.xaxis.tick.year')
    .call(xaxis_tick_year);
  
  //-- Define & update xaxis_label_month
  var xaxis_label_month = d3.axisBottom(xscale)
    .tickSize(0)
    .tickValues(wrap.xtick_label_month)
    .tickFormat(function (d, i) {return wrap.xticklabel_month[i];});
  wrap.svg.select('.xaxis.label.month')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis_label_month)
    .selectAll('text')
      .attr('transform', 'translate(0,8)');
      
  //-- Define & update xaxis_label_year
  var xaxis_label_year = d3.axisBottom(xscale)
    .tickSize(0)
    .tickValues(wrap.xtick_label_year)
    .tickFormat(function (d, i) {return wrap.xticklabel_year[i];});
  wrap.svg.select('.xaxis.label.year')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis_label_year)
    .selectAll('text')
      .attr('transform', 'translate(0,40)');
  
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('.0%'));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis);
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Proportion of the population', fr: 'Part de la population', 'zh-tw': '佔人口比例'};
  GP_ReplotYLabel(wrap, ylabel_dict);
    
  //-- Define area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.x);})
    .y0(function (d) {return yscale(d.y0);})
    .y1(function (d) {return yscale(d.y1);});
    
  //-- Update area
  wrap.area.selectAll('.content.area')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_area(d);});
    
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  var legend_value = []
  var i;
  for (i=0; i<wrap.legend_value.length; i++) 
    legend_value.push(d3.format('.2%')(wrap.legend_value[i]));
      
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['已施打一劑', '已施打兩劑'];
  else if (LS_lang == 'fr')
    legend_label = ['1er dose ', '2nd dose'];
  else
    legend_label = ['1st dose', '2nd dose'];
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label.splice(0, 0, LS_GetLegendTitle_Page(wrap));
  
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
//       .style('font-size', '1.2rem')
      .text(function (d) {return d;});
    
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
//       .style('font-size', '1.2rem')
      .text(function (d) {return d;});
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
      VBD_FormatData4(wrap);
      VBD_Plot(wrap);
      VBD_Replot(wrap);
    });
}

function VBD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data2) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData2(wrap, data2);
      VBD_FormatData4(wrap);
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
