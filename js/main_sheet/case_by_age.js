
//-- Filename:
//--   case_by_age.js
//--
//-- Author:
//--   Chieh-An Lin

function CBA_MakeCanvas(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 90, top: 2};
  
  GS_MakeCanvas(wrap);
}

function CBA_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var nb_col = col_tag_list.length;
  var age_list = [];
  var formatted_data = [];
  
  //-- Other variables
  var y_max = 0;
  var i, j, x, y, height, block;

  //-- Convert data form
  if (wrap.do_cumul == 1)
    GS_CumSum(data, col_tag_list);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    y = 0;
    x = data[i]["age"];
    age_list.push(x);
    
    //-- Determine whether to have xtick
    xtick.push(i)
    xticklabel.push(GS_ISODateToMDDate(x));
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      //-- Current value
      height = +data[i][col_tag_list[j]];
      
      //-- Make data block
      block = {
        'x': x,
        'y0': y,
        'y1': y + height,
        'height': height,
        'h1': +data[i][col_tag_list[nb_col-1]],
        'h2': +data[i][col_tag_list[nb_col-2]],
        'h3': +data[i][col_tag_list[nb_col-3]],
        'h4': +data[i][col_tag_list[nb_col-4]],
        'h5': +data[i][col_tag_list[nb_col-5]],
        'h6': +data[i][col_tag_list[nb_col-6]],
        'col': col_tag_list[j]
      };
        
      //-- Update total height
      y += height;
      
      //-- Stock
      formatted_data.push(block);
    }
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Choose y_max & y_path
  var y_path;
  if (wrap.do_cumul == 1) {
    if (wrap.do_onset == 1) {
      if (wrap.y_max_fix_1_1 > 0)
        y_max = wrap.y_max_fix_1_1;
      y_path = wrap.y_path_1_1;
    }
    else {
      if (wrap.y_max_fix_1_0 > 0)
        y_max = wrap.y_max_fix_1_0;
      y_path = wrap.y_path_1_0;
    }
  }
  else {
    if (wrap.do_onset == 1) {
      if (wrap.y_max_fix_0_1 > 0)
        y_max = wrap.y_max_fix_0_1;
      y_path = wrap.y_path_0_1;
    }
    else {
      if (wrap.y_max_fix_0_0 > 0)
        y_max = wrap.y_max_fix_0_0;
      y_path = wrap.y_path_0_0;
    }
  }
  
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
  
  //-- Calculate respective sum
  var imported, local_link, local_unlink, fleet, plane, unknown;
  if (wrap.do_cumul == 1) {
    imported = d3.max(formatted_data, function (d) {if (d.col == 'imported') return +d.height;});
    local_link = d3.max(formatted_data, function (d) {if (d.col == 'linked') return +d.height;});
    local_unlink = d3.max(formatted_data, function (d) {if (d.col == 'unlinked') return +d.height;});
    fleet = d3.max(formatted_data, function (d) {if (d.col == 'fleet') return +d.height;});
    plane = d3.max(formatted_data, function (d) {if (d.col == 'plane') return +d.height;});
    unknown = d3.max(formatted_data, function (d) {if (d.col == 'unknown') return +d.height;});
  }
  else {
    imported = d3.sum(formatted_data, function (d) {if (d.col == 'imported') return +d.height;});
    local_link = d3.sum(formatted_data, function (d) {if (d.col == 'linked') return +d.height;});
    local_unlink = d3.sum(formatted_data, function (d) {if (d.col == 'unlinked') return +d.height;});
    fleet = d3.sum(formatted_data, function (d) {if (d.col == 'fleet') return +d.height;});
    plane = d3.sum(formatted_data, function (d) {if (d.col == 'plane') return +d.height;});
    unknown = d3.sum(formatted_data, function (d) {if (d.col == 'unknown') return +d.height;});
  }
  var legend_value = [imported, local_link, local_unlink, fleet, plane, unknown];
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.age_list = age_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

