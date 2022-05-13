
    //----------------------------------------//
    //--  incidence_evolution_by_county.js  --//
    //--  Chieh-An Lin                      --//
    //--  2022.05.09                        --//
    //----------------------------------------//

function IEBC_InitFig(wrap) {
  wrap.tot_width = 1200;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 580;
  wrap.tot_height_['fr'] = 580;
  wrap.tot_height_['en'] = 580;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 50, right: 5, bottom: 65, top: 35};
  wrap.margin_['fr'] = {left: 170, right: 5, bottom: 65, top: 35};
  wrap.margin_['en'] = {left: 140, right: 5, bottom: 75, top: 35};
  
  GP_InitFig(wrap);
}

function IEBC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('incidence_evolution_by_county_title', '各縣市盛行率變化');
    
    LS_AddHtml('incidence_evolution_by_county_description', '\
      此圖中，盛行率之定義為自該日起回推七日內，指定縣市每十萬人本土個案數之總合（而非平均）。\
      <br><br>\
      因為今日確診個案的資料明天才會更新，所以最後一欄留空。\
      <br><br>\
      此統計不包含境外移入個案，\
      因此全國盛行率可能會與「各年齡層盛行率變化」之「所有年齡」盛行率不同。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('incidence_evolution_by_county_title', 'Évolution du taux d\'incidence par ville et comté');
    
    LS_AddHtml('incidence_evolution_by_county_description', '\
      Dans cette figure, le taux d\'incidence est défini comme la somme (non pas la moyenne) des cas locaux pendant 7 derniers jours,\
      pour 100k habitants de la ville ou du comté indiqué.\
      <br><br>\
      La dernière colonne est vide car les données d\'aujourd\'hui ne sont disponibles que demain.\
      <br><br>\
      Les cas importés sont exclus.\
      Par conséquent, le taux d\'incidence national peut ne pas être identique à celui de « Tous âges » dans l\'« Évolution du taux d\'incidence par tranche d\'âge »\
    ');
  }
  
  else { //-- En
    LS_AddStr('incidence_evolution_by_county_title', 'Evolution of Incidence Rate by City & County');
    
    LS_AddHtml('incidence_evolution_by_county_description', '\
      In this figure, the incidence rate is defined as the sum (instead of average) of local cases during 7 lookback days,\
      for every 100k inhabitants of the indicated city or county.\
      <br><br>\
      The last column is empty since today\'s data are only available tomorrow.\
      <br><br>\
      The imported cases are not included.\
      Thus, the incidence rate of "Nationalwide" could be different from the value of "All ages" in "Evolution of Incidence Rate by Age Group".\
    ');
  }
}

function IEBC_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var formatted_data = [];
  var x_list = []; //-- For date
  var value_max = 0;
  var block, col_tag;
  
  //-- Variables for xaxis
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xticklabel = [];
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r)
      xticklabel.push(x);
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col_tag = col_tag_list[j];
      
      //-- Make data block
      block = {
        'x': x,
        'y': col_tag,
        'value': +row[col_tag]
      };
      
      //-- Calculate value_max
      value_max = Math.max(value_max, +row[col_tag]);
      
      //-- Stock
      formatted_data.push(block);
    }
  }
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<nb_col; i++)
    ytick.push(i+0.5);
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
  wrap.y_list = col_tag_list;
  wrap.ytick = ytick;
  wrap.value_max = value_max * 0.55;
}

function IEBC_FormatData2(wrap, data2) {
  var yticklabel_dict = {'key': [], 'en': [], 'fr': [], 'zh-tw': []};
  var i; 
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    yticklabel_dict['key'].push(data2[i]['key']);
    yticklabel_dict['en'].push(data2[i]['label']);
    yticklabel_dict['fr'].push(data2[i]['label_fr']);
    yticklabel_dict['zh-tw'].push(data2[i]['label_zh']);
  }
  
  //-- Save to wrapper
  wrap.yticklabel_dict = yticklabel_dict;
}

function IEBC_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Define square color
  wrap.value_max = Math.max(10, wrap.value_max);
//   wrap.value_max = Math.min(1500, wrap.value_max);
  wrap.color = d3.scaleSequential()
    .domain([0, wrap.value_max])
    .interpolator(t => d3.interpolatePuRd(t));
  
  //-- Define opacity & delay
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay_long;
  
  //-- Plot hot map
  GP_PlotHotMap(wrap);
}

function IEBC_Replot(wrap) {
  //-- Replot hot map
  GP_ReplotHotMap(wrap);
  
  //-- Replot xaxis
  GP_ReplotDateAsTileX(wrap);
  
  //-- Replot yaxis
  GP_ReplotTileY(wrap);
      
  //-- Adjust font size
  wrap.svg.select('.xaxis')
    .selectAll('text')
      .style('font-size', '1.15rem');
  wrap.svg.select('.yaxis')
    .selectAll('text')
      .style('font-size', '1.05rem');
      
  //-- Remove old lines
  wrap.svg.selectAll('.legend.line')
    .remove();
    
  //-- Update lines
  var x = wrap.width;
  x -= wrap.width / 45 * 7;
  var points
  while (x >= 0) {
    points = x + ',0 ' + x + ',' + wrap.height;
    x -= wrap.width / 45 * 7;
    
    wrap.svg.append('polyline')
      .attr('class', 'legend line')
      .attr('points', points)
      .attr('fill', 'none')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1)
      .attr('opacity', 1);
  }
  
  //-- Define legend position
  var offset = {x: -5, y: -8};
  
  //-- Define legend caption
  var legend_caption
  if (LS_lang == 'zh-tw')
    legend_caption = ['近45日統計', '每十萬人過去七日確診數總合'];
  else if (LS_lang == 'fr')
    legend_caption = ['45 derniers jours', 'Nombre de cas confirmés sur 7 jours pour 100k habitants'];
  else 
    legend_caption = ['Last 45 days', 'Number of confirmed cases over 7 days per 100k inhabitants'];
  
  //-- Update legend caption
  var legend_caption_2 = [legend_caption[0] + ' \u00A0 - \u00A0 ' + legend_caption[1]];
  
  //-- Update legend caption
  wrap.svg.selectAll('.legend.caption')
    .remove()
    .exit()
    .data(legend_caption_2)
    .enter()
    .append('text')
      .attr('class', 'legend caption')
      .attr('x', wrap.width+offset.x)
      .attr('y', offset.y)
      .attr('text-anchor', 'end')
      .style('fill', '#000000')
      .style('font-size', '1.2rem')
      .text(function (d) {return d;});
}

//-- Load
function IEBC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      IEBC_FormatData(wrap, data);
      IEBC_FormatData2(wrap, data2);
      IEBC_Plot(wrap);
      IEBC_Replot(wrap);
    });
}

function IEBC_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Remove
    d3.selectAll(wrap.id+' .plot').remove()
    
    //-- Reload
    IEBC_InitFig(wrap);
    IEBC_ResetText();
    IEBC_Load(wrap);
  });
}

//-- Main
function IEBC_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Load
  IEBC_InitFig(wrap);
  IEBC_ResetText();
  IEBC_Load(wrap);
  
  //-- Setup button listeners
  IEBC_ButtonListener(wrap);
}
