
//-- Filename:
//--   vaccination_by_county.js
//--
//-- Author:
//--   Chieh-An Lin

function VBC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VBC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_county_title', '各縣市疫苗接種進度');
    LS_AddStr('vaccination_by_county_text', '資料不全');
    LS_AddStr('vaccination_by_county_button_brand_total', '所有廠牌');
    LS_AddStr('vaccination_by_county_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_county_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_by_county_button_county_total', '全國合計');
    LS_AddStr('vaccination_by_county_button_keelung', '基隆');
    LS_AddStr('vaccination_by_county_button_taipei', '台北');
    LS_AddStr('vaccination_by_county_button_new_taipei', '新北');
    LS_AddStr('vaccination_by_county_button_taoyuan', '桃園');
    LS_AddStr('vaccination_by_county_button_hsinchu', '竹縣');
    LS_AddStr('vaccination_by_county_button_hsinchu_city', '竹市');
    LS_AddStr('vaccination_by_county_button_miaoli', '苗栗');
    LS_AddStr('vaccination_by_county_button_taichung', '台中');
    LS_AddStr('vaccination_by_county_button_changhua', '彰化');
    LS_AddStr('vaccination_by_county_button_nantou', '南投');
    LS_AddStr('vaccination_by_county_button_yunlin', '雲林');
    LS_AddStr('vaccination_by_county_button_chiayi', '嘉縣');
    LS_AddStr('vaccination_by_county_button_chiayi_city', '嘉市');
    LS_AddStr('vaccination_by_county_button_tainan', '台南');
    LS_AddStr('vaccination_by_county_button_kaohsiung', '高雄');
    LS_AddStr('vaccination_by_county_button_pingtung', '屏東');
    LS_AddStr('vaccination_by_county_button_yilan', '宜蘭');
    LS_AddStr('vaccination_by_county_button_hualien', '花蓮');
    LS_AddStr('vaccination_by_county_button_taitung', '台東');
    LS_AddStr('vaccination_by_county_button_penghu', '澎湖');
    LS_AddStr('vaccination_by_county_button_kinmen', '金門');
    LS_AddStr('vaccination_by_county_button_matsu', '馬祖');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_county_title', 'Vaccins administrés par ville et comté');
    LS_AddStr('vaccination_by_county_text', 'Données incomplètes');
    LS_AddStr('vaccination_by_county_button_brand_total', 'Toutes marques');
    LS_AddStr('vaccination_by_county_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_county_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_by_county_button_county_total', 'Totaux nationaux');
    LS_AddStr('vaccination_by_county_button_keelung', 'Keelung');
    LS_AddStr('vaccination_by_county_button_taipei', 'Taipei');
    LS_AddStr('vaccination_by_county_button_new_taipei', 'Nouveau Taipei');
    LS_AddStr('vaccination_by_county_button_taoyuan', 'Taoyuan');
    LS_AddStr('vaccination_by_county_button_hsinchu', 'Comté de Hsinchu');
    LS_AddStr('vaccination_by_county_button_hsinchu_city', 'Ville de Hsinchu');
    LS_AddStr('vaccination_by_county_button_miaoli', 'Miaoli');
    LS_AddStr('vaccination_by_county_button_taichung', 'Taichung');
    LS_AddStr('vaccination_by_county_button_changhua', 'Changhua');
    LS_AddStr('vaccination_by_county_button_nantou', 'Nantou');
    LS_AddStr('vaccination_by_county_button_yunlin', 'Yunlin');
    LS_AddStr('vaccination_by_county_button_chiayi', 'Comté de Chiayi');
    LS_AddStr('vaccination_by_county_button_chiayi_city', 'Ville de Chiayi');
    LS_AddStr('vaccination_by_county_button_tainan', 'Tainan');
    LS_AddStr('vaccination_by_county_button_kaohsiung', 'Kaohsiung');
    LS_AddStr('vaccination_by_county_button_pingtung', 'Pingtung');
    LS_AddStr('vaccination_by_county_button_yilan', 'Yilan');
    LS_AddStr('vaccination_by_county_button_hualien', 'Hualien');
    LS_AddStr('vaccination_by_county_button_taitung', 'Taitung');
    LS_AddStr('vaccination_by_county_button_penghu', 'Penghu');
    LS_AddStr('vaccination_by_county_button_kinmen', 'Kinmen');
    LS_AddStr('vaccination_by_county_button_matsu', 'Matsu');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_county_title', 'Administrated Vaccines by City & County');
    LS_AddStr('vaccination_by_county_text', 'Incomplete data');
    LS_AddStr('vaccination_by_county_button_brand_total', 'All brands');
    LS_AddStr('vaccination_by_county_button_AZ', 'AZ');
    LS_AddStr('vaccination_by_county_button_Moderna', 'Moderna');
    LS_AddStr('vaccination_by_county_button_county_total', 'Nationalwide');
    LS_AddStr('vaccination_by_county_button_keelung', 'Keelung');
    LS_AddStr('vaccination_by_county_button_taipei', 'Taipei');
    LS_AddStr('vaccination_by_county_button_new_taipei', 'New Taipei');
    LS_AddStr('vaccination_by_county_button_taoyuan', 'Taoyuan');
    LS_AddStr('vaccination_by_county_button_hsinchu', 'Hsinchu County');
    LS_AddStr('vaccination_by_county_button_hsinchu_city', 'Hsinchu City');
    LS_AddStr('vaccination_by_county_button_miaoli', 'Miaoli');
    LS_AddStr('vaccination_by_county_button_taichung', 'Taichung');
    LS_AddStr('vaccination_by_county_button_changhua', 'Changhua');
    LS_AddStr('vaccination_by_county_button_nantou', 'Nantou');
    LS_AddStr('vaccination_by_county_button_yunlin', 'Yunlin');
    LS_AddStr('vaccination_by_county_button_chiayi', 'Chiayi County');
    LS_AddStr('vaccination_by_county_button_chiayi_city', 'Chiayi City');
    LS_AddStr('vaccination_by_county_button_tainan', 'Tainan');
    LS_AddStr('vaccination_by_county_button_kaohsiung', 'Kaohsiung');
    LS_AddStr('vaccination_by_county_button_pingtung', 'Pingtung');
    LS_AddStr('vaccination_by_county_button_yilan', 'Yilan');
    LS_AddStr('vaccination_by_county_button_hualien', 'Hualien');
    LS_AddStr('vaccination_by_county_button_taitung', 'Taitung');
    LS_AddStr('vaccination_by_county_button_penghu', 'Penghu');
    LS_AddStr('vaccination_by_county_button_kinmen', 'Kinmen');
    LS_AddStr('vaccination_by_county_button_matsu', 'Matsu');
  }
}

