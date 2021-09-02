
//-- Filename:
//--   vaccination_progress.js
//--
//-- Author:
//--   Chieh-An Lin

function VP_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VP_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_progress_title', '疫苗到貨與接種進度');
    LS_AddStr('vaccination_progress_button_total', '全部');
    LS_AddStr('vaccination_progress_button_AZ', 'AZ');
    LS_AddStr('vaccination_progress_button_Moderna', '莫德納');
    LS_AddStr('vaccination_progress_button_Medigen', '高端');
    LS_AddStr('vaccination_progress_button_Pfizer', 'BNT');
  
    LS_AddHtml('vaccination_progress_description', '\
      疫苗之實際施打劑數可能大於到貨劑量數，\
      因為抽完常規劑量後的殘餘液往往足以再供人施打，\
      這些殘劑大約有總到貨量的10%。\
      <br><br>\
      台灣疫苗接種已多次發生因延誤到貨導致進度停滯的現象。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_progress_title', 'Livraisons et avancement de vaccination');
    LS_AddStr('vaccination_progress_button_total', 'Tous');
    LS_AddStr('vaccination_progress_button_AZ', 'AZ');
    LS_AddStr('vaccination_progress_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_progress_button_Medigen', 'Medigen');
    LS_AddStr('vaccination_progress_button_Pfizer', 'Pfizer');
  
    LS_AddHtml('vaccination_progress_description', "\
      Le nombre de doses administrées peut être supérieur au nombre de doses approvisionnées,\
      car les doses supplémentaires peuvent être extraites de chaque flacon.\
      Ces bonus prennent jusqu'à 10% de l'approvisionnement total.\
      <br><br>\
      L'avancement de la campagne de vaccination a été limité à plusieurs reprises par le retard des livraisons.\
    ");
  }
  
  else { //-- En
    LS_AddStr('vaccination_progress_title', 'Vaccination Progress & Deliveries');
    LS_AddStr('vaccination_progress_button_total', 'All');
    LS_AddStr('vaccination_progress_button_AZ', 'AZ');
    LS_AddStr('vaccination_progress_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_progress_button_Medigen', 'Medigen');
    LS_AddStr('vaccination_progress_button_Pfizer', 'Pfizer');
    
    LS_AddHtml('vaccination_progress_description', '\
      The number of injections can be greater than supplies, \
      since additional doses can be extracted. \
      This bonus takes about 10% of the nominal available doses.\
      <br><br>\
      The vaccination progress has been limited several times by lack of supplies.\
    ');
  }
}

//-- Key values
function VP_FormatData(wrap, data) {
  var i, population;
  for (i=0; i<data.length; i++) {
    if ('timestamp' == data[i]['key'])
      wrap.timestamp = data[i]['value'];
    else if ('population_twn' == data[i]['key'])
      population = +data[i]['value'];
  }
  
  //-- Set iso_begin
  if (wrap.tag.includes('latest'))
    wrap.iso_begin = GP_ISODateAddition(wrap.timestamp.slice(0, 10), -90+1);
  else if (wrap.tag.includes('overall'))
    wrap.iso_begin = GP_wrap.iso_ref_vacc;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap, 'dot');
  
  //-- Calculate x_max
  var iso_today = wrap.iso_end;
  var x_today = wrap.x_max;
  var nb_extended_days = (x_today - wrap.x_min) * (wrap.x_max_factor - 1);
  nb_extended_days = Math.ceil(nb_extended_days);
  var x_max = x_today + nb_extended_days;
  
  //-- Add real end
  var iso_end = GP_ISODateAddition(iso_today, nb_extended_days);
  
  //-- Variables for xaxis
  var xticklabel = [];
  var x_list = [];
  var r, x;
  
  if (wrap.tag.includes('latest')) {
    r = GP_GetRForTickPos(wrap, 90+nb_extended_days);
    
    //-- For xtick
    for (i=0; i<90+nb_extended_days; i++) {
      //-- Determine where to have xtick
      if (i % wrap.xlabel_path == r) {
        x = GP_ISODateAddition(wrap.iso_begin, i);
        x_list.push(i+wrap.x_min);
        xticklabel.push(x);
      }
    }
  }
  
  //-- Save to wrapper
  wrap.population = population;
  wrap.iso_today = iso_today;
  wrap.iso_end = iso_end;
  wrap.x_today = x_today;
  wrap.x_max = x_max;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
}

