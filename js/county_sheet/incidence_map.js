
//-- Filename:
//--   incidence_map.js
//--
//-- Author:
//--   Chieh-An Lin

function IM_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 600;
  wrap.tot_height_['fr'] = 600;
  wrap.tot_height_['en'] = 600;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 2, right: 2, bottom: 2, top: 2};
  wrap.margin_['fr'] = {left: 2, right: 2, bottom: 2, top: 2};
  wrap.margin_['en'] = {left: 2, right: 2, bottom: 2, top: 2};
  
  GP_InitFig(wrap);
}

function IM_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('incidence_map_title', '縣市疫情地圖');
    LS_AddStr('incidence_map_button_count', '病例數');
    LS_AddStr('incidence_map_button_rate', '盛行率');
    LS_AddStr('incidence_map_button_total', '本土合計');
    LS_AddStr('incidence_map_button_w-1', '0-6天前');
    LS_AddStr('incidence_map_button_w-2', '7-13天前');
    LS_AddStr('incidence_map_button_w-3', '14-20天前');
    LS_AddStr('incidence_map_button_w-4', '21-27天前');
    LS_AddStr('incidence_map_button_w-5', '28-34天前');
    LS_AddStr('incidence_map_button_w-6', '35-41天前');
    LS_AddStr('incidence_map_button_w-7', '42-48天前');
    LS_AddStr('incidence_map_button_w-8', '49-55天前');
    LS_AddStr('incidence_map_button_w-9', '56-62天前');
    LS_AddStr('incidence_map_button_w-10', '63-69天前');
    LS_AddStr('incidence_map_button_w-11', '70-76天前');
    LS_AddStr('incidence_map_button_w-12', '77-83天前');
    LS_AddStr('incidence_map_button_m1', '1月');
    LS_AddStr('incidence_map_button_m2', '2月');
    LS_AddStr('incidence_map_button_m3', '3月');
    LS_AddStr('incidence_map_button_m4', '4月');
    LS_AddStr('incidence_map_button_m5', '5月');
    LS_AddStr('incidence_map_button_m6', '6月');
    LS_AddStr('incidence_map_button_m7', '7月');
    LS_AddStr('incidence_map_button_m8', '8月');
    LS_AddStr('incidence_map_button_m9', '9月');
    LS_AddStr('incidence_map_button_m10', '10月');
    LS_AddStr('incidence_map_button_m11', '11月');
    LS_AddStr('incidence_map_button_m12', '12月');
    LS_AddStr('incidence_map_button_2020_01', '2020年1月');
    LS_AddStr('incidence_map_button_2020_02', '2020年2月');
    LS_AddStr('incidence_map_button_2020_03', '2020年3月');
    LS_AddStr('incidence_map_button_2020_04', '2020年4月');
    LS_AddStr('incidence_map_button_2020_05', '2020年5月');
    LS_AddStr('incidence_map_button_2020_06', '2020年6月');
    LS_AddStr('incidence_map_button_2020_07', '2020年7月');
    LS_AddStr('incidence_map_button_2020_08', '2020年8月');
    LS_AddStr('incidence_map_button_2020_09', '2020年9月');
    LS_AddStr('incidence_map_button_2020_10', '2020年10月');
    LS_AddStr('incidence_map_button_2020_11', '2020年11月');
    LS_AddStr('incidence_map_button_2020_12', '2020年12月');
    LS_AddStr('incidence_map_button_2021_01', '2021年1月');
    LS_AddStr('incidence_map_button_2021_02', '2021年2月');
    LS_AddStr('incidence_map_button_2021_03', '2021年3月');
    LS_AddStr('incidence_map_button_2021_04', '2021年4月');
    LS_AddStr('incidence_map_button_2021_05', '2021年5月');
    LS_AddStr('incidence_map_button_2021_06', '2021年6月');
    LS_AddStr('incidence_map_button_2021_07', '2021年7月');
    LS_AddStr('incidence_map_button_2021_08', '2021年8月');
    LS_AddStr('incidence_map_button_2021_09', '2021年9月');
    LS_AddStr('incidence_map_button_2021_10', '2021年10月');
    LS_AddStr('incidence_map_button_2021_11', '2021年11月');
    LS_AddStr('incidence_map_button_2021_12', '2021年12月');
    
    LS_AddHtml('incidence_map_description', '\
      2021年5月所爆發的感染多半集中於雙北地區，\
      其確診個案佔全國總數八成以上。\
      <br><br>\
      此圖中，盛行率之定義為指定期間內，每十萬人本土個案數之總合（而非平均）。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('incidence_map_title', "Carte d'incidence");
    LS_AddStr('incidence_map_button_count', 'Nombre');
    LS_AddStr('incidence_map_button_rate', 'Taux');
    LS_AddStr('incidence_map_button_total', 'Locaux totaux');
    LS_AddStr('incidence_map_button_w-1', '0-6 jours plus tôt');
    LS_AddStr('incidence_map_button_w-2', '7-13 jours plus tôt');
    LS_AddStr('incidence_map_button_w-3', '14-20 jours plus tôt');
    LS_AddStr('incidence_map_button_w-4', '21-27 jours plus tôt');
    LS_AddStr('incidence_map_button_w-5', '28-34 jours plus tôt');
    LS_AddStr('incidence_map_button_w-6', '35-41 jours plus tôt');
    LS_AddStr('incidence_map_button_w-7', '42-48 jours plus tôt');
    LS_AddStr('incidence_map_button_w-8', '49-55 jours plus tôt');
    LS_AddStr('incidence_map_button_w-9', '56-62 jours plus tôt');
    LS_AddStr('incidence_map_button_w-10', '63-69 jours plus tôt');
    LS_AddStr('incidence_map_button_w-11', '70-76 jours plus tôt');
    LS_AddStr('incidence_map_button_w-12', '77-83 jours plus tôt');
    LS_AddStr('incidence_map_button_m1', 'Janvier');
    LS_AddStr('incidence_map_button_m2', 'Février');
    LS_AddStr('incidence_map_button_m3', 'Mars');
    LS_AddStr('incidence_map_button_m4', 'Avril');
    LS_AddStr('incidence_map_button_m5', 'Mai');
    LS_AddStr('incidence_map_button_m6', 'Juin');
    LS_AddStr('incidence_map_button_m7', 'Juillet');
    LS_AddStr('incidence_map_button_m8', 'Août');
    LS_AddStr('incidence_map_button_m9', 'Septembre');
    LS_AddStr('incidence_map_button_m10', 'Octobre');
    LS_AddStr('incidence_map_button_m11', 'Novembre');
    LS_AddStr('incidence_map_button_m12', 'Décembre');
    LS_AddStr('incidence_map_button_2020_01', 'Janv 2020');
    LS_AddStr('incidence_map_button_2020_02', 'Févr 2020');
    LS_AddStr('incidence_map_button_2020_03', 'Mars 2020');
    LS_AddStr('incidence_map_button_2020_04', 'Avr 2020');
    LS_AddStr('incidence_map_button_2020_05', 'Mai 2020');
    LS_AddStr('incidence_map_button_2020_06', 'Juin 2020');
    LS_AddStr('incidence_map_button_2020_07', 'Juil 2020');
    LS_AddStr('incidence_map_button_2020_08', 'Août 2020');
    LS_AddStr('incidence_map_button_2020_09', 'Sept 2020');
    LS_AddStr('incidence_map_button_2020_10', 'Oct 2020');
    LS_AddStr('incidence_map_button_2020_11', 'Nov 2020');
    LS_AddStr('incidence_map_button_2020_12', 'Déc 2020');
    LS_AddStr('incidence_map_button_2021_01', 'Janv 2021');
    LS_AddStr('incidence_map_button_2021_02', 'Févr 2021');
    LS_AddStr('incidence_map_button_2021_03', 'Mars 2021');
    LS_AddStr('incidence_map_button_2021_04', 'Avr 2021');
    LS_AddStr('incidence_map_button_2021_05', 'Mai 2021');
    LS_AddStr('incidence_map_button_2021_06', 'Juin 2021');
    LS_AddStr('incidence_map_button_2021_07', 'Juil 2021');
    LS_AddStr('incidence_map_button_2021_08', 'Août 2021');
    LS_AddStr('incidence_map_button_2021_09', 'Sept 2021');
    LS_AddStr('incidence_map_button_2021_10', 'Oct 2021');
    LS_AddStr('incidence_map_button_2021_11', 'Nov 2021');
    LS_AddStr('incidence_map_button_2021_12', 'Déc 2021');
    
    LS_AddHtml('incidence_map_description', "\
      La vague de mai 2021 se concentraient à Taipei et à Nouveau Taipei.\
      Plus de 80% des cas ont été observés dans ces 2 régions.\
      <br><br>\
      Le taux d'incidence est défini comme la somme (non pas la moyenne) des cas locaux pendant la période spécifique,\
      pour 100k habitants de la ville ou du comté indiqué.\
    ");
  }
  
  else { //-- En
    LS_AddStr('incidence_map_title', 'Incidence Map');
    LS_AddStr('incidence_map_button_count', 'Counts');
    LS_AddStr('incidence_map_button_rate', 'Rate');
    LS_AddStr('incidence_map_button_total', 'Total local');
    LS_AddStr('incidence_map_button_w-1', '0-6 days ago');
    LS_AddStr('incidence_map_button_w-2', '7-13 days ago');
    LS_AddStr('incidence_map_button_w-3', '14-20 days ago');
    LS_AddStr('incidence_map_button_w-4', '21-27 days ago');
    LS_AddStr('incidence_map_button_w-5', '28-34 days ago');
    LS_AddStr('incidence_map_button_w-6', '35-41 days ago');
    LS_AddStr('incidence_map_button_w-7', '42-48 days ago');
    LS_AddStr('incidence_map_button_w-8', '49-55 days ago');
    LS_AddStr('incidence_map_button_w-9', '56-62 days ago');
    LS_AddStr('incidence_map_button_w-10', '63-69 days ago');
    LS_AddStr('incidence_map_button_w-11', '70-76 days ago');
    LS_AddStr('incidence_map_button_w-12', '77-83 days ago');
    LS_AddStr('incidence_map_button_m1', 'January');
    LS_AddStr('incidence_map_button_m2', 'February');
    LS_AddStr('incidence_map_button_m3', 'March');
    LS_AddStr('incidence_map_button_m4', 'April');
    LS_AddStr('incidence_map_button_m5', 'May');
    LS_AddStr('incidence_map_button_m6', 'June');
    LS_AddStr('incidence_map_button_m7', 'July');
    LS_AddStr('incidence_map_button_m8', 'August');
    LS_AddStr('incidence_map_button_m9', 'September');
    LS_AddStr('incidence_map_button_m10', 'October');
    LS_AddStr('incidence_map_button_m11', 'November');
    LS_AddStr('incidence_map_button_m12', 'December');
    LS_AddStr('incidence_map_button_2020_01', 'Jan 2020');
    LS_AddStr('incidence_map_button_2020_02', 'Feb 2020');
    LS_AddStr('incidence_map_button_2020_03', 'Mar 2020');
    LS_AddStr('incidence_map_button_2020_04', 'Apr 2020');
    LS_AddStr('incidence_map_button_2020_05', 'May 2020');
    LS_AddStr('incidence_map_button_2020_06', 'Jun 2020');
    LS_AddStr('incidence_map_button_2020_07', 'Jul 2020');
    LS_AddStr('incidence_map_button_2020_08', 'Aug 2020');
    LS_AddStr('incidence_map_button_2020_09', 'Sep 2020');
    LS_AddStr('incidence_map_button_2020_10', 'Oct 2020');
    LS_AddStr('incidence_map_button_2020_11', 'Nov 2020');
    LS_AddStr('incidence_map_button_2020_12', 'Dec 2020');
    LS_AddStr('incidence_map_button_2021_01', 'Jan 2021');
    LS_AddStr('incidence_map_button_2021_02', 'Feb 2021');
    LS_AddStr('incidence_map_button_2021_03', 'Mar 2021');
    LS_AddStr('incidence_map_button_2021_04', 'Apr 2021');
    LS_AddStr('incidence_map_button_2021_05', 'May 2021');
    LS_AddStr('incidence_map_button_2021_06', 'Jun 2021');
    LS_AddStr('incidence_map_button_2021_07', 'Jul 2021');
    LS_AddStr('incidence_map_button_2021_08', 'Aug 2021');
    LS_AddStr('incidence_map_button_2021_09', 'Sep 2021');
    LS_AddStr('incidence_map_button_2021_10', 'Oct 2021');
    LS_AddStr('incidence_map_button_2021_11', 'Nov 2021');
    LS_AddStr('incidence_map_button_2021_12', 'Dec 2021');
    
    LS_AddHtml('incidence_map_description', '\
      The outbreak of May 2021 was concentrated at Taipei & New Taipei.\
      More than 80% of the total cases were observed in these 2 areas.\
      <br><br>\
      The incidence rate is defined as the sum (instead of average) of local cases during the chosen period,\
      for every 100k inhabitants of the indicated city or county.\
    ');
  }
}

