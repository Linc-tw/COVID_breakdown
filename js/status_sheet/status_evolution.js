
//-- Filename:
//--   status_evolution.js
//--
//-- Author:
//--   Chieh-An Lin

function SE_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function SE_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('status_evolution_title', '疫情變化');
    
    LS_AddHtml('status_evolution_description', '\
      確診個案有三種狀態：解隔離、住院（隔離）中、死亡。\
      <br><br>\
      在台灣，所有嚴重特殊傳染性肺炎患者需依法隔離。\
      衛生單位會盡可能安排病患住院，當醫療量能滿載時，則將輕症病患轉往集中檢疫所或防疫旅館。\
      <br><br>\
      確診者若不再有傳染力，則可解除隔離，至於傳染與否之判斷標準因先前症狀而異。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('status_evolution_title', 'Évolution de la situation');
    
    LS_AddHtml('status_evolution_description', "\
      Tous les cas confirmés sont dans 1 des 3 états suivant :\
      rétabli, hospitalisé (isolé) ou décédé.\
      <br><br>\
      Tous les patients de covid sont isolés à Taïwan.\
      Ils sont isolés aux hôpitaux sauf si les hôpitaux sont pleins.\
      Dans le cas échéant, les patients avec symptômes légers sont mis dans des infrastructures centralisées ou des hôtels dédiés.\
      <br><br>\
      Un patient est rétabli quand il/elle est considéré sans contagiosité.\
      Les critères exactes pour le juger varient selon les symptômes d'avant.\
    ");
  }
  
  else { //-- En
    LS_AddStr('status_evolution_title', 'Status Evolution');
    
    LS_AddHtml('status_evolution_description', "\
      All confirmed cases are in 1 of the 3 following states:\
      discharged, hospitalized (isolated), or death.\
      <br><br>\
      All COVID patients in Taiwan are isolated.\
      They are isolated in hospitals unless hospitals are full.\
      In such case, patients with light symptoms will be transferred to centralized facilities or dedicated hotels.\
      <br><br>\
      A patient is discharged when he/she is considered uncontagious.\
      The exact criteria for discharge vary depending on patient's symptoms.\
    ");
  }
}

function SE_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var formatted_data = [];
  var x_list = [];
  var h, h_list, block;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
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
    h_list = [];
    x = row['date'];
    y = 0;
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      h = row[col_tag_list[j]];
      h_list.push(+h);
      
      //-- Update y_last
      if (h != '')
        y_last[j] = +h;
    }
    
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
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
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
  wrap.legend_value_raw = y_last;
}

//-- Tooltip
function SE_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
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
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color_list = GP_wrap.c_list.slice(0, wrap.nb_col);
  
  //-- Define mouse-move
  wrap.mouse_move = SE_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotMultipleBar(wrap);
}

function SE_Replot(wrap) {
  //-- Replot bar
  GP_ReplotMultipleBar(wrap);
  
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
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 40, dx: 10, dy: 27, x1: wrap.legend_pos_x1_[LS_lang]};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  wrap.legend_color.push('#000000');
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  var sum = wrap.legend_value.reduce((a, b) => a + b, 0);
  wrap.legend_value.push(sum);
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['解隔離', '隔離中', '死亡', '合計'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Rétablis', 'Hospitalisés', 'Décédés', 'Total'];
  else
    wrap.legend_label = ['Discharged', 'Hospitalized', 'Deaths', 'Total'];
  
  //-- Update legend title
  var wrap2 = {tag: 'overall'};
  var title = LS_GetLegendTitle_Page(wrap2);
  GP_UpdateLegendTitle(wrap, title);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count_fold', '1.2rem');
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