//-- Supply
function VP_FormatData2(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(3); //-- 0 = index, 1 = date, 2 = source
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var i, j, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var x = wrap.x_min;
  var y = 0;
  var y_prev = 0;
  var block = [{x: x, y: y}];
  var annotation = [];
  var date, x_prev;
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    date = row['date'];
    
    //-- If no date, vaccines are delivered but under quality check
    if ('' == date)
      break;
    
    //-- Before delivery
    x = +row['index'] - 0.5;
    
    if (x < wrap.x_min) {
      y = +row[col_tag];
      block[0].y = y;
      continue;
    }
    
    //-- Stock
    block.push({x: x, y: y});
    
    //-- After delivery
    x_prev = x;
    y_prev = y;
    y = +row[col_tag];
    
    //-- Stock
    block.push({x: x, y: y});
    
    //-- Annotation
    source = row['source'];
    if (y > y_prev && source != 'COVAX' && !col_tag_list.includes(source))
      annotation.push({x: x, y: y, x_prev: x_prev, y_prev: y_prev, source: source});
  }
  
  //-- Stock last point
  x = wrap.x_today;
  block.push({x: x, y: y});
  
  //-- Stock array
  var formatted_data = [block];
  
  //-- Get today's value as legend value
  var legend_value_raw = [y];
  
  //-- Continue loop over row (for supplies under checks)
  block = [{x: x, y: y}];
  while (i<data.length) {
    y = +data[i][col_tag];
    i++; 
  }
  block.push({x: x, y: y});
  
  //-- Update y_max
  var y_max = y;
    
  //-- Stock last point
  x = wrap.x_max;
  block.push({x: x, y: y});
  var under_qc = block;
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.under_qc = under_qc;
  wrap.annotation = annotation;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.legend_value_raw = legend_value_raw;
}

