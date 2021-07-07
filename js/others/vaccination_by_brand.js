
//-- Filename:
//--   vaccination_by_brand.js
//--
//-- Author:
//--   Chieh-An Lin

function VBB_InitFig(wrap) {
  GP_InitFig_Standard(wrap);
}

function VBB_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_brand_title', '疫苗接種');
    LS_AddStr('vaccination_by_brand_text', '資料不全');
    LS_AddStr('vaccination_by_brand_button_1', '逐日');
    LS_AddStr('vaccination_by_brand_button_2', '累計');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_brand_title', 'Vaccins administrés par marque');
    LS_AddStr('vaccination_by_brand_text', 'Données incomplètes');
    LS_AddStr('vaccination_by_brand_button_1', 'Quotidiens');
    LS_AddStr('vaccination_by_brand_button_2', 'Cumulés');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_brand_title', 'Administrated Vaccines by Brand');
    LS_AddStr('vaccination_by_brand_text', 'Incomplete data');
    LS_AddStr('vaccination_by_brand_button_1', 'Daily');
    LS_AddStr('vaccination_by_brand_button_2', 'Cumulative');
  }
}

function VBB_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(3); //-- 0 = date, 1 = interpolated, 2 = moving average
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var h_sum = []; //-- For legend
  var y_max = 0;
  var h, h_list;
  
  //-- Other variables
  var formatted_data = [];
  var moving_avg = [];
  var i, j, x, y, avg, block;

  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Initialize h_sum
  for (j=0; j<nb_col; j++)
    h_sum.push(0);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    h_list = [];
    x = row['date'];
    y = 0;
    avg = row['moving_avg'];
    x_list.push(x);
    
    if ('' == avg)
      moving_avg.push({x: x, y: NaN});
    else
      moving_avg.push({x: x, y: +avg});
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Loop over column
    for (j=0; j<nb_col; j++)
      h_list.push(+row[col_tag_list[j]]);
    
    //-- Loop over column again (reversed order)
    for (j=nb_col-1; j>=0; j--) {
      //-- Current value
      if (0 < wrap.cumul && 0 < +row['interpolated'])
        h = 0;
      else if (0 == wrap.cumul && 0 != +row['interpolated'])
        h = 0;
      else
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
      
      //-- Update sum
      if (wrap.cumul == 1)
        h_sum[j] = Math.max(h, h_sum[j]);
      else
        h_sum[j] += h_list[j]; //-- Add the real value anyway
      
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
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.moving_avg = moving_avg;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = h_sum;
}

//-- Tooltip
function VBB_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  col_label_list = ['AZ', 'Moderna']
  
  //-- Define tooltip texts
  var tooltip_text = d.x;
  var sum = 0;
  var i, h;
  
  for (i=0; i<wrap.nb_col; i++) {
    h = d.h_list[i];
    if (h > 0) {
      sum += h;
      if (wrap.cumul > 0)
        h = GP_AbbreviateValue(h);
      tooltip_text += '<br>' + col_label_list[i] + ' = ' + h;
    }
  }
  
  //-- Add text for sum
  if (LS_lang == 'zh-tw')
    tooltip_text += '<br>合計 = ';
  else if (LS_lang == 'fr')
    tooltip_text += '<br>Total = ';
  else
    tooltip_text += '<br>Total = ';
  if (wrap.cumul > 0)
    sum = GP_AbbreviateValue(sum);
  tooltip_text += sum;
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function VBB_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(3, 3+wrap.nb_col);
  
  //-- Save to wrapper
  wrap.mouse_move = VBB_MouseMove;
  wrap.color_list = color_list;
  
  //-- Plot bar
  GP_PlotMultipleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function VBB_Replot(wrap) {
  //-- Replot xaxis
  GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap);
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of doses', fr: 'Nombre de doses', 'zh-tw': '施打劑數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Replot bar
  GP_ReplotMultipleBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
  //-- Define legend position
  var legend_pos = {x: 95, y: 40, dx: 12, dy: 30};
  if (wrap.cumul == 0) {
    if (wrap.legend_pos_x_0_[LS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_0_[LS_lang];
  }
  else {
    if (wrap.legend_pos_x_1_[LS_lang] != 0)
      legend_pos.x = wrap.legend_pos_x_1_[LS_lang];
  }
  
  //-- Define legend color
  var legend_color = wrap.color_list.slice();
  legend_color.push('#000000');
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  var sum = legend_value.reduce((a, b) => a + b, 0);
  legend_value.push(sum);
  
  //-- Define legend label
  var legend_label = ['AstraZeneca', 'Moderna'];
  if (LS_lang == 'zh-tw')
    legend_label.push('合計');
  else
    legend_label.push('Total');
  
  //-- Remove from legend if value = 0
  var i;
  for (i=legend_value.length-1; i>=0; i--) {
    if (0 == legend_value[i]) {
      legend_color.splice(i, 1);
      legend_value.splice(i, 1);
      legend_label.splice(i, 1);
    }
  }
  
  //-- Update legend title
  legend_color.splice(0, 0, '#000000');
  legend_value.splice(0, 0, '');
  legend_label.splice(0, 0, LS_GetLegendTitle(wrap));
  
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
function VBB_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBB_FormatData(wrap, data);
      VBB_Plot(wrap);
      VBB_Replot(wrap);
    });
}

function VBB_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBB_FormatData(wrap, data);
      VBB_Replot(wrap);
    });
}

function VBB_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    VBB_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    var tag1;
    
    if (wrap.cumul == 1)
      tag1 = 'cumulative';
    else
      tag1 = 'daily';
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    VBB_ResetText();
    VBB_Replot(wrap);
  });
}

//-- Main
function VBB_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
  GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  
  //-- Load
  VBB_InitFig(wrap);
  VBB_ResetText();
  VBB_Load(wrap);
  
  //-- Setup button listeners
  VBB_ButtonListener(wrap);
}
