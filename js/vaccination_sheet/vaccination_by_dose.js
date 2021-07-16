
//-- Filename:
//--   vaccination_by_dose.js
//--
//-- Author:
//--   Chieh-An Lin

function VBD_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VBD_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_dose_title', '疫苗劑次接種進度');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_dose_title', 'Avancement de vaccination par nombre de doses');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_dose_title', 'Vaccination Progress by Dose');
  }
}

function VBD_FormatData(wrap, data) {
  //-- Variables for xtick
  var x_key = 'date';
  var q, r;
  if (!wrap.tag.includes('overall') && !wrap.tag.includes('mini')) {
    q = data.length % wrap.xlabel_path;
    r = wrap.r_list[q];
  }
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Other variables
  var formatted_data = [];
  var y_list_list = [];
  var y_last_list = [];
  var y_max = 0;
  var i, j, x, y, y_list, y_last, block, block2;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y_list = [];
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (!wrap.tag.includes('overall') && !wrap.tag.includes('mini')) {
      if (i % wrap.xlabel_path == r)
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
    y_list.push(0);
    
    y_list_list.push(y_list)
  }
  
  //-- Loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      y_list = y_list_list[i];
      y = y_list[j];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]['index'],
        'y0': y_list[j+1],
        'y1': y_list[j],
        'y_list': y_list
      };
      
      //-- Update y_last & y_max
      if (!isNaN(y)) {
        y_last = y;
        y_max = Math.max(y_max, y);
      }
      
      //-- Stock
      block2.push(block);
    }
    
    //-- Stock
    formatted_data.push(block2);
    y_last_list.push(y_last);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var log_precision = Math.floor(Math.log10(y_max)) - 1;
  var precision = Math.pow(10, log_precision);
  var y_path = y_max / (wrap.nb_yticks + 0.5);
  y_path = Math.round(y_path / precision) * precision;
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_last_list;
}

//-- Not optional
function VBD_FormatData2(wrap, data2) {
  var i, timestamp;
  for (i=0; i<data2.length; i++) {
    if ('timestamp' == data2[i]['key'])
      timestamp = data2[i]['value'];
  }
  
  //-- Calculate x_min
  var x_min = (new Date(wrap.iso_begin) - new Date(GP_wrap.iso_ref)) / 86400000;
  x_min -= 0.5; //-- For edge
  
  //-- Calculate x_max
  var iso_today = timestamp.slice(0, 10);
  var x_max = (new Date(iso_today) - new Date(GP_wrap.iso_ref)) / 86400000;
  x_max += 0.5; //-- For edge
  
  //-- Half day correction
  var hour = timestamp.slice(11, 13);
  if (+hour < 12)
    x_max -= 1;
  
  //-- Save to wrapper
  wrap.iso_end = iso_today;
  wrap.x_min = x_min;
  wrap.x_max = x_max;
}

function VBD_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(2, 2+wrap.nb_col).reverse();
  
  //-- Define xscale
  var xscale = d3.scaleLinear()
    .domain([wrap.x_min, wrap.x_max])
    .range([0, wrap.width]);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define dummy line
  var draw_line = d3.line()
    .x(function (d) {return xscale(d.x);})
    .y(yscale(0));
    
  //-- Add line
  var line = wrap.svg.selectAll('.content.line')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line')
    .attr('d', function (d) {return draw_line(d);})
    .style('stroke', function (d, i) {return color_list[i];})
    .style('fill', 'none');
      
  //-- Define dummy area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.x);})
    .y0(yscale(0))
    .y1(yscale(0));
    
  //-- Add area
  var area = wrap.svg.selectAll('.content.area')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update area with dummy details
  area.append('path')
    .attr('class', 'content area')
    .attr('d', function (d) {return draw_area(d);})
    .style('fill', function (d, i) {return color_list[i];})
      .on('mouseover', function (d) {GP_MouseOver2(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave2(wrap, d);});
    
  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.area = area;
}

function VBD_Replot(wrap) {
  //-- Define xscale
  var xscale = d3.scaleLinear()
    .domain([wrap.x_min, wrap.x_max])
    .range([0, wrap.width]);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.x);})
    .y0(function (d) {return yscale(d.y0);})
    .y1(function (d) {return yscale(d.y1);});
    
  //-- Update area
  wrap.area.selectAll('.content.area')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_area(d);});
    
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap);
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('.0%'));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis);
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Proportion of the population', fr: 'Part de la population', 'zh-tw': '佔人口比例'};
  GP_ReplotYLabel(wrap, ylabel_dict);
    
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  var legend_value = []
  var i;
  for (i=0; i<wrap.legend_value.length; i++) 
    legend_value.push(d3.format('.2%')(wrap.legend_value[i]));
      
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['已施打一劑', '已施打兩劑'];
  else if (LS_lang == 'fr')
    legend_label = ['1er dose ', '2nd dose'];
  else
    legend_label = ['1st dose', '2nd dose'];
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label.splice(0, 0, LS_GetLegendTitle_Page(wrap));
  
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
      .attr('text-anchor', 'end')
      .style('fill', function (d, i) {return legend_color[i];})
//       .style('font-size', '1.2rem')
      .text(function (d) {return d;});
    
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'start')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', function (d, i) {return legend_color[i];})
//       .style('font-size', '1.2rem')
      .text(function (d) {return d;});
}

//-- Load
function VBD_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData(wrap, data);
      VBD_FormatData2(wrap, data2);
      VBD_Plot(wrap);
      VBD_Replot(wrap);
    });
}

function VBD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData(wrap, data);
      VBD_Replot(wrap);
    });
}

function VBD_ButtonListener(wrap) {
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
    VBD_ResetText();
    VBD_Reload(wrap);
  });
}

//-- Main
function VBD_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VBD_InitFig(wrap);
  VBD_ResetText();
  VBD_Load(wrap);
  
  //-- Setup button listeners
  VBD_ButtonListener(wrap);
}
