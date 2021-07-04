
//-- Filename:
//--   vaccination_progress.js
//--
//-- Author:
//--   Chieh-An Lin

function VP_InitFig(wrap) {
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

function VP_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_progress_title', '疫苗到貨與施打進度');
    LS_AddStr('vaccination_progress_button_1', '全部');
    LS_AddStr('vaccination_progress_button_2', 'AZ');
    LS_AddStr('vaccination_progress_button_3', 'Moderna');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_progress_title', 'Livraisons et avancement de vaccination');
    LS_AddStr('vaccination_progress_button_1', 'Tous');
    LS_AddStr('vaccination_progress_button_2', 'AZ');
    LS_AddStr('vaccination_progress_button_3', 'Moderna');
  }
  
  else { //-- En
    LS_AddStr('vaccination_progress_title', 'Vaccination Progress & Deliveries');
    LS_AddStr('vaccination_progress_button_1', 'All');
    LS_AddStr('vaccination_progress_button_2', 'AZ');
    LS_AddStr('vaccination_progress_button_3', 'Moderna');
  }
}

function VP_FormatData(wrap, data) {
  var i, timestamp, population;
  for (i=0; i<data.length; i++) {
    if ('timestamp' == data[i]['key'])
      timestamp = data[i]['value'];
    else if ('population_twn' == data[i]['key'])
      population = +data[i]['value'];
  }
  
  //-- Save to wrapper
  wrap.population = population;
  wrap.timestamp = timestamp;
}

function VP_FormatData2(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var nb_col = col_tag_list.length;
  var row;
  
  //-- Variables for xtick
  var x_min = (new Date(wrap.iso_begin) - new Date(wrap.iso_ref)) / 86400000;
  x_min -= 0.5; //-- For edge
  
  //-- Other variables
  var y_max = 0; //wrap.population;
  var x = x_min;
  var y = 0;
  var block = {
    'x': x,
    'y': y
  };
  var block2 = [block];
  var i, j;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    
    //-- Before delivery
    x = +row['index'] - 0.5;
    block = {
      'x': x,
      'y': y
    };
    
    //-- Stock
    block2.push(block);
    
    //-- After delivery
    if (0 == wrap.brand) {
      //-- Loop over column
      for (j=0; j<nb_col; j++)
        y += +row[col_tag_list[j]];
    }
    else 
      y += +row[col_tag_list[wrap.brand-1]];
    
    block = {
      'x': x,
      'y': y
    };
    
    //-- Stock
    block2.push(block);
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate last point
  var iso_today = wrap.timestamp.slice(0, 10);
  var x_max = (new Date(iso_today) - new Date(wrap.iso_ref)) / 86400000;
  x_max += 0.5; //-- For edge
  
  //-- Half day correction
  var hour = wrap.timestamp.slice(11, 13);
  if (+hour < 12)
    x_max -= 1;
  
  //-- Stock last point
  x = x_max;
  block = {
    'x': x,
    'y': y
  };
  block2.push(block);
  
  //-- Stock array
  var formatted_data = [block2];
  
  //-- Get latest value as legend value
  var legend_value = [y];
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.iso_today = iso_today;
  wrap.x_min = x_min;
  wrap.x_max = x_max;
  wrap.y_max = y_max;
  wrap.legend_value = legend_value;
}

