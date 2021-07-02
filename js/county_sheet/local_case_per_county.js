
//-- Filename:
//--   local_case_per_county.js
//--
//-- Author:
//--   Chieh-An Lin

function LCPC_InitFig(wrap) {
  GP_InitFig_Standard(wrap);
}

function LCPC_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('local_case_per_county_title', '各縣市之每日確診人數');
    LS_AddStr('local_case_per_county_button_total', '本土合計');
    LS_AddStr('local_case_per_county_button_keelung', '基隆');
    LS_AddStr('local_case_per_county_button_taipei', '台北');
    LS_AddStr('local_case_per_county_button_new_taipei', '新北');
    LS_AddStr('local_case_per_county_button_taoyuan', '桃園');
    LS_AddStr('local_case_per_county_button_hsinchu', '竹縣');
    LS_AddStr('local_case_per_county_button_hsinchu_city', '竹市');
    LS_AddStr('local_case_per_county_button_miaoli', '苗栗');
    LS_AddStr('local_case_per_county_button_taichung', '台中');
    LS_AddStr('local_case_per_county_button_changhua', '彰化');
    LS_AddStr('local_case_per_county_button_nantou', '南投');
    LS_AddStr('local_case_per_county_button_yunlin', '雲林');
    LS_AddStr('local_case_per_county_button_chiayi', '嘉縣');
    LS_AddStr('local_case_per_county_button_chiayi_city', '嘉市');
    LS_AddStr('local_case_per_county_button_tainan', '台南');
    LS_AddStr('local_case_per_county_button_kaohsiung', '高雄');
    LS_AddStr('local_case_per_county_button_pingtung', '屏東');
    LS_AddStr('local_case_per_county_button_yilan', '宜蘭');
    LS_AddStr('local_case_per_county_button_hualien', '花蓮');
    LS_AddStr('local_case_per_county_button_taitung', '台東');
    LS_AddStr('local_case_per_county_button_penghu', '澎湖');
    LS_AddStr('local_case_per_county_button_kinmen', '金門');
    LS_AddStr('local_case_per_county_button_matsu', '馬祖');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('local_case_per_county_title', 'Cas confirmés locaux par ville et comté');
    LS_AddStr('local_case_per_county_button_total', 'Locaux totaux');
    LS_AddStr('local_case_per_county_button_keelung', 'Keelung');
    LS_AddStr('local_case_per_county_button_taipei', 'Taipei');
    LS_AddStr('local_case_per_county_button_new_taipei', 'Nouveau Taipei');
    LS_AddStr('local_case_per_county_button_taoyuan', 'Taoyuan');
    LS_AddStr('local_case_per_county_button_hsinchu', 'Comté de Hsinchu');
    LS_AddStr('local_case_per_county_button_hsinchu_city', 'Ville de Hsinchu');
    LS_AddStr('local_case_per_county_button_miaoli', 'Miaoli');
    LS_AddStr('local_case_per_county_button_taichung', 'Taichung');
    LS_AddStr('local_case_per_county_button_changhua', 'Changhua');
    LS_AddStr('local_case_per_county_button_nantou', 'Nantou');
    LS_AddStr('local_case_per_county_button_yunlin', 'Yunlin');
    LS_AddStr('local_case_per_county_button_chiayi', 'Comté de Chiayi');
    LS_AddStr('local_case_per_county_button_chiayi_city', 'Ville de Chiayi');
    LS_AddStr('local_case_per_county_button_tainan', 'Tainan');
    LS_AddStr('local_case_per_county_button_kaohsiung', 'Kaohsiung');
    LS_AddStr('local_case_per_county_button_pingtung', 'Pingtung');
    LS_AddStr('local_case_per_county_button_yilan', 'Yilan');
    LS_AddStr('local_case_per_county_button_hualien', 'Hualien');
    LS_AddStr('local_case_per_county_button_taitung', 'Taitung');
    LS_AddStr('local_case_per_county_button_penghu', 'Penghu');
    LS_AddStr('local_case_per_county_button_kinmen', 'Kinmen');
    LS_AddStr('local_case_per_county_button_matsu', 'Matsu');
  }
  
  else { //-- En
    LS_AddStr('local_case_per_county_title', 'Local Confirmed Cases per City & County');
    LS_AddStr('local_case_per_county_button_total', 'Total local');
    LS_AddStr('local_case_per_county_button_keelung', 'Keelung');
    LS_AddStr('local_case_per_county_button_taipei', 'Taipei');
    LS_AddStr('local_case_per_county_button_new_taipei', 'New Taipei');
    LS_AddStr('local_case_per_county_button_taoyuan', 'Taoyuan');
    LS_AddStr('local_case_per_county_button_hsinchu', 'Hsinchu County');
    LS_AddStr('local_case_per_county_button_hsinchu_city', 'Hsinchu City');
    LS_AddStr('local_case_per_county_button_miaoli', 'Miaoli');
    LS_AddStr('local_case_per_county_button_taichung', 'Taichung');
    LS_AddStr('local_case_per_county_button_changhua', 'Changhua');
    LS_AddStr('local_case_per_county_button_nantou', 'Nantou');
    LS_AddStr('local_case_per_county_button_yunlin', 'Yunlin');
    LS_AddStr('local_case_per_county_button_chiayi', 'Chiayi County');
    LS_AddStr('local_case_per_county_button_chiayi_city', 'Chiayi City');
    LS_AddStr('local_case_per_county_button_tainan', 'Tainan');
    LS_AddStr('local_case_per_county_button_kaohsiung', 'Kaohsiung');
    LS_AddStr('local_case_per_county_button_pingtung', 'Pingtung');
    LS_AddStr('local_case_per_county_button_yilan', 'Yilan');
    LS_AddStr('local_case_per_county_button_hualien', 'Hualien');
    LS_AddStr('local_case_per_county_button_taitung', 'Taitung');
    LS_AddStr('local_case_per_county_button_penghu', 'Penghu');
    LS_AddStr('local_case_per_county_button_kinmen', 'Kinmen');
    LS_AddStr('local_case_per_county_button_matsu', 'Matsu');
  }
}

