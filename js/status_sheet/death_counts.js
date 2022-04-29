
    //--------------------------------//
    //--  death_counts.js           --//
    //--  Chieh-An Lin              --//
    //--  2022.02.13                --//
    //--------------------------------//

function DC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function DC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('death_counts_title', '死亡人數');
    LS_AddStr('death_counts_button_daily', '逐日');
    LS_AddStr('death_counts_button_cumul', '累計');
    
    LS_AddHtml('death_counts_description', '\
      台灣死亡統計應不會偏離實際死亡人數太多，\
      因為即便是疫情最緊張的時期，\
      醫院情況都比多數國家好上許多。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('death_counts_title', 'Nombre de décès');
    LS_AddStr('death_counts_button_daily', 'Quotidiens');
    LS_AddStr('death_counts_button_cumul', 'Cumulés');
    
    LS_AddHtml('death_counts_description', "\
      Cette statistique semberait d'être proche de la réalité car même pendant le moment le plus dûr de la pandémie,\
      la situation hospitalière à Taïwan était beaucoup moins dramatique que la plupart des pays.\
    ");
  }
  
  else { //-- En
    LS_AddStr('death_counts_title', 'Death Counts');
    LS_AddStr('death_counts_button_daily', 'Daily');
    LS_AddStr('death_counts_button_cumul', 'Cumulative');
    
    LS_AddHtml('death_counts_description', '\
      This statistic would likely be close to the real death counts.\
      Since even during the toughest moment of the outbreak,\
      the situation of hospitals in Taiwan was far less dramatic than most countries.\
    ');
  }
}

function DC_FormatData(wrap, data) {
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
    last_date = x;
    
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

function DC_FormatData2(wrap, data2) {
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
  GP_MakeXLim(wrap);
}

//-- Tooltip
function DC_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw') {
    col_label = '死亡人數';
    avg_text = '過去七日平均';
  }
  else if (LS_lang == 'fr') {
    col_label = 'Nombre de décès';
    avg_text = 'Moyenne sur 7 jours';
  }
  else {
    col_label = 'Number of deaths';
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

function DC_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[7];
  
  //-- Define mouse-move
  wrap.mouse_move = DC_MouseMove;
  wrap.plot_opacity = GP_wrap.faint_opacity;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function DC_Replot(wrap) {
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
    GP_ReplotOverallXTick(wrap);
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_case);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color];
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  var legend_label_dict = {en: 'Deaths', fr: 'Décès', 'zh-tw': '死亡'};
  wrap.legend_label = [legend_label_dict[LS_lang]];
  
  //-- Update legend title
  GP_UpdateLegendTitle_Standard(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', wrap.legend_size);
}

//-- Load
function DC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DC_FormatData(wrap, data);
      DC_FormatData2(wrap, data2);
      DC_Plot(wrap);
      DC_Replot(wrap);
    });
}

function DC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DC_FormatData(wrap, data);
      DC_Replot(wrap);
    });
}

function DC_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    DC_Reload(wrap);
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
    DC_ResetText();
    DC_Replot(wrap);
  });
}

//-- Main
function DC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini'))
    wrap.cumul = 0;
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
  }
  
  //-- Load
  DC_InitFig(wrap);
  DC_ResetText();
  DC_Load(wrap);
  
  //-- Setup button listeners
  DC_ButtonListener(wrap);
}
