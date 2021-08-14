
//-- Filename:
//--   stats_in_mirror.js
//--
//-- Author:
//--   Chieh-An Lin

function SIM_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else {
    wrap.tot_width = 800;
    wrap.tot_height = 600;
    
    if (wrap.tag.includes('overall'))
      wrap.margin = {left: 90, right: 5, bottom: 70, top: 5};
    else
      wrap.margin = {left: 90, right: 5, bottom: 90, top: 5};
      
    wrap.tot_height_ = {};
    wrap.tot_height_['zh-tw'] = wrap.tot_height;
    wrap.tot_height_['fr'] = wrap.tot_height;
    wrap.tot_height_['en'] = wrap.tot_height;
    wrap.margin_ = {};
    wrap.margin_['zh-tw'] = wrap.margin;
    wrap.margin_['fr'] = wrap.margin;
    wrap.margin_['en'] = wrap.margin;
    
    GP_InitFig(wrap);
  }
  
  //-- Pop out svg
  var svg = wrap.svg;
  delete wrap['svg'];
  
  //-- Copy wrap
  var new_wrap_0 = JSON.parse(JSON.stringify(wrap));
  var new_wrap_1 = JSON.parse(JSON.stringify(wrap));
  wrap.sub_wrap_list = [new_wrap_0, new_wrap_1];
  
  //-- Restore with the same svg
  wrap.svg = svg;
  new_wrap_0.svg = svg;
  new_wrap_1.svg = svg;
}

function SIM_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('stats_in_mirror_title', '統計比較');
    LS_AddStr('stats_in_mirror_button_test_0', '檢驗人次');
    LS_AddStr('stats_in_mirror_button_test_1', '檢驗人次');
    LS_AddStr('stats_in_mirror_button_case_0', '確診人數');
    LS_AddStr('stats_in_mirror_button_case_1', '確診人數');
    LS_AddStr('stats_in_mirror_button_hospitalization_0', '住院人數');
    LS_AddStr('stats_in_mirror_button_hospitalization_1', '住院人數');
    LS_AddStr('stats_in_mirror_button_death_0', '死亡人數');
    LS_AddStr('stats_in_mirror_button_death_1', '死亡人數');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('stats_in_mirror_title', 'Statistiques en miroir');
    LS_AddStr('stats_in_mirror_button_test_0', 'Tests');
    LS_AddStr('stats_in_mirror_button_test_1', 'Tests');
    LS_AddStr('stats_in_mirror_button_case_0', 'Cas confirmés');
    LS_AddStr('stats_in_mirror_button_case_1', 'Cas confirmés');
    LS_AddStr('stats_in_mirror_button_hospitalization_0', 'Hospitalisation');
    LS_AddStr('stats_in_mirror_button_hospitalization_1', 'Hospitalisation');
    LS_AddStr('stats_in_mirror_button_death_0', 'Décédés');
    LS_AddStr('stats_in_mirror_button_death_1', 'Décédés');
  }
  
  else { //-- En
    LS_AddStr('stats_in_mirror_title', 'Statistics in Mirror');
    LS_AddStr('stats_in_mirror_button_test_0', 'Test counts');
    LS_AddStr('stats_in_mirror_button_test_1', 'Test counts');
    LS_AddStr('stats_in_mirror_button_case_0', 'Case counts');
    LS_AddStr('stats_in_mirror_button_case_1', 'Case counts');
    LS_AddStr('stats_in_mirror_button_hospitalization_0', 'Hospitalization');
    LS_AddStr('stats_in_mirror_button_hospitalization_1', 'Hospitalization');
    LS_AddStr('stats_in_mirror_button_death_0', 'Death counts');
    LS_AddStr('stats_in_mirror_button_death_1', 'Death counts');
  }
}

