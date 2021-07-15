
//-- Filename:
//--   test_by_criterion.js
//--
//-- Author:
//--   Chieh-An Lin

function TBC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function TBC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('test_by_criterion_title', '檢驗數量');
    LS_AddStr('test_by_criterion_button_daily', '逐日');
    LS_AddStr('test_by_criterion_button_cumul', '累計');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('test_by_criterion_title', 'Nombre de tests');
    LS_AddStr('test_by_criterion_button_daily', 'Quotidiens');
    LS_AddStr('test_by_criterion_button_cumul', 'Cumulés');
  }
  
  else { //-- En
    LS_AddStr('test_by_criterion_title', 'Test Counts');
    LS_AddStr('test_by_criterion_button_daily', 'Daily');
    LS_AddStr('test_by_criterion_button_cumul', 'Cumulative');
  }
}

function TBC_FormatData(wrap, data) {
  //-- Variables for xtick
  var x_key = 'date';
  var q, r;
  if (wrap.tag.includes('overall'))
    r = 999;
  else {
    q = data.length % wrap.xlabel_path;
    r = wrap.r_list[q];
  }
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 2); //-- 0 = date
  var col_tag = col_tag_list[0];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Variables for bar
  var y_sum = 0; //-- For legend
  var y_max = 4.5;
  
  //-- Other variables
  var i, j, x, y, avg;

  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    if ('' == avg)
      row[col_tag_avg] = NaN;
    else
      row[col_tag_avg] = +avg;
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Update y_sum
    for (j=0; j<nb_col; j++) {
      if (wrap.cumul == 0)
        y_sum += +row[col_tag_list[j]];
      else 
        y_sum = Math.max(y_sum, +row[col_tag_list[j]]);
    }
    
    y = +row[col_tag];
    
    //-- Modify data
    if (wrap.cumul == 1)
      row[col_tag_avg] = y;
      
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
  wrap.formatted_data = data;
  wrap.col_tag = col_tag;
  wrap.col_tag_avg = col_tag_avg;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = [y_sum];
}

function TBC_FormatData2(wrap, data2) {
  var i, timestamp;
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      timestamp = data2[i]['value'];
  }
  
  //-- Save to wrapper
  wrap.timestamp = timestamp;
}

//-- Tooltip
function TBC_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw') {
    col_label = '檢驗量';
    avg_text = '過去七日平均';
  }
  else if (LS_lang == 'fr') {
    col_label = 'Nombre de tests';
    avg_text = 'Moyenne sur 7 jours';
  }
  else {
    col_label = 'Number of tests';
    avg_text = '7-day average';
  }
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag]);
  tooltip_text += '<br>' + avg_text + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function TBC_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[2];
  
  //-- Define mouse-move
  wrap.mouse_move = TBC_MouseMove;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function TBC_Replot(wrap) {
  //-- Replot bar
  GP_ReplotFaintSingleBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
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
  
  //-- Replot ylabel
  var ylabel_dict = {en: 'Number of tests', fr: 'Nombre de tests', 'zh-tw': '檢驗量'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = [wrap.color];
  
  //-- Calculate legend value
  var legend_value = wrap.legend_value.slice();
  
  //-- Define legend label
  var legend_label = [ylabel_dict[LS_lang]];
  
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
function TBC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      TBC_FormatData(wrap, data);
      TBC_FormatData2(wrap, data2);
      TBC_Plot(wrap);
      TBC_Replot(wrap);
    });
}

function TBC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      TBC_FormatData(wrap, data);
      TBC_Replot(wrap);
    });
}

function TBC_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    TBC_Reload(wrap);
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
    TBC_ResetText();
    TBC_Replot(wrap);
  });
}

//-- Main
function TBC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini'))
    wrap.cumul = 0;
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  }
  
  //-- Load
  TBC_InitFig(wrap);
  TBC_ResetText();
  TBC_Load(wrap);
  
  //-- Setup button listeners
  TBC_ButtonListener(wrap);
}