function VP_MakeXTick(wrap) {
  var xticklabel_month_list;
  if (LS_lang == 'zh-tw')
    xticklabel_month_list = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  else if (LS_lang == 'fr')
    xticklabel_month_list = ['', 'Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  else
    xticklabel_month_list = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
  //-- Generate xtick for month
  var yyyymm_begin = +wrap.iso_begin.slice(5, 7) - 1 + 12 * +wrap.iso_begin.slice(0, 4);
  var yyyymm_today = +wrap.iso_today.slice(5, 7) - 1 + 12 * +wrap.iso_today.slice(0, 4);
  var xtick_sep_month = [];
  var xtick_label_month = [];
  var xticklabel_month = [];
  var x_prev = wrap.x_min;
  var i, x, mm, yyyy, iso;
  
  for (i=yyyymm_begin; i<yyyymm_today+1; i++) {
    //-- Get tick date
    yyyy = Math.floor(i/12);
    mm = (i % 12 + 1 + 1).toLocaleString(undefined, {minimumIntegerDigits: 2}); //-- Get next month
    iso = yyyy + '-' + mm +'-01';
    
    //-- Get index
    x = (new Date(iso) - new Date(wrap.iso_ref)); //-- Calculate difference
    x /= 86400000; //-- Convert from ms to day
    x -= 0.5; //-- For edge
    
    //-- If last month, do not draw xtick_sep_month & use x_max to compare
    if (i == yyyymm_today)
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
  var yyyy_today = +wrap.iso_today.slice(0, 4);
  var xtick_sep_year = [];
  var xtick_label_year = [];
  var xticklabel_year = [];
  x_prev = wrap.x_min;
  
  for (i=yyyy_begin; i<yyyy_today+1; i++) {
    //-- Get tick date
    iso = i + '-12-31';
    
    //-- Get index
    x = (new Date(iso) - new Date(wrap.iso_ref)); //-- Calculate difference
    x /= 86400000; //-- Convert from ms to day
    x += 0.5; //-- For edge
    
    //-- If last year, do not draw xtick_sep_year & use x_max to compare
    if (i == yyyy_today)
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

function VP_FormatData3(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var nb_col = col_tag_list.length;
  var row;
  
  //-- Other variables
  var block2 = [];
  var y_max = 0;
  var i_delivery = 0;
  var delivery = wrap.formatted_data[0][i_delivery+1];
  var i, j, x, y, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = +row['index'];
    
    if (0 == wrap.brand) {
      y = 0;
      //-- Loop over column
      for (j=0; j<nb_col; j++)
        y += +row[col_tag_list[j]];
    }
    else 
      y = +row[col_tag_list[wrap.brand-1]];
    
    if (x >= delivery.x) {
      i_delivery += 2;
      delivery = wrap.formatted_data[0][i_delivery+1];
    }
    
    block = {
      'date': row['date'],
      'x': x,
      'y': y,
      'y_delivery': delivery.y,
    };
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
      
    //-- Stock
    block2.push(block);
  }
  
  //-- Stock array
  wrap.formatted_data.push(block2);
  
  //-- Calculate y_max
  y_max = Math.max(y_max, wrap.y_max);
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks);
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Get latest value as legend value
  wrap.legend_value.push(y);
  
  //-- Save to wrapper
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  
  //-- Post processing
  var threshold = 0.6;
  block2 = [{x: wrap.x_min, y: wrap.population}, {x: wrap.x_max, y: wrap.population}];
  wrap.formatted_data.push(block2);
  
  VP_MakeXTick(wrap);
}

//-- Tooltip
function VP_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['到貨量', '施打量'];
  else if (LS_lang == 'fr')
    col_label_list = ['Livraisons', 'Injections'];
  else
    col_label_list = ['Deliveries', 'Injections'];
  
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

function VP_Plot(wrap) {
  //-- Plot x
  var xscale = d3.scaleLinear()
    .domain([wrap.x_min, wrap.x_max])
    .range([0, wrap.width]);
  
  //-- Define xaxis for xtick_sep_month
  var xaxis_month = d3.axisBottom(xscale)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick_sep_month)
    .tickFormat('');
  
  //-- Add xaxis & adjust position (bottom frameline)
  wrap.svg.append('g')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis_month);
  
  //-- Define xaxis for xtick_sep_year
  var xaxis_year = d3.axisBottom(xscale)
    .tickSize(20)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick_sep_year)
    .tickFormat('');
  
  //-- Add xaxis & adjust position (bottom frameline)
  wrap.svg.append('g')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis_year);
  
  //-- Placeholder for xtick_label_month + xticklabel_month & adjust position (bottom frameline)
  wrap.svg.append('g')
    .attr('class', 'xaxis month')
    .attr('transform', 'translate(0,' + wrap.height + ')');
    
  //-- Placeholder for xtick_label_year + xticklabel_year & adjust position (bottom frameline)
  wrap.svg.append('g')
    .attr('class', 'xaxis year')
    .attr('transform', 'translate(0,' + wrap.height + ')');
    
  //-- Plot y
  GP_PlotLinearY(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(7, 7+wrap.nb_col);
  color_list.push(GP_wrap.gray);
  
  //-- Define linestyle
  var linewidth_list = ['2.5px', '2.5px', '1.5px'];
  var linestyle_list = ['5,0', '5,0', '5,5'];
  
  //-- Define dummy line
  var draw_line = d3.line()
    .x(function (d) {return xscale(d.x);})
    .y(wrap.yscale(0));
    
  //-- Add line
  var line = wrap.svg.selectAll('.content.line')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line')
    .attr('d', function (d) {return draw_line(d);})
    .style('stroke', function (d, i) {return color_list[i];})
    .style('stroke-width', function (d, i) {return linewidth_list[i];})
    .style('stroke-dasharray', function (d, i) {return linestyle_list[i];})
    .style('fill', 'none');
      
  //-- Add dot (only administrated)
  var dot = wrap.svg.append('g')
    .style('fill', color_list[1]);
  
  //-- Update dot with dummy details
  dot.selectAll('.content.dot')
    .data(wrap.formatted_data[1])
    .enter()
    .append('circle')
    .attr('class', 'content dot')
      .attr('cx', function (d) {return xscale(d.x);})
      .attr('cy', wrap.yscale(0))
      .attr('r', 0)
        .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
        .on('mousemove', function (d) {VP_MouseMove(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);});
  
  //-- Save to wrapper
  wrap.xscale = xscale;
  wrap.color_list = color_list;
  wrap.line = line;
  wrap.dot = dot;
}