function SIM_FormatData(wrap, data, index) {
  var stat = wrap.stat_list[index];
  var sub_wrap = wrap.sub_wrap_list[index];
  
  if (stat == 0)
    TC_FormatData(sub_wrap, data);
  else if (stat == 1) {
    sub_wrap.col_ind = 0;
    CC_FormatData(sub_wrap, data);
  }
  else if (stat == 2)
    HOI_FormatData(sub_wrap, data);
  else
    DC_FormatData(sub_wrap, data);
}

function SIM_FormatData2(wrap, data2) {
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

function SIM_PlotSingleBar(wrap, index) {
  //-- Define xscale for bar
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale for counts
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar'+index)
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar'+index)
    .attr('x', function (d) {return xscale(d[wrap.x_key]);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0);
}

function SIM_PlotFaintSingleBar(wrap, index) {
  //-- Define xscale for bar
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale for counts
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar'+index)
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class',  'content bar'+index)
    .attr('x', function (d) {return xscale(d[wrap.x_key]);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0);
}

function SIM_PlotAvgLine(wrap, index) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Define dummy line
  var draw_line_0 = d3.line()
    .defined(d => !isNaN(d[wrap.col_tag_avg]))//-- Don't show line if NaN
    .x(function (d) {return xscale(d.date) + 0.5*xscale.bandwidth();})
    .y(yscale(0));
    
  //-- Add line
  var line = wrap.svg.selectAll('.content.line'+index)
    .data([wrap.formatted_data])
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line'+index)
    .attr('d', function (d) {return draw_line_0(d);})
    .style('fill', 'none')
    .style('stroke-width', '2.5px');
}

function SIM_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  GP_MakeTooltip(wrap);
  wrap.sub_wrap_list[0].tooltip = wrap.tooltip;
  wrap.sub_wrap_list[1].tooltip = wrap.tooltip;
  
  var i, stat, sub_wrap;
  for (i=0; i<2; i++) {
    stat = wrap.stat_list[i];
    sub_wrap = wrap.sub_wrap_list[i];
    
    //-- Placeholder for yaxis
    wrap.svg.append('g')
      .attr('class', 'yaxis ind'+i);
      
    //-- Placeholder for ylabel
    wrap.svg.append('text')
      .attr('class', 'ylabel ind'+i)
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (0.5*wrap.height+(2*i-1)*0.25*wrap.height).toString() + ')rotate(-90)');

    if (stat == 0) {
      SIM_PlotFaintSingleBar(sub_wrap, i);
      SIM_PlotAvgLine(sub_wrap, i);
    }
    else if (stat == 1) {
      SIM_PlotFaintSingleBar(sub_wrap, i);
      SIM_PlotAvgLine(sub_wrap, i);
    }
    else if (stat == 2) {
      SIM_PlotSingleBar(sub_wrap, i);
      SIM_PlotAvgLine(sub_wrap, i);
    }
    else {
      SIM_PlotFaintSingleBar(sub_wrap, i);
      SIM_PlotAvgLine(sub_wrap, i);
    }
  }
}

function SIM_ReplotSingleBar(wrap, index) {
  var sub_wrap = wrap.sub_wrap_list[index];
  var range_max;
  if (index > 0)
    range_max = wrap.height;
  else
    range_max = 0;
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, sub_wrap.y_max])
    .range([0.5*wrap.height, range_max]);
  
  //-- Update bar
  wrap.svg.selectAll('.content.bar'+index)
      .on('mouseover', function (d) {GP_MouseOver_Bright(sub_wrap, d);})
      .on('mousemove', function (d) {sub_wrap.mouse_move(sub_wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave_Bright(sub_wrap, d);})
    .data(sub_wrap.formatted_data)
    .transition()
    .duration(sub_wrap.trans_delay)
      .attr('y', function (d) {if (index > 0) return yscale(0); return yscale(d[sub_wrap.col_tag]);})
      .attr('height', function (d) {return (1-2*index)*(yscale(0)-yscale(d[sub_wrap.col_tag]));})
      .attr('fill', sub_wrap.color)
      .style('opacity', 1);
}

