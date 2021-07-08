
//-- Filename:
//--   travel_history_symptom_correlations.js
//--
//-- Author:
//--   Chieh-An Lin

function THSC_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 600;
  wrap.tot_height_['fr'] = 600;
  wrap.tot_height_['en'] = 600;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 230, right: 5, bottom: 5, top: 180};
  wrap.margin_['fr'] = {left: 280, right: 5, bottom: 5, top: 215};
  wrap.margin_['en'] = {left: 250, right: 5, bottom: 5, top: 195};
  
  GP_InitFig(wrap);
}

function THSC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('travel_history_symptom_correlations_title', '旅遊史與症狀相關程度');
    LS_AddStr('travel_history_symptom_correlations_button_1', '相關係數');
    LS_AddStr('travel_history_symptom_correlations_button_2', '案例數');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('travel_history_symptom_correlations_title', 'Corrélations entre antécédents de voyage & symptômes');
    LS_AddStr('travel_history_symptom_correlations_button_1', 'Coefficients');
    LS_AddStr('travel_history_symptom_correlations_button_2', 'Nombres');
  }
  
  else { //-- En
    LS_AddStr('travel_history_symptom_correlations_title', 'Correlations between Travel History & Symptoms');
    LS_AddStr('travel_history_symptom_correlations_button_1', 'Coefficients');
    LS_AddStr('travel_history_symptom_correlations_button_2', 'Counts');
  }
}

function THSC_FormatData(wrap, data) {
  var x_key = 'symptom';
  var y_key = 'trav_hist';
  var x_list = []; //-- For symptom
  var y_list = []; //-- For travel history
  var i, j, x, y, row;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = row[y_key];
    
    //-- Search if this x is already there
    for (j=0; j<x_list.length; j++) {
      if (x == x_list[j])
        break;
    }
    
    //-- If not, stock in list
    if (j == x_list.length)
      x_list.push(x);
    
    //-- Search if this y is already there
    for (j=0; j<y_list.length; j++) {
      if (y == y_list[j])
        break;
    }
    
    //-- If not, stock in list
    if (j == y_list.length)
      y_list.push(y);
  }
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.y_key = y_key;
  wrap.y_list = y_list;
}

function THSC_FormatData2(wrap, data2) {
  var i, row, n_total, n_imported, n_data;
  
  //-- Get value of `n_total`, `n_imported`, & `n_data`
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    row = data2[i];
    
    switch (row['key']) {
      case 'N_total':
        n_total = row['count'];
        break;
      case 'N_imported':
        n_imported = row['count'];
        break;
      case 'N_data':
        n_data = row['count'];
        break;
      default:
        break;
    }
  }
  
  var xticklabel_dict = {'en': [], 'fr': [], 'zh-tw': []};
  var yticklabel_dict = {'en': [], 'fr': [], 'zh-tw': []};
  var count;
  
  for (i=3+wrap.y_list.length; i<3+wrap.y_list.length+wrap.x_list.length; i++) {
    row = data2[i];
    count = row['count'];
    
    xticklabel_dict['en'].push(row['label'] + ' (' + count + ')');
    xticklabel_dict['fr'].push(row['label_fr'] + ' (' + count + ')');
    xticklabel_dict['zh-tw'].push(row['label_zh'] + ' (' + count + ')');
  }
  
  for (i=3; i<3+wrap.y_list.length; i++) {
    row = data2[i];
    count = row['count'];
    
    yticklabel_dict['en'].push(row['label'] + ' (' + count + ')');
    yticklabel_dict['fr'].push(row['label_fr'] + ' (' + count + ')');
    yticklabel_dict['zh-tw'].push(row['label_zh'] + ' (' + count + ')');
  }
  
  //-- Save to wrapper
  wrap.n_total = n_total;
  wrap.n_imported = n_imported;
  wrap.n_data = n_data;
  wrap.xticklabel_dict = xticklabel_dict;
  wrap.yticklabel_dict = yticklabel_dict;
}

function THSC_Plot(wrap) {
  //-- x = top, y = left
  GP_PlotTopLeft(wrap);
  
  //-- Define square color
  var color = d3.scaleSequential()
    .domain([-0.3, 0.3])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Save to wrapper
  wrap.color = color;
  
  //-- Plot corr
  GP_PlotCorr(wrap);
}

function THSC_Replot(wrap) {
  //-- Replot x
  GP_ReplotTileX(wrap);
  
  //-- Replot y
  GP_ReplotTileY(wrap);
  
  //-- Adjust font size
  wrap.svg.select('.xaxis')
    .selectAll('text')
      .style('font-size', '1.2rem');
  wrap.svg.select('.yaxis')
    .selectAll('text')
      .style('font-size', '1.2rem');
      
  //-- Replot corr
  GP_ReplotCorr(wrap);
    
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: -0.75*wrap.margin.top, dx: 12, dy: 27};
  
  //-- Define legend color
  var legend_color = [GP_wrap.c_list[0], GP_wrap.gray, GP_wrap.gray, '#000000'];
  
  //-- Define legend value
  var legend_value = [wrap.n_data, wrap.n_imported-wrap.n_data, wrap.n_total-wrap.n_imported, wrap.n_total];
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = ['有資料案例數', '資料不全', '無旅遊史', '合計'];
  else if (LS_lang == 'fr')
    legend_label = ['Données complètes', 'Données incomplètes', 'Sans anté. de voyage', 'Total'];
  else
    legend_label = ['Data complete', 'Data incomplete', 'No travel history', 'Total'];
  
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
      .attr('x', -wrap.margin.left + legend_pos.x)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'end')
      .style('fill', function (d, i) {return legend_color[i];})
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
  
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', -wrap.margin.left + legend_pos.x + legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .attr('text-anchor', 'start')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', function (d, i) {return legend_color[i];})
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
}

//-- Load
function THSC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      THSC_FormatData(wrap, data);
      THSC_FormatData2(wrap, data2);
      THSC_Plot(wrap);
      THSC_Replot(wrap);
    });
}

function THSC_ButtonListener(wrap) {
  //-- Correlation or count
  $(document).on("change", "input:radio[name='" + wrap.tag + "_count']", function (event) {
    GP_PressRadioButton(wrap, 'count', wrap.count, this.value);
    wrap.count = this.value;
    THSC_Replot(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.count == 1)
      tag1 = 'count';
    else
      tag1 = 'coefficient';
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Remove (because of figure size)
    d3.selectAll(wrap.id+' .plot').remove()
    
    //-- Reload
    THSC_InitFig(wrap);
    THSC_ResetText();
    THSC_Load(wrap);
  });
}

//-- Main
function THSC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.count = document.querySelector("input[name='" + wrap.tag + "_count']:checked").value;
  GP_PressRadioButton(wrap, 'count', 0, wrap.count); //-- 0 from .html

  //-- Load
  THSC_InitFig(wrap);
  THSC_ResetText();
  THSC_Load(wrap);
  
  //-- Setup button listeners
  THSC_ButtonListener(wrap);
}
