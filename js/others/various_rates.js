
//-- Filename:
//--   various_rates.js
//--
//-- Author:
//--   Chieh-An Lin

function VR_InitFig(wrap) {
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

function VR_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr("various_rates_title", "各種比率之七日平均");
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr("various_rates_title", "Taux en moyenne glissante sur 7 jours");
  }
  
  else { //-- En
    TT_AddStr("various_rates_title", "7-day Average of Various Rates");
  }
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
  var y_list_list = [];
  var i, j, x, y, y_list, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    y_list = [];
    x = data[i]["date"];
    date_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == data[i][col])
        y = NaN;
      else
        y = +data[i][col];
      
      y_list.push(y);
    }
    
    y_list_list.push(y_list)
  }
  
  //-- Loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]["date"],
        'y': y_list_list[i][j],
        'y_list': y_list_list[i]
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
  
  //-- Get column tags
  if (GS_lang == 'zh-tw')
    col_label_list = ['陽性率', '入境盛行率', '本土盛行率']
  else if (GS_lang == 'fr')
    col_label_list = ['Taux de positivité', "Taux d'inci. front.", "Taux d'inci. local"]
  else
    col_label_list = ['Positive rate', 'Arrival inci. rate', 'Local inci. rate']
  
  //-- Define tooltip texts
  var fct_format = d3.format(".2%");
  var tooltip_text = d.x;
  var i;
  
  for (i=0; i<wrap.nb_col; i++)
    tooltip_text += "<br>" + col_label_list[i] + " = " + fct_format(d.y_list[i]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function VR_Plot(wrap) {
  //-- Define x-axis
  var x = d3.scalePoint()
    .domain(wrap.date_list)
    .range([0, wrap.width])
    .padding(0.5);
    
  //-- No xtick or xticklabel 
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat("");
  
  //-- Add x-axis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    
  //-- Define a 2nd x-axis for xtick & xticklabel
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.date_list.length])
    .range([0, wrap.width])
  
  //-- Define xtick & update xticklabel later
  var x_axis_2 = d3.axisBottom(x_2)
    .tickSize(12)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat("");
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + wrap.height + ")")
    .call(x_axis_2)
  
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
    .tickSize(0);
  
  //-- Add 2nd y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2);
    
  //-- Add ylabel & update value later
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)");
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GS_wrap.c_list.slice(0, wrap.nb_col);
  var col_tag_list = wrap.col_tag_list.slice();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Define dummy line
  var draw_line_0 = d3.line()
    .x(function (d) {return x(d.x);})
    .y(y(0));
    
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
  wrap.x_2 = x_2;
  wrap.color_list = color_list;
  wrap.draw_line = draw_line;
  wrap.line = line;
  wrap.dot = dot;
}

function VR_Replot(wrap) {
  //-- Define new xticklabel
  var x_axis_2 = d3.axisBottom(wrap.x_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update 2nd x-axis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(GS_wrap.trans_duration)
    .call(x_axis_2)
    .selectAll("text")
      .attr("transform", "translate(-20,15) rotate(-90)")
      .style("text-anchor", "end");
  
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
    .duration(GS_wrap.trans_duration)
    .call(y_axis);
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '比率';
  else if (GS_lang == 'fr')
    ylabel = 'Taux';
  else
    ylabel = 'Rate';
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel);
    
  //-- Update line
  wrap.line.selectAll('.content.line')
    .transition()
    .duration(GS_wrap.trans_duration)
    .attr('d', function (d) {return wrap.draw_line(d.values);});
    
  //-- Update dot
  wrap.dot.selectAll('.content.dot')
    .transition()
    .duration(GS_wrap.trans_duration)
    .attr("r", function (d) {if (!isNaN(d.y)) return wrap.r; return 0;}); //-- Don't show dots if NaN

  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = ["陽性率", "入境盛行率（逐月更新）", "本土盛行率"];
  else if (GS_lang == 'fr')
    legend_label = ["Taux de positivité", "Taux d'incidence frontalier (mise à jour mensuellement)", "Taux d'incidence local"];
  else
    legend_label = ["Positive rate", "Arrival incidence rate (updated monthly)", "Local incidence rate"];
  
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

//-- Load
function VR_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VR_FormatData(wrap, data);
      VR_Plot(wrap);
      VR_Replot(wrap);
    });
}

function VR_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + GS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Replot
    VR_ResetText();
    VR_Replot(wrap);
  });
}

//-- Main
function VR_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VR_InitFig(wrap);
  VR_ResetText();
  VR_Load(wrap);
  
  //-- Setup button listeners
  VR_ButtonListener(wrap);
}
