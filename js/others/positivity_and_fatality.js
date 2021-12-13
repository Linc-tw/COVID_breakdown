
    //----------------------------------//
    //--  positivity_and_fatality.js  --//
    //--  Chieh-An Lin                --//
    //--  2021.12.13                  --//
    //----------------------------------//

function PAF_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function PAF_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('positivity_and_fatality_title', '陽性率與致死率');
    
    LS_AddHtml('positivity_and_fatality_description', '\
      陽性率的定義為確診人數除以檢驗人次。\
      陽性率越高代表篩檢族群中的傳播鍊越多，尚未揪出之潛在確診者也可能越多。\
      這裡所呈現之陽性率為7日平均。\
      <br><br>\
      致死率的定義為死亡人數除以確診人數。\
      由於死亡往往不會立即在確診後發生，\
      因此通常得用累積一段時間的統計才能計算。\
      這裡呈現的是整體致死率的變化，每點都是疫情初期到當日的統計結果。\
      <br><br>\
      台灣之所以致死率偏高，是因為大爆發時確診病患以年長者居多。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('positivity_and_fatality_title', 'Taux de positivité et de létalité');
    
    LS_AddHtml('positivity_and_fatality_description', "\
      Le taux de positivité ou la positivité est défini comme le nombre de cas confirmés sur le nombre de tests conduits.\
      Plus la positivité est élevée, plus il y a des transmissions au sein de la population examinée\
      et plus il est possible qu'il y a des patients non identifiés.\
      Ici pour la positivité, la moyenne glissante sur 7 jours est présentée.\
      <br><br>\
      Le taux de létalité est défini comme le nombre de décédés sur le nombre de cas confirmés.\
      Comme les décès n'ont souvent pas lieu tout de suite après être diagnostiqués,\
      il est plus commode de calculer la létalité sur une période longue.\
      Ici, on choisit de montrer l'évolution de la létalité globale,\
      i.e. calculée à partir du début de la pandémie.\
      <br><br>\
      La létalité est élevée à Taïwan car les patients sont plutôt âgés pendant la vague importante.\
    ");
  }
  
  else { //-- En
    LS_AddStr('positivity_and_fatality_title', 'Positive Rate & Case Fatality Rate');
    
    LS_AddHtml('positivity_and_fatality_description', "\
      The positive rate or positivity is defined as the number of confirmed cases over the number of tests.\
      The higher the positivity, the more there are transmissions among the targeted population,\
      and the more likely there are unidentified patients.\
      Here for positivity, the 7-day moving average is shown.\
      <br><br>\
      The case fatality rate (CFR) is defined as the number of deaths over the confirmed case counts.\
      Since the death usually happens a while after being diagnosed,\
      CFR can only be calculated on a long period.\
      Here we choose to show the evolution of the overall CFR,\
      i.e. since the beginning of the pandemic.\
      <br><br>\
      CFR is high in Taiwan as the infected people during the outbreak were quite aged.\
    ");
  }
}

function PAF_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var formatted_data = [];
  var x_list = []; //-- For date
  var y_list_list = [];
  var y_list, block;
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, data.length);
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max = 0;
  
  //-- Variables for legend
  var y_last_list = [];
  var y_last;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y_list = [];
    x = row['date'];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == row[col])
        y = NaN;
      else
        y = +row[col];
      
      y_list.push(y);
    }
    
    y_list_list.push(y_list)
  }
  
  //-- Main loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      y_list = y_list_list[i];
      y = y_list[j];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]['date'],
        'y': y,
        'y_list': y_list
      };
      
      //-- Update y_last & y_max
      if (!isNaN(y)) {
        y_last = y;
        y_max = Math.max(y_max, y);
      }
      
      //-- Stock
      block2.push(block);
    }
    
    //-- Stock
    formatted_data.push(block2);
    y_last_list.push(y_last);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'percentage');
  
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
  wrap.legend_value_raw = y_last_list;
}

function PAF_FormatData2(wrap, data2) {
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
  GP_MakeXLim(wrap, 'dot');
}

//-- Tooltip
function PAF_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  if (LS_lang == 'zh-tw')
    col_label_list = ['陽性率', '致死率'];
  else if (LS_lang == 'fr')
    col_label_list = ['Taux de positivité', 'Taux de létalité'];
  else
    col_label_list = ['Positive rate', 'Fatality rate'];
  
  //-- Define tooltip texts
  var fct_format = d3.format('.2%');
  var tooltip_text = d.x;
  var i;
  
  for (i=0; i<wrap.nb_col; i++)
    tooltip_text += '<br>' + col_label_list[i] + ' = ' + fct_format(d.y_list[i]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px');
}

function PAF_Plot(wrap) {
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
  wrap.color_list = GP_wrap.c_list.slice(5, 5+wrap.nb_col);
  
  //-- Define mouse-move
  wrap.mouse_move = PAF_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot line
  GP_PlotLine(wrap);
  
  //-- Plot dot
  GP_PlotDot(wrap);
}

function PAF_Replot(wrap) {
  //-- Replot line
  GP_ReplotLine(wrap);
    
  //-- Replot dot
  GP_ReplotDot(wrap);
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap, 'dot');
  else
    GP_ReplotDateAsX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'percentage');
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_rate);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- Define legend value
  wrap.legend_value = wrap.legend_value_raw.slice();
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['陽性率（過去7日）', '致死率（整體）'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Taux de positivité (7 derniers jours)', 'Taux de létalité (cumulé)'];
  else
    wrap.legend_label = ['Positive rate (last 7 days)', 'Fatality rate (overall)'];
    
  //-- Update legend title
  legend_title_dict = {en: 'Latest value', fr: 'Derniers chiffres', 'zh-tw': '最新統計'};
  GP_UpdateLegendTitle(wrap, legend_title_dict[LS_lang]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', wrap.legend_size);
}

//-- Load
function PAF_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      PAF_FormatData(wrap, data);
      PAF_FormatData2(wrap, data2);
      PAF_Plot(wrap);
      PAF_Replot(wrap);
    });
}

function PAF_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    PAF_ResetText();
    PAF_Replot(wrap);
  });
}

//-- Main
function PAF_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  PAF_InitFig(wrap);
  PAF_ResetText();
  PAF_Load(wrap);
  
  //-- Setup button listeners
  PAF_ButtonListener(wrap);
}