// 
// function CBA_Initialize(wrap) {
//   //-- Define x-axis
//   var x = d3.scaleBand()
//     .domain(wrap.age_list)
//     .range([0, wrap.width])
//     .padding(0.2);
//     
//   //-- No xtick or xticklabel 
//   var x_axis = d3.axisBottom(x)
//     .tickSize(0)
//     .tickFormat(function (d, i) {return ""});
//   
//   //-- Add x-axis & adjust position
//   wrap.svg.append('g')
//     .attr('class', 'xaxis')
//     .attr('transform', 'translate(0,' + wrap.height + ')')
//     .call(x_axis)
//     
//   //-- Define a 2nd x-axis for xtick & xticklabel
//   var x_2 = d3.scaleLinear()
//     .domain([0, wrap.age_list.length])
//     .range([0, wrap.width])
//   
//   //-- Define xtick & xticklabel
//   var x_axis_2 = d3.axisBottom(x_2)
//     .tickValues(wrap.xtick)
//     .tickSize(10)
//     .tickSizeOuter(0)
//     .tickFormat(function (d, i) {return wrap.xticklabel[i]});
//   
//   //-- Add 2nd x-axis & adjust position
//   wrap.svg.append("g")
//     .attr("transform", "translate(0," + wrap.height + ")")
//     .attr("class", "xaxis")
//     .call(x_axis_2)
//     .selectAll("text")
//       .attr("transform", "translate(-20,15) rotate(-90)")
//       .style("text-anchor", "end")
//   
//   //-- Define y-axis
//   var y = d3.scaleLinear()
//     .domain([0, wrap.y_max])
//     .range([wrap.height, 0]);
//   
//   //-- Define ytick & yticklabel
//   var y_axis = d3.axisLeft(y)
//     .tickSize(-wrap.width)
//     .tickValues(wrap.ytick)
//     .tickFormat(d3.format("d"));
//   
//   //-- Add y-axis
//   wrap.svg.append("g")
//     .attr("class", "yaxis")
//     .call(y_axis)
// 
//   //-- Define a 2nd y-axis for the frameline at right
//   var y_axis_2 = d3.axisRight(y)
//     .ticks(0)
//     .tickSize(0)
//   
//   //-- Add 2nd y-axis
//   wrap.svg.append("g")
//     .attr("class", "yaxis")
//     .attr("transform", "translate(" + wrap.width + ",0)")
//     .call(y_axis_2)
//     
//   //-- Define ylabel
//   var ylabel;
//   if (GS_lang == 'zh-tw')
//     ylabel = '案例數';
//   else if (GS_lang == 'fr')
//     ylabel = 'Nombre de cas';
//   else
//     ylabel = 'Number of cases';
//   
//   //-- Add ylabel
//   wrap.svg.append("text")
//     .attr("class", "ylabel")
//     .attr("text-anchor", "middle")
//     .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
//     .text(ylabel);
//     
//   //-- Define color
//   var color_list = GS_var.c_list.slice(0, wrap.nb_col);
//   var col_tag_list = wrap.col_tag_list.slice().reverse();
//   var color = d3.scaleOrdinal()
//     .domain(col_tag_list)
//     .range(color_list);
//   
//   //-- Add bar
//   var bar = wrap.svg.selectAll('.content.bar')
//     .data(wrap.formatted_data)
//     .enter();
//   
//   //-- Update bar with dummy details
//   bar.append('rect')
//     .attr('class', 'content bar')
//     .attr('fill', function (d) {return color(d.col);})
//     .attr('x', function (d) {return x(d.x);})
//     .attr('y', function (d) {return y(0);})
//     .attr('width', x.bandwidth())
//     .attr('height', 0)
//     .on("mouseover", function (d) {GS_Mouse_Over(wrap, d);})
//     .on("mousemove", function (d) {CBA_Mouse_Move(wrap, d);})
//     .on("mouseleave", function (d) {GS_Mouse_Leave(wrap, d);})
// 
//   //-- Save to wrapper
//   wrap.color_list = color_list;
//   wrap.bar = bar;
// }
// 
// function CBA_Update(wrap) {
//   //-- Define y-axis
//   var y = d3.scaleLinear()
//     .domain([0, wrap.y_max])
//     .range([wrap.height, 0]);
//   
//   //-- Define yticklabel format
//   var yticklabel_format;
//   if (wrap.ytick[wrap.ytick.length-1] > 9999) 
//     yticklabel_format = ".2s";
//   else
//     yticklabel_format = "d";
//   
//   //-- Define ytick
//   var y_axis = d3.axisLeft(y)
//     .tickSize(-wrap.width)
//     .tickValues(wrap.ytick)
//     .tickFormat(d3.format(yticklabel_format));
//   
//   //-- Update y-axis
//   wrap.svg.select('.yaxis')
//     .transition()
//     .duration(GS_var.trans_duration)
//     .call(y_axis);
//   
//   //-- Update bar
//   wrap.bar.selectAll('.content.bar')
//     .data(wrap.formatted_data)
//     .transition()
//     .duration(GS_var.trans_duration)
//     .attr('y', function (d) {return y(d.y1);})
//     .attr('height', function (d) {return y(d.y0)-y(d.y1);});
//     
//   //-- Define legend position
//   var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
//   
//   //-- Define legend color
//   var legend_color_list = wrap.color_list.slice();
//   legend_color_list.push('#000000');
//   
//   //-- Calculate legend value
//   var legend_value = wrap.legend_value.slice();
//   var sum = legend_value.reduce((a, b) => a + b, 0);
//   legend_value.push(sum);
//   
//   //-- Define legend label
//   var legend_label;
//   if (GS_lang == 'zh-tw')
//     legend_label = ["解隔離", "隔離中", "死亡", "合計"];
//   else if (GS_lang == 'fr')
//     legend_label = ["Rétablis", "Hospitalisés", "Décédés", "Total"];
//   else
//     legend_label = ["Discharged", "Hospitalized", "Deaths", 'Total'];
//   
//   //-- Update legend value
//   wrap.svg.selectAll(".legend.value")
//     .remove()
//     .exit()
//     .data(legend_value)
//     .enter()
//     .append("text")
//       .attr("class", "legend value")
//       .attr("x", legend_pos.x)
//       .attr("y", function (d,i) {return legend_pos.y + i*legend_pos.dy})
//       .style("fill", function (d, i) {return legend_color_list[i]})
//       .text(function (d) {return d})
//       .attr("text-anchor", "end")
//   
//   //-- Update legend label
//   wrap.svg.selectAll(".legend.label")
//     .remove()
//     .exit()
//     .data(legend_label)
//     .enter()
//     .append("text")
//       .attr("class", "legend label")
//       .attr("x", legend_pos.x+legend_pos.dx)
//       .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
//       .style("fill", function (d, i) {return legend_color_list[i]})
//       .text(function (d) {return d})
//       .attr("text-anchor", "start")
// }

//-- Plot
function CBA_Plot(wrap, error, data) {
  if (error)
    return console.warn(error);
  
  CBA_MakeCanvas(wrap);
//   CBA_FormatData(wrap, data);
//   CBA_FormatData2(wrap, data2);
//   CBA_Initialize(wrap);
//   CBA_Update(wrap);
}

function CBA_Replot(wrap, error) {
  if (error)
    return console.warn(error);
  
//   CBA_FormatData(wrap, data);
//   CBA_Update(wrap);
}