function SIM_ReplotFaintSingleBar(wrap, index) {
  var sub_wrap = wrap.sub_wrap_list[index];
  var range_max;
  if (index > 0)
    range_max = wrap.height;
  else
    range_max = 0;
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, sub_wrap.y_max])
    .range([0.5*wrap.height, range_max]);
    
  //-- Update bar
  var bar = wrap.svg.selectAll('.content.bar'+index)
      .on('mouseover', function (d) {GP_MouseOver_Faint(sub_wrap, d);})
      .on('mousemove', function (d) {sub_wrap.mouse_move(sub_wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave_Faint(sub_wrap, d);})
    .data(sub_wrap.formatted_data)
    .transition()
    .duration(sub_wrap.trans_delay)
      .attr('y', function (d) {if (index > 0) return yscale(0); return yscale(d[sub_wrap.col_tag]);})
      .attr('height', function (d) {return (1-2*index)*(yscale(0)-yscale(d[sub_wrap.col_tag]));})
      .attr('fill', sub_wrap.color)
      .style('opacity', sub_wrap.plot_opacity);
}

function SIM_ReplotAvgLine(wrap, index) {
  var sub_wrap = wrap.sub_wrap_list[index];
  var range_max;
  if (index > 0)
    range_max = wrap.height;
  else
    range_max = 0;
  
  //-- Define xscale
  var xscale = d3.scaleBand()
    .domain(sub_wrap.x_list)
    .range([0, wrap.width])
    .padding(GP_wrap.bar_padding);
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, sub_wrap.y_max])
    .range([0.5*wrap.height, range_max]);
  
  //-- Define line
  var draw_line = d3.line()
    .defined(d => !isNaN(d[sub_wrap.col_tag_avg])) //-- Don't show line if NaN
    .x(function (d) {return xscale(d.date) + 0.5*xscale.bandwidth();})
    .y(function (d) {return yscale(d[sub_wrap.col_tag_avg]);});
  
  //-- Update line
  var line = wrap.svg.selectAll('.content.line'+index)
    .data([sub_wrap.formatted_data])
    .transition()
    .duration(sub_wrap.trans_delay)
      .attr('d', function (d) {return draw_line(d);})
      .style('stroke', sub_wrap.color);
}

function SIM_ReplotCountAsY(wrap, format, index) {
  var sub_wrap = wrap.sub_wrap_list[index];
  var range_max;
  if (index > 0)
    range_max = wrap.height;
  else
    range_max = 0;
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, sub_wrap.y_max])
    .range([0.5*wrap.height, range_max]);
  
  //-- Define yaxis
  var yaxis, yticklabel_format;
  if (format == 'percentage') {
    if (sub_wrap.ytick[sub_wrap.ytick.length-1] >= 0.1) 
      yticklabel_format = '.0%';
    else
      yticklabel_format = '.1%';
  
    yaxis = d3.axisLeft(yscale)
      .tickSize(-wrap.width) //-- Top & bottom frameline
      .tickValues(sub_wrap.ytick)
      .tickFormat(d3.format(yticklabel_format));
  }
  else {
    if (sub_wrap.ytick[sub_wrap.ytick.length-1] > 9999) 
      yticklabel_format = '.2s';
    else
      yticklabel_format = 'd';
  
    yaxis = d3.axisLeft(yscale)
      .tickSize(-wrap.width) //-- Top & bottom frameline
      .tickValues(sub_wrap.ytick)
      .tickFormat(d3.format(yticklabel_format));
  }
  
  //-- Add yaxis
  wrap.svg.select('.yaxis.ind'+index)
    .transition()
    .duration(sub_wrap.trans_delay)
    .call(yaxis);
}

