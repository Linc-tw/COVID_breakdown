
    //--------------------------------//
    //--  death_by_age.js           --//
    //--  Chieh-An Lin              --//
    //--  2022.05.20                --//
    //--------------------------------//

function DBA_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  //-- No GP_InitFig_Overall because it doesn't change axis
  else
    GP_InitFig_SimpleBar(wrap);
}

function DBA_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('death_by_age_title', '死亡個案年齡分布');
    LS_AddStr('death_by_age_button_count', '死亡數');
    LS_AddStr('death_by_age_button_rate', '致死率');
    LS_AddStr('death_by_age_button_total', '合計');
    LS_AddStr('death_by_age_button_2020', '2020');
    LS_AddStr('death_by_age_button_2021', '2021');
    LS_AddStr('death_by_age_button_2022', '2022');
    
    LS_AddHtml('death_by_age_description', '\
      此圖數字可能會和「死亡人數」的統計不同，\
      因為兩者取自不同來源，資料更新速度不同。\
    ');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('death_by_age_title', 'Décès par âge');
    LS_AddStr('death_by_age_button_count', 'Nombre');
    LS_AddStr('death_by_age_button_rate', 'Taux');
    LS_AddStr('death_by_age_button_total', 'Totaux');
    LS_AddStr('death_by_age_button_2020', '2020');
    LS_AddStr('death_by_age_button_2021', '2021');
    LS_AddStr('death_by_age_button_2022', '2022');
    
    LS_AddHtml('death_by_age_description', '\
      Le chiffre dans cette figure peut ne pas correspond à celui du « Nombre de décès »,\
      car ils viennent des sources différentes\
      qui ne mettent pas les données à jour en même temps.\
    ');
  }
  
  else { //-- En
    LS_AddStr('death_by_age_title', 'Deaths by Age');
    LS_AddStr('death_by_age_button_count', 'Counts');
    LS_AddStr('death_by_age_button_rate', 'Rate');
    LS_AddStr('death_by_age_button_total', 'Total');
    LS_AddStr('death_by_age_button_2020', '2020');
    LS_AddStr('death_by_age_button_2021', '2021');
    LS_AddStr('death_by_age_button_2022', '2022');
    
    LS_AddHtml('death_by_age_description', '\
      The value on this figure does not necessarily match to the one in "Death Counts",\
      because they come from different sources\
      which do not update data at the same time.\
    ');
  }
}

function DBA_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var formatted_data = [];
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'age';
  var x_list = []; //-- For age
  
  //-- Variables for xaxis
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for yaxis
  var y_max;
  if (wrap.rate > 0)
    y_max = 0.005;
  else
    y_max = 4.5;
  
  //-- Variables for legend
  var y_sum = [+data[0][col_tag_list[0]], +data[0][col_tag]]; //-- 0 (total) & year
  
  //-- Main loop over row
  for (i=1; i<data.length; i++) { //-- Starting from 1 = no total
    row = data[i];
    x = row[x_key];
    y = +row[col_tag];
    
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (!wrap.tag.includes('mini')) { //-- No total
      xtick.push(i-1);
      xticklabel.push((i-1)*10);
    }
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
    
    formatted_data.push(row);
  }
  
  //-- Last tick
  xtick.push(i-1);
  xticklabel.push('+');
  
  //-- Add dummy data
  var block;
  if (wrap.rate > 0) {
    for (i=0; i<3; i++) {
      block = {};
      for (j=0; j<col_tag_list.length; j++)
        block[col_tag_list[j]] = NaN;
      formatted_data.push(block);
    }
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path;
  if (wrap.rate > 0)
    y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'percentage');
  else
    y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.col_tag = col_tag;
  wrap.nb_col = nb_col;
  wrap.x_key = x_key;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value_raw = y_sum;
}

function DBA_FormatData2(wrap, data2) {
  var ylabel_dict = {'en': {}, 'fr': {}, 'zh-tw': {}};
  var i, key, block; 
  
  //-- Loop over row
  for (i=0; i<data2.length; i++) {
    key = data2[i]['key'];
    ylabel_dict['en'][key] = data2[i]['label'];
    ylabel_dict['fr'][key] = data2[i]['label_fr'];
    ylabel_dict['zh-tw'][key] = data2[i]['label_zh'];
  }
  
  //-- Save to wrapper
  wrap.ylabel_dict = ylabel_dict;
}

