
//-- Filename:
//--   hospitalization_or_isolation.js
//--
//-- Author:
//--   Chieh-An Lin

function HOI_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function HOI_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('hospitalization_or_isolation_title', '住院或確診隔離人數');
    
    LS_AddHtml('hospitalization_or_isolation_description', '\
      在台灣，所有嚴重特殊傳染性肺炎患者需依法隔離。\
      衛生單位會盡可能安排病患住院，當醫療量能滿載時，則將輕症病患轉往集中檢疫所或防疫旅館。\
      <br><br>\
      隔離人數資料在2021年6月13日有個斷點，原因是指揮中心先前因疫情爆發無暇整理，\
      一夕之間更新數字，進而造成不連續變化。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('hospitalization_or_isolation_title', "Nombre d'hospitalisation ou de cas confirmés en isolation");
    
    LS_AddHtml('hospitalization_or_isolation_description', "\
      Tous les patients de covid sont isolés à Taïwan.\
      Ils sont isolés aux hôpitaux sauf si les hôpitaux sont pleins.\
      Dans le cas échéant, les patients avec symptômes légers sont mis dans des infrastructures centralisées ou des hôtels dédiés.\
      <br><br>\
      Il existe une discontinuité au 13 juin 2021 dans les données.\
      Ceci est dû au gouvernement, dépassé par la vague, a arrêté de mettre les données des cas rétablis à jour pendant un certain temps avant d'y revenir.\
      Au moment le plus chargé, il y aurait 8000 patients de covid en même temps.\
    ");
  }
  
  else { //-- En
    LS_AddStr('hospitalization_or_isolation_title', 'Hospitalization or Confirmed Cases in Isolation');
    
    LS_AddHtml('hospitalization_or_isolation_description', '\
      All COVID patients in Taiwan are isolated.\
      They are isolated in hospitals unless hospitals are full.\
      In such case, patients with light symptoms will be transferred to centralized facilities or dedicated hotels.\
      <br><br>\
      The data contain a discontinuous break on June 13th 2021.\
      This was because the government, overwhelmed by the outbreak, stopped updating the discharged cases before coming back suddenly.\
      The highest watermark of number of COVID patients in charge is likely to be around 8k.\
    ');
  }
}

function HOI_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var col_tag = col_tag_list[0];
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var x_list = []; //-- For age
  var last_date;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_last = []; 
  for (j=0; j<nb_col; j++) //-- Initialize with 0
    y_last.push(0);
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i)
      xticklabel.push(x);
    }
    
    //-- Update data
    if ('' == y) {
      row[col_tag] = NaN;
      continue;
    }
    
    //-- Update last date
    last_date = row['date'];
    
    //-- Update y_last
    for (j=0; j<nb_col; j++)
      y_last[j] = +y;
    
    //-- Update y_max
    y_max = Math.max(y_max, +y);
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
  wrap.col_tag_list = col_tag_list;
  wrap.col_tag = col_tag;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.last_date = last_date;
  wrap.legend_value_raw = y_last;
}

function HOI_FormatData2(wrap, data2) {
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
function HOI_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label = '住院人數';
  else if (LS_lang == 'fr')
    col_label = 'Nombre de patients<br>hospitalisés';
  else
    col_label = 'Number of hospitalized<br>patients';
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag]);
  
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
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
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
    GP_ReplotOverallXTick(wrap, 'band');
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_case);
  
  //-- Define legend color
  wrap.legend_color = [wrap.color];
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  var legend_label_dict = {en: 'Hospitalized', fr: 'Hospitalisés', 'zh-tw': '住院或確診隔離人數'};
  wrap.legend_label = [legend_label_dict[LS_lang]];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, wrap.last_date);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', 'normal');
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
