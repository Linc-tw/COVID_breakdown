
    //--------------------------------//
    //--  stats_in_mirror.js        --//
    //--  Chieh-An Lin              --//
    //--  2022.02.13                --//
    //--------------------------------//

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
  //-- new_stat_flag
  if (LS_lang == 'zh-tw') {
    LS_AddStr('stats_in_mirror_title', '統計比較');
    LS_AddStr('stats_in_mirror_button_test_0', '檢驗人次');
    LS_AddStr('stats_in_mirror_button_test_1', '檢驗人次');
    LS_AddStr('stats_in_mirror_button_total_case_0', '總確診案例');
    LS_AddStr('stats_in_mirror_button_total_case_1', '總確診案例');
    LS_AddStr('stats_in_mirror_button_imported_case_0', '境外移入案例');
    LS_AddStr('stats_in_mirror_button_imported_case_1', '境外移入案例');
    LS_AddStr('stats_in_mirror_button_local_case_0', '本土案例');
    LS_AddStr('stats_in_mirror_button_local_case_1', '本土案例');
    LS_AddStr('stats_in_mirror_button_death_0', '死亡人數');
    LS_AddStr('stats_in_mirror_button_death_1', '死亡人數');
    LS_AddStr('stats_in_mirror_button_border_entry_0', '入境人數');
    LS_AddStr('stats_in_mirror_button_border_entry_1', '入境人數');
    LS_AddStr('stats_in_mirror_button_border_exit_0', '出境人數');
    LS_AddStr('stats_in_mirror_button_border_exit_1', '出境人數');
    LS_AddStr('stats_in_mirror_button_border_both_0', '入出境總人數');
    LS_AddStr('stats_in_mirror_button_border_both_1', '入出境總人數');
    LS_AddStr('stats_in_mirror_button_arrival_incidence_0', '入境盛行率');
    LS_AddStr('stats_in_mirror_button_arrival_incidence_1', '入境盛行率');
    LS_AddStr('stats_in_mirror_button_local_incidence_0', '本土盛行率');
    LS_AddStr('stats_in_mirror_button_local_incidence_1', '本土盛行率');
    LS_AddStr('stats_in_mirror_button_positivity_0', '陽性率');
    LS_AddStr('stats_in_mirror_button_positivity_1', '陽性率');
    LS_AddStr('stats_in_mirror_button_fatality_0', '累計致死率');
    LS_AddStr('stats_in_mirror_button_fatality_1', '累計致死率');
    
    LS_AddHtml('stats_in_mirror_description', '\
      使用者可於此圖挑選：\
      <br>\
      - 檢驗人次\
      <br>\
      - 總確診、境外移入、本土案例數\
      <br>\
      - 死亡人數\
      <br>\
      - 入境、出境、入出境總人數\
      <br>\
      - 入境、本土盛行率\
      <br>\
      - 陽性率\
      <br>\
      - 累計致死率\
      <br>\
      當中之任兩者並列比較。\
      此設計將有助於突顯比較不同統計隨時間之變化。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('stats_in_mirror_title', 'Statistiques en miroir');
    LS_AddStr('stats_in_mirror_button_test_0', 'Dépistage');
    LS_AddStr('stats_in_mirror_button_test_1', 'Dépistage');
    LS_AddStr('stats_in_mirror_button_total_case_0', 'Cas confirmés totaux');
    LS_AddStr('stats_in_mirror_button_total_case_1', 'Cas confirmés totaux');
    LS_AddStr('stats_in_mirror_button_imported_case_0', 'Cas importés');
    LS_AddStr('stats_in_mirror_button_imported_case_1', 'Cas importés');
    LS_AddStr('stats_in_mirror_button_local_case_0', 'Cas locaux');
    LS_AddStr('stats_in_mirror_button_local_case_1', 'Cas locaux');
    LS_AddStr('stats_in_mirror_button_death_0', 'Décès');
    LS_AddStr('stats_in_mirror_button_death_1', 'Décès');
    LS_AddStr('stats_in_mirror_button_border_entry_0', 'Arrivée aux frontières');
    LS_AddStr('stats_in_mirror_button_border_entry_1', 'Arrivée aux frontières');
    LS_AddStr('stats_in_mirror_button_border_exit_0', 'Départ des frontières');
    LS_AddStr('stats_in_mirror_button_border_exit_1', 'Départ des frontières');
    LS_AddStr('stats_in_mirror_button_border_both_0', 'Passage des frontières');
    LS_AddStr('stats_in_mirror_button_border_both_1', 'Passage des frontières');
    LS_AddStr('stats_in_mirror_button_arrival_incidence_0', "Taux d'incidence frontalière");
    LS_AddStr('stats_in_mirror_button_arrival_incidence_1', "Taux d'incidence frontalière");
    LS_AddStr('stats_in_mirror_button_local_incidence_0', "Taux d'incidence locale");
    LS_AddStr('stats_in_mirror_button_local_incidence_1', "Taux d'incidence locale");
    LS_AddStr('stats_in_mirror_button_positivity_0', 'Taux de positivité');
    LS_AddStr('stats_in_mirror_button_positivity_1', 'Taux de positivité');
    LS_AddStr('stats_in_mirror_button_fatality_0', 'Taux de létalité cumulé');
    LS_AddStr('stats_in_mirror_button_fatality_1', 'Taux de létalité cumulé');
    
    LS_AddHtml('stats_in_mirror_description', "\
      Ce panneau permet les utilisateurs de choisir parmi :\
      <br>\
      - le nombre de tests,\
      <br>\
      - les nombres de cas confirmés totaux, importés et locaux,\
      <br>\
      - le nombre de décédés,\
      <br>\
      - les nombres de voyageurs entrant, sortant et totaux aux frontières,\
      <br>\
      - les taux d'incidences frontalière et locale,\
      <br>\
      - le taux de positivité et\
      <br>\
      - le taux de létalité cumulé,\
      <br>\
      et de présenter n'importe quels 2 de ceux-ci côte-à-côte.\
      Ceci fournit une meilleure comparaison entre les évolutions des statistiques différentes.\
    ");
  }
  
  else { //-- En
    LS_AddStr('stats_in_mirror_title', 'Statistics in Mirror');
    LS_AddStr('stats_in_mirror_button_test_0', 'Test counts');
    LS_AddStr('stats_in_mirror_button_test_1', 'Test counts');
    LS_AddStr('stats_in_mirror_button_total_case_0', 'Total case counts');
    LS_AddStr('stats_in_mirror_button_total_case_1', 'Total case counts');
    LS_AddStr('stats_in_mirror_button_imported_case_0', 'Imported case counts');
    LS_AddStr('stats_in_mirror_button_imported_case_1', 'Imported case counts');
    LS_AddStr('stats_in_mirror_button_local_case_0', 'Local case counts');
    LS_AddStr('stats_in_mirror_button_local_case_1', 'Local case counts');
    LS_AddStr('stats_in_mirror_button_death_0', 'Death counts');
    LS_AddStr('stats_in_mirror_button_death_1', 'Death counts');
    LS_AddStr('stats_in_mirror_button_border_entry_0', 'Border arrival counts');
    LS_AddStr('stats_in_mirror_button_border_entry_1', 'Border arrival counts');
    LS_AddStr('stats_in_mirror_button_border_exit_0', 'Border departure counts');
    LS_AddStr('stats_in_mirror_button_border_exit_1', 'Border departure counts');
    LS_AddStr('stats_in_mirror_button_border_both_0', 'Border total counts');
    LS_AddStr('stats_in_mirror_button_border_both_1', 'Border total counts');
    LS_AddStr('stats_in_mirror_button_arrival_incidence_0', 'Arrival incidence rate');
    LS_AddStr('stats_in_mirror_button_arrival_incidence_1', 'Arrival incidence rate');
    LS_AddStr('stats_in_mirror_button_local_incidence_0', 'Local incidence rate');
    LS_AddStr('stats_in_mirror_button_local_incidence_1', 'Local incidence rate');
    LS_AddStr('stats_in_mirror_button_positivity_0', 'Positive rate');
    LS_AddStr('stats_in_mirror_button_positivity_1', 'Positive rate');
    LS_AddStr('stats_in_mirror_button_fatality_0', 'Overall fatality rate');
    LS_AddStr('stats_in_mirror_button_fatality_1', 'Overall fatality rate');
    
    LS_AddHtml('stats_in_mirror_description', '\
      This panel allows users to choose between:\
      <br>\
      - test counts,\
      <br>\
      - total, imported, and local confirmed case counts,\
      <br>\
      - death counts,\
      <br>\
      - border arrival, departure, and total counts,\
      <br>\
      - the arrival and local incidence rates,\
      <br>\
      - the positive rate, and\
      <br>\
      - the overall fatality rate,\
      <br>\
      and display any 2 of them side-by-side.\
      This may provide a better comparison between the evolutions of different statistics.\
    ');
  }
}

