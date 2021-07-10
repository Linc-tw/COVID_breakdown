
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
    LS_AddStr('vaccination_progress_title', '疫苗到貨與接種進度');
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
  var col_tag_list = data.columns.slice(3); //-- 0 = index, 1 = date, 2 = source
  var nb_col = col_tag_list.length;
  var annotation = [];
  var row;
  
  //-- Variables for xtick
  var x_min = (new Date(wrap.iso_begin) - new Date(wrap.iso_ref)) / 86400000;
  x_min -= 0.5; //-- For edge
  
  //-- Other variables
  var x = x_min;
  var y = 0;
  var block = [{x: x, y: y}];
  var i, j, dy;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    
    //-- If no date, vaccines are delivered but under quality check
    if ('' == row['date'])
      break;
    
    //-- Before delivery
    x = +row['index'] - 0.5;
    
    //-- Stock
    block.push({x: x, y: y});
    
    //-- After delivery
    if (0 == wrap.brand) {
      dy = 0;
      //-- Loop over column
      for (j=0; j<nb_col; j++)
        dy += +row[col_tag_list[j]];
    }
    else 
      dy = +row[col_tag_list[wrap.brand-1]];
    y += dy;
    
    //-- Stock
    block.push({x: x, y: y});
    
    //-- Annotation
    source = row['source'];
    if (dy > 0 && source != 'COVAX' && !col_tag_list.includes(source))
      annotation.push({x: x, y: y, source: source});
  }
  
  //-- Calculate today
  var iso_today = wrap.timestamp.slice(0, 10);
  var x_today = (new Date(iso_today) - new Date(wrap.iso_ref)) / 86400000;
  x_today += 0.5; //-- For edge
  
  //-- Half day correction
  var hour = wrap.timestamp.slice(11, 13);
  if (+hour < 12)
    x_today -= 1;
  
  //-- Stock last point
  x = x_today;
  block.push({x: x, y: y});
  
  //-- Calculate x_max
  var x_max = Math.ceil(x_min+0.5 + (x_today - x_min) * wrap.x_max_factor)
  x_max -= 0.5;
  
  //-- Stock array
  var formatted_data = [block];
  
  //-- Get today's value as legend value
  var legend_value = [y];
  
  //-- Continue loop over row
  block = [{x: x, y: y}];
  while (i<data.length) {
    row = data[i];
    
    if (0 == wrap.brand) {
      dy = 0;
      //-- Loop over column
      for (j=0; j<nb_col; j++)
        dy += +row[col_tag_list[j]];
    }
    else 
      dy = +row[col_tag_list[wrap.brand-1]];
    y += dy;
    
    i++; 
  }
  block.push({x: x, y: y});
  
  //-- Update y_max
  var y_max = y;
    
  //-- Stock last point
  x = x_max;
  block.push({x: x, y: y});
  var under_qc = block;
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.under_qc = under_qc;
  wrap.annotation = annotation;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.iso_today = iso_today;
  wrap.x_min = x_min;
  wrap.x_today = x_today;
  wrap.x_max = x_max;
  wrap.y_max = y_max;
  wrap.legend_value = legend_value;
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
    
    //-- Get delivery data to stock in block, for tooltip
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
  if (wrap.y_max_fixed > 0)
    y_max = wrap.y_max_fixed
  else {
    y_max = Math.max(y_max, wrap.y_max);
    y_max *= wrap.y_max_factor;
  }
  
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