//-- Injection
function VP_FormatData3(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var i_delivery = 0;
  var delivery = wrap.formatted_data[0][i_delivery+1];
  var block2 = [];
  var block, last_date;
  
  //-- Variables for yaxis
  var y_max = 0;
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = +row['index'];
    y = +row[col_tag];
    last_date = row['date'];
    
    //-- Get delivery data to stock in block, for tooltip
    if (x >= delivery.x) {
      i_delivery += 2;
      delivery = wrap.formatted_data[0][i_delivery+1];
    }
    
    block = {
      'date': last_date,
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
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Get latest value as legend value
  wrap.legend_value_raw.push(y);
  
  //-- Save to wrapper
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.last_date = last_date;
}

//-- Post processing
function VP_FormatData4(wrap) {
  var eps = 10; //-- [px]
  var i, x, y, x_prev, y_prev;
  var x_anno, y_anno, xp_anno, yp_anno;
  var block_line, block_anno;
  
  //-- No donation line
  
  //-- Donation annotations
  var annotation = [];
  var alpha = 2.5; //-- Distance factor for annotation
  var beta = 1.5;
  var delta = 2.5; //-- [px]
  for (i=0; i<wrap.annotation.length; i++) {
    x = wrap.annotation[i].x;
    y = wrap.annotation[i].y;
    x_prev = wrap.annotation[i].x_prev;
    y_prev = wrap.annotation[i].y_prev;
    x_anno = (x - wrap.x_min) / (wrap.x_max - wrap.x_min) * wrap.width;
    y_anno = (1 - y / wrap.y_max) * wrap.height;
    xp_anno = (x_prev - wrap.x_min) / (wrap.x_max - wrap.x_min) * wrap.width;
    yp_anno = (1 - y_prev / wrap.y_max) * wrap.height;
    
    text_dict = {
      'Japan': {en: 'Donated by Japan', fr: 'Offert par le Japon', 'zh-tw': '日本捐贈'},
      'USA': {en: 'Donated by USA', fr: 'Offert par les É-U', 'zh-tw': '美國捐贈'},
      'Lithuania': {en: 'Donated by Lithuania', fr: 'Offert par la Lituanie', 'zh-tw': '立陶宛捐贈'},
    };
    
    //-- Filter & get those only in frame
    if (x_anno < 180)
      continue;
    
    wrap.annotation[i]['tag'] = '';
    wrap.annotation[i]['points'] =
      (x_anno-alpha*eps) + ',' + (y_anno-beta*eps) + ' ' +
      (x_anno-alpha*eps) + ',' + y_anno + ' ' + 
      (x_anno-delta) + ',' + y_anno + ' ' + 
      (x_anno-delta) + ',' + yp_anno;
    wrap.annotation[i]['text'] = text_dict[wrap.annotation[i].source][LS_lang];
    wrap.annotation[i]['x_text'] = x_anno - alpha*eps;
    wrap.annotation[i]['y_text'] = y_anno - (beta+1)*eps;
    wrap.annotation[i]['text-anchor'] = 'end';
    
    annotation.push(wrap.annotation[i]);
  }
  
  //-- Replace
  wrap.annotation = annotation;
  
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
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color & linestyle
  //-- AZ, Moderna
  var color_list = GP_wrap.c_list.slice(4, 4+2);
  var linewidth_list = ['2.5px', '2.5px'];
  var linestyle_list = ['none', 'none'];
  
  //-- Under QC, extrapolation, today, population
  color_list = color_list.concat([GP_wrap.c_list[4], GP_wrap.c_list[5], GP_wrap.gray]);
  linewidth_list = linewidth_list.concat(['2.5px', '1px', '1.5px']);
  linestyle_list = linestyle_list.concat(['8,5', '8,5', '8,5']);
  
  //-- Define opacity & delay
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
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
        .on('mouseover', function (d) {GP_MouseOver_Bright(wrap, d);})
        .on('mousemove', function (d) {VP_MouseMove(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave_Bright(wrap, d);});
  
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.line = line;
  wrap.dot = dot;
}

function VP_Replot(wrap) {
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
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

  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
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
      
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap, 'dot');
  else 
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_dose);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 10, dy: 27};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  wrap.legend_label = [];
  var col_tag_list = wrap.col_tag_list.slice(1);
  var i, legend_label;
  if (LS_lang == 'zh-tw') {
    legend_label = ['供應量', '接種量'];
    col_tag_list = ['總', 'AZ', '莫德納', '高端', 'BNT'];
    
    for (i=0; i<legend_label.length; i++)
      wrap.legend_label.push(col_tag_list[wrap.col_ind]+legend_label[i]);
  }
  else if (LS_lang == 'fr') {
    legend_label = ['Approvisionnements ', ' Injections '];
    col_tag_list = [['totaux', 'AZ', 'Moderna', 'Medigen', 'Pfizer'], ['totales', 'AZ', 'Moderna', 'Medigen', 'Pfizer']];
    
    for (i=0; i<legend_label.length; i++)
      wrap.legend_label.push(legend_label[i]+col_tag_list[i][wrap.col_ind]);
  }
  else {
    legend_label = [' supplies', ' injections'];
    col_tag_list = ['Total', 'AZ', 'Moderna', 'Medigen', 'Pfizer'];
    
    for (i=0; i<legend_label.length; i++)
      wrap.legend_label.push(col_tag_list[wrap.col_ind]+legend_label[i]);
  }
  
  //-- Update legend title
  var wrap2 = {tag: 'overall'};
  var title = LS_GetLegendTitle_Page(wrap2);
  GP_UpdateLegendTitle(wrap, title);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', '1.2rem');
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
  d3.select(wrap.id +'_brand').on('change', function() {
    wrap.col_ind = this.value;
    VP_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.col_ind == 1)
      tag1 = 'AZ';
    else if (wrap.col_ind == 2)
      tag1 = 'Moderna';
    else if (wrap.col_ind == 3)
      tag1 = 'Medigen';
    else if (wrap.col_ind == 4)
      tag1 = 'Pfizer';
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
  if (wrap.tag.includes('mini'))
    wrap.col_ind = 0;
  else
    wrap.col_ind = document.getElementById(wrap.tag + '_brand').value;
    
  //-- Load
  VP_InitFig(wrap);
  VP_ResetText();
  VP_Load(wrap);
  
  //-- Setup button listeners
  VP_ButtonListener(wrap);
}
