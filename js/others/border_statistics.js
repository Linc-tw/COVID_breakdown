
//-- Filename:
//--   border_statistics.js
//--
//-- Author:
//--   Chieh-An Lin

function BS_InitFig(wrap) {
  GP_InitFig_Standard(wrap);
}

function BS_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('border_statistics_title', '入出境人數統計');
    LS_AddStr('border_statistics_text', '逐月更新');
    LS_AddStr('border_statistics_button_1', '入境');
    LS_AddStr('border_statistics_button_2', '出境');
    LS_AddStr('border_statistics_button_3', '合計');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('border_statistics_title', 'Statistiques frontalières');
    LS_AddStr('border_statistics_text', 'Mise à jour mensuellement');
    LS_AddStr('border_statistics_button_1', 'Arrivée');
    LS_AddStr('border_statistics_button_2', 'Départ');
    LS_AddStr('border_statistics_button_3', 'Total');
  }
  
  else { //-- En
    LS_AddStr('border_statistics_title', 'Border Crossing');
    LS_AddStr('border_statistics_text', 'Updated monthly');
    LS_AddStr('border_statistics_button_1', 'Arrival');
    LS_AddStr('border_statistics_button_2', 'Departure');
    LS_AddStr('border_statistics_button_3', 'Both');
  }
}

function BS_FormatData(wrap, data) {
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
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks);
  
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
  
  var last_date = data[last]['date'];
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.last_date = last_date;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function BS_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['機場', '港口', '無細節']
  else if (LS_lang == 'fr')
    col_label_list = ['Aéroports', 'Ports maritimes', 'Sans précisions']
  else
    col_label_list = ['Airports', 'Seaports', 'Not specified']
  
  //-- Define tooltip texts
  var tooltip_text = d.x;
  var sum = 0;
  var i, h;
  
  for (i=0; i<wrap.nb_col; i++) {
    h = d.h_list[i];
    if (h > 0) {
      tooltip_text += "<br>" + col_label_list[i] + " = " + h;
      sum += h;
    }
  }
  
  //-- Add text for sum
  if (LS_lang == 'zh-tw')
    tooltip_text += "<br>合計 = ";
  else if (LS_lang == 'fr')
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

function BS_Plot(wrap) {
  GP_PlotDateAsX(wrap);
  GP_PlotLinearY(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.concat(GP_wrap.c_list).slice(10, 10+wrap.nb_col);
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
    .attr('x', function (d) {return wrap.xscale(d.x);})
    .attr('y', wrap.yscale(0))
    .attr('width', wrap.xscale.bandwidth())
    .attr('height', 0)
      .on('mouseover', function (d) {GP_MouseOver(wrap, d);})
      .on('mousemove', function (d) {BS_MouseMove(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.bar = bar;
}

function BS_Replot(wrap) {
  GP_ReplotDateAsX(wrap);
  GP_ReplotCountAsY(wrap);
  
  //-- Define ylabel
  var ylabel;
  if (LS_lang == 'zh-tw')
    ylabel = '旅客人數';
  else if (LS_lang == 'fr')
    ylabel = 'Nombre de voyageurs';
  else
    ylabel = 'Number of people';
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel);
    
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
    .attr('y', function (d) {return wrap.yscale(d.y1);})
    .attr('height', function (d) {return wrap.yscale(d.y0)-wrap.yscale(d.y1);});
    
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
  if (LS_lang == 'zh-tw')
    legend_label = ['機場', '港口', '無細節', '合計'];
  else if (LS_lang == 'fr')
    legend_label = ['Aéroports', 'Ports maritimes', 'Sans précisions', 'Total'];
  else
    legend_label = ['Airports', 'Seaports', 'Not specified', 'Total'];
  
  //-- Remove from legend if value = 0
  var i;
  for (i=legend_value.length-1; i>=0; i--) {
    if (0 == legend_value[i]) {
      legend_color_list.splice(i, 1);
      legend_value.splice(i, 1);
      legend_label.splice(i, 1);
    }
  }
  
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
  wrap.svg.selectAll(wrap.id+'_legend_label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('id', wrap.tag+'_legend_label')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start')
  
  //-- Define legend title
  var legend_title;
  if (LS_lang == 'zh-tw')
    legend_title = ['於' + wrap.last_date];
  else if (LS_lang == 'fr')
    legend_title = ['Au ' + wrap.last_date];
  else
    legend_title = ['On ' + wrap.last_date];
  
  //-- Update legend title
  wrap.svg.selectAll(wrap.id+'_legend_title')
    .remove()
    .exit()
    .data(legend_title)
    .enter()
    .append('text')
      .attr('id', wrap.tag+'_legend_title')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', legend_pos.y+(legend_value.length+0.25)*legend_pos.dy)
      .style('fill', '#000000')
      .text(function (d) {return d;})
      .attr('text-anchor', 'start')
}

//-- Load
function BS_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.do_exit])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      BS_FormatData(wrap, data);
      BS_Plot(wrap);
      BS_Replot(wrap);
    });
}

function BS_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.do_exit])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      BS_FormatData(wrap, data);
      BS_Replot(wrap);
    });
}

function BS_ButtonListener(wrap) {
  //-- Entry or exit or both
  $(document).on("change", "input:radio[name='" + wrap.tag + "_exit']", function (event) {
    GP_PressRadioButton(wrap, 'exit', wrap.do_exit, this.value);
    wrap.do_exit = this.value;
    BS_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.do_exit == 0)
      tag1 = 'arrival';
    else if (wrap.do_exit == 1)
      tag1 = 'departure';
    else
      tag1 = 'both';

    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    BS_ResetText();
    BS_Replot(wrap);
  });
}

//-- Main
function BS_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.do_exit = document.querySelector("input[name='" + wrap.tag + "_exit']:checked").value;
  GP_PressRadioButton(wrap, 'exit', 0, wrap.do_exit); //-- 0 from .html

  //-- Load
  BS_InitFig(wrap);
  BS_ResetText();
  BS_Load(wrap);
  
  //-- Setup button listeners
  BS_ButtonListener(wrap);
}
