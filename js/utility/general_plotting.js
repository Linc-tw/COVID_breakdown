
//-- Filename:
//--   general_plotting.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- TODO

//Legend caption/title
//VP: donation legend
//Note with "Collapse"

//------------------------------------------------------------------------------
//-- Variable declarations - global variable

var GP_wrap = {
  //-- xlabel
  xlabel_path_latest: 7,
  r_list_latest: [3, 3, 4, 1, 1, 2, 2],
  xlabel_path_2020: 25,
  r_list_2020: [12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  // xlabel_path_2021: 25,
  // r_list_2021: [12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  xlabel_path_2021: 15,
  r_list_2021: [7, 7, 8, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
  
  //-- Color
  c_list: ['#3366BB', '#CC6677', '#55BB44', '#EE9977', '#9977AA', '#AAAA55', '#222288', '#660022', '#117733', '#DD6622', '#7733AA', '#BB8811'],
  gray: '#999999',
  
  //-- Transition delay
  trans_delay: 800,
  trans_delay_long: 1600,
};

//------------------------------------------------------------------------------
//-- Function declarations - utility

function GP_AbbreviateValue(value) {
  if (value >= 1e+6)
    return (1e-6*value).toPrecision(3) + 'M';
  if (value >= 1e+4)
    return (1e-3*value).toPrecision(3) + 'k';
  return value;
}

function GP_CumSum(data, col_tag_list) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<col_tag_list.length; j++)
      data[i][col_tag_list[j]] = +data[i][col_tag_list[j]] + +data[i-1][col_tag_list[j]];
  }
}

function GP_CalculateTickInterval(y_max, nb_yticks) {
  var log_precision = Math.floor(Math.log10(y_max)) - 1;
  var precision = Math.pow(10, log_precision);
  precision = Math.max(1, precision); //-- precision at least 1
  
  var y_path = y_max / (nb_yticks + 0.5);
  y_path = Math.round(y_path / precision) * precision;
  return y_path;
}

//------------------------------------------------------------------------------
//-- Function declarations - figure

function GP_InitFig(wrap) {
  //-- Parameters for canvas
  var tot_height = wrap.tot_height_[LS_lang];
  var margin = wrap.margin_[LS_lang];
  var width = wrap.tot_width - margin.left - margin.right;
  var height = tot_height - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  //-- Add svg
  var svg = d3.select(wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + wrap.tot_width + " " + tot_height)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  //-- Add background
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  //-- Save to wrapper
  wrap.tot_height = tot_height;
  wrap.margin = margin;
  wrap.width = width;
  wrap.height = height;
  wrap.corner = corner;
  wrap.svg = svg;
}

function GP_InitFig_Standard(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 400;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 5, bottom: 90, top: 5};
  wrap.margin_['fr'] = {left: 90, right: 5, bottom: 90, top: 5};
  wrap.margin_['en'] = {left: 90, right: 5, bottom: 90, top: 5};
  
  GP_InitFig(wrap);
}

//------------------------------------------------------------------------------
//-- Function declarations - xscale & yscale

//-- Require x_list
function GP_MakeBandXForBar(wrap) {
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.2);
  return xscale;
}

//-- Require x_list
function GP_MakeLinearXForBarTick(wrap) {
  var eps = 0.1
  var xscale = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  return xscale;
}

//-- Require x_list
function GP_MakeBandXForTile(wrap) {
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.04);
  return xscale;
}

//-- Require y_max
function GP_MakeLinearY(wrap) {
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  return yscale;
}

//-- Require y_list
function GP_MakeBandYForTile(wrap) {
  var yscale = d3.scaleBand()
    .domain(wrap.y_list)
    .range([0, wrap.height])
    .padding(0.04);
  return yscale;
}

//------------------------------------------------------------------------------
//-- Function declarations - framelines