function SIM_FormatData(wrap, data, index) {
  var stat = wrap.stat_list[index];
  var sub_wrap = wrap.sub_wrap_list[index];
  
  if (wrap.tag.includes('overall'))
    sub_wrap.r = 1.5;
  else
    sub_wrap.r = 3;
  
  //-- new_stat_flag
//     HOI_FormatData(sub_wrap, data);
  if (stat == 0)
    TC_FormatData(sub_wrap, data);
  else if (stat == 1 || stat == 2 || stat == 3) {
    if (stat == 1)
      sub_wrap.col_ind = 0;
    else if (stat == 2)
      sub_wrap.col_ind = 1;
    else
      sub_wrap.col_ind = 2;
    CC_FormatData(sub_wrap, data);
  }
  else if (stat == 4)
    DC_FormatData(sub_wrap, data);
  else if (stat == 5 || stat == 6 || stat == 7) {
    if (stat == 5)
      sub_wrap.col_ind = 0;
    else if (stat == 6)
      sub_wrap.col_ind = 1;
    else
      sub_wrap.col_ind = 2;
    BS_FormatData(sub_wrap, data);
  }
  else if (stat == 8 || stat == 9) 
    IR_FormatData(sub_wrap, data);
  else if (stat == 10 || stat == 11)
    PAF_FormatData(sub_wrap, data);
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
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, 1])
    .range([0.5*wrap.height, wrap.height]);
  
  //-- Compare dimension
  var dim_0 = Object.keys(wrap.formatted_data).length;
  var dim_1 = Object.keys(wrap.formatted_data[0]).length;
  var bar;
  
  //-- Bar-like, add bar
  if (dim_0 > dim_1) {
    bar = wrap.svg.selectAll('.content.bar'+index)
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
  
  //-- Dot-like
  else {
    bar = wrap.svg.selectAll('.content.bar'+index)
      .data(wrap.formatted_data[0])
      .enter();
    
    //-- Update bar with dummy details
    bar.append('rect')
      .attr('class', 'content bar'+index)
      .attr('x', function (d) {return xscale(d.x);})
      .attr('y', yscale(0))
      .attr('width', xscale.bandwidth())
      .attr('height', 0);
  }
}

