
//-- Filename:
//--   criteria_timeline.js
//--
//-- Author:
//--   Chieh-An Lin

function CT_Make_Canvas(wrap) {
  var tot_width = 800;
  var tot_height = 540;
  
  var margin = {left: 0, right: 0, bottom: 0, top: 0};
  var width = tot_width - margin.left - margin.right;
  var height = tot_height - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + tot_width + " " + tot_height)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  wrap.tot_width = tot_width;
  wrap.tot_height = tot_height;
  wrap.margin = margin;
  wrap.width = width;
  wrap.height = height;
  wrap.corner = corner;
  wrap.svg = svg;
}

function CT_Format_Data(wrap, data) {
  wrap.formatted_data = data;
  wrap.length = data.length;
}

function CT_Mouse_Over(wrap, d) {
  wrap.tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(d3.event.target)
    .style("opacity", 0.6)
}

function CT_Get_Tooltip_Pos(wrap, d) {
  var x_pos = d[0];
  var y_pos = d[1];
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var card_hdr = 3.125*16; //-- Offset caused by card-header
  var svg_dim = d3.select(wrap.id).node().getBoundingClientRect();
  var x_aspect = (svg_dim.width - 2*buffer) / wrap.tot_width;
  var y_aspect = (svg_dim.height - 2*buffer) / wrap.tot_height;
  
  x_pos = (x_pos + wrap.margin.left) * x_aspect + buffer;
  y_pos = (y_pos + wrap.margin.top) * y_aspect + buffer + card_hdr + button;
  
  x_pos = x_pos + 10;
  y_pos = y_pos - 40;
  return [x_pos, y_pos];
}