function GP_PlotTopFrameline(wrap) {
  //-- Define dummy xscale
  var xscale = d3.scaleBand()
    .domain([0, 1])
    .range([0, wrap.width]);
    
  //-- Define xaxis for top frameline
  var xaxis = d3.axisBottom(xscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis (top frameline)
  wrap.svg.append('g')
    .call(xaxis);
}

function GP_PlotBottomFrameline(wrap) {
  //-- Define dummy xscale
  var xscale = d3.scaleBand()
    .domain([0, 1])
    .range([0, wrap.width]);
    
  //-- Define xaxis for bottom frameline
  var xaxis = d3.axisBottom(xscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis (bottom frameline)
  wrap.svg.append('g')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis);
}

function GP_PlotLeftFrameline(wrap) {
  //-- Define dummy yscale
  var yscale = d3.scaleBand()
    .domain([0, 1])
    .range([wrap.height, 0]);
    
  //-- Define yaxis for left frameline
  var yaxis = d3.axisRight(yscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add yaxis (left frameline)
  wrap.svg.append('g')
    .call(yaxis);
}

function GP_PlotRightFrameline(wrap) {
  //-- Define dummy yscale
  var yscale = d3.scaleBand()
    .domain([0, 1])
    .range([wrap.height, 0]);
    
  //-- Define yaxis for right frameline
  var yaxis = d3.axisRight(yscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add yaxis (right frameline)
  wrap.svg.append('g')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis);
}

//------------------------------------------------------------------------------
//-- Function declarations - xaxis & yaxis

//-- Placeholder for top xaxis
function GP_PlotTopEmptyAxis(wrap) {
  wrap.svg.append('g')
    .attr('class', 'xaxis');
}

//-- Placeholder for bottom xaxis
function GP_PlotBottomEmptyAxis(wrap) {
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')');
}

//-- Placeholder for left yaxis
function GP_PlotLeftEmptyAxis(wrap) {
  wrap.svg.append('g')
    .attr('class', 'yaxis');
}

//-- Placeholder for right yaxis
function GP_PlotRightEmptyAxis(wrap) {
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .attr('transform', 'translate(' + wrap.width + ',0)');
}

//------------------------------------------------------------------------------
//-- Function declarations - frame

function GP_PlotBottomLeft(wrap) {
  GP_PlotTopFrameline(wrap);
  GP_PlotBottomEmptyAxis(wrap);
  GP_PlotLeftEmptyAxis(wrap);
  GP_PlotRightFrameline(wrap);
}

function GP_PlotTopLeft(wrap) {
  GP_PlotTopEmptyAxis(wrap);
  GP_PlotBottomFrameline(wrap);
  GP_PlotLeftEmptyAxis(wrap);
  GP_PlotRightFrameline(wrap);
}

//------------------------------------------------------------------------------
//-- Function declarations - labels

//-- Placeholder for xlabel
function GP_PlotXLabel(wrap) {
  wrap.svg.append('text')
    .attr('class', 'xlabel')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'bottom')
    .attr('transform', 'translate(' + (wrap.width*0.5).toString() + ', ' + (wrap.tot_height-0.2*wrap.margin.bottom).toString() + ')');
}
  
//-- Placeholder for ylabel
function GP_PlotYLabel(wrap) {
  wrap.svg.append('text')
    .attr('class', 'ylabel')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (wrap.height/2).toString() + ')rotate(-90)');
}

//------------------------------------------------------------------------------
//-- Function declarations - xaxis

function GP_ReplotDateAsX(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define xaxis
  var xaxis = d3.axisBottom(xscale)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xticklabel)
    .tickFormat(function (d) {return LS_ISODateToMDDate(d);});
  
  //-- Add xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-20,15) rotate(-90)')
      .style('text-anchor', 'end');
      
  //-- Save to wrapper
  wrap.xscale_tick = xscale;
}

