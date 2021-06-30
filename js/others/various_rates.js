
//-- Filename:
//--   various_rates.js
//--
//-- Author:
//--   Chieh-An Lin

function VR_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 400;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 70, right: 5, bottom: 90, top: 5};
  wrap.margin_['fr'] = {left: 70, right: 5, bottom: 90, top: 5};
  wrap.margin_['en'] = {left: 70, right: 5, bottom: 90, top: 5};
  
  GP_InitFig(wrap);
}

function VR_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('various_rates_title', '各種比率之七日平均');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('various_rates_title', 'Taux en moyenne glissante sur 7 jours');
  }
  
  else { //-- En
    LS_AddStr('various_rates_title', '7-day Average of Various Rates');
  }
}

function VR_FormatData(wrap, data) {
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
  
  //-- Other variables
  var formatted_data = [];
  var y_list_list = [];
  var y_max = 0;
  var i, j, x, y, y_list, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y_list = [];
    x = row['date'];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == row[col])
        y = NaN;
      else
        y = +row[col];
      
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
        'x': data[i]['date'],
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
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
}

//-- Tooltip
function VR_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['陽性率', '入境盛行率', '本土盛行率']
  else if (LS_lang == 'fr')
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
  //-- Plot x
  GP_PlotDateAsX(wrap);
  
  //-- Plot y
  GP_PlotLinearY(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(3, 3+wrap.nb_col);
  var color = d3.scaleOrdinal()
    .domain(wrap.col_tag_list)
    .range(color_list);
  
  //-- Define dummy line
  var draw_line_0 = d3.line()
    .x(function (d) {return wrap.xscale(d.x);})
    .y(wrap.yscale(0));
    
  //-- Define real line
  var draw_line = d3.line()
    .defined(d => !isNaN(d.y))//-- Don't show line if NaN
    .x(function (d) {return wrap.xscale(d.x);})
    .y(function (d) {return wrap.yscale(d.y);});
  
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
    .style('fill', function (d) {return color(d.col);})
    .selectAll('.content.dot')
    .data(function (d) {return d.values;})
    .enter()
    .append('circle')
      .attr('class', 'content dot')
      .attr('cx', function (d) {return wrap.xscale(d.x);})
      .attr('cy', function (d) {return wrap.yscale(d.y);})
      .attr('r', 0)
        .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
        .on('mousemove', function (d) {VR_MouseMove(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);});
      
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.draw_line = draw_line;
  wrap.line = line;
  wrap.dot = dot;
}

function VR_Replot(wrap) {
  //-- Replot x
  GP_ReplotDateAsX(wrap);
  
  //-- Define yaxis for ytick
  var yaxis = d3.axisLeft(wrap.yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('.0%'));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GP_wrap.trans_delay)
    .call(yaxis);
  
  //-- Define ylabel
  var ylabel_dict = {en: 'Rate', fr: 'Taux', 'zh-tw': '比率'};
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel_dict[LS_lang]);
    
  //-- Update line
  wrap.line.selectAll('.content.line')
    .transition()
    .duration(GP_wrap.trans_delay)
    .attr('d', function (d) {return wrap.draw_line(d.values);});
    
  //-- Update dot
  wrap.dot.selectAll('.content.dot')
    .transition()
    .duration(GP_wrap.trans_delay)
    .attr('r', function (d) {if (!isNaN(d.y)) return wrap.r; return 0;}); //-- Don't show dots if NaN

  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['陽性率', '入境盛行率（逐月更新）', '本土盛行率'];
  else if (LS_lang == 'fr')
    legend_label = ['Taux de positivité', "Taux d'incidence frontalier (mise à jour mensuellement)", "Taux d'incidence local"];
  else
    legend_label = ['Positive rate', 'Arrival incidence rate (updated monthly)', 'Local incidence rate'];
  
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
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
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