function SIM_PlotLine(wrap, index) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, 1])
    .range([0.5*wrap.height, wrap.height]);
  
  //-- Compare dimension
  var dim_0 = Object.keys(wrap.formatted_data).length;
  var dim_1 = Object.keys(wrap.formatted_data[0]).length;
  var draw_line;
  var dummy_data;
  
  //-- Bar-like
  if (dim_0 > dim_1) {
    draw_line = d3.line()
      .defined(d => !isNaN(d[wrap.col_tag_avg])) //-- Don't show line if NaN
      .x(function (d) {return xscale(d.date) + 0.5*xscale.bandwidth();})
      .y(yscale(0));
    dummy_data = [wrap.formatted_data];
  }
  
  //-- Dot-like
  else {
    draw_line = d3.line()
      .defined(d => !isNaN(d.y))//-- Don't show line if NaN
      .x(function (d) {return xscale(d.x) + 0.5*xscale.bandwidth();})
      .y(yscale(0));
    dummy_data = [wrap.formatted_data[0]];
  }
  
  //-- Add line with dummy data
  var line = wrap.svg.selectAll('.content.line'+index)
    .data(dummy_data)
    .enter();
    
  //-- Update line with dummy details
  line.append('path')
    .attr('class', 'content line'+index)
    .attr('d', function (d) {return draw_line(d);})
    .style('stroke-width', '2.5px')
    .style('fill', 'none');
}