function GP_ReplotBandX(wrap) {
  //-- Define xscale
  var xscale = GP_MakeLinearXForBarTick(wrap);
  
  //-- Define xaxis
  var xaxis = d3.axisBottom(xscale)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  //-- Add xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(0,5)')
      .style('text-anchor', 'middle');
      
  //-- Save to wrapper
  wrap.xscale_tick = xscale;
}

//-- Require xticklabel_dict
function GP_ReplotTileX(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForTile(wrap);
    
  //-- Define xaxis
  var xaxis = d3.axisTop(xscale)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.xticklabel_dict[LS_lang][i];});
  
  //-- Add xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(8,-5) rotate(-90)')
      .style('font-size', '20px')
      .style('text-anchor', 'start');
      
  //-- Save to wrapper
  wrap.xscale_tick = xscale;
}

function GP_ReplotXLabel(wrap, xlabel_dict) {
  //-- Update xlabel
  wrap.svg.select(".xlabel")
    .text(xlabel_dict[LS_lang]);
}

//------------------------------------------------------------------------------
//-- Function declarations - yaxis

function GP_ReplotCountAsY(wrap) {
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Define yticklabel format
  var yticklabel_format;
  if (wrap.ytick[wrap.ytick.length-1] > 9999) 
    yticklabel_format = '.2s';
  else
    yticklabel_format = 'd';
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width) //-- Top & bottom frameline
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(yticklabel_format));
  
  //-- Add yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis);
      
  //-- Save to wrapper
  wrap.yscale_tick = yscale;
}

//-- Require yticklabel_dict
function GP_ReplotTileY(wrap) {
  //-- Define yscale
  var yscale = GP_MakeBandYForTile(wrap);
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.yticklabel_dict[LS_lang][i];});
  
  //-- Add yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis)
    .selectAll('text')
      .attr('transform', 'translate(-3,0)')
      .style('font-size', '20px');
      
  //-- Save to wrapper
  wrap.yscale_tick = yscale;
}

function GP_ReplotYLabel(wrap, ylabel_dict) {
  //-- Update ylabel
  wrap.svg.select('.ylabel')
    .text(ylabel_dict[LS_lang]);
}

//------------------------------------------------------------------------------
//-- Function declarations - plotting charts

function GP_PlotMultipleBar(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return wrap.color_list[d.col_ind];})
    .attr('x', function (d) {return xscale(d.x);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0)
      .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
      .on('mousemove', function (d) {wrap.mouse_move(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);})
      
  //-- Save to wrapper
  wrap.bar = bar;
}

function GP_ReplotMultipleBar(wrap) {
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('y', function (d) {return yscale(d.y1);})
      .attr('height', function (d) {return yscale(d.y0)-yscale(d.y1);});
}

function GP_PlotSingleBar(wrap) {
  //-- Define xscale for bar
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale for counts
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', wrap.color_list[wrap.col_ind])
    .attr('x', function (d) {return xscale(d[wrap.x_key]);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0)
      .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
      .on('mousemove', function (d) {wrap.mouse_move(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);})
      
  //-- Save to wrapper
  wrap.bar = bar;
}

function GP_ReplotSingleBar(wrap) {
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('fill', wrap.color_list[wrap.col_ind])
      .attr('y', function (d) {return yscale(d[wrap.col_tag]);})
      .attr('height', function (d) {return yscale(0)-yscale(d[wrap.col_tag]);});
}
  
function GP_PlotAvgLine(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Define dummy line
  var draw_line_0 = d3.line()
    .defined(d => !isNaN(d.y))//-- Don't show line if NaN
    .x(function (d) {return xscale(d.x) + 0.5*xscale.bandwidth();})
    .y(yscale(0));
    
  //-- Add line
  var line = wrap.svg.selectAll('.content.line')
    .data([wrap.moving_avg])
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line')
    .attr('d', function (d) {return draw_line_0(d);})
    .style('stroke', GP_wrap.gray)
    .style('stroke-width', '2.5px')
    .style('fill', 'none');
    
  //-- Save to wrapper
  wrap.draw_line_0 = draw_line_0;
  wrap.line = line;
}

function GP_ReplotAvgLine(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Define line
  var draw_line;
  if (wrap.cumul > 0)
    draw_line = wrap.draw_line_0; //-- No avg line if cumulative
  else
    draw_line = d3.line()
      .defined(d => !isNaN(d.y))//-- Don't show line if NaN
      .x(function (d) {return xscale(d.x) + 0.5*xscale.bandwidth();})
      .y(function (d) {return yscale(d.y);});
  
  //-- Update line
  wrap.line.selectAll('.content.line')
    .data([wrap.moving_avg])
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_line(d);});
}

