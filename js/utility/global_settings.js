
//-- Filename:
//--   global_settings.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- TODO
//Revise js for simple x-axis files
//Revise corr js & data
//Vaccine progress with line
//`incidence_evolution_by_county.js` TODO
//`incidence_evolution_by_age.js` TODO

//7-day average for CBT, CBD, LCPC, TBC, VBB, BS, 

//Cut continuous data with index
//2020 & 2021 by week (data, plot, text)

//------------------------------------------------------------------------------
//-- Variable declarations - global variable

var GS_wrap = {
  //-- ID
  tag: 'global',
  
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
//-- Variable declarations - language setting

var GS_lang = Cookies.get("lang"); // 'en', 'fr', 'zh-tw'
if (!GS_lang) {
  GS_lang = "en";
  Cookies.set("lang", GS_lang, {sameSite: 'lax'});
}

var GS_lang_btn = document.getElementById('global_lang_'+GS_lang);
GS_lang_btn.classList.add("active");

//------------------------------------------------------------------------------
//-- Function declarations - general

function GS_ISODateToMDDate(iso_date) {
  var md_date_format;
  if (GS_lang == 'zh-tw')
    md_date_format = d3.timeFormat("%-m月%-d日");
  else if (GS_lang == 'fr')
    md_date_format = d3.timeFormat("%d/%m");
  else
    md_date_format = d3.timeFormat("%b %d");
  
  var date = d3.isoParse(iso_date);
  return md_date_format(date);
}

function GS_CumSum(data, col_tag_list) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<col_tag_list.length; j++) {
      data[i][col_tag_list[j]] = +data[i][col_tag_list[j]] + +data[i-1][col_tag_list[j]];
    }
  }
}

//------------------------------------------------------------------------------
//-- Function declarations - figure

function GS_InitFig(wrap) {
  //-- Parameters for canvas
  var tot_height = wrap.tot_height_[GS_lang];
  var margin = wrap.margin_[GS_lang];
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

//------------------------------------------------------------------------------
//-- Function declarations - tooltip

function GS_MakeTooltip(wrap) {
  wrap.tooltip = d3.select(wrap.id)
    .append("div")
    .attr("class", "tooltip")
}

function GS_MouseOver(wrap, d) {
  //-- Change opacity when moving mouse over
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function GS_MouseLeave(wrap, d) {
  //-- Change opacity when moving mouse away
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function GS_GetTooltipPos(wrap, y_alpha, d) {
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
function GS_MouseOver2(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

//-- For THSC & ASC (no tooltip)
function GS_MouseLeave2(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 1)
}

//-- For CT & ET
function GS_MouseOver3(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.6)
}

//------------------------------------------------------------------------------
//-- Function declarations - button

function GS_PressRadioButton(wrap, btn_tag, old_value, new_value) {
  var old_btn, new_btn;
  old_btn = document.getElementById(wrap.tag + '_' + btn_tag + '_' + old_value);
  new_btn = document.getElementById(wrap.tag + '_' + btn_tag + '_' + new_value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
}

//------------------------------------------------------------------------------
//-- Function declarations - cascade plotting

function GS_Delay(delay) {
  return new Promise(resolve => {
    setTimeout(() => {resolve(delay);}, delay);
  });
}

async function GS_Cascade(plot_list) {
  var plot_list_r = plot_list.reverse();
  var plot, fct, wrap, delay;
  
  while (plot_list_r.length > 0) {
    plot = plot_list_r.pop();
    fct = plot[0];
    wrap = plot[1];
    delay = plot[2];
    
    fct(wrap);
    await GS_Delay(delay);
  }
}

//-- End of file
//------------------------------------------------------------------------------
