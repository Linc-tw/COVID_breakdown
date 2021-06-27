
//-- Filename:
//--   status_evolution.js
//--
//-- Author:
//--   Chieh-An Lin

function SE_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 90, top: 2};
  
  GS_InitFig(wrap);
}

function SE_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr("status_evolution_title", "疫情變化");
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr("status_evolution_title", "Évolution de la situation");
  }
  
  else { //-- En
    TT_AddStr("status_evolution_title", "Status Evolution");
  }
}

function SE_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var y_max = 0;
  var h, h_list;
  
  //-- Other variables
  var formatted_data = [];
  var i, j, x, y, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    h_list = [];
    x = row['date'];
    y = 0;
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++)
      h_list.push(+row[col_tag_list[j]]);
    
    //-- Loop over column again (reversed order)
    for (j=nb_col-1; j>=0; j--) {
      //-- Current value
      h = h_list[j];
      
      //-- Make data block
      block = {
        'x': x,
        'y0': y,
        'y1': y+h,
        'h_list': h_list.slice(),
        'col': col_tag_list[j]
      };
      
      //-- Update total height
      y += h;
      
      //-- Stock
      formatted_data.push(block);
    }
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var y_path, log_precision, precision;
  //-- If string, use it as nb of ticks
  if (typeof wrap.y_path === 'string') {
    log_precision = Math.floor(Math.log10(y_max)) - 1;
    precision = Math.pow(10, log_precision);
    precision = Math.max(1, precision); //-- precision at least 1
    y_path = y_max / (+wrap.y_path + 0.5);
    y_path = Math.round(y_path / precision) * precision;
  }
  else
    y_path = wrap.y_path;
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Calculate last row which is not zero
  var last = data.length - 1;
  while (+data[last][col_tag_list[0]] == 0)
    last -= 1;
  
  //-- Get latest value as legend value
  var legend_value = [];
  for (j=0; j<nb_col; j++)
    legend_value.push(+data[last][col_tag_list[j]]);
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function SE_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (GS_lang == 'zh-tw')
    col_label_list = ['解隔離', '隔離中', '死亡']
  else if (GS_lang == 'fr')
    col_label_list = ['Rétablis', 'Hospitalisés', 'Décédés']
  else
    col_label_list = ['Discharged', 'Hospitalized', 'Deaths']
  
  //-- Define tooltip texts
  var tooltip_text = d.x;
  var sum = 0;
  var i;
  
  for (i=0; i<wrap.nb_col; i++) {
    tooltip_text += "<br>" + col_label_list[i] + " = " + d.h_list[i];
    sum += d.h_list[i];
  }
  
  //-- Add text for sum
  if (GS_lang == 'zh-tw')
    tooltip_text += "<br>合計 = ";
  else if (GS_lang == 'fr')
    tooltip_text += "<br>Total = ";
  else
    tooltip_text += "<br>Total = ";
  tooltip_text += sum;
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function SE_Plot(wrap) {
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
  
  //-- Define xaxis & update xtick or xticklabel later
  var xaxis = d3.axisBottom(xscale_2)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis);
    
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
  
  //-- Add yaxis_2 & adjust position
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_2);
    
  //-- Add ylabel & update value later
  wrap.svg.append('text')
    .attr('class', 'ylabel')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (wrap.height/2).toString() + ')rotate(-90)');
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GS_wrap.c_list.slice(0, wrap.nb_col);
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
    .attr('fill', function (d) {return color(d.col);})
    .attr('x', function (d) {return xscale(d.x);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0)
    .on('mouseover', function (d) {GS_MouseOver(wrap, d);})
    .on('mousemove', function (d) {SE_MouseMove(wrap, d);})
    .on('mouseleave', function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.xscale_2 = xscale_2;
  wrap.color_list = color_list;
  wrap.bar = bar;
}

function SE_Replot(wrap) {
  //-- Define new xaxis for xticklabel
  var xaxis = d3.axisBottom(wrap.xscale_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(GS_wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-20,15) rotate(-90)')
      .style('text-anchor', 'end');
  
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
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (GS_lang == 'fr')
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
    .duration(GS_wrap.trans_delay)
    .attr('y', function (d) {return yscale(d.y1);})
    .attr('height', function (d) {return yscale(d.y0)-yscale(d.y1);});
    
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color_list = wrap.color_list.slice();
  legend_color_list.push('#000000');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  legend_value.push(sum);
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = ['解隔離', '隔離中', '死亡', '合計'];
  else if (GS_lang == 'fr')
    legend_label = ['Rétablis', 'Hospitalisés', 'Décédés', 'Total'];
  else
    legend_label = ['Discharged', 'Hospitalized', 'Deaths', 'Total'];
  
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
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'end')
  
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
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start')
}

//-- Load
function SE_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      SE_FormatData(wrap, data);
      SE_Plot(wrap);
      SE_Replot(wrap);
    });
}

function SE_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + GS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Replot
    SE_ResetText();
    SE_Replot(wrap);
  });
}

//-- Main
function SE_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  SE_InitFig(wrap);
  SE_ResetText();
  SE_Load(wrap);
  
  //-- Setup button listeners
  SE_ButtonListener(wrap);
}
