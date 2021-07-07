
//-- Filename:
//--   incidence_evolution_by_age.js
//--
//-- Author:
//--   Chieh-An Lin

function IEBA_InitFig(wrap) {
  wrap.tot_width = 1200;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 500;
  wrap.tot_height_['fr'] = 500;
  wrap.tot_height_['en'] = 500;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 85, right: 5, bottom: 65, top: 35};
  wrap.margin_['fr'] = {left: 100, right: 5, bottom: 65, top: 35};
  wrap.margin_['en'] = {left: 95, right: 5, bottom: 75, top: 35};
  
  GP_InitFig(wrap);
}

function IEBA_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('incidence_evolution_by_age_title', '各年齡層確診率變化');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('incidence_evolution_by_age_title', "Évolution du taux d'incidence par tranche d'âge");
  }
  
  else { //-- En
    LS_AddStr('incidence_evolution_by_age_title', 'Evolution of Incidence Rate by Age Group');
  }
}

function IEBA_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row, col_tag;
  
  //-- Other variables
  var formatted_data = [];
  var value_max = 0;
  var i, j, x, y, block;
  
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
      col_tag = col_tag_list[j]
      
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
  wrap.value_max = value_max;
}

function IEBA_FormatData2(wrap, data2) {
  var yticklabel_dict = {'tag': [], 'en': [], 'fr': [], 'zh-tw': []};
  var i, tag; 
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    yticklabel_dict['tag'].push(data2[i]['county']);
    yticklabel_dict['en'].push(data2[i]['label']);
    yticklabel_dict['fr'].push(data2[i]['label_fr']);
    yticklabel_dict['zh-tw'].push(data2[i]['label_zh']);
  }
  
  //-- Save to wrapper
  wrap.yticklabel_dict = yticklabel_dict;
}

function IEBA_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Define square color
  var value_max = Math.max(3, wrap.value_max);
  var color = d3.scaleSequential()
    .domain([0, value_max])
    .interpolator(t => d3.interpolatePuRd(t));
  
  //-- Save to wrapper
  wrap.value_max = value_max;
  wrap.color = color;
  
  //-- Plot hot map
  GP_PlotHotMap(wrap);
}

function IEBA_Replot(wrap) {
  //-- Define xscale
  var xscale = GP_MakeBandXForTile(wrap);
  
  //-- Define xaxis
  var xaxis = d3.axisBottom(xscale)
    .tickSize(0)
    .tickValues(wrap.xticklabel)
    .tickFormat(function (d) {return LS_ISODateToMDDate(d);});
  
  //-- Update xaxis & adjust position (bottom frameline)
  wrap.svg.selectAll('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-8,5) rotate(-90)')
      .style('text-anchor', 'end');
  
  //-- Replot yaxis
  GP_ReplotTileY(wrap);
      
  //-- Adjust font size
  wrap.svg.select('.xaxis')
    .selectAll('text')
      .style('font-size', '1.15rem');
  wrap.svg.select('.yaxis')
    .selectAll('text')
      .style('font-size', '1.15rem');
      
  //-- Replot hot map
  GP_ReplotHotMap(wrap);
  
  //-- Define legend position
  var offset = {x: -5, y: -8};
  
  //-- Define legend caption
  var legend_caption
  if (LS_lang == 'zh-tw')
    legend_caption = ['近45日統計', '每十萬人過去七日確診數總合'];
  else if (LS_lang == 'fr')
    legend_caption = ['45 derniers jours', 'Nombre de cas confirmés sur 7 jours par 100k habitants'];
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
      .text(function (d) {return d;});
}

//-- Load
function IEBA_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      IEBA_FormatData(wrap, data);
      IEBA_FormatData2(wrap, data2);
      IEBA_Plot(wrap);
      IEBA_Replot(wrap);
    });
}

function IEBA_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Remove
    d3.selectAll(wrap.id+' .plot').remove()
    
    //-- Reload
    IEBA_InitFig(wrap);
    IEBA_ResetText();
    IEBA_Load(wrap);
  });
}

//-- Main
function IEBA_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Load
  IEBA_InitFig(wrap);
  IEBA_ResetText();
  IEBA_Load(wrap);
  
  //-- Setup button listeners
  IEBA_ButtonListener(wrap);
}