//-- Post processing
function VP_FormatData4(wrap) {
  //-- Make ticks
  VP_MakeXTick(wrap);
  
  var eps = 10;
  var i, x, y, x_anno, y_anno;
  var block_line, block_anno;
  
  //-- No donation line
  
  //-- Donation annotations
  var alpha = 2; //-- Distance factor for annotation
  for (i=0; i<wrap.annotation.length; i++) {
    x = wrap.annotation[i].x;
    y = wrap.annotation[i].y;
    x_anno = (x - wrap.x_min) / (wrap.x_max - wrap.x_min) * wrap.width;
    y_anno = (1 - y / wrap.y_max) * wrap.height;
    
    text_dict = {
      'Japan': {en: 'Donated by Japan', fr: 'Offert par le Japon', 'zh-tw': '日本捐贈'},
      'USA': {en: 'Donated by USA', fr: 'Offert par les É-U', 'zh-tw': '美國捐贈'}
    };
    wrap.annotation[i]['tag'] = '';
    wrap.annotation[i]['points'] = x_anno + ',' + y_anno + ' ' + x_anno + ',' + (y_anno-alpha*eps);
    wrap.annotation[i]['text'] = text_dict[wrap.annotation[i].source][LS_lang];
    wrap.annotation[i]['x_text'] = x_anno;
    wrap.annotation[i]['y_text'] = y_anno - (alpha+1)*eps;
    wrap.annotation[i]['text-anchor'] = 'end';
  }
  
  //-- Under QC line
  wrap.formatted_data.push(wrap.under_qc);
  
  //-- Under QC annotation
  x = 0.5 * (wrap.under_qc[1].x + wrap.under_qc[2].x)
  y = wrap.under_qc[1].y;
  x_anno = (x - wrap.x_min) / (wrap.x_max - wrap.x_min) * wrap.width;
  y_anno = (1 - y / wrap.y_max) * wrap.height;
  if (wrap.under_qc[1].y != wrap.under_qc[0].y) {
    text_dict = {en: 'Under', fr: 'En contrôle', 'zh-tw': ''};
    block_anno = {tag: 'delivery', points: '', text: text_dict[LS_lang], x_text: x_anno, y_text: y_anno-3*eps, 'text-anchor': 'middle'};
    wrap.annotation.push(block_anno);
    text_dict = {en: 'quality checks', fr: 'de qualité', 'zh-tw': '檢驗中'};
    block_anno = {tag: 'delivery', points: '', text: text_dict[LS_lang], x_text: x_anno, y_text: y_anno-1.3*eps, 'text-anchor': 'middle'};
    wrap.annotation.push(block_anno);
  }
  
  //-- Extrapolation line
  var administrated = wrap.formatted_data[1];
  var length = administrated.length;
  var last = administrated[length-1];
  var gradient = (last.y - administrated[length-8].y) / 7;
  var extra_days = 14; //Math.ceil(0.75 * (wrap.x_max_factor-1) * (wrap.x_today-wrap.x_min));
  block_line = [last, {x: last.x+extra_days, y: last.y+extra_days*gradient}];
  wrap.formatted_data.push(block_line);
  
  //-- Extrapolation annotation
  x = 0.5 * (wrap.under_qc[1].x + wrap.under_qc[2].x)
  x_anno = (x - wrap.x_min) / (wrap.x_max - wrap.x_min) * wrap.width;
  y_anno = (1 - last.y / wrap.y_max) * wrap.height;
  text_dict = {en: 'Extrapolation', fr: 'Projection', 'zh-tw': '施打趨勢'};
  block_anno = {tag: 'administrated', points: '', text: text_dict[LS_lang], x_text: x_anno, y_text: y_anno+eps, 'text-anchor': 'middle'};
  wrap.annotation.push(block_anno);
  
  //-- Today line
  block_line = [{x: wrap.x_today, y: 0}, {x: wrap.x_today, y: wrap.y_max}];
  wrap.formatted_data.push(block_line);
  
  //-- No today annotation
  
  //-- Population line
  var threshold = 0.2;
  y = wrap.population * threshold;
  block_line = [{x: wrap.x_min, y: y}, {x: wrap.x_max, y: y}];
  wrap.formatted_data.push(block_line);
  
  //-- Population annotation
  y_anno = (1 - y / wrap.y_max) * wrap.height;
  if (y_anno > 10) {
    text_dict = {en: '20% of population', fr: '20% de la population', 'zh-tw': '20%人口'};
    block_anno = {tag: '', points: '', text: text_dict[LS_lang], x_text: 3*eps, y_text: y_anno-eps, 'text-anchor': 'start'};
    wrap.annotation.push(block_anno);
  }
}

