
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
    LS_AddStr('incidence_map_title', '縣市確診地圖');
    LS_AddStr('incidence_map_button_1', '案例數');
    LS_AddStr('incidence_map_button_2', '確診率');
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
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('incidence_map_title', "Carte d'incidence");
    LS_AddStr('incidence_map_button_1', 'Nombre');
    LS_AddStr('incidence_map_button_2', 'Taux');
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
  }
  
  else { //-- En
    LS_AddStr('incidence_map_title', 'Incidence Map');
    LS_AddStr('incidence_map_button_1', 'Counts');
    LS_AddStr('incidence_map_button_2', 'Rate');
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
  var label_list_dict = {'tag': [], 'en': [], 'fr': [], 'zh-tw': []};
  var i, code, tag, population; 
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    tag = data2[i]['key'];
    code = data2[i]['code'];
    population = +data2[i]['population'];
    code_dict[tag] = {'code': code, 'population': population/100000};
    label_list_dict['tag'].push(tag);
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
  var y_list = [];
  
  //-- Other variables
  var y_max = 0.0;
  var i, j, x, y, count, county, code, population, properties;
  
  //-- Loop over row
  for (i=0; i<data3.length; i++) {
    x = data3[i]['county'];
    count = +data3[i][col_tag];
    code = wrap.code_dict[x]['code'];
    population = wrap.code_dict[x]['population'];
    
    y = count / population;
    y_max = Math.max(y, y_max);
    if (wrap.rate == 1)
      y_list.push(y);
    else
      y_list.push(count);
    
    for (j=0; j<wrap.list_length; j++) {
      properties = wrap.formatted_data[j].properties;
      
      if (code == properties.COUNTYCODE)
        properties.value = y;
    }
  }
  
  //-- Save to wrapper
  wrap.col_tag_list = col_tag_list;
  wrap.y_max = y_max;
  wrap.y_list = y_list;
}

//-- Tooltip
function IM_MouseOver(wrap, d, i) {
  d3.select(d3.event.target)
    .style('opacity', 0.8);
    
  wrap.svg.selectAll(wrap.id+'_label_'+d.properties.COUNTYCODE)
    .style('font-size', '20px')
}

function IM_MouseLeave(wrap, d, i) {
  d3.select(d3.event.target)
    .style('opacity', 1);
    
  wrap.svg.selectAll(wrap.id+'_label_'+d.properties.COUNTYCODE)
    .style('font-size', '16px')
}

function IM_Plot(wrap) {
  //-- Define projection
  var scale = 150;
  var ctr_ra = 120+48/60; //-- Center was 120 58' 55"
  var ctr_dec = 23+48/60; //-- Center was  23 58' 26"
  var projection = d3.geoGnomonic()
    .rotate([-ctr_ra, -ctr_dec]).scale(scale*180/Math.PI).translate([0.5*wrap.width, 0.5*wrap.height]);
    
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
  wrap.projection = projection;
  wrap.map = map;
}

