
    //--------------------------------//
    //--  death_delay.js            --//
    //--  Chieh-An Lin              --//
    //--  2022.05.20                --//
    //--------------------------------//

function DD_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  //-- No GP_InitFig_Overall because it doesn't change axis
  else
    GP_InitFig_SimpleBar(wrap);
}

function DD_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('death_delay_title', '確診到死亡延遲時間分布');
    LS_AddStr('death_delay_button_total', '合計');
    LS_AddStr('death_delay_button_2020', '2020');
    LS_AddStr('death_delay_button_2021', '2021');
    LS_AddStr('death_delay_button_2022', '2022');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('death_delay_title', 'Délai entre infection et décès');
    LS_AddStr('death_delay_button_total', 'Totaux');
    LS_AddStr('death_delay_button_2020', '2020');
    LS_AddStr('death_delay_button_2021', '2021');
    LS_AddStr('death_delay_button_2022', '2022');
  }
  
  else { //-- En
    LS_AddStr('death_delay_title', 'Delay between Case and Death Counts');
    LS_AddStr('death_delay_button_total', 'Total');
    LS_AddStr('death_delay_button_2020', '2020');
    LS_AddStr('death_delay_button_2021', '2021');
    LS_AddStr('death_delay_button_2022', '2022');
  }
}

function DD_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.col_ind];
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'difference';
  var x_list = []; //-- For age
  
  //-- Variables for xaxis
  var xtick = [];
  var xticklabel = [];
  var xlabel_path = 5; //-- Hard-coded
  var r = 0;
  
  //-- Variables for yaxis
  var y_max = 4.5;
  
  //-- Variables for legend
  var y_sum = [0, 0]; //-- 0 (total) & period
  
  //-- Main loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row[x_key];
    y = +row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (!wrap.tag.includes('mini') && i % xlabel_path == r) {
      xtick.push(i)
      xticklabel.push(x);
    }
    
    //-- Update y_sum
    y_sum[0] += +row[col_tag_list[0]];
    y_sum[1] += y;
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Last tick
  xtick.push(i+1);
  xticklabel.push('+');
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'count');
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = data;
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

//-- Tooltip
function DD_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.5;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target)); //TODO
  
//   //-- Get column tags
//   var age_label;
//   if (LS_lang == 'zh-tw')
//     age_label = '歲';
//   else if (LS_lang == 'fr')
//     age_label = ' ans';
//   else
//     age_label = ' years old';
//   
//   //-- Define tooltip text
//   var tooltip_text = wrap.ylabel_dict[LS_lang][wrap.col_tag];
//   tooltip_text += '<br>' + d['age'] + age_label + ' = ' + GP_ValueStr_Tooltip(+d[wrap.col_tag]);
  
  
//   //-- Get column tags
//   if (LS_lang == 'zh-tw')
//     col_label_list = ['全部', '境外移入', '本土', '其他']
//   else if (LS_lang == 'fr')
//     col_label_list = ["de l'ensemble des cas", 'des cas importés', 'des cas locaux', 'des autres cas']
//   else
//     col_label_list = ["all", 'imported', 'local', 'fleet']
//   
//   //-- Generate tooltip text
//   var tooltip_text;
//   if (LS_lang == 'zh-tw')
//     tooltip_text = col_label_list[wrap.col_ind] + '案例中有' + d[wrap.col_tag] + '位<br>發病或入境後' + d['difference'] + '日確診';
//   else if (LS_lang == 'fr')
//     tooltip_text = d[wrap.col_tag] + ' ' + col_label_list[wrap.col_ind] + ' attend(ent)<br>' + d['difference'] + " jour(s) avant d'être identifié(s)";
//   else
//     tooltip_text = d[wrap.col_tag] + ' of ' + col_label_list[wrap.col_ind] + ' cases required<br>' + d['difference'] + ' day(s) to be identified';
  
  var tooltip_text = '';
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style('left', new_pos[0] + 'px')
    .style('top', new_pos[1] + 'px')
}

function DD_Plot(wrap) {
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
  wrap.color = GP_wrap.c_list[8];
  
  //-- Define mouse-move
  wrap.mouse_move = DD_MouseMove;
  wrap.plot_opacity = GP_wrap.trans_opacity_bright;
  wrap.trans_delay = GP_wrap.trans_delay;
  
  //-- Plot bar
  GP_PlotSingleBar(wrap);
}

function DD_Replot(wrap) {
  //-- Update bar
  GP_ReplotSingleBar(wrap);
  
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  GP_ReplotBandX(wrap);
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'count');
  
  //-- Replot xlabel
  var xlabel_dict = {
    en: 'Delay in days between case and death counts', 
    fr: 'Délai en jours entre infection et décès',
    'zh-tw': '確診到死亡所需天數'
  };
  GP_ReplotXLabel(wrap, xlabel_dict);
  
  //-- Replot ylabel
  GP_ReplotYLabel(wrap, GP_wrap.ylabel_dict_death);
  
  //-- Set legend parameters
  GP_SetLegendParam(wrap, 'small');
  
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: wrap.legend_pos_y, dx: wrap.legend_pos_dx, dy: wrap.legend_pos_dy};
  
  //-- Define legend color
  wrap.legend_color = [wrap.color, GP_wrap.gray];
  
  //-- Define legend value
  wrap.legend_value = [wrap.legend_value_raw[1], wrap.legend_value_raw[0]];
  
  //-- Define legend label
  wrap.legend_label = ['Total', LS_GetLegendTitle_Page(wrap)];
  
  //-- Remove redundancy from legend if col_ind = 0
  if (wrap.col_ind == 0) {
    wrap.legend_color = wrap.legend_color.slice(0, 1);
    wrap.legend_value = wrap.legend_value.slice(1, 2);
    wrap.legend_label = wrap.legend_label.slice(1, 2);
  }
  
  //-- Update legend title
  var legend_title = {en: 'Deaths', fr: 'Décès', 'zh-tw': '死亡人數'}; //-- No time info for title here
  GP_UpdateLegendTitle(wrap, legend_title[LS_lang]);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'count', wrap.legend_size);
}

//-- Load
function DD_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DD_FormatData(wrap, data);
      DD_Plot(wrap);
      DD_Replot(wrap);
    });
}

function DD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DD_FormatData(wrap, data);
      DD_Replot(wrap);
    });
}

function DD_ButtonListener(wrap) {
  //-- Year
  d3.select(wrap.id +'_year').on('change', function() {
    wrap.col_ind = this.value;
    DD_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1 = wrap.col_tag;
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    DD_ResetText();
    DD_Replot(wrap);
  });
}

//-- Main
function DD_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  if (wrap.tag.includes('overall')) {
    wrap.col_ind = document.getElementById(wrap.tag + '_year').value;
  }
  else {
    wrap.col_ind = 0;
  }
  
  //-- Load
  DD_InitFig(wrap);
  DD_ResetText();
  DD_Load(wrap);
  
  //-- Setup button listeners
  DD_ButtonListener(wrap);
}
