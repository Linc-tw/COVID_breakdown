
//-- Filename:
//--   hospitalization_or_isolation.js
//--
//-- Author:
//--   Chieh-An Lin

function HOI_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function HOI_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('hospitalization_or_isolation_title', '住院或確診隔離人數');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('hospitalization_or_isolation_title', "Nombre d'hospitalisation ou de cas confirmés en isolation");
  }
  
  else { //-- En
    LS_AddStr('hospitalization_or_isolation_title', 'Hospitalization or confirmed cases in isolation');
  }
}

function HOI_FormatData(wrap, data) {
  //-- Variables for xtick
  var x_key = 'date';
  var q, r;
  if (!wrap.tag.includes('overall') && !wrap.tag.includes('mini')) {
    q = data.length % wrap.xlabel_path;
    r = wrap.r_list[q];
  }
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var col_tag = col_tag_list[0];
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For age
  var row;
  
  //-- Other variables
  var y_last = 0;
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (!wrap.tag.includes('overall') && !wrap.tag.includes('mini')) {
      if (i % wrap.xlabel_path == r) {
        xtick.push(i)
        xticklabel.push(x);
      }
    }
    
    //-- Update y_last
    if (y != '')
      y_last = +y;
    
    //-- Update y_max
    y_max = Math.max(y_max, +y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks);
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.col_tag_list = col_tag_list;
  wrap.col_tag = col_tag;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = [y_last];
}

function HOI_FormatData2(wrap, data2) {
  if (!wrap.tag.includes('overall'))
    return;
  
  var i, timestamp;
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      timestamp = data2[i]['value'];
  }
  
  //-- Calculate x_min
  var x_min = (new Date(wrap.iso_begin) - new Date(GP_wrap.iso_ref)) / 86400000;
  x_min -= 0.2; //-- For edge
  
  //-- Calculate x_max
  var iso_today = timestamp.slice(0, 10);
  var x_max = (new Date(iso_today) - new Date(GP_wrap.iso_ref)) / 86400000;
  x_max += 1; //-- For edge
  
  //-- Half day correction
  var hour = timestamp.slice(11, 13);
  if (+hour < 12)
    x_max -= 1;
  
  //-- Save to wrapper
  wrap.iso_end = iso_today;
  wrap.x_min = x_min;
  wrap.x_max = x_max;
}

//-- Tooltip
function HOI_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.35;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label = '住院人數';
  else if (LS_lang == 'fr')
    col_label = 'Hospitalisés';
  else
    col_label = 'Hospitalized';
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function HOI_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Make tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[3];
  
  //-- Define mouse-move
  wrap.mouse_move = HOI_MouseMove;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function HOI_Replot(wrap) {
  //-- Update bar
  GP_ReplotSingleBar(wrap);
  
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
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap);
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of cases', fr: 'Nombre de cas', 'zh-tw': '案例數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define legend color
  var legend_color = [wrap.color];
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend value
  var legend_value = wrap.legend_value.slice();
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['住院或確診隔離人數'];
  else if (LS_lang == 'fr')
    legend_label = ['Hospitalisés'];
  else
    legend_label = ['Hospitalized'];
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label.splice(0, 0, LS_GetLegendTitle_Page(wrap));
  var legend_length = legend_color.length;
  
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
      .text(function (d) {return d;});
}

//-- Load
function HOI_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      HOI_FormatData(wrap, data);
      HOI_FormatData2(wrap, data2);
      HOI_Plot(wrap);
      HOI_Replot(wrap);
    });
}

function HOI_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      HOI_FormatData(wrap, data);
      HOI_Replot(wrap);
    });
}

function HOI_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    name = wrap.tag + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    HOI_ResetText();
    HOI_Replot(wrap);
  });
}

//-- Main
function HOI_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Load
  HOI_InitFig(wrap);
  HOI_ResetText();
  HOI_Load(wrap);
  
  //-- Setup button listeners
  HOI_ButtonListener(wrap);
}