//-- Tooltip
function DBA_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Get column tags
  var age_label;
  if (LS_lang == 'zh-tw')
    age_label = '歲';
  else if (LS_lang == 'fr')
    age_label = ' ans';
  else
    age_label = ' years old';
  
  //-- Define tooltip text
  var fct_format;
  if (wrap.rate > 0)
    fct_format = d3.format('.2%');
  else
    fct_format = GP_ValueStr_Tooltip;
  var tooltip_text = wrap.ylabel_dict[LS_lang][wrap.col_tag];
  tooltip_text += '<br>' + d['age'] + age_label + ' = ' + fct_format(+d[wrap.col_tag]);
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function DBA_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Add xlabel
  GP_PlotXLabel(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Add tooltip
  if (!wrap.tag.includes('mini'))
    GP_MakeTooltip(wrap);
  
  //-- Define color
  wrap.color = GP_wrap.c_list[9];
  
  //-- Define mouse-move
  wrap.mouse_move = DBA_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function DBA_Replot(wrap) {
  //-- Define scales
  var xscale = GP_MakeBandXForBar(wrap);
  var yscale = GP_MakeLinearY(wrap);
  
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('x', function (d) {if (isNaN(d[wrap.col_tag])) return wrap.width; return xscale(d[wrap.x_key]);})
      .attr('y', function (d) {if (isNaN(d[wrap.col_tag])) return yscale(0); return yscale(d[wrap.col_tag]);})
      .attr('width', xscale.bandwidth())
      .attr('height', function (d) {if (isNaN(d[wrap.col_tag])) return 0; return yscale(0)-yscale(d[wrap.col_tag]);});
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  GP_ReplotBandX(wrap);
  
  //-- Replot yaxis
  var format;
  if (wrap.rate > 0)
    format = 'percentage';
  else
    format = 'count';
  GP_ReplotCountAsY(wrap, format);
  
  //-- Replot xlabel
  var xlabel_dict = {en: 'Age', fr: 'Âge', 'zh-tw': '年齡'};
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  if (wrap.rate > 0)
    GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_rate);
  else
    GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_death);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'normal');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  wrap.legend_label = [wrap.ylabel_dict[LS_lang][wrap.col_tag], LS_GetLegendTitle_Page(wrap)];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(1, 2);
    wrap.legend_label = wrap.legend_label.slice(1, 2);
  }
  
  var legend_title;
  if (wrap.rate > 0)
    legend_title = {en: 'Case fatality rate', fr: 'Létalité', 'zh-tw': '致死率'}; //-- No time info for title here
  else
    legend_title = {en: 'Deaths', fr: 'Décès', 'zh-tw': '死亡人數'}; //-- No time info for title here
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap, legend_title[LS_lang]);

  //-- Replot legend
  GP_ReplotLegend(wrap, format, wrap.legend_size);
}

//-- Load
function DBA_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.rate])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DBA_FormatData(wrap, data);
      DBA_FormatData2(wrap, data2);
      DBA_Plot(wrap);
      DBA_Replot(wrap);
    });
}

function DBA_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.rate])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      DBA_FormatData(wrap, data);
      DBA_FormatData2(wrap, data2);
      DBA_Replot(wrap);
    });
}

function DBA_ButtonListener(wrap) {
  //-- Count or rate
  $(document).on('change', "input:radio[name='" + wrap.tag + "_rate']", function (event) {
    GP_PressRadioButton(wrap, 'rate', wrap.rate, this.value);
    wrap.rate = this.value;
    DBA_Reload(wrap);
  });
  
  //-- Period
  d3.select(wrap.id +'_year').on('change', function() {
    wrap.col_ind = +this.value;
    DBA_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1, tag2;
    
    if (wrap.rate == 0)
      tag1 = 'count';
    else
      tag1 = 'rate';
    
    if (wrap.col_ind == 0)
      tag2 = 'total';
    else
      tag2 = '' + (wrap.col_ind + 2019);
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });
  
  //-- Language
  $(document).on('change', "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set('lang', LS_lang);
    
    //-- Replot
    DBA_ResetText();
    DBA_Replot(wrap);
  });
}

//-- Main
function DBA_Main(wrap) {
  wrap.id = '#' + wrap.tag;
  
  //-- Swap active to current value
  wrap.rate = document.querySelector("input[name='" + wrap.tag + "_rate']:checked").value;
  GP_PressRadioButton(wrap, 'rate', 0, wrap.rate); //-- 0 from .html
  wrap.col_ind = document.getElementById(wrap.tag + '_year').value;
  
  //-- Load
  DBA_InitFig(wrap);
  DBA_ResetText();
  DBA_Load(wrap);
  
  //-- Setup button listeners
  DBA_ButtonListener(wrap);
}