function LCPC_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1); //-- 0 = date
  var col_tag = col_tag_list[wrap.county];
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row;
  
  //-- Other variables
  var y_sum = [0, 0]; //-- For legend: 0 (total) & county
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    y = +row[col_tag];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Update y_sum
    y_sum[0] += +row[col_tag_list[0]];
    y_sum[1] += y;
    
    //-- Update y_max
    y_max = Math.max(y_max, y);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks);
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path)
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.col_tag_list = col_tag_list;
  wrap.col_tag = col_tag;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_sum;
}

//-- Tooltip
function LCPC_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.35;
  var new_pos = GP_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Generate tooltip text
  var tooltip_text = d.date + '<br>';
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw') {
    legend_label = [
      '本土合計', '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
    tooltip_text += legend_label[wrap.county] + d[wrap.col_tag] + '例';
  }
  
  else if (LS_lang == 'fr') {
    legend_label = [
      'Locaux totaux', 'à Keelung', 'à Taipei', 'à Nouveau Taipei', 'à Taoyuan', 'au comté de Hsinchu', 'à la ville de Hsinchu', 'à Miaoli', 'à Taichung', 'à Changhua', 'à Nantou', 'à Yunlin', 
      'au comté de Chiayi', 'à la ville de Chiayi', 'à Tainan', 'à Kaohsiung', 'à Pingtung', 'à Yilan', 'à Hualien', 'à Taitung', 'à Penghu', 'à Kinmen', 'à Matsu'
    ];
    if (wrap.county == 0)
      tooltip_text += d[wrap.col_tag] + ' cas locaux au total';
    else
      tooltip_text += d[wrap.col_tag] + ' cas ' + legend_label[wrap.county];
  }
  
  else {
    legend_label = [
      'Total local', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    if (wrap.county == 0)
      tooltip_text += d[wrap.col_tag] + ' local cases in total';
    else
      tooltip_text += d[wrap.col_tag] + ' cases in ' + legend_label[wrap.county];
  }
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function LCPC_Plot(wrap) {
  //-- Plot x
  GP_PlotDateAsX(wrap);
  
  //-- Plot y
  GP_PlotLinearY(wrap);
  
  //-- Add tooltip
  GP_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GP_wrap.c_list.slice(6).concat(GP_wrap.c_list.slice(0, 6));
  color_list = color_list.concat(color_list.slice(1));
  var color = d3.scaleOrdinal()
    .domain(wrap.col_tag_list)
    .range(color_list);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', color(wrap.col_tag))
    .attr('x', function (d) {return wrap.xscale(d.date);})
    .attr('y', wrap.yscale(0))
    .attr('width', wrap.xscale.bandwidth())
    .attr('height', 0)
      .on("mouseover", function (d) {GP_MouseOver(wrap, d);})
      .on("mousemove", function (d) {LCPC_MouseMove(wrap, d);})
      .on("mouseleave", function (d) {GP_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function LCPC_Replot(wrap) {
  //-- Replot x
  GP_ReplotDateAsX(wrap);
  
  //-- Replot y
  GP_ReplotCountAsY(wrap);
  
  //-- Define ylabel
  var ylabel_dict = {en: 'Number of cases', fr: 'Nombre de cas', 'zh-tw': '案例數'};
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel_dict[LS_lang]);
    
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GP_wrap.trans_delay)
    .attr('fill', wrap.color(wrap.col_tag))
    .attr('y', function (d) {return wrap.yscale(d[wrap.col_tag]);})
    .attr('height', function (d) {return wrap.yscale(0)-wrap.yscale(d[wrap.col_tag]);});
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (LS_lang == 'zh-tw')
    legend_label = [
      '本土合計 '+LS_GetYearLabel(wrap), '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
  else if (LS_lang == 'fr')
    legend_label = [
      'Locaux totaux '+LS_GetYearLabel(wrap), 'Keelung', 'Taipei', 'Nouveau Taipei', 'Taoyuan', 'Comté de Hsinchu', 'Ville de Hsinchu', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Comté de Chiayi', 'Ville de Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
  else
    legend_label = [
      'Total local '+LS_GetYearLabel(wrap), 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
  
  //-- Update legend color, label, & value
  var legend_color_list = [];
  var legend_label_2 = [];
  var legend_value_2 = [];
  if (wrap.county > 0) {
    legend_color_list.push(wrap.color_list[wrap.county]);
    legend_label_2.push(legend_label[wrap.county]);
    legend_value_2.push(wrap.legend_value[1]);
  }
  legend_color_list.push(wrap.color_list[0]);
  legend_label_2.push(legend_label[0]);
  legend_value_2.push(wrap.legend_value[0]);
  
  //-- Update legend value
  wrap.svg.selectAll('.legend.value')
    .remove()
    .exit()
    .data(legend_value_2)
    .enter()
    .append('text')
      .attr('class', 'legend value')
      .attr('x', legend_pos.x)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'end')
    
  //-- Update legend label
  wrap.svg.selectAll('.legend.label')
    .remove()
    .exit()
    .data(legend_label_2)
    .enter()
    .append('text')
      .attr('class', 'legend label')
      .attr('x', legend_pos.x+legend_pos.dx)
      .attr('y', function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style('fill', function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr('text-anchor', 'start')
}

//-- Load
function LCPC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      LCPC_FormatData(wrap, data);
      LCPC_Plot(wrap);
      LCPC_Replot(wrap);
    });
}

function LCPC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      LCPC_FormatData(wrap, data);
      LCPC_Replot(wrap);
    });
}

function LCPC_ButtonListener(wrap) {
  //-- Period
  d3.select(wrap.id +'_county').on('change', function() {
    wrap.county = this.value;
    LCPC_Reload(wrap);
  });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    col_label = [
      'Total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    var tag1 = col_label[wrap.county];
    
    name = wrap.tag + '_' + tag1 + '_' + LS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    LCPC_ResetText();
    LCPC_Replot(wrap);
  });
}

//-- Main
function LCPC_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Swap active to current value
  wrap.county = document.getElementById(wrap.tag + "_county").value;
  
  //-- Load
  LCPC_InitFig(wrap);
  LCPC_ResetText();
  LCPC_Load(wrap);
  
  //-- Setup button listeners
  LCPC_ButtonListener(wrap);
}
