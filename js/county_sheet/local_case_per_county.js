
//-- Filename:
//--   local_case_per_county.js
//--
//-- Author:
//--   Chieh-An Lin

function LCPC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function LCPC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('local_case_per_county_title', '各縣市本土病例數');
    LS_AddStr('local_case_per_county_button_daily', '逐日');
    LS_AddStr('local_case_per_county_button_cumul', '累計');
    LS_AddStr('local_case_per_county_button_total', '全國合計');
    LS_AddStr('local_case_per_county_button_keelung', '基隆');
    LS_AddStr('local_case_per_county_button_taipei', '台北');
    LS_AddStr('local_case_per_county_button_new_taipei', '新北');
    LS_AddStr('local_case_per_county_button_taoyuan', '桃園');
    LS_AddStr('local_case_per_county_button_hsinchu', '竹縣');
    LS_AddStr('local_case_per_county_button_hsinchu_city', '竹市');
    LS_AddStr('local_case_per_county_button_miaoli', '苗栗');
    LS_AddStr('local_case_per_county_button_taichung', '台中');
    LS_AddStr('local_case_per_county_button_changhua', '彰化');
    LS_AddStr('local_case_per_county_button_nantou', '南投');
    LS_AddStr('local_case_per_county_button_yunlin', '雲林');
    LS_AddStr('local_case_per_county_button_chiayi', '嘉縣');
    LS_AddStr('local_case_per_county_button_chiayi_city', '嘉市');
    LS_AddStr('local_case_per_county_button_tainan', '台南');
    LS_AddStr('local_case_per_county_button_kaohsiung', '高雄');
    LS_AddStr('local_case_per_county_button_pingtung', '屏東');
    LS_AddStr('local_case_per_county_button_yilan', '宜蘭');
    LS_AddStr('local_case_per_county_button_hualien', '花蓮');
    LS_AddStr('local_case_per_county_button_taitung', '台東');
    LS_AddStr('local_case_per_county_button_penghu', '澎湖');
    LS_AddStr('local_case_per_county_button_kinmen', '金門');
    LS_AddStr('local_case_per_county_button_matsu', '馬祖');
    
    LS_AddHtml('local_case_per_county_description', '\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('local_case_per_county_title', 'Cas confirmés locaux par ville et comté');
    LS_AddStr('local_case_per_county_button_daily', 'Quotidiens');
    LS_AddStr('local_case_per_county_button_cumul', 'Cumulés');
    LS_AddStr('local_case_per_county_button_total', 'Totaux nationaux');
    LS_AddStr('local_case_per_county_button_keelung', 'Keelung');
    LS_AddStr('local_case_per_county_button_taipei', 'Taipei');
    LS_AddStr('local_case_per_county_button_new_taipei', 'Nouveau Taipei');
    LS_AddStr('local_case_per_county_button_taoyuan', 'Taoyuan');
    LS_AddStr('local_case_per_county_button_hsinchu', 'Comté de Hsinchu');
    LS_AddStr('local_case_per_county_button_hsinchu_city', 'Ville de Hsinchu');
    LS_AddStr('local_case_per_county_button_miaoli', 'Miaoli');
    LS_AddStr('local_case_per_county_button_taichung', 'Taichung');
    LS_AddStr('local_case_per_county_button_changhua', 'Changhua');
    LS_AddStr('local_case_per_county_button_nantou', 'Nantou');
    LS_AddStr('local_case_per_county_button_yunlin', 'Yunlin');
    LS_AddStr('local_case_per_county_button_chiayi', 'Comté de Chiayi');
    LS_AddStr('local_case_per_county_button_chiayi_city', 'Ville de Chiayi');
    LS_AddStr('local_case_per_county_button_tainan', 'Tainan');
    LS_AddStr('local_case_per_county_button_kaohsiung', 'Kaohsiung');
    LS_AddStr('local_case_per_county_button_pingtung', 'Pingtung');
    LS_AddStr('local_case_per_county_button_yilan', 'Yilan');
    LS_AddStr('local_case_per_county_button_hualien', 'Hualien');
    LS_AddStr('local_case_per_county_button_taitung', 'Taitung');
    LS_AddStr('local_case_per_county_button_penghu', 'Penghu');
    LS_AddStr('local_case_per_county_button_kinmen', 'Kinmen');
    LS_AddStr('local_case_per_county_button_matsu', 'Matsu');
    
    LS_AddHtml('local_case_per_county_description', '\
    ');
  }
  
  else { //-- En
    LS_AddStr('local_case_per_county_title', 'Local Confirmed Cases per City & County');
    LS_AddStr('local_case_per_county_button_daily', 'Daily');
    LS_AddStr('local_case_per_county_button_cumul', 'Cumulative');
    LS_AddStr('local_case_per_county_button_total', 'Nationalwide total');
    LS_AddStr('local_case_per_county_button_keelung', 'Keelung');
    LS_AddStr('local_case_per_county_button_taipei', 'Taipei');
    LS_AddStr('local_case_per_county_button_new_taipei', 'New Taipei');
    LS_AddStr('local_case_per_county_button_taoyuan', 'Taoyuan');
    LS_AddStr('local_case_per_county_button_hsinchu', 'Hsinchu County');
    LS_AddStr('local_case_per_county_button_hsinchu_city', 'Hsinchu City');
    LS_AddStr('local_case_per_county_button_miaoli', 'Miaoli');
    LS_AddStr('local_case_per_county_button_taichung', 'Taichung');
    LS_AddStr('local_case_per_county_button_changhua', 'Changhua');
    LS_AddStr('local_case_per_county_button_nantou', 'Nantou');
    LS_AddStr('local_case_per_county_button_yunlin', 'Yunlin');
    LS_AddStr('local_case_per_county_button_chiayi', 'Chiayi County');
    LS_AddStr('local_case_per_county_button_chiayi_city', 'Chiayi City');
    LS_AddStr('local_case_per_county_button_tainan', 'Tainan');
    LS_AddStr('local_case_per_county_button_kaohsiung', 'Kaohsiung');
    LS_AddStr('local_case_per_county_button_pingtung', 'Pingtung');
    LS_AddStr('local_case_per_county_button_yilan', 'Yilan');
    LS_AddStr('local_case_per_county_button_hualien', 'Hualien');
    LS_AddStr('local_case_per_county_button_taitung', 'Taitung');
    LS_AddStr('local_case_per_county_button_penghu', 'Penghu');
    LS_AddStr('local_case_per_county_button_kinmen', 'Kinmen');
    LS_AddStr('local_case_per_county_button_matsu', 'Matsu');
    
    LS_AddHtml('local_case_per_county_description', '\
      Most cases were concentrated in Taipei & New Taipei.\
    ');
  }
}

