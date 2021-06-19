
//-- Filename:
//--   criteria_timeline.js
//--
//-- Author:
//--   Chieh-An Lin

function CT_MakeCanvas(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 540;
  wrap.tot_height_['fr'] = 540;
  wrap.tot_height_['en'] = 540;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 0, right: 0, bottom: 0, top: 0};
  wrap.margin_['fr'] = {left: 0, right: 0, bottom: 0, top: 0};
  wrap.margin_['en'] = {left: 0, right: 0, bottom: 0, top: 0};
  
  GS_MakeCanvas(wrap);
}

function CT_FormatData(wrap, data) {
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.length = data.length;
}

function CT_GetTooltipPos(wrap, d) {
  //-- Get position
  var x_pos = d[0];
  var y_pos = d[1];
  
  //-- Calculate the adjustment from card header, card body, & buttons
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var card_hdr = 3.125*16; //-- Offset caused by card-header
  var svg_dim = d3.select(wrap.id).node().getBoundingClientRect();
  var x_aspect = (svg_dim.width - 2*buffer) / wrap.tot_width;
  var y_aspect = (svg_dim.height - 2*buffer) / wrap.tot_height;
  
  //-- Update position
  x_pos = (x_pos + wrap.margin.left) * x_aspect + buffer;
  y_pos = (y_pos + wrap.margin.top) * y_aspect + buffer + card_hdr + button;
  
  //-- Intentional adjustment
  x_pos = x_pos + 10;
  y_pos = y_pos - 40;
  return [x_pos, y_pos];
}

function CT_MouseMove(wrap, d) {
  //-- Get tooltip position
  var new_pos = CT_GetTooltipPos(wrap, d3.mouse(d3.event.target));
  
  //-- Define tooltip texts
  var tooltip_text;
  if (GS_lang == 'zh-tw')
    tooltip_text = '點我'
  else if (GS_lang == 'fr')
    tooltip_text = 'Cliquez'
  else
    tooltip_text = 'Click me'
  
  //-- Generate tooltip
  wrap.tooltip
    .html(tooltip_text)
    .style("left", new_pos[0] + "px")
    .style("top", new_pos[1] + "px")
}

