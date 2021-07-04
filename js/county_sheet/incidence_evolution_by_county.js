
//-- Filename:
//--   incidence_evolution_by_county.js
//--
//-- Author:
//--   Chieh-An Lin

function IEBC_InitFig(wrap) {
  wrap.tot_width = 1200;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 600;
  wrap.tot_height_['fr'] = 600;
  wrap.tot_height_['en'] = 600;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 60, right: 5, bottom: 65, top: 35};
  wrap.margin_['fr'] = {left: 160, right: 5, bottom: 65, top: 35};
  wrap.margin_['en'] = {left: 140, right: 5, bottom: 75, top: 35};
  
  GP_InitFig(wrap);
}

function IEBC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('incidence_evolution_by_county_title', '各縣市確診率變化');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('incidence_evolution_by_county_title', "Évolution du taux d'incidence par ville et comté");
  }
  
  else { //-- En
    LS_AddStr('incidence_evolution_by_county_title', 'Evolution of Incidence Rate by City & County');
  }
}

function IEBC_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
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
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
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
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.value_max = value_max;
}

function IEBC_FormatData2(wrap, data2) {
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

function IEBC_Plot(wrap) {
  //-- Define xscale for square
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.04);
    
  //-- Define xaxis_frame for top frameline
  var xaxis_frame = d3.axisBottom(xscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis_frame (top frameline)
  wrap.svg.append('g')
    .call(xaxis_frame);
    
  //-- Define xscale_tick for xticklabel
  var eps = 0
  var xscale_tick = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Placeholder for xticklabel & adjust position (bottom frameline)
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')');
  
  //-- Define yscale
  var yscale = d3.scaleBand()
    .domain(wrap.col_tag_list)
    .range([0, wrap.height])
    .padding(0.04);
  
  //-- Define yaxis for yticklabel
  var yaxis = d3.axisLeft(yscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Placeholder for yticklabel (left frameline)
  wrap.svg.append('g')
    .attr('class', 'yaxis');

  //-- Define yaxis_frame for right frameline
  var yaxis_frame = d3.axisRight(yscale)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add yaxis_frame & adjust position (right frameline)
  wrap.svg.append('g')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_frame);
    
  //-- Define square color
  var color = d3.scaleSequential()
    .domain([0, Math.max(10, wrap.value_max+0.001)])
    .interpolator(t => d3.interpolatePuRd(t));
  
  //-- Add square
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('rect')
      .attr('class', 'content square')
      .attr('x', function (d) {return xscale(d.x);})
      .attr('y', function (d) {return yscale(d.y);})
      .attr('rx', 1.2)
      .attr('ry', 1.2)
      .attr('width', xscale.bandwidth())
      .attr('height', yscale.bandwidth())
      .style('fill', '#FFFFFF')
        .on('mouseover', function (d) {GP_MouseOver2(wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave2(wrap, d);});
    
  //-- Add text
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('text')
      .attr('class', 'content text')
      .attr('x', function (d) {return xscale(d.x) + 0.5*+xscale.bandwidth();})
      .attr('y', function (d) {return yscale(d.y) + 0.5*+yscale.bandwidth();})
      .style('fill', function (d) {if (d.value<25) return '#000000'; return '#FFFFFF';})
      .text(function (d) {if (d.value<0.5001) return ''; return d.value.toFixed(0);})
      .style('font-size', '13px')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
    
  //-- Save to wrapper
  wrap.xscale_tick = xscale_tick;
  wrap.yscale = yscale;
  wrap.color = color;
}

function IEBC_Replot(wrap) {
  //-- Define xaxis for xtick + xticklabel
  var xaxis = d3.axisBottom(wrap.xscale_tick)
    .tickSize(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return LS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update xaxis & adjust position (bottom frameline)
  wrap.svg.selectAll('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-8,5) rotate(-90)')
      .style('font-size', '18px')
      .style('text-anchor', 'end');
  
  //-- Define yaxis for ytick + yticklabel
  var yaxis = d3.axisLeft(wrap.yscale)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.yticklabel_dict[LS_lang][i]});
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis)
    .selectAll('text')
      .attr('transform', 'translate(-2,0)')
      .style('font-size', '18px')
      .style('text-anchor', 'end');
      
  //-- Update square
  wrap.svg.selectAll('.content.square')
    .transition()
    .duration(wrap.trans_delay)
      .style('fill', function (d) {return wrap.color(d.value);});
  
  //-- Define legend position
  var offset = {x: -5, y: -8};
  
  //-- Define legend caption
  if (LS_lang == 'zh-tw')
    caption = ['每十萬人過去七日確診數總合'];
  else if (LS_lang == 'fr')
    caption = ['Nombre de cas confirmés sur 7 jours par 100k habitants'];
  else 
    caption = ['Number of confirmed cases over 7 days per 100k inhabitants'];
  
  //-- Update legend caption
  wrap.svg.selectAll('.legend.caption')
    .remove()
    .exit()
    .data(caption)
    .enter()
    .append('text')
      .attr('class', 'legend caption')
      .attr('x', wrap.width+offset.x)
      .attr('y', offset.y)
      .style('fill', '#000000')
      .text(function (d) {return d;})
      .style('font-size', '22px')
      .attr('text-anchor', 'end');
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
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
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