//-- Map
function IM_FormatData(wrap, data) {
  wrap.formatted_data = data.features;
  wrap.list_length = data.features.length;
}

//-- Label
function IM_FormatData2(wrap, data2) {
  var code_dict = {}
  var label_list_dict = {'key': [], 'en': [], 'fr': [], 'zh-tw': []};
  var i, code, key, population; 
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    key = data2[i]['key'];
    code = data2[i]['code'];
    population = +data2[i]['population'];
    code_dict[key] = {'code': code, 'population': population/100000};
    
    if (key == 'total')
      continue;
    
    label_list_dict['key'].push(key);
    label_list_dict['en'].push(data2[i]['label']);
    label_list_dict['fr'].push(data2[i]['label_fr']);
    label_list_dict['zh-tw'].push(data2[i]['label_zh']);
  }
  
  //-- Save to wrapper
  wrap.code_dict = code_dict;
  wrap.label_list_dict = label_list_dict;
}

//-- Value
function IM_FormatData3(wrap, data3) {
  //-- Variables for data
  var col_tag_list = data3.columns.slice(1);
  var col_tag = col_tag_list[wrap.period];
  var i, j, x, y;
  
  //-- Variables for plot
  var value_list = [];
  var value_max = 0.0;
  var count, county, code, population, properties, legend_value;
  
  //-- Loop over row
  for (i=0; i<data3.length; i++) {
    x = data3[i]['county'];
    count = +data3[i][col_tag];
    code = wrap.code_dict[x]['code'];
    population = wrap.code_dict[x]['population'];
    
    y = count / population;
    
    if (x == 'total') {
      if (wrap.rate == 1)
        legend_value = y;
      else
        legend_value = count;
      continue;
    }
    else {
      value_max = Math.max(y, value_max);
      if (wrap.rate == 1)
        value_list.push(y);
      else
        value_list.push(count);
    }
    
    for (j=0; j<wrap.list_length; j++) {
      properties = wrap.formatted_data[j].properties;
      
      if (code == properties.COUNTYCODE)
        properties.value = y;
    }
  }
  
  //-- Save to wrapper
  wrap.col_tag_list = col_tag_list;
  wrap.value_list = value_list;
  wrap.value_max = value_max;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function IM_MouseOver(wrap, d, i) {
  d3.select(d3.event.target)
    .style('opacity', wrap.plot_opacity);
    
  wrap.svg.select(wrap.id+'_label_'+d.properties.COUNTYCODE)
    .style('font-size', '1.3rem');
}

function IM_MouseLeave(wrap, d, i) {
  d3.select(d3.event.target)
    .style('opacity', 1);
    
  wrap.svg.select(wrap.id+'_label_'+d.properties.COUNTYCODE)
    .style('font-size', 'inherit');
}

function IM_Plot(wrap) {
  //-- Define projection
  var scale = 150;
  var ctr_ra = 120+48/60; //-- Center was 120 58' 55"
  var ctr_dec = 23+48/60; //-- Center was  23 58' 26"
  var projection = d3.geoGnomonic()
    .rotate([-ctr_ra, -ctr_dec]).scale(scale*180/Math.PI).translate([0.5*wrap.width, 0.5*wrap.height]);
    
  //-- Define opacity & delay
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
    
  //-- Add map
  var map = wrap.svg.selectAll('.content.map')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update map with dummy color
  map.append('path')
    .attr('class', 'content map')
    .attr('d', d3.geoPath().projection(projection))
    .attr('fill', function (d) {return '#FFFFFF';})
    .style('stroke', GP_wrap.gray)
      .on('mouseover', function (d, i) {IM_MouseOver(wrap, d, i);})
      .on('mouseleave', function (d, i) {IM_MouseLeave(wrap, d, i);});
    
  //-- Save to wrapper
  wrap.map = map;
}

function IM_Replot(wrap) {
  //-- Redefine color everytime, because value_max changes
  var color = d3.scaleSequential()
    .domain([0, Math.max(Math.log10(1+wrap.value_max), 0.3)])
    .interpolator(t => d3.interpolatePuRd(t));
  
  //-- Update map
  wrap.map.selectAll('.content.map')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('fill', function (d) {return color(Math.log10(1+d.properties.value));})
    
  //-- Define annotation position
  var anno_dy = 27;
  var anno_n = {x: 645, y: 110};
  var anno_nw = {x: 420, y: 40};
  var anno_c = {x: 350, y: 170};
  var anno_s = {x: 290, y: 420};
  var anno_e = {x: 615, y: 300};
  var anno_offset = {x: -63, y: 20};
  
  var anno_pos = [
      {lab_x: anno_n.x, lab_y: anno_n.y,           sign: -1, zone_x: 585, zone_y: 80}, //-- Keelung
      {lab_x: anno_n.x, lab_y: anno_n.y+anno_dy,   sign: -1, zone_x: 565, zone_y: 90}, //-- Taipei
      {lab_x: anno_n.x, lab_y: anno_n.y+2*anno_dy, sign: -1, zone_x: 560, zone_y: 115}, //-- New_Taipei
      
    {lab_x: anno_nw.x, lab_y: anno_nw.y,           sign: 1, zone_x: 510, zone_y: 100}, //-- Taoyuan
    {lab_x: anno_nw.x, lab_y: anno_nw.y+anno_dy,   sign: 1, zone_x: 490, zone_y: 117}, //-- Hsinchu
    {lab_x: anno_nw.x, lab_y: anno_nw.y+2*anno_dy, sign: 1, zone_x: 480, zone_y: 130}, //-- Hsinchu_C
    {lab_x: anno_nw.x, lab_y: anno_nw.y+3*anno_dy, sign: 1, zone_x: 472, zone_y: 155}, //-- Miaoli
    
    {lab_x: anno_c.x, lab_y: anno_c.y,           sign: 1, zone_x: 440, zone_y: 220}, //-- Taichung
    {lab_x: anno_c.x, lab_y: anno_c.y+anno_dy,   sign: 1, zone_x: 420, zone_y: 240}, //-- Changhua
    {lab_x: anno_c.x, lab_y: anno_c.y+2*anno_dy, sign: 1, zone_x: 455, zone_y: 290}, //-- Nantou
    {lab_x: anno_c.x, lab_y: anno_c.y+3*anno_dy, sign: 1, zone_x: 410, zone_y: 285}, //-- Yunlin
    
    {lab_x: anno_s.x, lab_y: anno_s.y,           sign: 1, zone_x: 387, zone_y: 330}, //-- Chiayi
    {lab_x: anno_s.x, lab_y: anno_s.y+anno_dy,   sign: 1, zone_x: 413, zone_y: 326}, //-- Chiayi_C
    {lab_x: anno_s.x, lab_y: anno_s.y+2*anno_dy, sign: 1, zone_x: 385, zone_y: 380}, //-- Tainan
    {lab_x: anno_s.x, lab_y: anno_s.y+3*anno_dy, sign: 1, zone_x: 395, zone_y: 430}, //-- Kaohsiung
    {lab_x: anno_s.x, lab_y: anno_s.y+4*anno_dy, sign: 1, zone_x: 430, zone_y: 455}, //-- Pingtung
    
      {lab_x: anno_e.x, lab_y: anno_e.y,           sign: -1, zone_x: 575, zone_y: 170}, //-- Yilan
      {lab_x: anno_e.x, lab_y: anno_e.y+anno_dy,   sign: -1, zone_x: 545, zone_y: 270}, //-- Hualien
      {lab_x: anno_e.x, lab_y: anno_e.y+2*anno_dy, sign: -1, zone_x: 510, zone_y: 400}, //-- Taitung
      
    {lab_x: 260, lab_y: 310, sign: 1, zone_x: 285, zone_y: 305}, //-- Penghu
    {lab_x: 180, lab_y: 220, sign: 1, zone_x: 175, zone_y: 185}, //-- Kinmen
    {lab_x: 215, lab_y: 90,  sign: 1, zone_x: 180, zone_y: 30}, //-- Matsu
  ];
  
  //-- Update annotation text
  wrap.svg.selectAll('.content.text')
    .remove()
    .exit()
    .data(wrap.label_list_dict[LS_lang])
    .enter()
    .append('text')
      .attr('class', 'content text')
      .attr('id', function (d, i) {return wrap.tag+'_label_'+wrap.code_dict[wrap.label_list_dict.key[i]]['code'];})
      .attr('x', function (d, i) {return anno_offset.x+anno_pos[i].lab_x;})
      .attr('y', function (d, i) {return anno_offset.y+anno_pos[i].lab_y;})
      .attr('text-anchor', function (d, i) {if (anno_pos[i].sign > 0) return 'end'; return 'start';})
      .attr('dominant-baseline', 'middle')
      .style('fill', '#000000')
      .text(function (d, i) {if (wrap.rate == 1) return d+' '+wrap.value_list[i].toFixed(1); return d+' '+wrap.value_list[i];});
  
  //-- Remove annotation lines
  wrap.svg.selectAll('.annotation.line')
    .remove();
    
  //-- Update annotation lines
  var eps = 5;
  var dx = 15;
  var i, row, points;
  for (i=0; i<wrap.list_length; i++) {
    if ((i == 19) || (i == 20) || (i == 21))
      continue;
    
    row = anno_pos[i];
    points = (anno_offset.x+row.lab_x+row.sign*eps) + ',' + (anno_offset.y+row.lab_y) + ' ' +
             (anno_offset.x+row.lab_x+row.sign*(eps+dx)) + ',' + (anno_offset.y+row.lab_y) + ' ' +
             (anno_offset.x+row.zone_x) + ',' + (anno_offset.y+row.zone_y);
    
    wrap.svg.append('polyline')
      .attr('class', 'annotation line')
      .attr('points', points)
      .attr('fill', 'none')
      .attr('stroke', GP_wrap.gray)
      .attr('stroke-width', 1)
      .attr('opacity', 1);
  }
      
  //-- Define top legend caption
  var legend_caption_top;
  if (wrap.rate == 1) {
    if (LS_lang == 'zh-tw')
      legend_caption_top = ['每十萬人確診率'];
    else if (LS_lang == 'fr')
      legend_caption_top = ["Taux d'incidence pour 100k habitants"];
    else 
      legend_caption_top = ['Incidence rate per 100k inhabitants'];
  }
  else 
    if (LS_lang == 'zh-tw')
      legend_caption_top = ['確診案例數'];
    else if (LS_lang == 'fr')
      legend_caption_top = ['Nombre de cas confirmés'];
    else 
      legend_caption_top = ['Confirmed case counts'];
    
  //-- Update top legend caption
  wrap.svg.selectAll('.legend.caption_top')
    .remove()
    .exit()
    .data(legend_caption_top)
    .enter()
    .append('text')
      .attr('class', 'legend caption_top')
      .attr('x', wrap.tot_width-20)
      .attr('y', 20)
      .attr('text-anchor', 'end')
      .style('fill', '#000000')
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
  
  //-- Define legend title
  var legend_title_list;
  if (wrap.tag.includes('latest')) {
    if (LS_lang == 'zh-tw')
      legend_title_list = [
        '0-6天前', '7-13天前', '14-20天前', '21-27天前', '28-34天前', '35-41天前', 
        '42-48天前', '49-55天前', '56-62天前', '63-69天前', '70-76天前', '77-83天前'
      ];
    else if (LS_lang == 'fr')
      legend_title_list = [
        '0-6 jours plus tôt', '7-13 jours plus tôt', '14-20 jours plus tôt', '21-27 jours plus tôt', '28-34 jours plus tôt', '35-41 jours plus tôt', 
        '42-48 jours plus tôt', '49-55 jours plus tôt', '56-62 jours plus tôt', '63-69 jours plus tôt', '70-76 jours plus tôt', '77-83 jours plus tôt'
      ];
    else
      legend_title_list = [
        '0-6 days ago', '7-13 days ago', '14-20 days ago', '21-27 days ago', '28-34 days ago', '35-41 days ago', 
        '42-48 days ago', '49-55 days ago', '56-62 days ago', '63-69 days ago', '70-76 days ago', '77-83 days ago'
      ]; 
  }
  else if (wrap.tag.includes('overall')) {
    if (LS_lang == 'zh-tw')
      legend_title_list = [
        '2020年1月', '2020年2月','2020年3月', '2020年4月','2020年5月', '2020年6月',
        '2020年7月', '2020年8月','2020年9月', '2020年10月','2020年11月', '2020年12月',
        '2021年1月', '2021年2月','2021年3月', '2021年4月','2021年5月', '2021年6月',
        '2021年7月', '2021年8月','2021年9月', '2021年10月','2021年11月', '2021年12月'
      ];
    else if (LS_lang == 'fr')
      legend_title_list = [
        'Janvier 2020', 'Février 2020', 'Mars 2020', 'Avril 2020', 'Mai 2020', 'Juin 2020', 
        'Juillet 2020', 'Août 2020', 'Septembre 2020', 'Octobre 2020', 'Novembre 2020', 'Décembre 2020', 
        'Janvier 2021', 'Février 2021', 'Mars 2021', 'Avril 2021', 'Mai 2021', 'Juin 2021', 
        'Juillet 2021', 'Août 2021', 'Septembre 2021', 'Octobre 2021', 'Novembre 2021', 'Décembre 2021', 
      ];
    else
      legend_title_list = [
        'January 2020', 'February 2020', 'March 2020', 'April 2020', 'May 2020', 'June 2020', 
        'July 2020', 'Auguest 2020', 'September 2020', 'October 2020', 'November 2020', 'December 2020', 
        'January 2021', 'February 2021', 'March 2021', 'April 2021', 'May 2021', 'June 2021', 
        'July 2021', 'Auguest 2021', 'September 2021', 'October 2021', 'November 2021', 'December 2021', 
      ]; 
  }
  legend_title_list = [LS_GetLegendTitle_Page(wrap)].concat(legend_title_list);
  
  //-- Define bottom legend caption
  var legend_label;
  if (wrap.rate == 1) {
    if (LS_lang == 'zh-tw')
      legend_label = '全國平均 ';
    else if (LS_lang == 'fr')
      legend_label = 'Niveau national ';
    else 
      legend_label = 'Nationalwide level ';
    legend_label += +wrap.legend_value.toFixed(1);
  }
  else {
    if (LS_lang == 'zh-tw')
      legend_label = '全國合計 ';
    else if (LS_lang == 'fr')
      legend_label = 'Totaux nationaux ';
    else 
      legend_label = 'Nationalwide total ';
    legend_label += wrap.legend_value;
  }
  legend_caption_bottom = [legend_title_list[wrap.period], legend_label];
  
  //-- Update legend caption
  wrap.svg.selectAll('.legend.caption')
    .remove()
    .exit()
    .data(legend_caption_bottom)
    .enter()
    .append('text')
      .attr('class', 'legend caption')
      .attr('x', wrap.tot_width-20)
      .attr('y', function (d, i) {return wrap.tot_height-20-(legend_caption_bottom.length-1-i)*27;})
      .attr('text-anchor', 'end')
      .attr('text-decoration', function (d, i) {if (0 == i) return 'underline'; return '';})
      .style('fill', '#000000')
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
}
   
//-- Load
function IM_Load(wrap) {
  d3.queue()
    .defer(d3.json, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2, data3) {
      if (error)
        return console.warn(error);
      
      IM_FormatData(wrap, data);
      IM_FormatData2(wrap, data2);
      IM_FormatData3(wrap, data3);
      IM_Plot(wrap);
      IM_Replot(wrap);
    });
}