//-- Tooltip
function VP_MouseMove(wrap, d) {
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

function VP_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Placeholders
  wrap.svg.append('g')
    .attr('class', 'xaxis tick month')
    .attr('transform', 'translate(0,' + wrap.height + ')');
  wrap.svg.append('g')
    .attr('class', 'xaxis tick year')
    .attr('transform', 'translate(0,' + wrap.height + ')');
  wrap.svg.append('g')
    .attr('class', 'xaxis label month')
    .attr('transform', 'translate(0,' + wrap.height + ')');
  wrap.svg.append('g')
    .attr('class', 'xaxis label year')
    .attr('transform', 'translate(0,' + wrap.height + ')');
    
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color & linestyle
  //-- AZ, Moderna
  var color_list = GP_wrap.c_list.slice(7, 7+wrap.nb_col);
  var linewidth_list = ['2.5px', '2.5px'];
  var linestyle_list = ['none', 'none'];
  
  //-- Under QC, extrapolation, today, population
  color_list = color_list.concat([GP_wrap.c_list[7], GP_wrap.c_list[8], GP_wrap.gray, GP_wrap.gray]);
  linewidth_list = linewidth_list.concat(['2.5px', '1.5px', '1.5px', '1.5px']);
  linestyle_list = linestyle_list.concat(['8,5', '8,5', '8,5', '8,5']);
  
  //-- Define xscale
  var xscale = d3.scaleLinear()
    .domain([wrap.x_min, wrap.x_max])
    .range([0, wrap.width]);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define dummy line
  var draw_line = d3.line()
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
      .attr('cy', yscale(0))
      .attr('r', 0)
        .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
        .on('mousemove', function (d) {VP_MouseMove(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);});
  
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.line = line;
  wrap.dot = dot;
}

function VP_Replot(wrap) {
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
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap);
  var yscale = wrap.yscale_tick;
    
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of doses', fr: 'Nombre de doses', 'zh-tw': '疫苗劑數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
    
  //-- Define line
  var draw_line = d3.line()
    .x(function (d) {return xscale(d.x);})
    .y(function (d) {return yscale(d.y);});
  
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
      .attr('cy', function (d) {return yscale(d.y);})
      .attr('r', wrap.r);

  //-- Update annotation line
  wrap.svg.selectAll('.annotation.line')
    .remove()
    .exit()
    .data(wrap.annotation)
    .enter()
    .append('polyline')
      .attr('class', 'annotation line')
      .attr('points', function (d) {return d.points;})
      .attr('fill', 'none')
      .attr('stroke', GP_wrap.gray)
      .attr('stroke-width', 1);
      
  //-- Update annotation text
  wrap.svg.selectAll('.content.text') //-- Do not change class name for font reason
    .remove()
    .exit()
    .data(wrap.annotation)
    .enter()
    .append('text')
      .attr('class', 'content text') //-- Do not change class name for font reason
      .attr('x', function (d) {return d.x_text;})
      .attr('y', function (d) {return d.y_text;})
      .attr('text-anchor', function (d) {return d['text-anchor'];})
      .attr('dominant-baseline', 'middle')
      .style('fill', function (d) {if (d.tag == 'delivery') return wrap.color_list[0]; if (d.tag == 'administrated') return wrap.color_list[1]; return GP_wrap.gray;})
      .text(function (d) {return d.text;});
      
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  var legend_value = wrap.legend_value.slice();
      
  //-- Define legend label
  var legend_label_2 = [];
  var i, legend_label, col_tag_list;
  if (LS_lang == 'zh-tw') {
    legend_label = ['供應量', '接種量'];
    legend_title = '整體統計';
    col_tag_list = ['總'].concat(wrap.col_tag_list);
    for (i=0; i<legend_label.length; i++)
      legend_label_2.push(col_tag_list[wrap.brand]+legend_label[i]);
  }
  else if (LS_lang == 'fr') {
    legend_label = ['Approvisionnements ', ' Injections '];
    legend_title = 'Stat complète';
    col_tag_list = [['totaux'].concat(wrap.col_tag_list), ['totales'].concat(wrap.col_tag_list)];
    for (i=0; i<legend_label.length; i++)
      legend_label_2.push(legend_label[i]+col_tag_list[i][wrap.brand]);
  }
  else {
    legend_label = [' supplies', ' injections'];
    legend_title = 'Overall stats';
    col_tag_list = ['Total'].concat(wrap.col_tag_list);
    for (i=0; i<legend_label.length; i++)
      legend_label_2.push(col_tag_list[wrap.brand]+legend_label[i]);
  }
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label_2.splice(0, 0, legend_title);
  
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
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
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
      VP_FormatData4(wrap);
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
      VP_FormatData4(wrap);
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
