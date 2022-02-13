
    //--------------------------------//
    //--  vaccination_by_county.js  --//
    //--  Chieh-An Lin              --//
    //--  2021.12.13                --//
    //--------------------------------//

function VBC_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  
  //-- No GP_InitFig_Overall because it doesn't change axis
  else {
    wrap.tot_width = 800;
    wrap.tot_height_ = {};
    wrap.tot_height_['zh-tw'] = 400;
    wrap.tot_height_['fr'] = 400;
    wrap.tot_height_['en'] = 400;
    wrap.margin_ = {};
    wrap.margin_['zh-tw'] = {left: 40, right: 5, bottom: 60, top: 5};
    wrap.margin_['fr'] = {left: 130, right: 5, bottom: 60, top: 5};
    wrap.margin_['en'] = {left: 110, right: 5, bottom: 60, top: 5};
    
    GP_InitFig(wrap);
  }
}

function VBC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_county_title', '各縣市疫苗接種進度');
    
    LS_AddHtml('vaccination_by_county_description', '\
      各縣市疫苗接種率高的原因：\
      <br>\
      - 馬祖、澎湖：因醫療資源不足優先施打\
      <br>\
      - 台北：疫情爆發最嚴重\
      <br><br>\
      本圖資料似於2021年7月26日起停止更新。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_county_title', 'Vaccination par ville et comté');
    
    LS_AddHtml('vaccination_by_county_description', '\
      Le taux de vaccination est particulièrement élevé à Taipei, Penghu et Matsu pour des raisons différentes :\
      <br>\
      - Matsu & Penghu: priorisés à cause du manque de ressources médicales &\
      <br>\
      - Taipei: épicentre de la dernière vague.\
      <br><br>\
      Les données de cette figure ne sont plus mises à jour depuis à partir du 26 juillet 2021.\
    ');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_county_title', 'Vaccination by City & County');
    
    LS_AddHtml('vaccination_by_county_description', '\
      The vaccination rates of Taipei, Penghu, & Matsu are particularly high for various reasons:\
      <br>\
      - Matsu & Penghu: prioritized due to lack of medical resources &\
      <br>\
      - Taipei: epicenter of the last outbreak.\
      <br><br>\
      Since July 26th 2021, the update of data for this plot has been suspended.\
    ');
  }
}

function VBC_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = key, 1 = value
  var col_tag = col_tag_list[0];
  var i, j, x, y, row;
  
  //-- Variables for plot
  var y_key = 'key';
  var y_list = []; //-- For county
  var yticklabel_dict = {en: [], fr: [], 'zh-tw': []};
  
  //-- Variables for xaxis
  var x_max = 1.99; //-- For 200%
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y = row[y_key];
    
    if (y == 'latest_date')
      continue;
    y_list.push(y);
    yticklabel_dict['en'].push(row['label']);
    yticklabel_dict['fr'].push(row['label_fr']);
    yticklabel_dict['zh-tw'].push(row['label_zh']);
  }
  
  //-- Calculate x_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var x_path = GP_CalculateTickInterval(x_max, wrap.nb_yticks, 'percentage');
  
  //-- Generate yticks
  var xtick = [];
  for (i=0; i<x_max; i+=x_path)
    xtick.push(i)
    
  //-- Get legend value
  var legend_value_raw = data.splice(0, 1)[0];
  legend_value_raw = [legend_value_raw[col_tag], data[0][col_tag]];
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.col_tag = col_tag;
  wrap.y_key = y_key;
  wrap.y_list = y_list;
  wrap.yticklabel_dict = yticklabel_dict;
  wrap.x_min = 0.0;
  wrap.x_max = x_max;
  wrap.xtick = xtick;
  wrap.legend_value_raw = legend_value_raw;
}

//-- Tooltip
function VBC_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  var label_list;
  if (LS_lang == 'zh-tw')
    label_list = ['<br>已接種疫苗數<br>= ', '人口'];
  else if (LS_lang == 'fr')
    label_list = ["<br>Nombre d'injections<br>= ", ' de la population'];
  else
    label_list = ['<br>Number of injections<br>= ', ' of the population'];
  
  //-- Define tooltip texts
  var tooltip_text = wrap.legend_value_raw[0];
  tooltip_text += label_list[0] + d3.format('.2%')(d.value) + label_list[1];
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function VBC_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add xlabel
  GP_PlotXLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[0];
  
  //-- Define mouse-move
  wrap.mouse_move = VBC_MouseMove;
  wrap.plot_opacity = 0.7;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeBandYForBar(wrap);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('x', xscale(0))
    .attr('y', function (d) {return yscale(d[wrap.y_key]);})
    .attr('width', 0)
    .attr('height', yscale.bandwidth())
    .attr('fill', wrap.color)
    .style('opacity', wrap.plot_opacity)
      .on('mouseover', function (d) {GP_MouseOver_Faint(wrap, d);})
      .on('mousemove', function (d) {wrap.mouse_move(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave_Faint(wrap, d);})
      
  //-- Save to wrapper
  wrap.bar = bar;
}

function VBC_Replot(wrap) {
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeBandYForBar(wrap);
  
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('width', function (d) {return xscale(+d[wrap.col_tag])-xscale(0);});
      
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(0)
    .tickValues(wrap.y_list)
    .tickFormat(function (d, i) {return wrap.yticklabel_dict[LS_lang][i];});
  
  //-- Add yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis)
    .selectAll('text')
      .attr('transform', 'translate(0,0)')
      .style('text-anchor', 'end');
  wrap.svg.select('.yaxis')
    .selectAll('text')
    .style('font-size', '0.9rem');
      
  //-- Define xaxis
  var xaxis = d3.axisBottom(xscale)
      .tickSize(-wrap.height)
      .tickValues(wrap.xtick)
      .tickFormat(d3.format('.0%'));
  
  //-- Add xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(0,3)');
      
  //-- Update xlabel
  var xlabel_dict = {en: 'Proportion of the population', fr: 'Part de la population', 'zh-tw': '人口比'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x_[LS_lang], y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1]];
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['全國平均'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['Niveau national'];
  else
    wrap.legend_label = ['Nationalwide level'];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, wrap.legend_value_raw[0]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', wrap.legend_size);
}

//-- Load
function VBC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBC_FormatData(wrap, data);
      VBC_Plot(wrap);
      VBC_Replot(wrap);
    });
}

function VBC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBC_FormatData(wrap, data);
      VBC_Replot(wrap);
    });
}

function VBC_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Remove
    d3.selectAll(wrap.id+' .plot').remove()
    
    //-- Replot
    VBC_InitFig(wrap);
    VBC_ResetText();
    VBC_Load(wrap);
  });
}

//-- Main
function VBC_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VBC_InitFig(wrap);
  VBC_ResetText();
  VBC_Load(wrap);
  
  //-- Setup button listeners
  VBC_ButtonListener(wrap);
}
