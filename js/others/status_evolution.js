
//-- Filename:
//--   status_evolution.js
//--
//-- Author:
//--   Chieh-An Lin

function SE_InitFig(wrap) {
  GP_InitFig_Standard(wrap);
}

function SE_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr("status_evolution_title", "疫情變化");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr("status_evolution_title", "Évolution de la situation");
  }
  
  else { //-- En
    LS_AddStr("status_evolution_title", "Status Evolution");
  }
}

function SE_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
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
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
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
        'col_ind': j
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
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function SE_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['解隔離', '隔離中', '死亡']
  else if (LS_lang == 'fr')
    col_label_list = ['Rétablis', 'Hospitalisés', 'Décédés']
  else
    col_label_list = ['Discharged', 'Hospitalized', 'Deaths']
  
  //-- Define tooltip texts
  var tooltip_text = d.x;
  var sum = 0;
  var i;
  
  for (i=0; i<wrap.nb_col; i++) {
    tooltip_text += "<br>" + col_label_list[i] + " = " + d.h_list[i];
    sum += d.h_list[i];
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

function SE_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(0, wrap.nb_col);
  
  //-- Save to wrapper
  wrap.mouse_move = SE_MouseMove;
  wrap.color_list = color_list;
  
  //-- Plot bar
  GP_PlotMultipleBar(wrap);
}

function SE_Replot(wrap) {
  //-- Replot xaxis
  GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap);
  
  //-- Replot ylabel
  var ylabel_dict = {en: 'Number of cases', fr: 'Nombre de cas', 'zh-tw': '案例數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Replot bar
  GP_ReplotMultipleBar(wrap);
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  legend_color.push('#000000');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  legend_value.push(sum);
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['解隔離', '隔離中', '死亡', '合計'];
  else if (LS_lang == 'fr')
    legend_label = ['Rétablis', 'Hospitalisés', 'Décédés', 'Total'];
  else
    legend_label = ['Discharged', 'Hospitalized', 'Deaths', 'Total'];
  
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
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'end')
  
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
      .style('fill', function (d, i) {return legend_color[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start')
}

//-- Load
function SE_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      SE_FormatData(wrap, data);
      SE_Plot(wrap);
      SE_Replot(wrap);
    });
}

function SE_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    SE_ResetText();
    SE_Replot(wrap);
  });
}

//-- Main
function SE_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  SE_InitFig(wrap);
  SE_ResetText();
  SE_Load(wrap);
  
  //-- Setup button listeners
  SE_ButtonListener(wrap);
}