function IM_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data3) {
      if (error)
        return console.warn(error);
      
      IM_FormatData3(wrap, data3);
      IM_Replot(wrap);
    });
}

function IM_ButtonListener(wrap) {
  //-- Count or rate
  $(document).on("change", "input:radio[name='" + wrap.tag + "_rate']", function (event) {
    GP_PressRadioButton(wrap, 'rate', wrap.rate, this.value);
    wrap.rate = this.value;
    IM_Reload(wrap);
  });
  
  //-- Period
  d3.select(wrap.id +'_period').on('change', function() {
    wrap.period = this.value;
    IM_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1, tag2;
    
    if (wrap.rate == 0)
      tag1 = 'count';
    else
      tag1 = 'rate';
    
    if (wrap.period == 0)
      tag2 = 'total';
    else if (wrap.tag.includes('latest'))
      tag2 = 'w' + (-wrap.period);
    else
      tag2 = 'm' + wrap.period;
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Replot
    IM_ResetText();
    IM_Replot(wrap);
  });
}

//-- Main
function IM_Main(wrap) {
  wrap.id = '#' + wrap.tag;
  
  //-- Swap active to current value
  wrap.rate = document.querySelector("input[name='" + wrap.tag + "_rate']:checked").value;
  GP_PressRadioButton(wrap, 'rate', 0, wrap.rate); //-- 0 from .html
  wrap.period = document.getElementById(wrap.tag + '_period').value;
  
  //-- Load
  IM_InitFig(wrap);
  IM_ResetText();
  IM_Load(wrap);
  
  //-- Setup button listeners
  IM_ButtonListener(wrap);
}