function LCPC_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 24); //-- 0 = date
  var col_tag_0 = col_tag_list[0];
  var col_tag_avg_0 = col_tag_0 + '_avg';
  var col_tag = col_tag_list[wrap.col_ind];
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
  var y_last = [0, 0]; //-- 0 (total) & county
  
  //-- Convert data form
  if (wrap.cumul == 1)
    GP_CumSum(data, col_tag_list);
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = +row[col_tag];
    avg = row[col_tag_avg];
    x_list.push(x);
    
    //-- Determine where to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Update moving avg
    if ('' == avg) {
      row[col_tag_0] = NaN;
      row[col_tag] = NaN;
      row[col_tag_avg_0] = NaN;
      row[col_tag_avg] = NaN;
      continue;
    }
    else if (wrap.cumul == 1) {
      row[col_tag_avg_0] = +row[col_tag_0];
      row[col_tag_avg] = y;
    }
    else {
      row[col_tag_avg_0] = +row[col_tag_avg_0];
      row[col_tag_avg] = +avg;
    }
    
    //-- Update last date
    last_date = row['date'];
    
    //-- Update y_last
    if (wrap.cumul == 0) {
      y_last[0] = +row[col_tag_0];
      y_last[1] = y;
    }
    else {
      y_last[0] = Math.max(y_last[0], +row[col_tag_0]);
      y_last[1] = Math.max(y_last[1], y);
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

function LCPC_FormatData2(wrap, data2) {
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
function LCPC_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
  
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  var col_label_list, avg_text;
  if (LS_lang == 'zh-tw') {
    col_label_list = [
      '全國合計', '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
    avg_text = '過去七日平均';
  }
  
  else if (LS_lang == 'fr') {
    col_label_list = [
      'Totaux nationaux', 'Keelung', 'Taipei', 'Nouveau Taipei', 'Taoyuan', 'Comté de Hsinchu', 'Ville de Hsinchu', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Comté de Chiayi', 'Ville de Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    avg_text = 'Moyenne sur 7 jours';
  }
  
  else {
    col_label_list = [
      'Nationalwide total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    avg_text = '7-day average';
  }
  
  //-- Define tooltip texts
  var tooltip_text = d.date;
  tooltip_text += '<br>' + col_label_list[wrap.col_ind] + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag]);
  if (wrap.cumul == 0)
    tooltip_text += '<br>' + avg_text + ' = ' + GP_AbbreviateValue(+d[wrap.col_tag_avg]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function LCPC_Plot(wrap) {
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
  wrap.mouse_move = LCPC_MouseMove;
  wrap.plot_opacity = GP_wrap.faint_opacity;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotFaintSingleBar(wrap);
  
  //-- Plot avg line
  GP_PlotAvgLine(wrap);
}

function LCPC_Replot(wrap) {
  //-- Update bar
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
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_case);
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = [
      '全國合計', '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
  else if (LS_lang == 'fr')
    legend_label = [
      'Totaux nationaux', 'Keelung', 'Taipei', 'Nouveau Taipei', 'Taoyuan', 'Comté de Hsinchu', 'Ville de Hsinchu', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Comté de Chiayi', 'Ville de Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
  else
    legend_label = [
      'Nationalwide total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
  wrap.legend_label = [legend_label[wrap.col_ind], legend_label[0]];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(0, 1);
    wrap.legend_label = wrap.legend_label.slice(0, 1);
  }
  
  //-- Update legend title
  GP_UpdateLegendTitle_Standard(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', 'normal');
}

//-- Load
function LCPC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      LCPC_FormatData(wrap, data);
      LCPC_FormatData2(wrap, data2);
      LCPC_Plot(wrap);
      LCPC_Replot(wrap);
    });
}

function LCPC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      LCPC_FormatData(wrap, data);
      LCPC_Replot(wrap);
    });
}