function SIM_PlotDot(wrap, index) {
  //-- Define xscale
  var xscale = GP_MakeBandXForBar(wrap);
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, 1])
    .range([0.5*wrap.height, wrap.height]);
  
  //-- Compare dimension
  var dim_0 = Object.keys(wrap.formatted_data).length;
  var dim_1 = Object.keys(wrap.formatted_data[0]).length;
  
  //-- Add dot
  var dot = wrap.svg.append('g')
    .attr('class', 'content dot_list'+index);
  
  //-- Bar-like
  if (dim_0 > dim_1) {
    //-- Update dot with dummy details
    dot.selectAll('.content.dot'+index)
      .data(wrap.formatted_data)
      .enter()
      .append('circle')
        .attr('class', 'content dot'+index)
        .attr('cx', function (d) {return xscale(d.date) + 0.5*xscale.bandwidth();})
        .attr('cy', yscale(0))
        .attr('r', 0);
  }
  
  //-- Dot-like
  else {
    //-- Update dot with dummy details
    dot.selectAll('.content.dot'+index)
      .data(wrap.formatted_data[0])
      .enter()
      .append('circle')
        .attr('class', 'content dot'+index)
        .attr('cx', function (d) {return xscale(d.x) + 0.5*xscale.bandwidth();})
        .attr('cy', yscale(0))
        .attr('r', 0);
  }
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

    //-- new_stat_flag
    SIM_PlotSingleBar(sub_wrap, i);
    SIM_PlotLine(sub_wrap, i);
    SIM_PlotDot(sub_wrap, i);
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
      .attr('y', function (d) {if (isNaN(d[sub_wrap.col_tag])) return yscale(0); if (index > 0) return yscale(0); return yscale(d[sub_wrap.col_tag]);})
      .attr('height', function (d) {if (isNaN(d[sub_wrap.col_tag])) return 0; return (1-2*index)*(yscale(0)-yscale(d[sub_wrap.col_tag]));})
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
    
  //-- Compare dimension
  var dim_0 = Object.keys(sub_wrap.formatted_data).length;
  var dim_1 = Object.keys(sub_wrap.formatted_data[0]).length;
  
  //-- Bar-like, update
  if (dim_0 > dim_1) {
    //-- Update bar
    wrap.svg.selectAll('.content.bar'+index)
        .on('mouseover', function (d) {GP_MouseOver_Faint(sub_wrap, d);})
        .on('mousemove', function (d) {sub_wrap.mouse_move(sub_wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave_Faint(sub_wrap, d);})
      .data(sub_wrap.formatted_data)
      .transition()
      .duration(sub_wrap.trans_delay)
        .attr('y', function (d) {if (isNaN(d[sub_wrap.col_tag])) return yscale(0); if (index > 0) return yscale(0); return yscale(d[sub_wrap.col_tag]);})
        .attr('height', function (d) {if (isNaN(d[sub_wrap.col_tag])) return 0; return (1-2*index)*(yscale(0)-yscale(d[sub_wrap.col_tag]));})
        .attr('fill', sub_wrap.color)
        .style('opacity', sub_wrap.plot_opacity);
  }
  
  //-- Dot-like, dummy
  else {
    wrap.svg.selectAll('.content.bar'+index)
        .on('mouseover', function (d) {})
        .on('mousemove', function (d) {})
        .on('mouseleave', function (d) {})
      .data(sub_wrap.formatted_data[0])
      .transition()
      .duration(sub_wrap.trans_delay)
        .attr('y', yscale(0))
        .attr('height', 0)
        .attr('fill', sub_wrap.color)
        .style('opacity', sub_wrap.plot_opacity);
  }
}

function SIM_ReplotLine(wrap, index, list_ind) {
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
    .padding(GP_wrap.padding_bar);
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, sub_wrap.y_max])
    .range([0.5*wrap.height, range_max]);
    
  //-- Define line
  var draw_line = d3.line()
    .defined(d => !isNaN(d.y))//-- Don't show line if NaN
    .x(function (d) {return xscale(d.x) + 0.5*xscale.bandwidth();})
    .y(function (d) {return yscale(d.y);});
  
  //-- Update line
  var line = wrap.svg.selectAll('.content.line'+index)
    .data([sub_wrap.formatted_data[list_ind]])
    .transition()
    .duration(sub_wrap.trans_delay)
      .attr('d', function (d) {return draw_line(d);})
      .style('stroke', sub_wrap.color);
}

