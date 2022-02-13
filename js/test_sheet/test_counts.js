
    //--------------------------------//
    //--  test_counts.js            --//
    //--  Chieh-An Lin              --//
    //--  2021.12.13                --//
    //--------------------------------//

function TC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function TC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('test_counts_title', '檢驗人次');
    LS_AddStr('test_counts_button_daily', '逐日');
    LS_AddStr('test_counts_button_cumul', '累計');
    
    LS_AddHtml('test_counts_description', '\
      台灣政府長久以來對於廣篩相對保守，原因有三：\
      <br>\
      - 盛行率不高、\
      <br>\
      - 避免偽陽性癱瘓疫調系統和消耗隔離量能、\
      <br>\
      - 檢驗人力不足。\
      <br><br>\
      即便2021年5月的高峰後有明顯政策改變，和多數國家相比台灣的篩檢量依舊算少，每日篩檢量不曾超過38000人次。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('test_counts_title', 'Nombre de dépistage');
    LS_AddStr('test_counts_button_daily', 'Quotidiens');
    LS_AddStr('test_counts_button_cumul', 'Cumulés');
    
    LS_AddHtml('test_counts_description', "\
      Taïwan se restreint à tester massivement pour 3 raisons :\
      <br>\
      - le taux d'incidence est plutôt bas,\
      <br>\
      - éviter le débordement du système du traçage et d'isolation par les faux-positifs,\
      <br>\
      - manque de personnels.\
      <br><br>\
      Même s'il y a clairement un changement de politique entre avant et après la vague de mai 2021,\
      le nombre de dépistage reste bas par rapport à la plupart des pays.\
      Le nombre de dépistage conduits par jour n'a jamais dépassé 38k.\
    ");
  }
  
  else { //-- En
    LS_AddStr('test_counts_title', 'Test Counts');
    LS_AddStr('test_counts_button_daily', 'Daily');
    LS_AddStr('test_counts_button_cumul', 'Cumulative');
    
    LS_AddHtml('test_counts_description', '\
      Taiwan is rather conservative about testing for 3 reasons:\
      <br>\
      - low incidence rate,\
      <br>\
      - to avoid false positives overwhelming the trace-and-isolate system, &\
      <br>\
      - lack of human resource.\
      <br><br>\
      Although there is clearly a policy shift after the outbreak in May 2021,\
      the number of conducted tests remains low compared to most countries.\
      The daily number of tests has ever been more than 38k.\
    ');
  }
}

function TC_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 2); //-- 0 = date
  var col_tag = col_tag_list[0];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var x_list = [];
  var avg, last_date;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_last = []; 
  for (j=0; j<nb_col; j++) //-- Initialize with 0
    y_last.push(0);
  
  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = +row[col_tag];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Update moving avg
    if ('' == avg) {
      row[col_tag] = NaN;
      row[col_tag_avg] = NaN;
      continue;
    }
    else if (wrap.cumul == 1)
      row[col_tag_avg] = y;
    else
      row[col_tag_avg] = +avg;
    
    //-- Update last date
    last_date = row['date'];
    
    //-- Update y_last
    for (j=0; j<nb_col; j++) {
      if (wrap.cumul == 0)
        y_last[j] = +row[col_tag_list[j]];
      else 
        y_last[j] = Math.max(y_last[j], +row[col_tag_list[j]]);
    }
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
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
  wrap.last_date = last_date;
  wrap.legend_value_raw = y_last;
}

function TC_FormatData2(wrap, data2) {
  if (!wrap.tag.includes('overall'))
    return;
  
  //-- Loop over row
  var i;
  for (i=0; i<data2.length; i++) {
    //-- Get value of `n_tot`
    if ('timestamp' == data2[i]['key'])
      wrap.timestamp = data2[i]['value'];
  }
  
  //-- Set iso_begin
  wrap.iso_begin = GP_wrap.iso_ref;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap, 'band');
}

//-- Tooltip
function TC_MouseMove(wrap, d) {
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
  tooltip_text += '<br>' + col_label + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag]);
  if (wrap.cumul == 0)
    tooltip_text += '<br>' + avg_text + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function TC_Plot(wrap) {
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
  wrap.mouse_move = TC_MouseMove;
  wrap.plot_opacity = GP_wrap.faint_opacity;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function TC_Replot(wrap) {
  //-- Replot bar
  GP_ReplotFaintSingleBar(wrap);
  
  //-- Replot avg line
  GP_ReplotAvgLine(wrap);
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap, 'band');
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot ylabel
  var ylabel_dict = {en: 'Number of tests', fr: 'Nombre de tests', 'zh-tw': '人次'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color];
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  var legend_label_dict = {en: 'Tests', fr: 'Tests', 'zh-tw': '篩檢量'};
  wrap.legend_label = [legend_label_dict[LS_lang]];
  
  //-- Update legend title
  GP_UpdateLegendTitle_Standard(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', wrap.legend_size);
}

//-- Load
function TC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      TC_FormatData(wrap, data);
      TC_FormatData2(wrap, data2);
      TC_Plot(wrap);
      TC_Replot(wrap);
    });
}

function TC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      TC_FormatData(wrap, data);
      TC_Replot(wrap);
    });
}

function TC_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    TC_Reload(wrap);
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
    TC_ResetText();
    TC_Replot(wrap);
  });
}

//-- Main
function TC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini'))
    wrap.cumul = 0;
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  }
  
  //-- Load
  TC_InitFig(wrap);
  TC_ResetText();
  TC_Load(wrap);
  
  //-- Setup button listeners
  TC_ButtonListener(wrap);
}