function CT_Mouse_Move(wrap, d) {
  var new_pos = CT_Get_Tooltip_Pos(wrap, d3.mouse(d3.event.target));
  var tooltip_text;
  
  if (GS_lang == 'zh-tw')
    tooltip_text = '點我'
  else if (GS_lang == 'fr')
    tooltip_text = 'Cliquez'
  else
    tooltip_text = 'Click me'
  
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

function CT_Mouse_Leave(wrap, d) {
  wrap.tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(d3.event.target)
    .style("opacity", 1)
}

//-- Click
function CT_Click_Circle(wrap, d, i) {
  var j = wrap.length - 1 - i;
  var trans_duration = 200;
  var alpha = 1 - wrap['circle_text_'+j];
  wrap.doFull = 2;
  
  wrap.svg.selectAll(wrap.id+'_circle_text_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", alpha);
  
  wrap.svg.selectAll(wrap.id+'_circle_line_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", wrap.line_alpha*alpha)
  
  wrap['circle_text_'+j] = alpha;
}

function CT_Click_Timeline(wrap, d, j) {
  var trans_duration = 200;
  var alpha = 1 - wrap['timeline_text_'+j];
  wrap.doFull = 2;
  
  wrap.svg.selectAll(wrap.id+'_timeline_text_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", alpha);
  
  wrap.svg.selectAll(wrap.id+'_timeline_line_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", wrap.line_alpha*alpha)
  
  wrap['timeline_text_'+j] = alpha;
}

function CT_Initialize(wrap) {
  //-- Title
  var title;
  if (GS_lang == 'zh-tw') title = ['台灣針對嚴重特殊傳染性肺炎之', '採檢標準暨其生效日期變化圖'];
  else if (GS_lang == 'fr') title = ['Antécédents de voyage, symptômes et autres', 'conditions avec lesquelles Taïwan dépiste', "systématiquement & leurs dates d'effet"];
  else title = ['Travel history, symptoms, & other conditions', 'with which Taiwan tests systematically &', 'their starting dates'];
  
  wrap.svg.selectAll(".title")
    .data(title)
    .enter()
    .append("text")
      .attr("class", "title")
      .attr("x", 0.5*wrap.width-150)
      .attr("y", function (d, i) {return 0.5*wrap.height-20 + i*20})
      .attr("fill", 'black')
      .text(function (d) {return d})
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "bottom")
  
  //-- Color
  var color = d3.scaleLinear().domain([0, 0.25*(wrap.length-1), 0.5*(wrap.length-1), 0.75*(wrap.length-1), wrap.length-1]).range(['#aa0033', '#bb8866', '#aaaa99', '#5588aa', '#002299']);
  
  //-- Timeline texts & lines
  var x_list_t;
  if (GS_lang == 'zh-tw') {
    x_list_t = [
      0, 
          300, 120, 0, 180, 240, 
      0, 
      0, 
          300, 
      0, 
          300, 120, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0
    ];
  }
  else if (GS_lang == 'fr') {
    x_list_t = [
      0, 
          380, 120, 0, 180, 240, 
      0, 
      0, 
          380, 
      0, 
          380, 120, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0
    ];
  }
  else {
    x_list_t = [
      0, 
          300, 120, 0, 180, 240, 
      0, 
      0, 
          300, 
      0, 
          300, 120, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0
    ];
  }
  var y_list_t = [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0];
  var x0_t = 130;
  var dx_t = 20;
  
  var text = wrap.svg.append("g");
  var line = wrap.svg.append("g");
  var line_alpha = 0.35;
  var i, date, split;
  
  for (i=0; i<wrap.length; i++) {
    wrap['timeline_text_'+i] = 0; //-- Hide all
    date = wrap.formatted_data[i]['date'];
    split = wrap.formatted_data[i][GS_lang].split('\n');
    if (date == '2020-01-25' || date == '2020-03-17' || date == '2020-03-19')
      split = [split.join(' ')]
    if (date == '2020-02-16' && GS_lang == 'fr')
      split = [split[0]+' '+split[1], split[2]+' '+split[3]]
    if (date == '2020-02-29' && GS_lang == 'fr')
      split = [split[0], split[1], split[2]+' '+split[3]]
    
    //-- Timeline - date
    text.append("text")
      .attr("class", "content text")
      .attr("x", x0_t-dx_t)
      .attr("y", function (d, j) {return wrap.height*(i+0.5)/wrap.length+j*15})
      .attr("fill", function (d) {return color(i)})
      .attr("opacity", wrap['timeline_text_'+i])
      .attr("id", function (d, j) {return wrap.tag+'_timeline_text_'+i;})
      .text(date)
      .attr("text-anchor", 'end')
      .attr("dominant-baseline", "middle")
        
    //-- Timeline - text
    text.selectAll()
      .data(split)
      .enter()
      .append("text")
        .attr("class", "content text")
        .attr("x", x0_t+dx_t+x_list_t[i])
        .attr("y", function (d, j) {return wrap.height*(i+0.5)/wrap.length+j*15})
        .attr("fill", function (d) {return color(i)})
        .attr("opacity", wrap['timeline_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_timeline_text_'+i;})
        .text(function (d) {return d;})
        .attr("text-anchor", 'start')
        .attr("dominant-baseline", "middle")
        
    //-- Timeline - line
    if (x_list_t[i] > 0) {
      y1 = wrap.height*(i+0.5)/wrap.length;
      y2 = wrap.height*(i+0.5)/wrap.length+y_list_t[i];
      line.append("polyline")
        .attr("points", (x0_t+0.75*dx_t)+','+y1+' '+(x0_t+0.5*dx_t+x_list_t[i])+','+y2)
        .attr("opacity", line_alpha*wrap['timeline_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_timeline_line_'+i;})
        .attr("stroke", '#bbb')
        .attr("stroke-width", 1)
        .attr('fill', 'none')
    }
  }
  
  //-- Timeline - baseline
  var dot = wrap.svg.append("g");
  
  dot.append("line")
    .attr("x1", x0_t)
    .attr("y1", wrap.height*0.5/wrap.length)
    .attr("x2", x0_t)
    .attr("y2", wrap.height*(wrap.length-0.5)/wrap.length)
    .attr("opacity", 0)
    .attr('id', wrap.tag+'_timeline_baseline')
    .attr("stroke", "black")
    .attr("stroke-width", 1)
  
  //-- Timeline - dot
  dot.selectAll(".dot")
    .data(wrap.formatted_data)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .attr("cx", x0_t)
      .attr("cy", function (d, i) {return wrap.height*(i+0.5)/wrap.length})
      .attr("fill", function (d, i) {return color(i)})
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("click", function (d, j) {CT_Click_Timeline(wrap, d, j);})
      .on("mouseover", function (d) {CT_Mouse_Over(wrap, d);})
      .on("mousemove", function (d) {CT_Mouse_Move(wrap, d);})
      .on("mouseleave", function (d) {CT_Mouse_Leave(wrap, d);})
  
  //-- Circle - circle
  var r_c_min = 30;
  var r_c_max = 195;
  var x0_c = 210;
  var y0_c = wrap.height*0.6;
  var dy_c = 0.5;
  
  wrap.svg.append("g")
    .selectAll(".circle")
    .data(wrap.formatted_data)
    .enter()
    .append("circle")
      .attr("class", "circle")
      .attr("r", 0)
      .attr("cx", x0_c)
      .attr("cy", function (d, i) {return y0_c-(r_c_max-r_c_min)*i/(wrap.length-1)+dy_c*i})
      .attr("fill", function (d, i) {return color(wrap.length-1-i)})
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 0.3)
      .on("click", function (d, i) {CT_Click_Circle(wrap, d, i);})
      .on("mouseover", function (d) {CT_Mouse_Over(wrap, d);})
      .on("mousemove", function (d) {CT_Mouse_Move(wrap, d);})
      .on("mouseleave", function (d) {CT_Mouse_Leave(wrap, d);})
  
  //-- Circle texts & lines
  var x_list_c, y_list_c;
  if (GS_lang == 'zh-tw') {
    x_list_c = [
      0, 
        1, 1, 0, 1, 1, 
      0, 
      0, 
        1, 
      0, 
        1, 1, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0
    ];
    y_list_c = [
      0, 
          10, 20, 
      -15, 
          5, 15,
      -30, 
      -15, 
          -5, 
      -20, 
          -15, 25, 
      10, 
      20, 
      15, 
      10, 
      5, 
      0, 
      0
    ];
  }
  else if (GS_lang == 'fr') {
    x_list_c = [
      0, 
        1, 1, 0, 1, 1, 
      0, 
      0, 
        1, 
      0, 
        1, 1, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0
    ];
    y_list_c = [
      0, 
          10, 20, 
      -15, 
          5, 15,
      -35, 
      -25, 
          -20, 
      -25, 
          -5, 55, 
      -15, 
      10, 
      20, 
      15, 
      10, 
      5, 
      0
    ];
  }
  else {
    x_list_c = [
      0, 
        1, 1, 0, 1, 1, 
      0, 
      0, 
        1, 
      0, 
        1, 1, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0, 
      0
    ];
    y_list_c = [
      0, 
          10, 20, 
      -15, 
          5, 15,
      -35, 
      -25, 
          -20, 
      -25, 
          -15, 25, 
      15, 
      25, 
      20, 
      15, 
      10, 
      5, 
      0
    ];
  }
  var line_2 = wrap.svg.append("g");
  var x1, y1, y2, anchor;
  
  for (i=0; i<wrap.length; i++) {
    wrap['circle_text_'+i] = 0; //-- Hide all
    if (i > 12)
      split = (wrap.formatted_data[i]['date'] + ' ' + wrap.formatted_data[i][GS_lang]).split('\n');
    else
      split = (wrap.formatted_data[i]['date'] + '\n' + wrap.formatted_data[i][GS_lang]).split('\n');
    x1 = x_list_c[i] ? wrap.width-10 : 2*x0_c+20;
    anchor = x_list_c[i] ? 'end' : 'start';
    
    //-- Circle - text
    text.selectAll()
      .data(split)
      .enter()
      .append("text")
        .attr("class", "content text")
        .attr("x", x1)
        .attr("y", function (d, j) {return wrap.height*(i+0.5)/wrap.length+j*15+y_list_c[i]})
        .attr("fill", function (d) {return color(i)})
        .attr("opacity", wrap['circle_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_circle_text_'+i;})
        .text(function (d) {return d;})
        .attr("text-anchor", anchor)
        .attr("dominant-baseline", "middle")
        
    //-- Circle - line
    if (x_list_c[i] == 0) {
      y1 = y0_c+r_c_max - 2*(r_c_max-r_c_min)*(wrap.length-1-(i-0.45))/(wrap.length-1) + dy_c*(wrap.length-1-(i-0.45));
      y2 = wrap.height*(i+0.5)/wrap.length+y_list_c[i];
      line_2.append("polyline")
        .attr("points", x0_c+','+y1+' '+(x1-60)+','+y2+' '+(x1-5)+','+y2)
        .attr("opacity", line_alpha*wrap['circle_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_circle_line_'+i;})
        .attr("stroke", '#bbb')
        .attr("stroke-width", 1)
        .attr('fill', 'none')
    }
  }
  
  wrap.r_c_min = r_c_min;
  wrap.r_c_max = r_c_max;
  wrap.line_alpha = line_alpha;
}

function CT_Update(wrap) {
  var trans_duration = 800;
  var i, active_list;
  
  if (wrap.doFull == 0)
    active_list = [1,0,0,1,0,  0,1,1,0,1,  0,0,1,1,1,  0,1,1,1];
  else if (wrap.doFull == 1)
    active_list = [1,1,1,1,1,  1,1,1,1,1,  1,1,1,1,1,  1,1,1,1];
  
  //-- Custom
  else {
    active_list = []
    
    //-- Was circle before
    if (wrap.doTimeline == 1) {
      for (i=0; i<wrap.length; i++)
        active_list.push(wrap['circle_text_'+i])
    }
    //-- Was timeline before
    else {
      for (i=0; i<wrap.length; i++)
        active_list.push(wrap['timeline_text_'+i])
    }
  }
  
  if (wrap.doTimeline == 1) {
    //-- Update circles
    wrap.svg.selectAll('.circle')
      .data(wrap.formatted_data)
      .transition()
      .duration(trans_duration)
      .attr("r", 0)
      
    //-- Update dots
    wrap.svg.selectAll('.dot')
      .data(wrap.formatted_data)
      .transition()
      .duration(trans_duration)
      .attr("r", 5)
    
    //-- Update baseline
    wrap.svg.selectAll(wrap.id+'_timeline_baseline')
      .transition()
      .duration(trans_duration)
      .attr('opacity', 1)
    
    //-- Title
    if (GS_lang == 'zh-tw') {
      title_x_t = wrap.width - 270;
      title_y0_t = wrap.height - 100;
      title_y1_t = 20;
    }
    else if (GS_lang == 'fr') {
      title_x_t = wrap.width - 346;
      title_y0_t = wrap.height - 80;
      title_y1_t = 20;
    }
    else {
      title_x_t = wrap.width - 346;
      title_y0_t = wrap.height - 80;
      title_y1_t = 20;
    }
    
    wrap.svg.selectAll('.title')
      .transition()
      .duration(trans_duration)
      .attr("x", title_x_t)
      .attr("y", function (d, i) {return title_y0_t + title_y1_t*i})
      
    for (i=0; i<wrap.length; i++) {
      //-- Update circle texts
      wrap['circle_text_'+i] = 0;
      wrap.svg.selectAll(wrap.id+'_circle_text_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", 0)
      wrap.svg.selectAll(wrap.id+'_circle_line_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", wrap.line_alpha*0)
        
      //-- Update timeline texts
      wrap['timeline_text_'+i] = active_list[i];
      wrap.svg.selectAll(wrap.id+'_timeline_text_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", active_list[i])
      wrap.svg.selectAll(wrap.id+'_timeline_line_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", wrap.line_alpha*active_list[i])
    }
  }
  else {
    //-- Update circles
    wrap.svg.selectAll('.circle')
      .data(wrap.formatted_data)
      .transition()
      .duration(trans_duration)
      .attr("r", function (d, i) {return wrap.r_c_max-(wrap.r_c_max-wrap.r_c_min)*i/(wrap.length-1);})
      
    //-- Update dots
    wrap.svg.selectAll('.dot')
      .data(wrap.formatted_data)
      .transition()
      .duration(trans_duration)
      .attr("r", 0)
    
    //-- Update baseline
    wrap.svg.selectAll(wrap.id+'_timeline_baseline')
      .transition()
      .duration(trans_duration)
      .attr('opacity', 0)
      
    //-- Title
    wrap.svg.selectAll('.title')
      .transition()
      .duration(trans_duration)
      .attr("x", 10)
      .attr("y", function (d, i) {return 20 + i*20})
      
    for (i=0; i<wrap.length; i++) {
      //-- Update circle texts
      wrap['circle_text_'+i] = active_list[i];
      wrap.svg.selectAll(wrap.id+'_circle_text_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", active_list[i])
      wrap.svg.selectAll(wrap.id+'_circle_line_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", wrap.line_alpha*active_list[i])
        
      //-- Update timeline texts
      wrap['timeline_text_'+i] = 0;
      wrap.svg.selectAll(wrap.id+'_timeline_text_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", 0)
      wrap.svg.selectAll(wrap.id+'_timeline_line_'+i)
        .transition()
        .duration(trans_duration)
        .attr("opacity", wrap.line_alpha*0)
    }
  }
}

//-- Global variable
var CT_latest_wrap = {};

//-- ID
CT_latest_wrap.tag = 'criteria_timeline_latest'
CT_latest_wrap.id = '#' + CT_latest_wrap.tag

//-- File path
CT_latest_wrap.dataPathList = [
  "processed_data/criteria_timeline.csv"
];

//-- Tooltip
CT_latest_wrap.tooltip = d3.select(CT_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters

//-- Variables
CT_latest_wrap.doFull = 0;
CT_latest_wrap.doTimeline = 1;

//-- Plot
function CT_Latest_Plot() {
  d3.csv(CT_latest_wrap.dataPathList[0], function (error, data) {
    if (error) return console.warn(error);
    
    CT_Make_Canvas(CT_latest_wrap);
    CT_Format_Data(CT_latest_wrap, data);
    CT_Initialize(CT_latest_wrap);
    CT_Update(CT_latest_wrap);
  });
}

CT_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CT_latest_wrap.tag + "_doFull']", function (event) {
  CT_latest_wrap.doFull = this.value;
  
  CT_Update(CT_latest_wrap);
});

$(document).on("change", "input:radio[name='" + CT_latest_wrap.tag + "_doTimeline']", function (event) {
  CT_latest_wrap.doTimeline = this.value;
  
  CT_Update(CT_latest_wrap);
});

//-- Save button
d3.select(CT_latest_wrap.id + '_save').on('click', function () {
  var tag1, tag2;
  
  if (CT_latest_wrap.doTimeline == 1) tag1 = 'timeline';
  else tag1 = 'disks';
  
  if (CT_latest_wrap.doFull == 1) tag2 = 'full';
  else if (CT_latest_wrap.doFull == 2) tag2 = 'custom';
  else tag2 = 'selected';
  
  name = CT_latest_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CT_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='policy_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CT_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  CT_Latest_Plot();
});