function IM_Replot(wrap) {
  //-- Define color
  var color = d3.scaleSequential()
    .domain([0, Math.log10(1.000001+wrap.y_max)])
    .interpolator(t => d3.interpolateMagma(1-0.75*t));
  
  //-- Update map
  wrap.map.selectAll('.content.map')
    .data(wrap.formatted_data)
    .transition()
    .duration(GP_wrap.trans_delay)
    .attr('fill', function (d) {return color(Math.log10(1+d.properties.value));})
    
  //-- Define legend position
  var legend_dy = 25;
  var legend_n = {x: 645, y: 110};
  var legend_nw = {x: 420, y: 50};
  var legend_c = {x: 350, y: 170};
  var legend_s = {x: 290, y: 420};
  var legend_e = {x: 615, y: 300};
  var offset = {x: -63, y: 20};
  
  var legend_pos = [
      {lab_x: legend_n.x, lab_y: legend_n.y,             sign: -1, zone_x: 585, zone_y: 80}, //-- Keelung
      {lab_x: legend_n.x, lab_y: legend_n.y+legend_dy,   sign: -1, zone_x: 565, zone_y: 90}, //-- Taipei
      {lab_x: legend_n.x, lab_y: legend_n.y+2*legend_dy, sign: -1, zone_x: 560, zone_y: 115}, //-- New_Taipei
      
    {lab_x: legend_nw.x, lab_y: legend_nw.y,             sign: 1, zone_x: 510, zone_y: 100}, //-- Taoyuan
    {lab_x: legend_nw.x, lab_y: legend_nw.y+legend_dy,   sign: 1, zone_x: 490, zone_y: 117}, //-- Hsinchu
    {lab_x: legend_nw.x, lab_y: legend_nw.y+2*legend_dy, sign: 1, zone_x: 480, zone_y: 130}, //-- Hsinchu_C
    {lab_x: legend_nw.x, lab_y: legend_nw.y+3*legend_dy, sign: 1, zone_x: 472, zone_y: 155}, //-- Miaoli
    
    {lab_x: legend_c.x, lab_y: legend_c.y,             sign: 1, zone_x: 440, zone_y: 220}, //-- Taichung
    {lab_x: legend_c.x, lab_y: legend_c.y+legend_dy,   sign: 1, zone_x: 420, zone_y: 240}, //-- Changhua
    {lab_x: legend_c.x, lab_y: legend_c.y+2*legend_dy, sign: 1, zone_x: 455, zone_y: 290}, //-- Nantou
    {lab_x: legend_c.x, lab_y: legend_c.y+3*legend_dy, sign: 1, zone_x: 410, zone_y: 285}, //-- Yunlin
    
    {lab_x: legend_s.x, lab_y: legend_s.y,             sign: 1, zone_x: 387, zone_y: 330}, //-- Chiayi
    {lab_x: legend_s.x, lab_y: legend_s.y+legend_dy,   sign: 1, zone_x: 413, zone_y: 326}, //-- Chiayi_C
    {lab_x: legend_s.x, lab_y: legend_s.y+2*legend_dy, sign: 1, zone_x: 385, zone_y: 380}, //-- Tainan
    {lab_x: legend_s.x, lab_y: legend_s.y+3*legend_dy, sign: 1, zone_x: 395, zone_y: 430}, //-- Kaohsiung
    {lab_x: legend_s.x, lab_y: legend_s.y+4*legend_dy, sign: 1, zone_x: 430, zone_y: 455}, //-- Pingtung
    
      {lab_x: legend_e.x, lab_y: legend_e.y,             sign: -1, zone_x: 575, zone_y: 170}, //-- Yilan
      {lab_x: legend_e.x, lab_y: legend_e.y+legend_dy,   sign: -1, zone_x: 545, zone_y: 270}, //-- Hualien
      {lab_x: legend_e.x, lab_y: legend_e.y+2*legend_dy, sign: -1, zone_x: 510, zone_y: 400}, //-- Taitung
      
    {lab_x: 260, lab_y: 310, sign: 1, zone_x: 285, zone_y: 305}, //-- Penghu
    {lab_x: 190, lab_y: 220, sign: 1, zone_x: 175, zone_y: 185}, //-- Kinmen
    {lab_x: 215, lab_y: 90,  sign: 1, zone_x: 180, zone_y: 30}, //-- Matsu
  ];
  
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(wrap.label_list_dict[LS_lang])
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', function (d, i) {return offset.x+legend_pos[i].lab_x;})
      .attr('y', function (d, i) {return offset.y+legend_pos[i].lab_y;})
      .style('fill', '#000000')
      .text(function (d, i) {if (wrap.rate == 1) return d+' '+wrap.y_list[i].toFixed(1); return d+' '+wrap.y_list[i];})
      .style('font-size', '16px')
      .attr('id', function (d, i) {return wrap.tag+'_label_'+wrap.code_dict[wrap.label_list_dict.tag[i]]['code'];})
      .attr('text-anchor', function (d, i) {if (legend_pos[i].sign > 0) return 'end'; return 'start';})
      .attr('dominant-baseline', 'middle');
      
  var line = wrap.svg.append('g');
  var eps = 5;
  var dx = 15;
  var i, row, points;
  
  for (i=0; i<wrap.list_length; i++) {
    if ((i == 19) || (i == 20) || (i == 21))
      continue;
    
    row = legend_pos[i];
    points = (offset.x+row.lab_x+row.sign*eps) + ',' + (offset.y+row.lab_y) + ' ' +
             (offset.x+row.lab_x+row.sign*(eps+dx)) + ',' + (offset.y+row.lab_y) + ' ' +
             (offset.x+row.zone_x) + ',' + (offset.y+row.zone_y);
    
    line.append('polyline')
      .attr('points', points)
      .attr('opacity', 1)
      .attr('stroke', GP_wrap.gray)
      .attr('stroke-width', 1)
      .attr('id', wrap.tag+'_line_'+i)
      .attr('fill', 'none');
  }
  
  if (wrap.rate == 1) {
    if (LS_lang == 'zh-tw')
      caption = ['每十萬人確診率 '+LS_GetYearLabel(wrap)];
    else if (LS_lang == 'fr')
      caption = ["Taux d'incidence", 'par 100k habitants', LS_GetYearLabel(wrap)];
    else 
      caption = ['Incidence rate', 'per 100k inhabitants', LS_GetYearLabel(wrap)];
  }
  else 
    if (LS_lang == 'zh-tw')
      caption = ['確診案例數 '+LS_GetYearLabel(wrap)];
    else if (LS_lang == 'fr')
      caption = ['Nombre des cas confirmés', LS_GetYearLabel(wrap)];
    else 
      caption = ['Confirmed case counts', LS_GetYearLabel(wrap)];
    
  //-- Update legend caption
  wrap.svg.selectAll('.legend.caption')
    .remove()
    .exit()
    .data(caption)
    .enter()
    .append('text')
      .attr('class', 'legend caption')
      .attr('x', wrap.tot_width-20)
      .attr('y', function (d, i) {return wrap.tot_height-20-(caption.length-1-i)*25;})
      .style('fill', '#000000')
      .text(function (d) {return d;})
      .style('font-size', '20px')
      .attr('text-anchor', 'end');
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
