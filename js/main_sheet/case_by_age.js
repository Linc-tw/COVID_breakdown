
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
  var r = 0;
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var age_list = [];
  
  //-- Other variables
  var y_sum = [];
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Initialize y_sum
  for (j=0; j<nb_col; j++)
    y_sum.push(0);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    x = data[i]["age"];
    y = +data[i][col_tag];
    age_list.push(x);
    
    //-- Determine whether to have xtick
    xtick.push(i);
    xticklabel.push(i*5);
    
    //-- Update y_sum
    for (j=0; j<nb_col; j++)
      y_sum[j] += +data[i][col_tag_list[j]];
      
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Last tick
  xtick.push(i);
  xticklabel.push('+');
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Choose y_path
  var y_path = wrap.y_path;
  
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
  
  //-- Get respective sum
  var legend_value = y_sum;
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.age_list = age_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function CBA_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Generate tooltip text
  var col_label
  var tooltip_text;
  if (wrap.col_ind < 12) {
    col_label = (7*(wrap.nb_col-2-wrap.col_ind)) + '-' + (7*(wrap.nb_col-1-wrap.col_ind)-1);
  
    if (GS_lang == 'zh-tw') {
      if (d['age'] == '70+')
        tooltip_text = col_label + '天前的案例中<br>有' + d[wrap.col_tag_list[wrap.col_ind]] + '位年齡<br>在70歲以上';
      else
        tooltip_text = col_label + '天前的案例中<br>有' + d[wrap.col_tag_list[wrap.col_ind]] + '位年齡<br>在' + d['age'] + '歲之間';
    }
    else if (GS_lang == 'fr')
      tooltip_text = d[wrap.col_tag_list[wrap.col_ind]] + " cas confirmés<br>d'il y a " + col_label + ' jours<br>sont âgés de ' + d['age'] + ' ans';
    else
      tooltip_text = d[wrap.col_tag_list[wrap.col_ind]] + ' confirmed cases<br>of ' + col_label + ' days ago<br>are ' + d['age'] + ' years old';
  }
  else {
    if (GS_lang == 'zh-tw'){
      if (d['age'] == '70+')
        tooltip_text = '全部案例中有' + d[wrap.col_tag_list[wrap.col_ind]] + '位<br>年齡在70歲以上';
      else
        tooltip_text = '全部案例中有' + d[wrap.col_tag_list[wrap.col_ind]] + '位<br>年齡在' + d['age'] + '歲之間';
    }
    else if (GS_lang == 'fr')
      tooltip_text = d[wrap.col_tag_list[wrap.col_ind]] + " de l'ensemble des cas<br>sont âgés de " + d['age'] + ' ans';
    else
      tooltip_text = d[wrap.col_tag_list[wrap.col_ind]] + ' of all confirmed cases<br>are ' + d['age'] + ' years old';
  }
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function CBA_Initialize(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.age_list)
    .range([0, wrap.width])
    .padding(0.2);
    
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
  var eps = 0.1
  var x_2 = d3.scaleLinear()
    .domain([-eps, wrap.age_list.length+eps])
    .range([0, wrap.width])
  
  //-- Define xtick & xticklabel
  var x_axis_2 = d3.axisBottom(x_2)
    .tickValues(wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
    .selectAll("text")
      .attr("transform", "translate(0,5)")
      .style("text-anchor", "middle")
  
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick & yticklabel
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format("d"));
  
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
    
  //-- Define xlabel
  var xlabel;
  if (GS_lang == 'zh-tw')
    xlabel = '年齡';
  else if (GS_lang == 'fr')
    xlabel = "Âge";
  else
    xlabel = "Age";
  
  //-- Add xlabel
  wrap.svg.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "bottom")
    .attr("transform", "translate(" + (wrap.width*0.5).toString() + ", " + (wrap.tot_height-0.2*wrap.margin.bottom).toString() + ")")
    .text(xlabel);
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (GS_lang == 'fr')
    ylabel = 'Nombre de cas';
  else
    ylabel = 'Number of cases';
  
  //-- Add ylabel
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Define color
  var color_list = GS_var.c_list.concat(['#999999']); 
  var col_tag_list = wrap.col_tag_list.slice();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function (d) {return color(col_tag_list[wrap.col_ind]);})
    .attr('x', function (d) {return x(d['age']);})
    .attr('y', function (d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {GS_MouseOver(wrap, d);})
    .on("mousemove", function (d) {CBA_MouseMove(wrap, d);})
    .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function CBA_Update(wrap) {
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format("d"));
  
  //-- Update y-axis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_var.trans_duration)
    .call(y_axis);
  
  //-- Update bar
  var col_tag_list = wrap.col_tag_list.slice();
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_var.trans_duration)
    .attr('fill', function (d) {return wrap.color(col_tag_list[wrap.col_ind]);})
    .attr('y', function (d) {return y(d[col_tag_list[wrap.col_ind]]);})
    .attr('height', function (d) {return y(0)-y(d[col_tag_list[wrap.col_ind]]);});
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice(0);
  var sum = wrap.legend_value.slice(1).reduce((a, b) => a + b, 0);
  legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label = [];
  var i, label_list;
  if (CBA_latest_wrap.tag.includes('latest')) {
    if (GS_lang == 'zh-tw')
      label_list = ['', '到', '天前', '合計'];
    else if (GS_lang == 'fr')
      label_list = ['Entre il y a ', ' & ', ' jours', 'Total'];
    else 
      label_list = ['Between ', ' & ', ' days ago', 'Total'];
    
    for (i=0; i<wrap.nb_col-1; i++)
      legend_label.push(label_list[0] + (7*(wrap.nb_col-2-i)) + label_list[1] + (7*(wrap.nb_col-1-i)-1) + label_list[2]);
    legend_label.push(label_list[3]);
  }
  else {
    if (GS_lang == 'zh-tw')
      legend_label = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '合計'];
    else if (GS_lang == 'fr')
      legend_label = ['Janvier', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre', 'Total'];
    else
      legend_label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];
  }
  
  //-- Update legend color, label, & value
  var legend_color_list = [];
  var legend_label_2 = [];
  var legend_value_2 = [];
  if (wrap.col_ind < 12) {
    legend_color_list.push(wrap.color_list[wrap.col_ind]);
    legend_label_2.push(legend_label[wrap.col_ind]);
    legend_value_2.push(legend_value[wrap.col_ind]);
  }
  legend_color_list.push(wrap.color_list[12]);
  legend_label_2.push(legend_label[12]);
  legend_value_2.push(legend_value[12]);
  
  //-- Update legend value
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value_2)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", legend_pos.x)
      .attr("y", function (d,i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return legend_color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
    
  //-- Update legend label
  wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label_2)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return legend_color_list[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}

//-- Plot
function CBA_Plot(wrap, error, data) {
  if (error)
    return console.warn(error);
  
  CBA_MakeCanvas(wrap);
  CBA_FormatData(wrap, data);
  CBA_Initialize(wrap);
  CBA_Update(wrap);
}

function CBA_Replot(wrap, error) {
  if (error)
    return console.warn(error);
  
  CBA_FormatData(wrap, data);
  CBA_Update(wrap);
}