function SIM_ReplotDot(wrap, index, list_ind) {
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
    .padding(GP_wrap.padding_bar);
  
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, sub_wrap.y_max])
    .range([0.5*wrap.height, range_max]);
  
  //-- Compare dimension
  var dim_0 = Object.keys(sub_wrap.formatted_data).length;
  var dim_1 = Object.keys(sub_wrap.formatted_data[0]).length;
  
  var dot = wrap.svg.selectAll('.content.dot_list'+index)
    .style('fill', sub_wrap.color);
  
  //-- Bar-like, dummy
  if (dim_0 > dim_1) {
    dot.selectAll('.content.dot'+index)
        .on('mouseover', function (d) {})
        .on('mousemove', function (d) {})
        .on('mouseleave', function (d) {})
      .data(sub_wrap.formatted_data)
      .transition()
      .duration(sub_wrap.trans_delay)
        .attr('cy', yscale(0))
        .attr('r', 0);
  }
  
  //-- Dot-like, update
  else {
    dot.selectAll('.content.dot'+index)
        .on('mouseover', function (d) {GP_MouseOver_Bright(sub_wrap, d);})
        .on('mousemove', function (d) {sub_wrap.mouse_move(sub_wrap, d);})
        .on('mouseleave', function (d) {GP_MouseLeave_Bright(sub_wrap, d);})
      .data(sub_wrap.formatted_data[list_ind])
      .transition()
      .duration(sub_wrap.trans_delay)
        .attr('cy', function (d) {if (isNaN(d.y)) return yscale(0); return yscale(d.y);})
        .attr('r', function (d) {if (isNaN(d.y)) return 0; return sub_wrap.r;}); //-- Don't show dots if NaN
  }
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
    .padding(GP_wrap.padding_bar);
  
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
  if (index > 0) {
    range_max = wrap.height;
    ytick = sub_wrap.ytick.slice(1);
  }
  else {
    range_max = 0;
    ytick = sub_wrap.ytick;
  }
  
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
      .tickValues(ytick)
      .tickFormat(d3.format(yticklabel_format));
  }
  else {
    if (sub_wrap.ytick[sub_wrap.ytick.length-1] > 9999) 
      yticklabel_format = '.2s';
    else
      yticklabel_format = 'd';
  
    yaxis = d3.axisLeft(yscale)
      .tickSize(-wrap.width) //-- Top & bottom frameline
      .tickValues(ytick)
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
    
    //-- new_stat_flag
    if (stat == 0) {
      sub_wrap.color = GP_wrap.c_list[2];
      sub_wrap.mouse_move = TC_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      ylabel_dict = {en: 'Number of tests', fr: 'Nombre de tests', 'zh-tw': '檢驗人次'};
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
      SIM_ReplotDot(wrap, i, 0);
      SIM_ReplotCountAsY(wrap, 'count', i);
    }
    else if (stat == 1 || stat == 2 || stat == 3) {
      sub_wrap.mouse_move = CC_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      
      if (stat == 1) {
        sub_wrap.color = GP_wrap.c_list[0];
        ylabel_dict = {en: 'Total confirmed cases', fr: 'Cas confirmés totaux', 'zh-tw': '總確診案例'};
      }
      else if (stat == 2) {
        sub_wrap.color = GP_wrap.c_list[1];
        ylabel_dict = {en: 'Imported cases', fr: 'Cas importés', 'zh-tw': '境外移入案例'};
      }
      else {
        sub_wrap.color = GP_wrap.c_list[8];
        ylabel_dict = {en: 'Local cases', fr: 'Cas locaux', 'zh-tw': '本土案例'};
      }
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
      SIM_ReplotDot(wrap, i, 0);
      SIM_ReplotCountAsY(wrap, 'count', i);
    }
    else if (stat == 4) {
      sub_wrap.color = GP_wrap.c_list[7];
      sub_wrap.mouse_move = DC_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      ylabel_dict = {en: 'Number of deaths', fr: 'Nombre de décès', 'zh-tw': '死亡人數'};
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
      SIM_ReplotDot(wrap, i, 0);
      SIM_ReplotCountAsY(wrap, 'count', i);
    }
    else if (stat == 5 || stat == 6 || stat == 7) {
      sub_wrap.mouse_move = BS_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.faint_opacity;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      
      if (stat == 5) {
        sub_wrap.color = GP_wrap.c_list[10];
        ylabel_dict = {en: 'Arrival travellers', fr: 'Voyageurs entrant', 'zh-tw': '入境人數'};
      }
      else if (stat == 6) {
        sub_wrap.color = GP_wrap.c_list[11];
        ylabel_dict = {en: 'Departure travellers', fr: 'Voyageurs sortant', 'zh-tw': '出境人數'};
      }
      else {
        sub_wrap.color = GP_wrap.c_list[9];
        ylabel_dict = {en: 'Total travellers', fr: 'Voyageurs totaux', 'zh-tw': '入出境總人數'};
      }
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotAvgLine(wrap, i);
      SIM_ReplotDot(wrap, i, 0);
      SIM_ReplotCountAsY(wrap, 'count', i);
    }
    else if (stat == 8 || stat == 9) {
      sub_wrap.mouse_move = IR_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.trans_opacity_bright;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      
      if (stat == 8) {
        sub_wrap.color = GP_wrap.c_list[3];
        ylabel_dict = {en: 'Arrival incidence', fr: "Incidence frontalière", 'zh-tw': '入境盛行率'};
        SIM_ReplotLine(wrap, i, 0);
        SIM_ReplotDot(wrap, i, 0);
      }
      else {
        sub_wrap.color = GP_wrap.c_list[4];
        ylabel_dict = {en: 'Local incidence * 1000', fr: "Incidence locale * 1000", 'zh-tw': '本土盛行率 * 1000'};
        SIM_ReplotLine(wrap, i, 1);
        SIM_ReplotDot(wrap, i, 1);
      }
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotCountAsY(wrap, 'percentage', i);
    }
    else if (stat == 10 || stat == 11) {
      sub_wrap.mouse_move = PAF_MouseMove;
      sub_wrap.plot_opacity = GP_wrap.trans_opacity_bright;
      sub_wrap.trans_delay = GP_wrap.trans_delay;
      
      if (stat == 10) {
        sub_wrap.color = GP_wrap.c_list[5];
        ylabel_dict = {en: 'Positive rate', fr: 'Positivité', 'zh-tw': '陽性率'};
        SIM_ReplotLine(wrap, i, 0);
        SIM_ReplotDot(wrap, i, 0);
      }
      else {
        sub_wrap.color = GP_wrap.c_list[6];
        ylabel_dict = {en: 'Overall fatality', fr: 'Létalité cumulé', 'zh-tw': '累計致死率'};
        SIM_ReplotLine(wrap, i, 1);
        SIM_ReplotDot(wrap, i, 1);
      }
      
      SIM_ReplotFaintSingleBar(wrap, i);
      SIM_ReplotCountAsY(wrap, 'percentage', i);
    }
    
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
    .defer(d3.csv, wrap.data_path_list[12]) //-- new_stat_flag
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
    
    //-- new_stat_flag
    if (stat_0 == 0)
      tag1 = 'tests';
    else if (stat_0 == 1)
      tag1 = 'total_cases';
    else if (stat_0 == 2)
      tag1 = 'imported_cases';
    else if (stat_0 == 3)
      tag1 = 'local_cases';
    else if (stat_0 == 4)
      tag1 = 'deaths';
    else if (stat_0 == 5)
      tag1 = 'border_entry';
    else if (stat_0 == 6)
      tag1 = 'border_exit';
    else if (stat_0 == 7)
      tag1 = 'border_both';
    else if (stat_0 == 8)
      tag1 = 'arrival_incidence';
    else if (stat_0 == 9)
      tag1 = 'local_incidence';
    else if (stat_0 == 10)
      tag1 = 'positivity';
    else if (stat_0 == 11)
      tag1 = 'fatality';
    
    if (stat_1 == 0)
      tag2 = 'tests';
    else if (stat_1 == 1)
      tag2 = 'total_cases';
    else if (stat_1 == 2)
      tag2 = 'imported_cases';
    else if (stat_1 == 3)
      tag2 = 'local_cases';
    else if (stat_1 == 4)
      tag2 = 'deaths';
    else if (stat_1 == 5)
      tag2 = 'border_entry';
    else if (stat_1 == 6)
      tag2 = 'border_exit';
    else if (stat_1 == 7)
      tag2 = 'border_both';
    else if (stat_1 == 8)
      tag2 = 'arrival_incidence';
    else if (stat_1 == 9)
      tag2 = 'local_incidence';
    else if (stat_1 == 10)
      tag2 = 'positivity';
    else if (stat_1 == 11)
      tag2 = 'fatality';
    
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
    wrap.stat_list = [1, 4]; //-- new_stat_flag
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