//-- Click
function CT_Click_Circle(wrap, d, i) {
  var trans_duration = 200;
  var j = wrap.length - 1 - i;
  var alpha = 1 - wrap['circle_text_'+j];
  
  //-- Update text
  wrap.svg.selectAll(wrap.id+'_circle_text_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", alpha);
  
  //-- Update line
  wrap.svg.selectAll(wrap.id+'_circle_line_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", wrap.line_alpha*alpha)
  
  //-- Save to wrapper
  wrap.full = 2;
  wrap['circle_text_'+j] = alpha;
}

function CT_Click_Timeline(wrap, d, j) {
  var trans_duration = 200;
  var alpha = 1 - wrap['timeline_text_'+j];
  
  //-- Update text
  wrap.svg.selectAll(wrap.id+'_timeline_text_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", alpha);
  
  //-- Update line
  wrap.svg.selectAll(wrap.id+'_timeline_line_'+j)
    .transition()
    .duration(trans_duration)
    .attr("opacity", wrap.line_alpha*alpha)
  
  //-- Save to wrapper
  wrap.full = 2;
  wrap['timeline_text_'+j] = alpha;
}

function CT_Initialize(wrap) {
  //-- Add tooltip
  GS_MakeTooltip(wrap);
  
  //-- Define title
  var title;
  if (GS_lang == 'zh-tw')
    title = ['台灣針對嚴重特殊傳染性肺炎之', '採檢標準暨其生效日期變化圖'];
  else if (GS_lang == 'fr')
    title = ['Antécédents de voyage, symptômes et autres', 'conditions avec lesquelles Taïwan dépiste', "systématiquement & leurs dates d'effet"];
  else
    title = ['Travel history, symptoms, & other conditions', 'with which Taiwan tests systematically &', 'their starting dates'];
  
  //-- Add title
  wrap.svg.selectAll(".title")
    .data(title)
    .enter()
    .append("text")
      .attr("class", "title")
      .attr("x", 0.5*wrap.width-150)
      .attr("y", function (d, i) {return 0.5*wrap.height-20 + i*20;})
      .attr("fill", 'black')
      .text(function (d) {return d;})
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "bottom")
  
  //-- Define color
  var color = d3.scaleLinear()
    .domain([0, 0.25*(wrap.length-1), 0.5*(wrap.length-1), 0.75*(wrap.length-1), wrap.length-1])
    .range(['#AA0033', '#BB8866', '#AAAA99', '#5588AA', '#002299']);
  
  //-- Timeline
  
  //-- Define timeline text x position
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
  
  //-- Define timeline text y position
  var y_list_t = [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0];
  
  //-- Define timeline parameters
  var x0_t = 130;
  var dx_t = 20;
  var text = wrap.svg.append("g");
  var line = wrap.svg.append("g");
  var line_alpha = 0.35;
  var i, date, split;
  
  //-- Loop over items
  for (i=0; i<wrap.length; i++) {
    wrap['timeline_text_'+i] = 0; //-- Hide all
    date = wrap.formatted_data[i]['date'];
    
    //-- Split text into multiple lines
    split = wrap.formatted_data[i][GS_lang].split('\n');
    if (date == '2020-01-25' || date == '2020-03-17' || date == '2020-03-19')
      split = [split.join(' ')]
    if (date == '2020-02-16' && GS_lang == 'fr')
      split = [split[0]+' '+split[1], split[2]+' '+split[3]]
    if (date == '2020-02-29' && GS_lang == 'fr')
      split = [split[0], split[1], split[2]+' '+split[3]]
    
    //-- Add timeline date
    text.append("text")
      .attr("class", "content text")
      .attr("x", x0_t-dx_t)
      .attr("y", function (d, j) {return wrap.height*(i+0.5)/wrap.length+j*15;})
      .attr("fill", function (d) {return color(i);})
      .attr("opacity", wrap['timeline_text_'+i])
      .attr("id", function (d, j) {return wrap.tag+'_timeline_text_'+i;})
      .text(date)
      .attr("text-anchor", 'end')
      .attr("dominant-baseline", "middle")
        
    //-- Add timeline text
    text.selectAll()
      .data(split)
      .enter()
      .append("text")
        .attr("class", "content text")
        .attr("x", x0_t+dx_t+x_list_t[i])
        .attr("y", function (d, j) {return wrap.height*(i+0.5)/wrap.length+j*15;})
        .attr("fill", function (d) {return color(i);})
        .attr("opacity", wrap['timeline_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_timeline_text_'+i;})
        .text(function (d) {return d;})
        .attr("text-anchor", 'start')
        .attr("dominant-baseline", "middle")
        
    //-- Add timeline line
    if (x_list_t[i] > 0) {
      y1 = wrap.height*(i+0.5)/wrap.length;
      y2 = wrap.height*(i+0.5)/wrap.length+y_list_t[i];
      line.append("polyline")
        .attr("points", (x0_t+0.75*dx_t)+','+y1+' '+(x0_t+0.5*dx_t+x_list_t[i])+','+y2)
        .attr("opacity", line_alpha*wrap['timeline_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_timeline_line_'+i;})
        .attr("stroke", GS_wrap.gray)
        .attr("stroke-width", 1)
        .attr('fill', 'none')
    }
  }
  
  //-- Add timeline baseline
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
  
  //-- Add timeline dot
  dot.selectAll(".dot")
    .data(wrap.formatted_data)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .attr("cx", x0_t)
      .attr("cy", function (d, i) {return wrap.height*(i+0.5)/wrap.length;})
      .attr("fill", function (d, i) {return color(i);})
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("click", function (d, j) {CT_Click_Timeline(wrap, d, j);})
      .on("mouseover", function (d) {GS_MouseOver3(wrap, d);})
      .on("mousemove", function (d) {CT_MouseMove(wrap, d);})
      .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})
  
  //-- Circle
  
  //-- Define circle parameters
  var r_c_min = 30;
  var r_c_max = 195;
  var x0_c = 210;
  var y0_c = wrap.height*0.6;
  var dy_c = 0.5;
  
  //-- Add circle
  wrap.svg.append("g")
    .selectAll(".circle")
    .data(wrap.formatted_data)
    .enter()
    .append("circle")
      .attr("class", "circle")
      .attr("r", 0)
      .attr("cx", x0_c)
      .attr("cy", function (d, i) {return y0_c-(r_c_max-r_c_min)*i/(wrap.length-1)+dy_c*i;})
      .attr("fill", function (d, i) {return color(wrap.length-1-i);})
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 0.3)
      .on("click", function (d, i) {CT_Click_Circle(wrap, d, i);})
      .on("mouseover", function (d) {GS_MouseOver3(wrap, d);})
      .on("mousemove", function (d) {CT_MouseMove(wrap, d);})
      .on("mouseleave", function (d) {GS_MouseLeave(wrap, d);})
  
  //-- Define circle text position
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
  
  //-- Define circle parameters
  var line_2 = wrap.svg.append("g");
  var x1, y1, y2, anchor;
  
  //-- Loop over items
  for (i=0; i<wrap.length; i++) {
    wrap['circle_text_'+i] = 0; //-- Hide all
    
    //-- Split text into multiple lines
    if (i > 12)
      split = (wrap.formatted_data[i]['date'] + ' ' + wrap.formatted_data[i][GS_lang]).split('\n');
    else
      split = (wrap.formatted_data[i]['date'] + '\n' + wrap.formatted_data[i][GS_lang]).split('\n');
    
    //-- Fine-tuning
    x1 = x_list_c[i] ? wrap.width-10 : 2*x0_c+20;
    anchor = x_list_c[i] ? 'end' : 'start';
    
    //-- Add circle text
    text.selectAll()
      .data(split)
      .enter()
      .append("text")
        .attr("class", "content text")
        .attr("x", x1)
        .attr("y", function (d, j) {return wrap.height*(i+0.5)/wrap.length+j*15+y_list_c[i];})
        .attr("fill", function (d) {return color(i);})
        .attr("opacity", wrap['circle_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_circle_text_'+i;})
        .text(function (d) {return d;})
        .attr("text-anchor", anchor)
        .attr("dominant-baseline", "middle")
        
    //-- Add circle line
    if (x_list_c[i] == 0) {
      y1 = y0_c+r_c_max - 2*(r_c_max-r_c_min)*(wrap.length-1-(i-0.45))/(wrap.length-1) + dy_c*(wrap.length-1-(i-0.45));
      y2 = wrap.height*(i+0.5)/wrap.length+y_list_c[i];
      line_2.append("polyline")
        .attr("points", x0_c+','+y1+' '+(x1-60)+','+y2+' '+(x1-5)+','+y2)
        .attr("opacity", line_alpha*wrap['circle_text_'+i])
        .attr("id", function (d, j) {return wrap.tag+'_circle_line_'+i;})
        .attr("stroke", GS_wrap.gray)
        .attr("stroke-width", 1)
        .attr('fill', 'none')
    }
  }
  
  //-- Save to wrapper
  wrap.r_c_min = r_c_min;
  wrap.r_c_max = r_c_max;
  wrap.line_alpha = line_alpha;
}