function SIM_Replot(wrap) {
  var i, stat, sub_wrap, ylabel_dict;
  
  for (i=0; i<2; i++) {
    stat = wrap.stat_list[i];
    sub_wrap = wrap.sub_wrap_list[i];
    
    if (stat == 0) {
      sub_wrap.color = GP_wrap.c_list[2];
      sub_wrap.mouse_move = TC_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      ylabel_dict = {en: 'Number of tests', fr: 'Nombre de tests', 'zh-tw': '檢驗人次'};
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
    }
    else if (stat == 1) {
      sub_wrap.color = GP_wrap.c_list[0];
      sub_wrap.mouse_move = CC_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      ylabel_dict = {en: 'Confirmed cases', fr: 'Cas confirmés', 'zh-tw': '確診人數'};
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
    }
    else if (stat == 2) {
      sub_wrap.color = GP_wrap.c_list[3];
      sub_wrap.mouse_move = HOI_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.trans_opacity_bright;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      ylabel_dict = {en: 'Hospitalization', fr: 'Hospitalisation', 'zh-tw': '住院人數'};
      
      SIM_ReplotSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
    }
    else {
      sub_wrap.color = GP_wrap.c_list[7];
      sub_wrap.mouse_move = DC_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      ylabel_dict = {en: 'Number of deaths', fr: 'Nombre de décédés', 'zh-tw': '死亡人數'};
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
    }
    
    SIM_ReplotCountAsY(wrap, 'count', i);
    
    //-- Update ylabel
    wrap.svg.select('.ylabel.ind'+i)
      .text(ylabel_dict[LS_lang]);
  }
  
  wrap.x_list = wrap.sub_wrap_list[0].x_list;
  wrap.xticklabel = wrap.sub_wrap_list[0].xticklabel;
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap, 'band');
  else
    GP_ReplotDateAsX(wrap);
}

//-- Load
function SIM_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.stat_list[0]])
    .defer(d3.csv, wrap.data_path_list[wrap.stat_list[1]])
    .defer(d3.csv, wrap.data_path_list[4])
    .await(function (error, data, data2, data3) {
      if (error)
        return console.warn(error);
      
      SIM_FormatData(wrap, data, 0);
      SIM_FormatData(wrap, data2, 1);
      SIM_FormatData2(wrap, data3);
      SIM_Plot(wrap);
      SIM_Replot(wrap);
    });
}

function SIM_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.stat_list[0]])
    .defer(d3.csv, wrap.data_path_list[wrap.stat_list[1]])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      SIM_FormatData(wrap, data, 0);
      SIM_FormatData(wrap, data2, 1);
      SIM_Replot(wrap);
    });
}

function SIM_ButtonListener(wrap) {
  //-- Stat 0
  d3.select(wrap.id +'_stat_0').on('change', function() {
    wrap.stat_list[0] = this.value;
    SIM_Reload(wrap);
  });
  
  //-- Stat 1
  d3.select(wrap.id +'_stat_1').on('change', function() {
    wrap.stat_list[1] = this.value;
    SIM_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    var stat_0 = wrap.stat_list[0];
    var stat_1 = wrap.stat_list[1];
    var tag1, tag2;
    
    if (stat_0 == 0)
      tag1 = 'test';
    else if (stat_0 == 1)
      tag1 = 'case';
    else if (stat_0 == 2)
      tag1 = 'hospitalization';
    else 
      tag1 = 'death';
    
    if (stat_1 == 0)
      tag2 = 'test';
    else if (stat_1 == 1)
      tag2 = 'case';
    else if (stat_1 == 2)
      tag2 = 'hospitalization';
    else 
      tag2 = 'death';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    SIM_ResetText();
    SIM_Replot(wrap);
  });
}

//-- Main
function SIM_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('mini'))
    wrap.stat_list = [1, 3];
  else
    wrap.stat_list = [
      document.getElementById(wrap.tag + '_stat_0').value,
      document.getElementById(wrap.tag + '_stat_1').value
    ];
  
  wrap.cumul = 0;
  
  //-- Load
  SIM_InitFig(wrap);
  SIM_ResetText();
  SIM_Load(wrap);
  
  //-- Setup button listeners
  SIM_ButtonListener(wrap);
}
