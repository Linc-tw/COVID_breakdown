
//-- Filename:
//--   local_case_per_county.js
//--
//-- Author:
//--   Chieh-An Lin

function LCPC_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 90, top: 2};
  
  GS_InitFig(wrap);
}

function LCPC_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr("local_case_per_county_title", "各縣市之每日確診人數");
    TT_AddStr("local_case_per_county_button_total", "本土合計");
    TT_AddStr("local_case_per_county_button_keelung", "基隆");
    TT_AddStr("local_case_per_county_button_taipei", "台北");
    TT_AddStr("local_case_per_county_button_new_taipei", "新北");
    TT_AddStr("local_case_per_county_button_taoyuan", "桃園");
    TT_AddStr("local_case_per_county_button_hsinchu", "竹縣");
    TT_AddStr("local_case_per_county_button_hsinchu_city", "竹市");
    TT_AddStr("local_case_per_county_button_miaoli", "苗栗");
    TT_AddStr("local_case_per_county_button_taichung", "台中");
    TT_AddStr("local_case_per_county_button_changhua", "彰化");
    TT_AddStr("local_case_per_county_button_nantou", "南投");
    TT_AddStr("local_case_per_county_button_yunlin", "雲林");
    TT_AddStr("local_case_per_county_button_chiayi", "嘉縣");
    TT_AddStr("local_case_per_county_button_chiayi_city", "嘉市");
    TT_AddStr("local_case_per_county_button_tainan", "台南");
    TT_AddStr("local_case_per_county_button_kaohsiung", "高雄");
    TT_AddStr("local_case_per_county_button_pingtung", "屏東");
    TT_AddStr("local_case_per_county_button_yilan", "宜蘭");
    TT_AddStr("local_case_per_county_button_hualien", "花蓮");
    TT_AddStr("local_case_per_county_button_taitung", "台東");
    TT_AddStr("local_case_per_county_button_penghu", "澎湖");
    TT_AddStr("local_case_per_county_button_kinmen", "金門");
    TT_AddStr("local_case_per_county_button_matsu", "馬祖");
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr("local_case_per_county_title", "Cas confirmés locaux par ville et comté");
    TT_AddStr("local_case_per_county_button_total", "Locaux totaux");
    TT_AddStr("local_case_per_county_button_keelung", "Keelung");
    TT_AddStr("local_case_per_county_button_taipei", "Taipei");
    TT_AddStr("local_case_per_county_button_new_taipei", "Nouveau Taipei");
    TT_AddStr("local_case_per_county_button_taoyuan", "Taoyuan");
    TT_AddStr("local_case_per_county_button_hsinchu", "Comté de Hsinchu");
    TT_AddStr("local_case_per_county_button_hsinchu_city", "Ville de Hsinchu");
    TT_AddStr("local_case_per_county_button_miaoli", "Miaoli");
    TT_AddStr("local_case_per_county_button_taichung", "Taichung");
    TT_AddStr("local_case_per_county_button_changhua", "Changhua");
    TT_AddStr("local_case_per_county_button_nantou", "Nantou");
    TT_AddStr("local_case_per_county_button_yunlin", "Yunlin");
    TT_AddStr("local_case_per_county_button_chiayi", "Comté de Chiayi");
    TT_AddStr("local_case_per_county_button_chiayi_city", "Ville de Chiayi");
    TT_AddStr("local_case_per_county_button_tainan", "Tainan");
    TT_AddStr("local_case_per_county_button_kaohsiung", "Kaohsiung");
    TT_AddStr("local_case_per_county_button_pingtung", "Pingtung");
    TT_AddStr("local_case_per_county_button_yilan", "Yilan");
    TT_AddStr("local_case_per_county_button_hualien", "Hualien");
    TT_AddStr("local_case_per_county_button_taitung", "Taitung");
    TT_AddStr("local_case_per_county_button_penghu", "Penghu");
    TT_AddStr("local_case_per_county_button_kinmen", "Kinmen");
    TT_AddStr("local_case_per_county_button_matsu", "Matsu");
  }
  
  else { //-- En
    TT_AddStr("local_case_per_county_title", "Local Confirmed Cases per City & County");
    TT_AddStr("local_case_per_county_button_total", "Total local");
    TT_AddStr("local_case_per_county_button_keelung", "Keelung");
    TT_AddStr("local_case_per_county_button_taipei", "Taipei");
    TT_AddStr("local_case_per_county_button_new_taipei", "New Taipei");
    TT_AddStr("local_case_per_county_button_taoyuan", "Taoyuan");
    TT_AddStr("local_case_per_county_button_hsinchu", "Hsinchu County");
    TT_AddStr("local_case_per_county_button_hsinchu_city", "Hsinchu City");
    TT_AddStr("local_case_per_county_button_miaoli", "Miaoli");
    TT_AddStr("local_case_per_county_button_taichung", "Taichung");
    TT_AddStr("local_case_per_county_button_changhua", "Changhua");
    TT_AddStr("local_case_per_county_button_nantou", "Nantou");
    TT_AddStr("local_case_per_county_button_yunlin", "Yunlin");
    TT_AddStr("local_case_per_county_button_chiayi", "Chiayi County");
    TT_AddStr("local_case_per_county_button_chiayi_city", "Chiayi City");
    TT_AddStr("local_case_per_county_button_tainan", "Tainan");
    TT_AddStr("local_case_per_county_button_kaohsiung", "Kaohsiung");
    TT_AddStr("local_case_per_county_button_pingtung", "Pingtung");
    TT_AddStr("local_case_per_county_button_yilan", "Yilan");
    TT_AddStr("local_case_per_county_button_hualien", "Hualien");
    TT_AddStr("local_case_per_county_button_taitung", "Taitung");
    TT_AddStr("local_case_per_county_button_penghu", "Penghu");
    TT_AddStr("local_case_per_county_button_kinmen", "Kinmen");
    TT_AddStr("local_case_per_county_button_matsu", "Matsu");
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
  var x_list = []; //-- date
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
  
  //-- Choose y_path
  var y_path = wrap.y_path;
  
  //-- Calculate y_path
  //-- If string, use it as nb of ticks
  var log_precision, precision;
  if (typeof y_path === 'string') {
    log_precision = Math.floor(Math.log10(y_max)) - 1;
    precision = Math.pow(10, log_precision);
    precision = Math.max(1, precision); //-- precision at least 1
    y_path = y_max / (+y_path + 0.5);
    y_path = Math.round(y_path / precision) * precision;
  }
  //-- Otherwise, do nothing
  
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
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Generate tooltip text
  var tooltip_text = d.date + '<br>';
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw') {
    legend_label = [
      '本土合計', '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
    tooltip_text += legend_label[wrap.county] + d[wrap.col_tag] + '例';
  }
  
  else if (GS_lang == 'fr') {
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
      tooltip_text += d[wrap.col_tag] + 'local cases in total';
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
  //-- Define xscale
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- Define xscale_2 for xtick & xticklabel
  var eps = 0.1
  var xscale_2 = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Define xaxis & update xtick or xticklabel later
  var xaxis = d3.axisBottom(xscale_2)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis);
    
  //-- Define yscale
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yaxis for ytick & yticklabel
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format('d'));
  
  //-- Add yaxis
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .call(yaxis);

  //-- Define yaxis_2 for the frameline at right
  var yaxis_2 = d3.axisRight(yscale)
    .ticks(0)
    .tickSize(0);
  
  //-- Add yaxis_2 & adjust position
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_2);
    
  //-- Add ylabel & update value later
  wrap.svg.append('text')
    .attr('class', 'ylabel')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + (-wrap.margin.left*0.75).toString() + ', ' + (wrap.height/2).toString() + ')rotate(-90)');
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = GS_wrap.c_list.slice(6).concat(GS_wrap.c_list.slice(0, 6));
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
    .attr('x', function (d) {return xscale(d.date);})
    .attr('y', yscale(0))
    .attr('width', xscale.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {GS_MouseOver(wrap, d);})
    .on("mousemove", function (d) {LCPC_MouseMove(wrap, d);})
    .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.xscale_2 = xscale_2;
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function LCPC_Replot(wrap) {
  //-- Define new xaxis for xticklabel
  var xaxis = d3.axisBottom(wrap.xscale_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(GS_wrap.trans_delay)
    .call(xaxis)
    .selectAll('text')
      .attr('transform', 'translate(-20,15) rotate(-90)')
      .style('text-anchor', 'end');
  
  //-- Define new yscale
  var yscale = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define yticklabel format
  var yticklabel_format;
  if (wrap.ytick[wrap.ytick.length-1] > 9999) 
    yticklabel_format = '.2s';
  else
    yticklabel_format = 'd';
  
  //-- Define new yaxis for ytick
  var yaxis = d3.axisLeft(yscale)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format(yticklabel_format));
  
  //-- Update yaxis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_wrap.trans_delay)
    .call(yaxis);
  
  //-- Define ylabel
  var ylabel;
  if (GS_lang == 'zh-tw')
    ylabel = '案例數';
  else if (GS_lang == 'fr')
    ylabel = 'Nombre de cas';
  else
    ylabel = 'Number of cases';
  
  //-- Update ylabel
  wrap.svg.select(".ylabel")
    .text(ylabel);
    
  //-- Update bar
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_wrap.trans_delay)
    .attr('fill', wrap.color(wrap.col_tag))
    .attr('y', function (d) {return yscale(d[wrap.col_tag]);})
    .attr('height', function (d) {return yscale(0)-yscale(d[wrap.col_tag]);});
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = [
      '本土合計 '+TT_GetYearLabel(wrap), '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
  else if (GS_lang == 'fr')
    legend_label = [
      'Locaux totaux '+TT_GetYearLabel(wrap), 'Keelung', 'Taipei', 'Nouveau Taipei', 'Taoyuan', 'Comté de Hsinchu', 'Ville de Hsinchu', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Comté de Chiayi', 'Ville de Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
  else
    legend_label = [
      'Total local '+TT_GetYearLabel(wrap), 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
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
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value_2)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", legend_pos.x)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "end")
    
  //-- Update legend label
  wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label_2)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", legend_pos.x+legend_pos.dx)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color_list[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "start")
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
    
    name = wrap.tag + '_' + tag1 + '_' + GS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
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