function VP_Replot(wrap) {
  //-- Define xaxis_month for xtick_label_month + xticklabel_month
  var xaxis_month = d3.axisBottom(wrap.xscale)
    .tickSize(0)
    .tickValues(wrap.xtick_label_month)
    .tickFormat(function (d, i) {return wrap.xticklabel_month[i];});
  
  //-- Add xaxis_month
  wrap.svg.select('.xaxis.month')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis_month)
    .selectAll('text')
      .attr('transform', 'translate(0,8)');
      
  //-- Define xaxis_year for xtick_label_year + xticklabel_year
  var xaxis_year = d3.axisBottom(wrap.xscale)
    .tickSize(0)
    .tickValues(wrap.xtick_label_year)
    .tickFormat(function (d, i) {return wrap.xticklabel_year[i];});
  
  //-- Add xaxis
  wrap.svg.select('.xaxis.year')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis_year)
    .selectAll('text')
      .attr('transform', 'translate(0,40)');
  
  //-- Replot y
  GP_ReplotCountAsY(wrap);
  
  //-- Define ylabel
  var ylabel_dict = {en: 'Number of doses', fr: 'Nombre de doses', 'zh-tw': '疫苗劑數'};
  
  //-- Update ylabel
  wrap.svg.select('.ylabel')
    .text(ylabel_dict[LS_lang]);
    
  //-- Define line
  var draw_line = d3.line()
    .x(function (d) {return wrap.xscale(d.x);})
    .y(function (d) {return wrap.yscale(d.y);});
  
  //-- Update line
  wrap.line.selectAll('.content.line')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_line(d);});
    
  //-- Update dot
  wrap.dot.selectAll('.content.dot')
    .data(wrap.formatted_data[1])
    .transition()
    .duration(wrap.trans_delay)
      .attr('cy', function (d) {return wrap.yscale(d.y);})
      .attr('r', wrap.r);

  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['到貨量', '施打量'];
  else if (LS_lang == 'fr')
    legend_label = ['Livraisons', 'Injections'];
  else
    legend_label = ['Deliveries', 'Injections'];
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(wrap.legend_value)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', legend_pos.x)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style('fill', function (d, i) {return wrap.color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'end');
    
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
      .style('fill', function (d, i) {return wrap.color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start');
}

//-- Load
function VP_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2, data3) {
      if (error)
        return console.warn(error);
      
      VP_FormatData(wrap, data);
      VP_FormatData2(wrap, data2);
      VP_FormatData3(wrap, data3);
      VP_Plot(wrap);
      VP_Replot(wrap);
    });
}

function VP_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[1])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data2, data3) {
      if (error)
        return console.warn(error);
      
      VP_FormatData2(wrap, data2);
      VP_FormatData3(wrap, data3);
      VP_Replot(wrap);
    });
}

function VP_ButtonListener(wrap) {
  //-- Brand
  $(document).on("change", "input:radio[name='" + wrap.tag + "_brand']", function (event) {
    GP_PressRadioButton(wrap, 'brand', wrap.brand, this.value);
    wrap.brand = this.value;
    VP_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.brand == 1)
      tag1 = 'AZ';
    else if (wrap.brand == 2)
      tag1 = 'Moderna';
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
    VP_ResetText();
    VP_Reload(wrap);
  });
}

//-- Main
function VP_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.brand = document.querySelector("input[name='" + wrap.tag + "_brand']:checked").value;
  GP_PressRadioButton(wrap, 'brand', 0, wrap.brand); //-- 0 from .html
  
  //-- Load
  VP_InitFig(wrap);
  VP_ResetText();
  VP_Load(wrap);
  
  //-- Setup button listeners
  VP_ButtonListener(wrap);
}
