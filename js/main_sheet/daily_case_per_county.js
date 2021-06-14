
//-- Filename:
//--   daily_case_per_county.js
//--
//-- Author:
//--   Chieh-An Lin

function DCPC_MakeCanvas(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 415;
  wrap.tot_height_['fr'] = 400;
  wrap.tot_height_['en'] = 400;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 90, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 90, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 90, right: 2, bottom: 90, top: 2};
  
  GS_MakeCanvas(wrap);
}

function DCPC_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var col_tag = col_tag_list[wrap.county];
  var nb_col = col_tag_list.length;
  var date_list = [];
  
  //-- Other variables
  var y_sum = [0, 0]; //-- For 0 (total) & col_ind
  var y_max = 4.5;
  var i, j, x, y;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    x = data[i]["date"];
    y = +data[i][col_tag];
    date_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Update y_sum
    y_sum[0] += +data[i][col_tag_list[0]];
    y_sum[1] += +data[i][col_tag];
    
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
  
  //-- Get respective sum
  var legend_value = y_sum;
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.date_list = date_list;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
  wrap.legend_value = legend_value;
}

//-- Tooltip
function DCPC_MouseMove(wrap, d) {
  //-- Get tooltip position
  var y_alpha = 0.35;
  var new_pos = GS_GetTooltipPos(wrap, y_alpha, d3.mouse(d3.event.target));
  
  //-- Generate tooltip text
  var tooltip_text;
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw') {
    legend_label = [
      '合計', '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
    tooltip_text = d.date + '<br>' + legend_label[wrap.county] + d[wrap.col_tag_list[wrap.county]] + '例';
  }
  
  else if (GS_lang == 'fr') {
    legend_label = [
      'Total', 'Keelung', 'Taipei', 'Nouveau Taipei', 'Taoyuan', 'Comté de Hsinchu', 'Ville de Hsinchu', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Comté de Chiayi', 'Ville de Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    tooltip_text = d.date + '<br>' + d[wrap.col_tag_list[wrap.county]] + ' cas à ' + legend_label[wrap.county];
  }
  
  else {
    legend_label = [
      'Total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
    tooltip_text = d.date + '<br>' + d[wrap.col_tag_list[wrap.county]] + ' cases in ' + legend_label[wrap.county];
  }
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function DCPC_Initialize(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.date_list)
    .range([0, wrap.width])
    .padding(0.2);
    
  //-- No xtick or xticklabel 
  var x_axis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return "";});
  
  //-- Add x-axis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(x_axis)
    
  //-- Define a 2nd x-axis for xtick & xticklabel
  var eps = 0.1
  var x_2 = d3.scaleLinear()
    .domain([-eps, wrap.date_list.length+eps])
    .range([0, wrap.width])
  
  //-- Define xtick & update xticklabel later
  var x_axis_2 = d3.axisBottom(x_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return "";});
  
  //-- Add 2nd x-axis & adjust position
  wrap.svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + wrap.height + ")")
    .call(x_axis_2);
  
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick & yticklabel
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format("d"));
  
  //-- Add y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis);

  //-- Define a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0);
  
  //-- Add 2nd y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2);
    
  //-- Add ylabel & update value later
  wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-wrap.margin.left*0.75).toString() + ", " + (wrap.height/2).toString() + ")rotate(-90)");
    
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define color
  var color_list = ['#000000'].concat(GS_wrap.c_list).concat(GS_wrap.c_list); 
  var col_tag_list = wrap.col_tag_list.slice();
  var color = d3.scaleOrdinal()
    .domain(col_tag_list)
    .range(color_list);
  
  //-- Add bar
  var bar = wrap.svg.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .enter();
  
  //-- Update bar with dummy details
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', color(col_tag_list[wrap.county]))
    .attr('x', function (d) {return x(d.date);})
    .attr('y', y(0))
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {GS_MouseOver(wrap, d);})
    .on("mousemove", function (d) {DCPC_MouseMove(wrap, d);})
    .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})

  //-- Save to wrapper
  wrap.x_2 = x_2;
  wrap.color_list = color_list;
  wrap.color = color;
  wrap.bar = bar;
}

function DCPC_Update(wrap) {
  //-- Define new xticklabel
  var x_axis_2 = d3.axisBottom(wrap.x_2)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update 2nd x-axis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(GS_wrap.trans_duration)
    .call(x_axis_2)
    .selectAll("text")
      .attr("transform", "translate(-20,15) rotate(-90)")
      .style("text-anchor", "end");
  
  //-- Define y-axis
  var y = d3.scaleLinear()
    .domain([0, wrap.y_max])
    .range([wrap.height, 0]);
  
  //-- Define ytick
  var y_axis = d3.axisLeft(y)
    .tickSize(-wrap.width)
    .tickValues(wrap.ytick)
    .tickFormat(d3.format("d"));
  
  //-- Update y-axis
  wrap.svg.select('.yaxis')
    .transition()
    .duration(GS_wrap.trans_duration)
    .call(y_axis);
  
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
  var col_tag_list = wrap.col_tag_list.slice();
  wrap.bar.selectAll('.content.bar')
    .data(wrap.formatted_data)
    .transition()
    .duration(GS_wrap.trans_duration)
    .attr('fill', wrap.color(col_tag_list[wrap.county]))
    .attr('y', function (d) {return y(d[col_tag_list[wrap.county]]);})
    .attr('height', function (d) {return y(0)-y(d[col_tag_list[wrap.county]]);});
  
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = [
      '合計', '基隆', '台北', '新北', '桃園', '竹縣', '竹市', '苗栗', '台中', '彰化', '南投', '雲林', 
      '嘉縣', '嘉市', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'
    ];
  else if (GS_lang == 'fr')
    legend_label = [
      'Total', 'Keelung', 'Taipei', 'Nouveau Taipei', 'Taoyuan', 'Comté de Hsinchu', 'Ville de Hsinchu', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Comté de Chiayi', 'Ville de Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
    ];
  else
    legend_label = [
      'Total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
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

//-- Plot
function DCPC_Plot(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DCPC_MakeCanvas(wrap);
      DCPC_FormatData(wrap, data);
      DCPC_Initialize(wrap);
      DCPC_Update(wrap);
    });
}

function DCPC_Replot(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      DCPC_FormatData(wrap, data);
      DCPC_Update(wrap);
    });
}

function DCPC_ButtonListener(wrap) {
  //-- Period
  d3.select(wrap.id +'_county').on('change', function() {
    wrap.county = this.value;
    DCPC_Replot(wrap);
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
    
    //-- Update
    DCPC_Update(wrap);
  });
}

//-- Main
function DCPC_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Swap active to current value
  wrap.county = document.getElementById(wrap.tag + "_county").value;
  
  //-- Plot
  DCPC_Plot(wrap);
  
  //-- Setup button listeners
  DCPC_ButtonListener(wrap);
}
