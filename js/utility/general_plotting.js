
//-- Filename:
//--   general_plotting.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- TODO

//Vaccine progress with line
//`incidence_evolution_by_age.js` TODO
//7-day average for CBT, CBD, LCPC, TBC, VBB, BS, 
//Cut continuous data with index
//2020 & 2021 by week (data, plot, text)

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
  wrap.margin_['zh-tw'] = {left: 70, right: 2, bottom: 90, top: 2};
  wrap.margin_['fr'] = {left: 70, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 70, right: 2, bottom: 90, top: 2};
  
  GP_InitFig(wrap);
}

//------------------------------------------------------------------------------
//-- Function declarations - plotting

//-- Require x_list
function GP_PlotDateAsX(wrap) {
  //-- Define xscale for bar
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- Define xscale_tick for xtick + xticklabel
  var eps = 0.1
  var xscale_tick = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Placeholder for xtick + xticklabel & adjust position (bottom frameline)
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')');
    
  //-- Save to wrapper
  wrap.xscale = xscale;
  wrap.xscale_tick = xscale_tick;
}

//-- Require x_list, xtick & xticklabel
function GP_PlotBandX(wrap) {
  //-- Define xscale for bar
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- Define xscale_tick for xtick + xticklabel
  var eps = 0.1
  var xscale_tick = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Define xaxis for xtick & xticklabel
  var xaxis = d3.axisBottom(xscale_tick)
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
    
  //-- Placeholder for xlabel
  wrap.svg.append('text')
    .attr('class', 'xlabel')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'bottom')
    .attr('transform', 'translate(' + (wrap.width*0.5).toString() + ', ' + (wrap.tot_height-0.2*wrap.margin.bottom).toString() + ')');
  
  //-- Save to wrapper
  wrap.xscale = xscale;
  wrap.xscale_tick = xscale_tick;
  wrap.xaxis = xaxis;
}

//-- Require y_max, ytick
function GP_PlotLinearY(wrap) {
  //-- Define yscale for bar, ytick + yticklabel
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Placeholder for ytick + yticklabel
  wrap.svg.append('g')
    .attr('class', 'yaxis');

  //-- Define yaxis_frame for right frameline
  var yaxis_frame = d3.axisRight(yscale)
    .ticks(0)
    .tickSize(0);
  
  //-- Add yaxis_frame & adjust position (right frameline)
  wrap.svg.append('g')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_frame);
  
  //-- Placeholder for ylabel
  wrap.svg.append('text')
    .attr('class', 'ylabel')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (wrap.height/2).toString() + ')rotate(-90)');
    
  //-- Save to wrapper
  wrap.yscale = yscale;
}

//-- Require xticklabel, y_max, ytick
function GP_ReplotDateAsX(wrap) {
  //-- Define xaxis for xtick + xticklabel
  var xaxis = d3.axisBottom(wrap.xscale_tick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return LS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Add xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-20,15) rotate(-90)')
      .style('text-anchor', 'end');
      
  //-- Save to wrapper
  wrap.xaxis = xaxis;
}

//-- Require y_max, ytick
function GP_ReplotCountAsY(wrap) {
  //-- Define yscale for counts
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yticklabel format
  var yticklabel_format;
  if (wrap.ytick[wrap.ytick.length-1] > 9999) 
    yticklabel_format = '.2s';
  else
    yticklabel_format = 'd';
  
  //-- Define yaxis for ytick + yticklabel
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(yticklabel_format));
  
  //-- Add yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis);
    
  //-- Save to wrapper
  wrap.yscale = yscale;
  wrap.yaxis = yaxis;
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
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
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

//-- For THSC & ASC (no tooltip)
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
