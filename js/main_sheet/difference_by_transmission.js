
//-- Filename:
//--   difference_by_transmission.js
//--
//-- Author:
//--   Chieh-An Lin

function DBT_MakeCanvas(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 70, right: 2, bottom: 90, top: 2};
  wrap.margin_['fr'] = {left: 70, right: 2, bottom: 80, top: 2};
  wrap.margin_['en'] = {left: 70, right: 2, bottom: 80, top: 2};
  
  GS_MakeCanvas(wrap);
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
  var diff_list = [];
  
  //-- Other variables
  var y_sum = [];
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Initialize y_sum
  for (j=0; j<nb_col; j++)
    y_sum.push(0);
  
  //-- Loop over row
  for (i=0; i<31; i++) { //-- Was data.length; now hard-coded to 31 (days)
    x = data[i]["difference"];
    y = +data[i][col_tag];
    diff_list.push(x);
    
    //-- Determine whether to have xtick
    if (30 == i) {
      xtick.push(i+0.5)
      xticklabel.push('30+');
    }
    else if (i % xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Update y_sum
    for (j=0; j<nb_col; j++)
      y_sum[j] += +data[i][col_tag_list[j]];
      
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
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
  
  //-- Get respective sum
  var legend_value = y_sum;
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.diff_list = diff_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
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
    tooltip_text = col_label_list[wrap.col_ind] + '案例中有' + d[wrap.col_tag_list[wrap.col_ind]] + '位<br>發病或入境後' + d['difference'] + '日確診';
  else if (GS_lang == 'fr')
    tooltip_text = d[wrap.col_tag_list[wrap.col_ind]] + ' ' + col_label_list[wrap.col_ind] + ' attend(ent)<br>' + d['difference'] + " jour(s) avant d'être identifié(s)";
  else
    tooltip_text = d[wrap.col_tag_list[wrap.col_ind]] + ' of ' + col_label_list[wrap.col_ind] + ' cases required<br>' + d['difference'] + ' day(s) to be identified';
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function DBT_Initialize(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.diff_list)
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
    .domain([-eps, wrap.diff_list.length+eps])
    .range([0, wrap.width])
  
  //-- Define xtick & xticklabel
  var x_axis_2 = d3.axisBottom(x_2)
    .tickValues(wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]});
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + wrap.height + ")")
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
    
  //-- Add xlabel & update value later
  wrap.svg.append("text")
      .attr("class", "xlabel")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "bottom")
      .attr("transform", "translate(" + (wrap.width*0.5).toString() + ", " + (wrap.tot_height-0.2*wrap.margin.bottom).toString() + ")");
  
  //-- Add ylabel & update value later
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)");
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = [GS_wrap.c_list[4], GS_wrap.c_list[0], GS_wrap.c_list[1], GS_wrap.c_list[3], '#999999', '#000000']; 
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
    .attr('x', function (d) {return x(d['difference']);})
    .attr('y', function (d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {GS_MouseOver(wrap, d);})
    .on("mousemove", function (d) {DBT_MouseMove(wrap, d);})
    .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function DBT_Update(wrap) {
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
    .duration(GS_wrap.trans_duration)
    .call(y_axis);
  
  //-- Update bar
  var col_tag_list = wrap.col_tag_list.slice();
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_wrap.trans_duration)
    .attr('fill', function (d) {return wrap.color(col_tag_list[wrap.col_ind]);})
    .attr('y', function (d) {return y(d[col_tag_list[wrap.col_ind]]);})
    .attr('height', function (d) {return y(0)-y(d[col_tag_list[wrap.col_ind]]);});
  
  //-- Define xlabel
  var xlabel;
  if (GS_lang == 'zh-tw')
    xlabel = '發病或入境後到確診所需天數';
  else if (GS_lang == 'fr')
    xlabel = "Nombre de jours avant identification";
  else
    xlabel = "Days required for each case to be identified";
  
  //-- Update xlabel
  wrap.svg.select(".xlabel")
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
  wrap.svg.select(".ylabel")
    .text(ylabel);
    
  //-- Define legend position
  var legend_pos = {x: 470, y: 45, dx: 12, dy: 30};
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice(0);
  var sum = wrap.legend_value.slice(1).reduce((a, b) => a + b, 0);
  legend_value.push(wrap.n_tot-sum);
  legend_value.push(wrap.n_tot);
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = ['有資料案例數', "境外移入", "本土", '其他', '資料不全', '合計'];
  else if (GS_lang == 'fr')
    legend_label = ['Données complètes', "Importés", "Locaux", 'Divers', 'Données incomplètes', 'Total'];
  else 
    legend_label = ['Data complete', 'Imported', 'Local', 'Others', 'Data incomplete', 'Total'];
  
  //-- Update legend color, label, & value
  var legend_color_list, legend_label_2, legend_value_2;
  if (wrap.col_ind == 0) {
    legend_color_list = [wrap.color_list[0], wrap.color_list[4], wrap.color_list[5]]
    legend_label_2 = [legend_label[0], legend_label[4], legend_label[5]]
    legend_value_2 = [legend_value[0], legend_value[4], legend_value[5]]
  }
  else {
    legend_color_list = [wrap.color_list[wrap.col_ind], wrap.color_list[5]]
    legend_label_2 = [legend_label[wrap.col_ind], legend_label[5]]
    legend_value_2 = [legend_value[wrap.col_ind], legend_value[5]]
  }
  
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
function DBT_Plot(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DBT_MakeCanvas(wrap);
      DBT_FormatData(wrap, data);
      DBT_FormatData2(wrap, data2);
      DBT_Initialize(wrap);
      DBT_Update(wrap);
    });
}

function DBT_Replot(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DBT_FormatData(wrap, data);
      DBT_Update(wrap);
    });
}

function DBT_ButtonListener(wrap) {
  //-- Column index
  $(document).on("change", "input:radio[name='" + wrap.tag + "_ind']", function (event) {
    GS_PressRadioButton(wrap, 'ind', wrap.col_ind, this.value);
    wrap.col_ind = this.value;
    DBT_Replot(wrap);
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
    
    //-- Update
    DBT_Update(wrap);
  });
}

//-- Main
function DBT_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.col_ind = document.querySelector("input[name='" + wrap.tag + "_ind']:checked").value;
  GS_PressRadioButton(wrap, 'ind', 0, wrap.col_ind); //-- 0 from .html
  
  //-- Plot
  DBT_Plot(wrap);
  
  //-- Setup button listeners
  DBT_ButtonListener(wrap);
}
