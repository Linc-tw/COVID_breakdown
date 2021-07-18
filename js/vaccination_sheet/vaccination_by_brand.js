
//-- Filename:
//--   vaccination_by_brand.js
//--
//-- Author:
//--   Chieh-An Lin

function VBB_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VBB_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_brand_title', '疫苗接種');
    LS_AddStr('vaccination_by_brand_text', '資料不全');
    LS_AddStr('vaccination_by_brand_button_daily', '逐日');
    LS_AddStr('vaccination_by_brand_button_cumul', '累計');
    LS_AddStr('vaccination_by_brand_button_total', '合計');
    LS_AddStr('vaccination_by_brand_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_brand_button_Moderna', 'Moderna');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_brand_title', 'Vaccins administrés par marque');
    LS_AddStr('vaccination_by_brand_text', 'Données incomplètes');
    LS_AddStr('vaccination_by_brand_button_daily', 'Quotidiens');
    LS_AddStr('vaccination_by_brand_button_cumul', 'Cumulés');
    LS_AddStr('vaccination_by_brand_button_total', 'Totaux');
    LS_AddStr('vaccination_by_brand_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_brand_button_Moderna', 'Moderna');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_brand_title', 'Administrated Vaccines by Brand');
    LS_AddStr('vaccination_by_brand_text', 'Incomplete data');
    LS_AddStr('vaccination_by_brand_button_daily', 'Daily');
    LS_AddStr('vaccination_by_brand_button_cumul', 'Cumulative');
    LS_AddStr('vaccination_by_brand_button_total', 'Total');
    LS_AddStr('vaccination_by_brand_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_brand_button_Moderna', 'Moderna');
  }
}

function VBB_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2, 5); //-- 0 = date, 1 = interpolated
  var col_tag = col_tag_list[wrap.col_ind];
  var col_tag_avg = col_tag + '_avg';
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var x_list = [];
  var avg;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_sum = []; 
  for (j=0; j<nb_col; j++) //-- Initialize with 0
    y_sum.push(0);
  
  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = +row[col_tag];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Update y_sum
    for (j=0; j<nb_col; j++) {
      if (wrap.cumul == 0)
        y_sum[j] += +row[col_tag_list[j]];
      else 
        y_sum[j] = Math.max(y_sum[j], +row[col_tag_list[j]]);
    }
    
    //-- Update moving avg
    if ('' == avg)
      row[col_tag_avg] = NaN;
    else if (wrap.cumul == 1)
      row[col_tag_avg] = y;
    else
      row[col_tag_avg] = +avg;
    
    //-- Update to exclude interpolation
    if (0 < wrap.cumul && 0 < +row['interpolated'])
      row[col_tag] = 0;
    else if (0 == wrap.cumul && 0 != +row['interpolated'])
      row[col_tag] = 0;
      
    //-- Update y_max
    y_max = Math.max(y_max, +row[col_tag]);
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
  
  //-- Make legend value
  var legend_value = y_sum.slice(1, nb_col);
  legend_value.push(y_sum[0]);
    
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
  wrap.legend_value = legend_value;
}

function VBB_FormatData2(wrap, data2) {
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
  wrap.iso_begin = GP_wrap.iso_ref_vacc;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap, 'band');
}

//-- Tooltip
function VBB_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw') {
    col_label_list = ['合計', 'AZ', 'Moderna'];
    avg_text = '過去七日平均';
  }
  else if (LS_lang == 'fr') {
    col_label_list = ['Totaux', 'AZ', 'Moderna'];
    avg_text = 'Moyenne sur 7 jours';
  }
  else {
    col_label_list = ['Total', 'AZ', 'Moderna'];
    avg_text = '7-day average';
  }
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[wrap.col_ind] + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag]);
  tooltip_text += '<br>' + avg_text + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function VBB_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[1];
  
  //-- Define mouse-move
  wrap.mouse_move = VBB_MouseMove;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);

  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function VBB_Replot(wrap) {
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
    GP_ReplotOverallXTick(wrap, 'band');
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Number of doses', fr: 'Nombre de doses', 'zh-tw': '施打劑數'};
  GP_ReplotYLabel(wrap, ylabel_dict);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  var i;
  wrap.legend_color = [];
  for (i=0; i<wrap.nb_col; i++)
    wrap.legend_color.push(GP_wrap.gray);
  i = (wrap.nb_col + wrap.col_ind - 1) % wrap.nb_col;
  wrap.legend_color[i] = wrap.color;
  
  //-- No need to update legend value
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['AstraZeneca', 'Moderna', '合計'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['AstraZeneca', 'Moderna', 'Totaux'];
  else
    wrap.legend_label = ['AstraZeneca', 'Moderna', 'Total'];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', 'normal');
}

//-- Load
function VBB_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      VBB_FormatData(wrap, data);
      VBB_FormatData2(wrap, data2);
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

  //-- Brand
  d3.select(wrap.id +'_brand').on('change', function() {
    wrap.col_ind = this.value;
    VBB_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    var tag1, tag2;
    
    if (wrap.col_ind == 0)
      tag1 = 'total';
    else if (wrap.col_ind == 1)
      tag1 = 'AZ';
    else
      tag1 = 'Moderna';
    
    if (wrap.cumul == 1)
      tag2 = 'cumulative';
    else
      tag2 = 'daily';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png'
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
  if (wrap.tag.includes('mini')) {
    wrap.cumul = 0;
    wrap.col_ind = 0;
  }
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
    wrap.col_ind = document.getElementById(wrap.tag + '_brand').value;
  }
  
  //-- Load
  VBB_InitFig(wrap);
  VBB_ResetText();
  VBB_Load(wrap);
  
  //-- Setup button listeners
  VBB_ButtonListener(wrap);
}