function CT_Update(wrap) {
  var i, active_list;
  
  //-- Switch state to selected
  if (wrap.full == 0)
    active_list = [1,0,0,1,0,  0,1,1,0,1,  0,0,1,1,1,  0,1,1,1];
  
  //-- Switch state to full
  else if (wrap.full == 1)
    active_list = [1,1,1,1,1,  1,1,1,1,1,  1,1,1,1,1,  1,1,1,1];
  
  //-- Switch state to custom
  else {
    active_list = []
    
    //-- Was circle before
    if (wrap.timeline == 1) {
      for (i=0; i<wrap.length; i++)
        active_list.push(wrap['circle_text_'+i])
    }
    
    //-- Was timeline before
    else {
      for (i=0; i<wrap.length; i++)
        active_list.push(wrap['timeline_text_'+i])
    }
  }
  
  //-- If timeline
  if (wrap.timeline == 1) {
    //-- Update circle
    wrap.svg.selectAll('.circle')
      .data(wrap.formatted_data)
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr("r", 0)
      
    //-- Update dot
    wrap.svg.selectAll('.dot')
      .data(wrap.formatted_data)
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr("r", 5)
    
    //-- Update baseline
    wrap.svg.selectAll(wrap.id+'_timeline_baseline')
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr('opacity', 1)
    
    //-- Define title parameters
    var title_x_t, title_y0_t, title_y1_t;
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
    
    //-- Update title
    wrap.svg.selectAll('.title')
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr("x", title_x_t)
      .attr("y", function (d, i) {return title_y0_t + title_y1_t*i;})
      
    //-- Loop over items
    for (i=0; i<wrap.length; i++) {
      //-- Update circle state
      wrap['circle_text_'+i] = 0;
      
      //-- Update circle text
      wrap.svg.selectAll(wrap.id+'_circle_text_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", 0)
        
      //-- Update circle line
      wrap.svg.selectAll(wrap.id+'_circle_line_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", wrap.line_alpha*0)
        
      //-- Update timeline state
      wrap['timeline_text_'+i] = active_list[i];
        
      //-- Update timeline text
      wrap.svg.selectAll(wrap.id+'_timeline_text_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", active_list[i])
        
      //-- Update timeline line
      wrap.svg.selectAll(wrap.id+'_timeline_line_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", wrap.line_alpha*active_list[i])
    }
  }
  
  
  //-- If circle
  else {
    //-- Update circle
    wrap.svg.selectAll('.circle')
      .data(wrap.formatted_data)
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr("r", function (d, i) {return wrap.r_c_max-(wrap.r_c_max-wrap.r_c_min)*i/(wrap.length-1);})
      
    //-- Update dot
    wrap.svg.selectAll('.dot')
      .data(wrap.formatted_data)
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr("r", 0)
    
    //-- Update baseline
    wrap.svg.selectAll(wrap.id+'_timeline_baseline')
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr('opacity', 0)
      
    //-- Update title
    wrap.svg.selectAll('.title')
      .transition()
      .duration(GS_wrap.trans_duration)
      .attr("x", 10)
      .attr("y", function (d, i) {return 20 + i*20;})
      
    //-- Loop over items
    for (i=0; i<wrap.length; i++) {
      //-- Update circle state
      wrap['circle_text_'+i] = active_list[i];
      
      //-- Update circle text
      wrap.svg.selectAll(wrap.id+'_circle_text_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", active_list[i])
      
      //-- Update circle line
      wrap.svg.selectAll(wrap.id+'_circle_line_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", wrap.line_alpha*active_list[i])
        
      //-- Update timeline state
      wrap['timeline_text_'+i] = 0;
        
      //-- Update timeline text
      wrap.svg.selectAll(wrap.id+'_timeline_text_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", 0)
        
      //-- Update timeline line
      wrap.svg.selectAll(wrap.id+'_timeline_line_'+i)
        .transition()
        .duration(GS_wrap.trans_duration)
        .attr("opacity", wrap.line_alpha*0)
    }
  }
}

//-- Plot
function CT_Plot(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      CT_MakeCanvas(wrap);
      CT_FormatData(wrap, data);
      CT_Initialize(wrap);
      CT_Update(wrap);
    });
}

function CT_ButtonListener(wrap) {
  //-- Selected or full
  $(document).on("change", "input:radio[name='" + wrap.tag + "_full']", function (event) {
    GS_PressRadioButton(wrap, 'full', wrap.full, this.value);
    wrap.full = this.value;
    CT_Update(wrap);
  });

  //-- Timeline or disks
  $(document).on("change", "input:radio[name='" + wrap.tag + "_timeline']", function (event) {
    GS_PressRadioButton(wrap, 'timeline', wrap.timeline, this.value);
    wrap.timeline = this.value;
    CT_Update(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1, tag2;
    
    if (wrap.timeline == 1)
      tag1 = 'timeline';
    else
      tag1 = 'disks';
    
    if (wrap.full == 1)
      tag2 = 'full';
    else if (wrap.full == 2)
      tag2 = 'custom';
    else
      tag2 = 'selected';
    
    name = wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language button
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Remove
    d3.selectAll(wrap.id+' .plot').remove();
    
    //-- Replot
    CT_Plot();
  });
}

//-- Main
function CT_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Swap active to current value
  wrap.full = document.querySelector("input[name='" + wrap.tag + "_full']:checked").value;
  wrap.timeline = document.querySelector("input[name='" + wrap.tag + "_timeline']:checked").value;
  GS_PressRadioButton(wrap, 'full', 0, wrap.full); //-- 0 from .html
  GS_PressRadioButton(wrap, 'timeline', 1, wrap.timeline); //-- 1 from .html
  
  //-- Plot
  CT_Plot(wrap);
  
  //-- Setup button listeners
  CT_ButtonListener(wrap);
}

//-- Global variable
var CT_wrap = {};

//-- ID
CT_wrap.tag = 'criteria_timeline'

//-- File path
CT_wrap.data_path_list = [
  "processed_data/criteria_timeline.csv"
];

//-- No parameters

//-- Main
CT_Main(CT_wrap);
