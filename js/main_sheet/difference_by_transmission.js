
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
  wrap.margin_['zh-tw'] = {left: 70, right: 2, bottom: 90, top: 2};
  wrap.margin_['fr'] = {left: 70, right: 2, bottom: 80, top: 2};
  wrap.margin_['en'] = {left: 70, right: 2, bottom: 80, top: 2};
  
  GS_InitFig(wrap);
}

function DBT_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr('difference_by_transmission_title', '發現個案所需時間分布');
    TT_AddStr('difference_by_transmission_button_1', '全部');
    TT_AddStr('difference_by_transmission_button_2', '境外移入');
    TT_AddStr('difference_by_transmission_button_3', '本土');
    TT_AddStr('difference_by_transmission_button_4', '其他');
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr('difference_by_transmission_title', "Délai avant d'identifier une transmission");
    TT_AddStr('difference_by_transmission_button_1', 'Tous');
    TT_AddStr('difference_by_transmission_button_2', 'Importés');
    TT_AddStr('difference_by_transmission_button_3', 'Locaux');
    TT_AddStr('difference_by_transmission_button_4', 'Divers');
  }
  
  else { //-- En
    TT_AddStr('difference_by_transmission_title', 'Delay Before Identifying a Transmission');
    TT_AddStr('difference_by_transmission_button_1', 'All');
    TT_AddStr('difference_by_transmission_button_2', 'Imported');
    TT_AddStr('difference_by_transmission_button_3', 'Local');
    TT_AddStr('difference_by_transmission_button_4', 'Others');
  }
}

function DBT_FormatData(wrap, data) {
  //-- Variables for xtick
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
    x = row['difference'];
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
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (GS_lang == 'zh-tw')
    col_label_list = ['全部', '境外移入', '本土', '其他']
  else if (GS_lang == 'fr')
    col_label_list = ["de l'ensemble des cas", 'des cas importés', 'des cas locaux', 'des autres cas']
  else
    col_label_list = ["all", 'imported', 'local', 'fleet']
  
  //-- Generate tooltip text
  var tooltip_text;
  if (GS_lang == 'zh-tw')
    tooltip_text = col_label_list[wrap.col_ind] + '案例中有' + d[wrap.col_tag] + '位<br>發病或入境後' + d['difference'] + '日確診';
  else if (GS_lang == 'fr')
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
  //-- Define xscale
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- Define xscale_2 for xtick & xticklabel
  var eps = 0.1
  var xscale_2 = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Define xaxis for xtick & xticklabel
  var xaxis = d3.axisBottom(xscale_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  //-- Add xaxis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis)
    .selectAll("text")
      .attr("transform", "translate(0,5)")
      .style("text-anchor", "middle");
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yaxis for ytick & yticklabel
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('d'));
  
  //-- Add yaxis
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .call(yaxis);

  //-- Define yaxis_2 for the frameline at right
  var yaxis_2 = d3.axisRight(yscale)
    .ticks(0)
    .tickSize(0);
  
  //-- Add yaxis_2 & adjust position (no yaxis class)
  wrap.svg.append('g')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_2);
    
  //-- Add xlabel & update value later
  wrap.svg.append('text')
    .attr('class', 'xlabel')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'bottom')
    .attr('transform', 'translate(' + (wrap.width*0.5).toString() + ', ' + (wrap.tot_height-0.2*wrap.margin.bottom).toString() + ')');
  
  //-- Add ylabel & update value later
  wrap.svg.append('text')
    .attr('class', 'ylabel')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (wrap.height/2).toString() + ')rotate(-90)');
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = [GS_wrap.c_list[8], GS_wrap.c_list[0], GS_wrap.c_list[1], GS_wrap.c_list[3], GS_wrap.gray, '#000000']; 
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
    .attr('x', function (d) {return xscale(d.difference);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0)
      .on('mouseover', function (d) {GS_MouseOver(wrap, d);})
      .on('mousemove', function (d) {DBT_MouseMove(wrap, d);})
      .on('mouseleave', function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function DBT_Replot(wrap) {
  //-- Define new yscale
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yticklabel format
  var yticklabel_format;
  if (wrap.ytick[wrap.ytick.length-1] > 9999) 
    yticklabel_format = '.2s';
  else
    yticklabel_format = 'd';
  
  //-- Define new yaxis for ytick
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(yticklabel_format));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_wrap.trans_delay)
    .call(yaxis);
  
  //-- Define xlabel
  var xlabel;
  if (GS_lang == 'zh-tw')
    xlabel = '發病或入境後到確診所需天數';
  else if (GS_lang == 'fr')
    xlabel = "Délai en nombre de jours avant d'identifier une transmission";
  else
    xlabel = 'Delay in number of days before identifying a transmission';
  
  //-- Update xlabel
  wrap.svg.select('.xlabel')
    .text(xlabel);
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (GS_lang == 'fr')
    ylabel = 'Nombre de cas';
  else
    ylabel = 'Number of cases';
  
  //-- Update ylabel
  wrap.svg.select('.ylabel')
    .text(ylabel);
    
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_wrap.trans_delay)
    .attr('fill', wrap.color(wrap.col_tag))
    .attr('y', function (d) {return yscale(d[wrap.col_tag]);})
    .attr('height', function (d) {return yscale(0)-yscale(d[wrap.col_tag]);});
  
  //-- Define legend position
  var legend_pos = {x: 470, y: 45, dx: 12, dy: 30};
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value;
  legend_value.push(wrap.n_tot-legend_value[0]);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = ['有資料案例數', '境外移入', '本土', '其他', '資料不全', '合計 '+TT_GetYearLabel(wrap)];
  else if (GS_lang == 'fr')
    legend_label = ['Données complètes', 'Importés', 'Locaux', 'Divers', 'Données incomplètes', 'Total '+TT_GetYearLabel(wrap)];
  else 
    legend_label = ['Data complete', 'Imported', 'Local', 'Others', 'Data incomplete', 'Total '+TT_GetYearLabel(wrap)];
  
  //-- Update legend color, label, & value
  var legend_color_list, legend_label_2, legend_value_2;
  if (wrap.col_ind == 0) {
    legend_color_list = [wrap.color_list[0], wrap.color_list[4]]
    legend_label_2 = [legend_label[0], legend_label[4]]
    legend_value_2 = [legend_value[0], legend_value[2]]
  }
  else {
    legend_color_list = [wrap.color_list[wrap.col_ind]]
    legend_label_2 = [legend_label[wrap.col_ind]]
    legend_value_2 = [legend_value[1]]
  }
  legend_color_list.push(wrap.color_list[5]);
  legend_label_2.push(legend_label[5]);
  legend_value_2.push(wrap.legend_value[3]);
  
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
    GS_PressRadioButton(wrap, 'ind', wrap.col_ind, this.value);
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
    
    name = wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
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
  GS_PressRadioButton(wrap, 'ind', 0, wrap.col_ind); //-- 0 from .html
  
  //-- Load
  DBT_InitFig(wrap);
  DBT_ResetText();
  DBT_Load(wrap);
  
  //-- Setup button listeners
  DBT_ButtonListener(wrap);
}
