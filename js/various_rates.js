
//-- Filename:
//--   various_rates.js
//--
//-- Author:
//--   Chieh-An Lin

function VR_MakeCanvas(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 70, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 70, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 70, right: 2, bottom: 90, top: 2};
  
  GS_MakeCanvas(wrap);
}

function VR_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var nb_col = col_tag_list.length;
  var date_list = [];
  var formatted_data = [];
  
  //-- Other variables
  var y_max = 0;
  var i, j, x, y, height, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    x = data[i]["date"];
    date_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i) //-- No 0.5 due to points
      xticklabel.push(GS_ISODateToMDDate(x));
    }
  }
  
  //-- Loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      //-- Current value
      if ('' == data[i][col])
        y = NaN;
      else
        y = +data[i][col];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]["date"],
        'y': y,
        'y1': +data[i][col_tag_list[0]],
        'y2': +data[i][col_tag_list[1]],
        'y3': +data[i][col_tag_list[2]]
      };
      
      //-- Update y_max
      y_max = Math.max(y_max, y);
      
      //-- Stock
      block2.push(block);
    }
    
    //-- Stock
    formatted_data.push({'col': col, 'values': block2});
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  if (wrap.y_max_fix > 0)
    y_max = wrap.y_max_fix;
  
  //-- Calculate y_path
  var y_path = wrap.y_path;
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.date_list = date_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
}

//-- Tooltip
function VR_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Define tooltip texts
  var fct_format = d3.format(".2%");
  var tooltip_text;
  if (GS_lang == 'zh-tw')
    tooltip_text = d.x + '<br>陽性率 = ' + fct_format(d.y1) + '<br>入境盛行率 = ' + fct_format(d.y2) + '<br>本土盛行率 = ' + fct_format(d.y3)
  else if (GS_lang == 'fr')
    tooltip_text = d.x + '<br>Taux de positivité = ' + fct_format(d.y1) + "<br>Taux d'inci. front. = " + fct_format(d.y2) + "<br>Taux d'inci. local = " + fct_format(d.y3)
  else
    tooltip_text = d.x + '<br>Positive rate = ' + fct_format(d.y1) + '<br>Arrival inci. rate = ' + fct_format(d.y2) + '<br>Local inci. rate = ' + fct_format(d.y3)
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function VR_Initialize(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.date_list)
    .range([0, wrap.width]);
    
  //-- No xtick or xticklabel 
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return ""});
  
  //-- Add x-axis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    
  //-- Define a 2nd x-axis for xtick & xticklabel
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.date_list.length])
    .range([0, wrap.width])
  
  //-- Define xtick & xticklabel
  var x_axis_2 = d3.axisBottom(x_2)
    .tickValues(wrap.xtick)
    .tickSize(12)
    .tickSizeOuter(0)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
    .selectAll("text")
      .attr("transform", "translate(-20,15) rotate(-90)")
      .style("text-anchor", "end")
  
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick & yticklabel
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(".0%"));
  
  //-- Add y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis)

  //-- Define a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  //-- Add 2nd y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2)
    
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '比率';
  else if (GS_lang == 'fr')
    ylabel = 'Taux';
  else
    ylabel = 'Rate';
  
  //-- Add ylabel
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Define color
  var color_list = GS_var.c_list.slice(0, wrap.nb_col);
  var col_tag_list = wrap.col_tag_list.slice();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Define dummy line
  var draw_line_0 = d3.line()
    .x(function (d) {return x(d.x);})
    .y(function (d) {return y(0);});
    
  //-- Define real line
  var draw_line = d3.line()
    .defined(d => !isNaN(d.y))//-- Don't show line if NaN
    .x(function (d) {return x(d.x);})
    .y(function (d) {return y(d.y);});
  
  //-- Add line
  var line = wrap.svg.selectAll('.content.line')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
      .attr('class', 'content line')
      .attr('d', function (d) {return draw_line_0(d.values);})
      .style('stroke', function (d) {return color(d.col);})
      .style('stroke-width', '2.5px')
      .style("fill", 'none');
      
  //-- Add dot
  var dot = wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update dot with dummy details
  dot.append('g')
    .style("fill", function (d) {return color(d.col);})
    .selectAll(".content.dot")
    .data(function (d) {return d.values;})
    .enter()
    .append("circle")
      .attr('class', 'content dot')
      .attr("cx", function (d) {return x(d.x);})
      .attr("cy", function (d) {return y(d.y);})
      .attr("r", 0)
      .on("mouseover", function (d) {GS_MouseOver(wrap, d);})
      .on("mousemove", function (d) {VR_MouseMove(wrap, d);})
      .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);});
      
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.draw_line = draw_line;
  wrap.line = line;
  wrap.dot = dot;
}

function VR_Update(wrap) {
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(".0%"));
  
  //-- Update y-axis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_var.trans_duration)
    .call(y_axis);
  
  //-- Update line
  wrap.line.selectAll('.content.line')
    .transition()
    .duration(GS_var.trans_duration)
    .attr('d', function (d) {return wrap.draw_line(d.values);});
    
  //-- Update dot
  wrap.dot.selectAll('.content.dot')
    .transition()
    .duration(GS_var.trans_duration)
    .attr("r", function (d) {if (!isNaN(d.y)) return wrap.r; return 0;}); //-- Don't show dots if NaN

  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = ["陽性率", "入境盛行率", "本土盛行率"];
  else if (GS_lang == 'fr')
    legend_label = ["Taux de positivité", "Taux d'incidence frontalier", "Taux d'incidence local"];
  else
    legend_label = ["Positive rate", "Arrival incidence rate", "Local incidence rate"];
  
  //-- Update legend label
  wrap.svg.selectAll(wrap.id+'_legend_label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("id", wrap.tag+"_legend_label")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style("fill", function (d, i) {return wrap.color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "start");
}

//-- Plot
function VR_Plot(wrap, error, data) {
  if (error)
    return console.warn(error);
  
  VR_MakeCanvas(wrap);
  VR_FormatData(wrap, data);
  VR_Initialize(wrap);
  VR_Update(wrap);
}