function GP_PlotCorr(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForTile(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeBandYForTile(wrap);
  
  //-- Add square
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('rect')
      .attr('class', 'content square')
      .attr('x', function (d) {return xscale(d[wrap.x_key]);})
      .attr('y', function (d) {return yscale(d[wrap.y_key]);})
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', xscale.bandwidth())
      .attr('height', yscale.bandwidth())
      .style('fill', '#FFFFFF')
        .on('mouseover', function (d) {GP_MouseOver2(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave2(wrap, d);});
    
  //-- Add text
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('text')
      .attr('class', 'content text')
      .attr('x', function (d) {return xscale(d[wrap.x_key]) + 0.5*+xscale.bandwidth();})
      .attr('y', function (d) {return yscale(d[wrap.y_key]) + 0.5*+yscale.bandwidth();})
      .style('fill', function (d) {if (Math.abs(+d.corr)<0.205) return '#000000'; return '#FFFFFF';})
      .text(function (d) {return '';})
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
}

function GP_ReplotCorr(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForTile(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeBandYForTile(wrap);
  
  //-- Update square
  wrap.svg.selectAll('.content.square')
    .transition()
    .duration(wrap.trans_delay)
      .style('fill', function (d) {return wrap.color(+d.corr);});
    
  //-- Update text
  wrap.svg.selectAll('.content.text')
    .remove()
    .exit()
    .data(wrap.formatted_data)
    .enter()
    .append('text')
      .attr('class', 'content text')
      .attr('x', function (d) {return xscale(d[wrap.x_key]) + 0.5*+xscale.bandwidth();})
      .attr('y', function (d) {return yscale(d[wrap.y_key]) + 0.5*+yscale.bandwidth();})
      .style('fill', function (d) {if (Math.abs(+d.corr)<0.205) return '#000000'; return '#FFFFFF';})
      .text(function (d) {if (wrap.count > 0) return d.count; return (+d.corr*100).toFixed(0)+'%';})
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
}

function GP_PlotHotMap(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForTile(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeBandYForTile(wrap);
  
  //-- Add square
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('rect')
      .attr('class', 'content square')
      .attr('x', function (d) {return xscale(d.x);})
      .attr('y', function (d) {return yscale(d.y);})
      .attr('rx', 1.2)
      .attr('ry', 1.2)
      .attr('width', xscale.bandwidth())
      .attr('height', yscale.bandwidth())
      .style('fill', '#FFFFFF')
        .on('mouseover', function (d) {GP_MouseOver2(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave2(wrap, d);});
    
  //-- Add text
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('text')
      .attr('class', 'content text')
      .attr('x', function (d) {return xscale(d.x) + 0.5*+xscale.bandwidth();})
      .attr('y', function (d) {return yscale(d.y) + 0.5*+yscale.bandwidth();})
      .style('fill', function (d) {if (d.value<0.5*wrap.value_max) return '#000000'; return '#FFFFFF';})
      .text(function (d) {if (d.value<0.5001) return ''; return d.value.toFixed(0);})
      .style('font-size', '13px')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
}

function GP_ReplotHotMap(wrap) {
  //-- Update square
  wrap.svg.selectAll('.content.square')
    .transition()
    .duration(wrap.trans_delay)
      .style('fill', function (d) {return wrap.color(d.value);});
}

//------------------------------------------------------------------------------
//-- Function declarations - tooltip

function GP_MakeTooltip(wrap) {
  wrap.tooltip = d3.select(wrap.id)
    .append("div")
    .attr("class", "tooltip")
}

function GP_MouseOver(wrap, d) {
  //-- Change opacity when moving mouse over
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function GP_MouseLeave(wrap, d) {
  //-- Change opacity when moving mouse away
  wrap.tooltip.html('')
    .transition()
    .duration(10)
    .style('opacity', 0);
  
  d3.select(d3.event.target)
    .style('opacity', 1);
}

function GP_GetTooltipPos(wrap, y_alpha, d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - wrap.corner[i][0])**2 + (d[1] - wrap.corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place caption somewhere on the longest arm, parametrizaed by x_alpha & y_alpha
  var x_alpha = 0.1;
  var x_pos = d[0] * (1-x_alpha) + wrap.corner[i_max][0] * x_alpha;
  var y_pos = d[1] * (1-y_alpha) + wrap.corner[i_max][1] * y_alpha;
  
  //-- Calculate adjustment from card header, card body, & buttons
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var card_hdr = 3.125*16; //-- Offset caused by card-header
  var svg_dim = d3.select(wrap.id).node().getBoundingClientRect();
  var x_aspect = (svg_dim.width - 2*buffer) / wrap.tot_width;
  var y_aspect = (svg_dim.height - 2*buffer) / wrap.tot_height;
  
  //-- Update position
  x_pos = (x_pos + wrap.margin.left) * x_aspect + buffer;
  y_pos = (y_pos + wrap.margin.top) * y_aspect + buffer + card_hdr + button;
  
  return [x_pos, y_pos];
}

//-- For THSC, ASC, IEBC, & IEBA (no tooltip)
function GP_MouseOver2(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

//-- For THSC & ASC (no tooltip)
function GP_MouseLeave2(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 1)
}

//-- For CT & ET
function GP_MouseOver3(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.6)
}

//------------------------------------------------------------------------------
//-- Function declarations - button

function GP_PressRadioButton(wrap, btn_tag, old_value, new_value) {
  var old_btn, new_btn;
  old_btn = document.getElementById(wrap.tag + '_' + btn_tag + '_' + old_value);
  new_btn = document.getElementById(wrap.tag + '_' + btn_tag + '_' + new_value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
}

//------------------------------------------------------------------------------
//-- Function declarations - cascade plotting

function GP_Delay(delay) {
  return new Promise(resolve => {
    setTimeout(() => {resolve(delay);}, delay);
  });
}

async function GP_Cascade(plot_list) {
  var plot_list_r = plot_list.reverse();
  var plot, fct, wrap, delay;
  
  while (plot_list_r.length > 0) {
    plot = plot_list_r.pop();
    fct = plot[0];
    wrap = plot[1];
    delay = plot[2];
    
    fct(wrap);
    await GP_Delay(delay);
  }
}

//------------------------------------------------------------------------------
//-- Function declarations - initialization

//-- Execution
d3.csv('processed_data/key_numbers.csv', function (error, data) {
  if (error)
    return console.warn(error);
  
  var i;
  for (i=0; i<data.length; i++) {
    if ('timestamp' == data[i]['key']) {
      LS_wrap.timestamp = data[i]['value'];
      break;
    }
  }

  LS_FillText_Main();
});

//-- Language button
$(document).on('change', "input:radio[name='language']", function (event) {
  var wrap = {tag: 'menu'};
  GP_PressRadioButton(wrap, 'lang', LS_lang, this.value)
  LS_lang = this.value;
  Cookies.set("lang", LS_lang, {sameSite: 'lax'});

  LS_FillText_Main();
});

//-- End of file
//------------------------------------------------------------------------------