function LCPC_ButtonListener(wrap) {
  //-- Daily or cumulative
  $(document).on("change", "input:radio[name='" + wrap.tag + "_cumul']", function (event) {
    GP_PressRadioButton(wrap, 'cumul', wrap.cumul, this.value);
    wrap.cumul = this.value;
    LCPC_Reload(wrap);
  });
  
  //-- Period
  d3.select(wrap.id +'_county').on('change', function() {
    wrap.col_ind = this.value;
    LCPC_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1, tag2;
    
    var col_label = [
      'total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    tag1 = col_label[wrap.col_ind];
    
    if (wrap.cumul == 1)
      tag2 = 'cumulative';
    else
      tag2 = 'daily';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    LCPC_ResetText();
    LCPC_Replot(wrap);
  });
}

//-- Main
function LCPC_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Swap active to current value
  if (wrap.tag.includes('mini')) {
    wrap.cumul = 0;
    wrap.col_ind = 0;
  }
  else {
    wrap.cumul = document.querySelector("input[name='" + wrap.tag + "_cumul']:checked").value;
    GP_PressRadioButton(wrap, 'cumul', 0, wrap.cumul); //-- 0 from .html
    wrap.col_ind = document.getElementById(wrap.tag + "_county").value;
  }
  
  //-- Load
  LCPC_InitFig(wrap);
  LCPC_ResetText();
  LCPC_Load(wrap);
  
  //-- Setup button listeners
  LCPC_ButtonListener(wrap);
}
