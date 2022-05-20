
    //-----------------------------//
    //--  vaccination_by_age.js  --//
    //--  Chieh-An Lin           --//
    //--  2022.05.20             --//
    //-----------------------------//

function VBA_InitFig(wrap) {
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
    wrap.margin_['zh-tw'] = {left: 90, right: 5, bottom: 60, top: 5};
    wrap.margin_['fr'] = {left: 100, right: 5, bottom: 60, top: 5};
    wrap.margin_['en'] = {left: 90, right: 5, bottom: 60, top: 5};
    
    GP_InitFig(wrap);
  }
}

function VBA_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_age_title', '各年齡層疫苗接種進度');
    
    LS_AddHtml('vaccination_by_age_description', '\
      台灣目前對12到17歲間之青少年，只開放施打兩劑疫苗，\
      第三劑仍在評估，有機會開放。\
      政府同時也在評估開放6到11歲兒童施打疫苗的可能性。\
      <br><br>\
      此圖每週一或二更新。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_age_title', 'Vaccination par tranche d\'âge');
    
    LS_AddHtml('vaccination_by_age_description', '\
      À Taïwan, les adolescents entre 12 et 17 ans sont seulement éligibles aux 2 doses de vaccins.\
      L\'authorisation de la 3e dose pour cette tranche d\'âge est encore en études.\
      En même temps, la vaccination peut ouvrir aux enfants entre 6 et 11 ans dans un futur proche.\
      <br><br>\
      Cette figure est mise à jour tous les lundis ou mardis.\
    ');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_age_title', 'Vaccination by Age Group');
    
    LS_AddHtml('vaccination_by_age_description', '\
      In Taiwan, people between 12 and 17 years old are only eligible for 2 doses of vaccines.\
      Authorization of 3rd dose for this age group is under study.\
      Meanwhile, vaccination can also open to children between 6 and 11 years old in the near future.\
      <br><br>\
      This figure is updated every Monday or Tuesday.\
    ');
  }
}

function VBA_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1, 4); //-- 0 = key, 1 = value_1, 2 = value_2, 3 = value_3
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var formatted_data = [];
  var y_list = []; //-- For county
  var x_list, x_lower, x_upper, block;
  
  //-- Variables for xaxis
  var x_max = 1.33; //-- For 133%
  
  //-- Variables for yaxis
  var yticklabel_dict = {en: {}, fr: {}, 'zh-tw': {}};
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y = row['key'];
    
    if (y == 'latest_date')
      continue;
    
    x_list = [];
    x_lower = 0;
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      x = row[col_tag_list[j]];
      x_list.push(+x / 100);
    }
    
    //-- Loop over column again (reversed order)
    for (j=nb_col-1; j>=0; j--) {
      //-- Current value
      x_upper = x_list[j];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x0': x_lower,
        'x1': x_upper,
        'y': y,
        'x_list': x_list,
        'col_ind': j,
      };
      
      x_lower = x_upper;
      formatted_data.push(block);
    }
    
    y_list.push(y);
    yticklabel_dict['en'][y] = row['label'];
    yticklabel_dict['fr'][y] = row['label_fr'];
    yticklabel_dict['zh-tw'][y] = row['label_zh'];
  }
  
  //-- Calculate x_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var x_path = 0.1
  
  //-- Generate yticks
  var xtick = [];
  for (i=0; i<1.01; i+=x_path)
    xtick.push(i)
    
  //-- Get legend value
  var last_date = data.splice(0, 1)[0]['value_1'];
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.nb_col = nb_col;
  wrap.y_list = y_list;
  wrap.yticklabel_dict = yticklabel_dict;
  wrap.x_min = 0.0;
  wrap.x_max = x_max;
  wrap.xtick = xtick;
  wrap.last_date = last_date;
}

//-- Tooltip
function VBA_MouseMove(wrap, d) {
  if (wrap.tag.includes('mini'))
    return;
    
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  var col_label_list;
  if (LS_lang == 'zh-tw')
    col_label_list = ['第一劑', '第兩劑', '第三劑'];
  else if (LS_lang == 'fr')
    col_label_list = ['1ère dose ', '2e dose', '3e dose'];
  else
    col_label_list = ['1st dose', '2nd dose', '3rd dose'];
  
  //-- Define tooltip texts
  var fct_format = d3.format('.2%');
  var tooltip_text = d.x;
  var i;
  
  var tooltip_text = wrap.last_date + '<br>' + wrap.yticklabel_dict[LS_lang][d.y];
  for (i=0; i<wrap.nb_col; i++)
    tooltip_text += '<br>' + col_label_list[i] + ' = ' + fct_format(d.x_list[i]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function VBA_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add xlabel
  GP_PlotXLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color_list = [GP_wrap.c_list[3], GP_wrap.c_list[2], GP_wrap.c_list[6]];
  
  //-- Define mouse-move
  wrap.mouse_move = VBA_MouseMove;
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
    .attr('y', function (d) {return yscale(d.y);})
    .attr('width', 0)
    .attr('height', yscale.bandwidth())
    .attr('fill', function (d) {return wrap.color_list[d.col_ind];})
      .on('mouseover', function (d) {GP_MouseOver_Bright(wrap, d);})
      .on('mousemove', function (d) {wrap.mouse_move(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave_Bright(wrap, d);})
      
  //-- Save to wrapper
  wrap.bar = bar;
}

function VBA_Replot(wrap) {
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeBandYForBar(wrap);
  
  //-- Replot bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('x', function (d) {return xscale(d.x0);})
      .attr('width', function (d) {return xscale(d.x1)-xscale(d.x0);});
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Define yaxis
  var yaxis = d3.axisLeft(yscale)
    .tickSize(0)
    .tickValues(wrap.y_list)
    .tickFormat(function (d) {return wrap.yticklabel_dict[LS_lang][d];});
  
  //-- Replot yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(yaxis)
    .selectAll('text')
      .attr('transform', 'translate(0,0)')
      .style('text-anchor', 'end');
  wrap.svg.select('.yaxis')
    .selectAll('text')
    .style('font-size', '1.2rem');
      
  //-- Define xaxis
  var xaxis = d3.axisBottom(xscale)
      .tickSize(-wrap.height)
      .tickValues(wrap.xtick)
      .tickFormat(d3.format('.0%'));
  
  //-- Replot xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(0,3)');
      
  //-- Update xlabel
  var xlabel_dict = {en: 'Population ratio', fr: 'Part de la population', 'zh-tw': '人口比'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x_[LS_lang], y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list;
  
  //-- Define legend value
  wrap.legend_value = [];
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['已施打一劑', '已施打兩劑', '已施打三劑'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['1ère dose ', '2e dose', '3e dose'];
  else
    wrap.legend_label = ['1st dose', '2nd dose', '3rd dose'];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, wrap.last_date);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', wrap.legend_size);
}

//-- Load
function VBA_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBA_FormatData(wrap, data);
      VBA_Plot(wrap);
      VBA_Replot(wrap);
    });
}

function VBA_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBA_FormatData(wrap, data);
      VBA_Replot(wrap);
    });
}

function VBA_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function(){
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Remove
    d3.selectAll(wrap.id+' .plot').remove()
    
    //-- Replot
    VBA_InitFig(wrap);
    VBA_ResetText();
    VBA_Load(wrap);
  });
}

//-- Main
function VBA_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VBA_InitFig(wrap);
  VBA_ResetText();
  VBA_Load(wrap);
  
  //-- Setup button listeners
  VBA_ButtonListener(wrap);
}