function VBC_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_last = [0, 0]; //-- 0 (total) & county
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y = +row[col_tag];
    
    //-- Update y_last
    y_last[0] = +row[col_tag_list[0]];
    y_last[1] = y;
    
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
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_last;
}

function VBC_FormatData2(wrap, data2) {
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
  if (wrap.tag.includes('latest'))
    wrap.iso_begin = GP_ISODateAddition(wrap.timestamp.slice(0, 10), -90+1);
  else if (wrap.tag.includes('overall'))
    wrap.iso_begin = GP_wrap.iso_ref_vacc;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap, 'area');
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, 90);
  var xticklabel = [];
  var x_list = [];
  var x;
  
  if (wrap.tag.includes('latest')) {
    //-- For xtick
    for (i=0; i<90; i++) {
      //-- Determine where to have xtick
      if (i % wrap.xlabel_path == r) {
        x = GP_ISODateAddition(wrap.iso_begin, i);
        x_list.push(i+wrap.x_min);
        xticklabel.push(x);
      }
    }
  }
  
  //-- Save to wrapper
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
}

//-- Tooltip
function VBC_MouseMove(wrap, d) {
//   if (wrap.tag.includes('mini'))
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

function VBC_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[0];
  
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define dummy area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.index);})
    .y0(yscale(0))
    .y1(yscale(0));
    
  //-- Add area
  var area = wrap.svg.selectAll('.content.area')
    .data([wrap.formatted_data])
    .enter();
    
  //-- Update area with dummy details
  area.append('path')
    .attr('class', 'content area')
    .attr('d', function (d) {return draw_area(d);})
    .style('fill', wrap.color)
      .on('mouseover', function (d) {GP_MouseOver2(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave2(wrap, d);});
    
  //-- Save to wrapper
  wrap.area = area;
}

function VBC_Replot(wrap) {
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.index);})
    .y0(yscale(0))
    .y1(function (d) {return yscale(d[wrap.col_tag]);});
    
  //-- Update area
  wrap.area.selectAll('.content.area')
    .data([wrap.formatted_data])
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_area(d);});
    
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap, 'area');
  else {
    //-- Define xaxis
    var xaxis = d3.axisBottom(xscale)
      .tickSize(10)
      .tickSizeOuter(0)
      .tickValues(wrap.x_list)
      .tickFormat(function (d, i) {return LS_ISODateToMDDate(wrap.xticklabel[i]);});
    
    //-- Add xaxis
    wrap.svg.select('.xaxis')
      .transition()
      .duration(wrap.trans_delay)
      .call(xaxis)
      .selectAll('text')
        .attr('transform', 'translate(-20,15) rotate(-90)')
        .style('text-anchor', 'end');
        
    //-- Tick style
    wrap.svg.selectAll('.xaxis line')
      .style('stroke-opacity', '0.4');
  }
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  return;
  
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
function VBC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.file_ind])
    .defer(d3.csv, wrap.data_path_list[3])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      VBC_FormatData(wrap, data);
      VBC_FormatData2(wrap, data2);
      VBC_Plot(wrap);
      VBC_Replot(wrap);
    });
}

function VBC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.file_ind])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBC_FormatData(wrap, data);
      VBC_Replot(wrap);
    });
}

function VBC_ButtonListener(wrap) {
  //-- Brand
  d3.select(wrap.id +'_brand').on('change', function() {
    wrap.file_ind = this.value;
    VBC_Reload(wrap);
  });
  
  //-- County
  d3.select(wrap.id +'_county').on('change', function() {
    wrap.col_ind = this.value;
    VBC_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    var col_label = [
      'nationalwide', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    var tag1 = col_label[wrap.col_ind];
    var tag2;
    
    if (wrap.file_ind == 0)
      tag2 = 'all_brands';
    else if (wrap.file_ind == 1)
      tag2 = 'AZ';
    else
      tag2 = 'Moderna';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    VBC_ResetText();
    VBC_Replot(wrap);
  });
}

//-- Main
function VBC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini')) {
    wrap.file_ind = 0;
    wrap.col_ind = 0;
  }
  else {
    wrap.file_ind = document.getElementById(wrap.tag + '_brand').value;
    wrap.col_ind = document.getElementById(wrap.tag + '_county').value;
  }
  
  //-- Load
  VBC_InitFig(wrap);
  VBC_ResetText();
  VBC_Load(wrap);
  
  //-- Setup button listeners
  VBC_ButtonListener(wrap);
}
