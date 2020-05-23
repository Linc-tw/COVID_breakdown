var CT_wrap = {};
CT_wrap.tag = 'criteria_timeline'
CT_wrap.id = '#' + CT_wrap.tag
CT_wrap.dataPathList = [
  "processed_data/criteria_timeline.csv"
];

function CT_makeCanvas() {
  var totWidth = 800;
  var totHeight = 540;
//   var totHeight, top;
//   if (lang == 'zh-tw') {
//     totHeight = 540;
//     left = 200;
//     top = 155;
//   }
//   else if (lang == 'fr') {
//     totHeight = 600;
//     left = 235;
//     top = 225;
//   }
//   else {
//     totHeight = 600;
//     left = 235;
//     top = 215;
//   }
  
  var margin = {left: 0, right: 0, bottom: 0, top: 0};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(CT_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  CT_wrap.totWidth = totWidth;
  CT_wrap.totHeight = totHeight;
  CT_wrap.margin = margin;
  CT_wrap.width = width;
  CT_wrap.height = height;
  CT_wrap.corner = corner;
  CT_wrap.svg = svg;
}

function CT_formatData(data) {
  CT_wrap.formattedData = data;
  CT_wrap.length = data.length;
}

//-- Tooltip
var CT_tooltip = d3.select(CT_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function CT_mouseover(d) {
  CT_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.6)
}

function CT_getTooltipPos(d) {
  var xPos = d[0];
  var yPos = d[1];
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(CT_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / CT_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / CT_wrap.totHeight;
  
  xPos = (xPos + CT_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + CT_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  xPos = xPos + 10;
  yPos = yPos - 40;
  return [xPos, yPos];
}

function CT_mousemove(d) {
  var newPos = CT_getTooltipPos(d3.mouse(this));
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = '點我'
  else if (lang == 'fr')
    tooltipText = 'Cliquez'
  else
    tooltipText = 'Click me'
  
  CT_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function CT_mouseleave(d) {
  CT_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

//-- Click
function CT_click_circle(d, i) {
  var j = CT_wrap.length - 1 - i;
  var transDuration = 200;
  var alpha = 1 - CT_wrap['circle_text_'+j];
  CT_wrap.doFull = 2;
  
  CT_wrap.svg.selectAll(CT_wrap.id+'_circle_text_'+j)
    .transition()
    .duration(transDuration)
    .attr("opacity", alpha);
  
  CT_wrap.svg.selectAll(CT_wrap.id+'_circle_line_'+j)
    .transition()
    .duration(transDuration)
    .attr("opacity", CT_wrap.lineAlpha*alpha)
  
  CT_wrap['circle_text_'+j] = alpha;
}

function CT_click_timeline(d, j) {
  var transDuration = 200;
  var alpha = 1 - CT_wrap['timeline_text_'+j];
  CT_wrap.doFull = 2;
  
  CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_text_'+j)
    .transition()
    .duration(transDuration)
    .attr("opacity", alpha);
  
  CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_line_'+j)
    .transition()
    .duration(transDuration)
    .attr("opacity", CT_wrap.lineAlpha*alpha)
  
  CT_wrap['timeline_text_'+j] = alpha;
}

function CT_initialize() {
  //-- Title
  var title;
  if (lang == 'zh-tw') title = ['台灣針對嚴重特殊傳染性肺炎之', '採檢標準暨其生效日期變化圖'];
  else if (lang == 'fr') title = ['Antécédents de voyage, symptômes et autres', 'conditions avec lesquelles Taïwan dépiste', "systématiquement & leurs dates d'effet"];
  else title = ['Travel history, symptoms, & other conditions', 'with which Taiwan tests systematically &', 'their starting dates'];
  
  CT_wrap.svg.selectAll(".title")
    .data(title)
    .enter()
    .append("text")
      .attr("class", "title")
      .attr("x", 0.5*CT_wrap.width-150)
      .attr("y", function(d, i) {return 0.5*CT_wrap.height-20 + i*20})
      .attr("fill", 'black')
      .text(function(d) {return d})
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "bottom")
  
  //-- Color
  var color = d3.scaleLinear().domain([0, 0.25*(CT_wrap.length-1), 0.5*(CT_wrap.length-1), 0.75*(CT_wrap.length-1), CT_wrap.length-1]).range(['#aa0033', '#bb8866', '#aaaa99', '#5588aa', '#002299']);
  
  //-- Timeline texts & lines
  var xList_t;
  if (lang == 'zh-tw') {
    xList_t = [
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
      0
    ];
  }
  else if (lang == 'fr') {
    xList_t = [
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
      0
    ];
  }
  else {
    xList_t = [
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
      0
    ];
  }
  var yList_t = [0, 0, 0, 0, 0,   0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0];
  var x0_t = 130;
  var dx_t = 20;
  
  var text = CT_wrap.svg.append("g");
  var line = CT_wrap.svg.append("g");
  var lineAlpha = 0.35;
  var i, date, split;
  
  for (i=0; i<CT_wrap.length; i++) {
    CT_wrap['timeline_text_'+i] = 0; //-- Hide all
    date = CT_wrap.formattedData[i]['date'];
    split = CT_wrap.formattedData[i][lang].split('\n');
    if (date == '2020-01-25' || date == '2020-03-17' || date == '2020-03-19')
      split = [split.join(' ')]
    if (date == '2020-02-16' && lang == 'fr')
      split = [split[0]+' '+split[1], split[2]+' '+split[3]]
    if (date == '2020-02-29' && lang == 'fr')
      split = [split[0], split[1], split[2]+' '+split[3]]
    
    //-- Timeline - date
    text.append("text")
      .attr("class", "content text")
      .attr("x", x0_t-dx_t)
      .attr("y", function(d, j) {return CT_wrap.height*(i+0.5)/CT_wrap.length+j*15})
      .attr("fill", function(d) {return color(i)})
      .attr("opacity", CT_wrap['timeline_text_'+i])
      .attr("id", function(d, j) {return CT_wrap.tag+'_timeline_text_'+i;})
      .text(date)
      .attr("text-anchor", 'end')
      .attr("dominant-baseline", "middle")
        
    //-- Timeline - text
    text.selectAll()
      .data(split)
      .enter()
      .append("text")
        .attr("class", "content text")
        .attr("x", x0_t+dx_t+xList_t[i])
        .attr("y", function(d, j) {return CT_wrap.height*(i+0.5)/CT_wrap.length+j*15})
        .attr("fill", function(d) {return color(i)})
        .attr("opacity", CT_wrap['timeline_text_'+i])
        .attr("id", function(d, j) {return CT_wrap.tag+'_timeline_text_'+i;})
        .text(function(d) {return d;})
        .attr("text-anchor", 'start')
        .attr("dominant-baseline", "middle")
        
    //-- Timeline - line
    if (xList_t[i] > 0) {
      y1 = CT_wrap.height*(i+0.5)/CT_wrap.length;
      y2 = CT_wrap.height*(i+0.5)/CT_wrap.length+yList_t[i];
      line.append("polyline")
        .attr("points", (x0_t+0.75*dx_t)+','+y1+' '+(x0_t+0.5*dx_t+xList_t[i])+','+y2)
        .attr("opacity", lineAlpha*CT_wrap['timeline_text_'+i])
        .attr("id", function(d, j) {return CT_wrap.tag+'_timeline_line_'+i;})
        .attr("stroke", '#bbb')
        .attr("stroke-width", 1)
        .attr('fill', 'none')
    }
  }
  
  //-- Timeline - baseline
  var dot = CT_wrap.svg.append("g");
  
  dot.append("line")
    .attr("x1", x0_t)
    .attr("y1", CT_wrap.height*0.5/CT_wrap.length)
    .attr("x2", x0_t)
    .attr("y2", CT_wrap.height*(CT_wrap.length-0.5)/CT_wrap.length)
    .attr("opacity", 0)
    .attr('id', CT_wrap.tag+'_timeline_baseline')
    .attr("stroke", "black")
    .attr("stroke-width", 1)
  
  //-- Timeline - dot
  dot.selectAll(".dot")
    .data(CT_wrap.formattedData)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .attr("cx", x0_t)
      .attr("cy", function(d, i) {return CT_wrap.height*(i+0.5)/CT_wrap.length})
      .attr("fill", function(d, i) {return color(i)})
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("click", CT_click_timeline)
      .on("mouseover", CT_mouseover)
      .on("mousemove", CT_mousemove)
      .on("mouseleave", CT_mouseleave)
  
  //-- Circle - circle
  var r_c_min = 30;
  var r_c_max = 195;
  var x0_c = 210;
  var y0_c = CT_wrap.height*0.6;
  var dy_c = 0.5;
  
  CT_wrap.svg.append("g")
    .selectAll(".circle")
    .data(CT_wrap.formattedData)
    .enter()
    .append("circle")
      .attr("class", "circle")
      .attr("r", 0)
      .attr("cx", x0_c)
      .attr("cy", function(d, i) {return y0_c-(r_c_max-r_c_min)*i/(CT_wrap.length-1)+dy_c*i})
      .attr("fill", function(d, i) {return color(CT_wrap.length-1-i)})
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 0.3)
      .on("click", CT_click_circle)
      .on("mouseover", CT_mouseover)
      .on("mousemove", CT_mousemove)
      .on("mouseleave", CT_mouseleave)
  
  //-- Circle texts & lines
  var xList_c, yList_c;
  if (lang == 'zh-tw') {
    xList_c = [
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
      0
    ];
    yList_c = [
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
      0
    ];
  }
  else if (lang == 'fr') {
    xList_c = [
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
      0
    ];
    yList_c = [
      0, 
          10, 20, 
      -15, 
          5, 15,
      -35, 
      -25, 
          -20, 
      -25, 
          -5, 55, 
      -20, 
      5, 
      15, 
      10, 
      5, 
      0
    ];
  }
  else {
    xList_c = [
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
      0
    ];
    yList_c = [
      0, 
          10, 20, 
      -15, 
          5, 15,
      -35, 
      -25, 
          -20, 
      -25, 
          -15, 25, 
      10, 
      20, 
      15, 
      10, 
      5, 
      0
    ];
  }
  var line2 = CT_wrap.svg.append("g");
  var x1, y1, y2, anchor;
  
  for (i=0; i<CT_wrap.length; i++) {
    CT_wrap['circle_text_'+i] = 0; //-- Hide all
    if (i > 12)
      split = (CT_wrap.formattedData[i]['date'] + ' ' + CT_wrap.formattedData[i][lang]).split('\n');
    else
      split = (CT_wrap.formattedData[i]['date'] + '\n' + CT_wrap.formattedData[i][lang]).split('\n');
    x1 = xList_c[i] ? CT_wrap.width-10 : 2*x0_c+20;
    anchor = xList_c[i] ? 'end' : 'start';
    
    //-- Circle - text
    text.selectAll()
      .data(split)
      .enter()
      .append("text")
        .attr("class", "content text")
        .attr("x", x1)
        .attr("y", function(d, j) {return CT_wrap.height*(i+0.5)/CT_wrap.length+j*15+yList_c[i]})
        .attr("fill", function(d) {return color(i)})
        .attr("opacity", CT_wrap['circle_text_'+i])
        .attr("id", function(d, j) {return CT_wrap.tag+'_circle_text_'+i;})
        .text(function(d) {return d;})
        .attr("text-anchor", anchor)
        .attr("dominant-baseline", "middle")
        
    //-- Circle - line
    if (xList_c[i] == 0) {
      y1 = y0_c+r_c_max - 2*(r_c_max-r_c_min)*(CT_wrap.length-1-(i-0.45))/(CT_wrap.length-1) + dy_c*(CT_wrap.length-1-(i-0.45));
      y2 = CT_wrap.height*(i+0.5)/CT_wrap.length+yList_c[i];
      line2.append("polyline")
        .attr("points", x0_c+','+y1+' '+(x1-60)+','+y2+' '+(x1-5)+','+y2)
        .attr("opacity", lineAlpha*CT_wrap['circle_text_'+i])
        .attr("id", function(d, j) {return CT_wrap.tag+'_circle_line_'+i;})
        .attr("stroke", '#bbb')
        .attr("stroke-width", 1)
        .attr('fill', 'none')
    }
  }
  
  CT_wrap.r_c_min = r_c_min;
  CT_wrap.r_c_max = r_c_max;
  CT_wrap.lineAlpha = lineAlpha;
}

function CT_update() {
  var transDuration = 800;
  var i, activeList;
  
  if (CT_wrap.doFull == 0)
    activeList = [1,0,0,1,0,  0,1,1,0,1,  0,0,1,1,1,  1,1,1];
  else if (CT_wrap.doFull == 1)
    activeList = [1,1,1,1,1,  1,1,1,1,1,  1,1,1,1,1,  1,1,1];
  
  //-- Custom
  else {
    activeList = []
    
    //-- Was circle before
    if (CT_wrap.doTimeline == 1) {
      for (i=0; i<CT_wrap.length; i++)
        activeList.push(CT_wrap['circle_text_'+i])
    }
    //-- Was timeline before
    else {
      for (i=0; i<CT_wrap.length; i++)
        activeList.push(CT_wrap['timeline_text_'+i])
    }
  }
  
  if (CT_wrap.doTimeline == 1) {
    //-- Update circles
    CT_wrap.svg.selectAll('.circle')
      .data(CT_wrap.formattedData)
      .transition()
      .duration(transDuration)
      .attr("r", 0)
      
    //-- Update dots
    CT_wrap.svg.selectAll('.dot')
      .data(CT_wrap.formattedData)
      .transition()
      .duration(transDuration)
      .attr("r", 5)
    
    //-- Update baseline
    CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_baseline')
      .transition()
      .duration(transDuration)
      .attr('opacity', 1)
    
    //-- Title
    if (lang == 'zh-tw') {
      tx_t = CT_wrap.width - 270;
      ty0_t = CT_wrap.height - 100;
      ty1_t = 20;
    }
    else if (lang == 'fr') {
      tx_t = CT_wrap.width - 346;
      ty0_t = CT_wrap.height - 80;
      ty1_t = 20;
    }
    else {
      tx_t = CT_wrap.width - 346;
      ty0_t = CT_wrap.height - 80;
      ty1_t = 20;
    }
    
    CT_wrap.svg.selectAll('.title')
      .transition()
      .duration(transDuration)
      .attr("x", tx_t)
      .attr("y", function(d, i) {return ty0_t + ty1_t*i})
      
    for (i=0; i<CT_wrap.length; i++) {
      //-- Update circle texts
      CT_wrap['circle_text_'+i] = 0;
      CT_wrap.svg.selectAll(CT_wrap.id+'_circle_text_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", 0)
      CT_wrap.svg.selectAll(CT_wrap.id+'_circle_line_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", CT_wrap.lineAlpha*0)
        
      //-- Update timeline texts
      CT_wrap['timeline_text_'+i] = activeList[i];
      CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_text_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", activeList[i])
      CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_line_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", CT_wrap.lineAlpha*activeList[i])
    }
  }
  else {
    //-- Update circles
    CT_wrap.svg.selectAll('.circle')
      .data(CT_wrap.formattedData)
      .transition()
      .duration(transDuration)
      .attr("r", function(d, i) {return CT_wrap.r_c_max-(CT_wrap.r_c_max-CT_wrap.r_c_min)*i/(CT_wrap.length-1);})
      
    //-- Update dots
    CT_wrap.svg.selectAll('.dot')
      .data(CT_wrap.formattedData)
      .transition()
      .duration(transDuration)
      .attr("r", 0)
    
    //-- Update baseline
    CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_baseline')
      .transition()
      .duration(transDuration)
      .attr('opacity', 0)
      
    //-- Title
    CT_wrap.svg.selectAll('.title')
      .transition()
      .duration(transDuration)
      .attr("x", 10)
      .attr("y", function(d, i) {return 20 + i*20})
      
    for (i=0; i<CT_wrap.length; i++) {
      //-- Update circle texts
      CT_wrap['circle_text_'+i] = activeList[i];
      CT_wrap.svg.selectAll(CT_wrap.id+'_circle_text_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", activeList[i])
      CT_wrap.svg.selectAll(CT_wrap.id+'_circle_line_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", CT_wrap.lineAlpha*activeList[i])
        
      //-- Update timeline texts
      CT_wrap['timeline_text_'+i] = 0;
      CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_text_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", 0)
      CT_wrap.svg.selectAll(CT_wrap.id+'_timeline_line_'+i)
        .transition()
        .duration(transDuration)
        .attr("opacity", CT_wrap.lineAlpha*0)
    }
  }
}

CT_wrap.doFull = 0;
CT_wrap.doTimeline = 1;

d3.csv(CT_wrap.dataPathList[0], function(error, data) {
  if (error) return console.warn(error);
  
  CT_makeCanvas();
  CT_formatData(data);
  CT_initialize();
  CT_update();
});

//-- Buttons
$(document).on("change", "input:radio[name='" + CT_wrap.tag + "_doFull']", function(event) {
  CT_wrap.doFull = this.value;
  
  CT_update();
});

$(document).on("change", "input:radio[name='" + CT_wrap.tag + "_doTimeline']", function(event) {
  CT_wrap.doTimeline = this.value;
  
  CT_update();
});

d3.select(CT_wrap.id + '_button_5').on('click', function(){
  var tag1, tag2;
  
  if (CT_wrap.doTimeline == 1) tag1 = 'timeline';
  else tag1 = 'disks';
  
  if (CT_wrap.doFull == 1) tag2 = 'full';
  else if (CT_wrap.doFull == 2) tag2 = 'custom';
  else tag2 = 'selected';
  
  name = CT_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(CT_wrap.id).select('svg').node(), name);
});

