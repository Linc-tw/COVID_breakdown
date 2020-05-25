var BS_wrap = {};
BS_wrap.tag = 'border_statistics'
BS_wrap.id = '#' + BS_wrap.tag
BS_wrap.dataPathList = [
  "processed_data/border_statistics_entry.csv",
  "processed_data/border_statistics_exit.csv",
  "processed_data/border_statistics_both.csv"
];

function BS_makeCanvas() {
  var totWidth = 800;
  var totHeight;
  if (lang == 'zh-tw') {
    totHeight = 415;
    bottom = 105;
  }
  else if (lang == 'fr') {
    totHeight = 400;
    bottom = 90;
  }
  else {
    totHeight = 400;
    bottom = 90;
  }
  
  var margin = {left: 120, right: 2, bottom: bottom, top: 2};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(BS_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  BS_wrap.totWidth = totWidth;
  BS_wrap.totHeight = totHeight;
  BS_wrap.margin = margin;
  BS_wrap.width = width;
  BS_wrap.height = height;
  BS_wrap.corner = corner;
  BS_wrap.svg = svg;
}

function BS_formatData(data) {
  //-- Settings for xticklabels
  var xlabel_path = 10;
  var q = data.length % xlabel_path;
  var rList = [4, 5, 5, 1, 1, 2, 2, 3, 3, 4];
  var r = rList[q];
  var xtick = [];
  var xticklabel = [];
  var ymax = 0;
  
  var colTagList = data.columns.slice(1);
  var nbCol = colTagList.length;
  var dateList = [];
  var formattedData = [];
  var i, j, x, y, height, block;
  
  for (i=0; i<data.length; i++) {
    y = 0;
    x = data[i]["date"];
    dateList.push(x);
    
    for (j=0; j<nbCol; j++) {
      height = +data[i][colTagList[j]];
      block = {
        'x': x,
        'y0': y,
        'y1': y + height,
        'height': height,
        'h1': +data[i][colTagList[nbCol-1]],
        'h2': +data[i][colTagList[nbCol-2]],
        'h3': +data[i][colTagList[nbCol-3]],
        'col': colTagList[j]
      };
        
      y += height;
      formattedData.push(block);
    }
    
    ymax = Math.max(ymax, y);
    
    if (i % xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(ISODateToMDDate(x));
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate ymax
  ymax *= 1.2;
  var ypath;
  if (BS_wrap.doExit == 0) ypath = 25000;
  else if (BS_wrap.doExit == 1) ypath = 25000;
  else                       ypath = 50000;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Calculate separate sum
  var air = +data[data.length-1]['airport'];
  var sea = +data[data.length-1]['seaport'];
  var NS  = +data[data.length-1]['not_specified'];
  var lValue = [air, sea, NS];
  
  BS_wrap.formattedData = formattedData;
  BS_wrap.dateList = dateList;
  BS_wrap.colTagList = colTagList;
  BS_wrap.nbCol = nbCol;
  BS_wrap.ymax = ymax;
  BS_wrap.xtick = xtick;
  BS_wrap.xticklabel = xticklabel;
  BS_wrap.ytick = ytick;
  BS_wrap.lValue = lValue;
}

//-- Tooltip
var BS_tooltip = d3.select(BS_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function BS_mouseover(d) {
  BS_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function BS_getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - BS_wrap.corner[i][0])**2 + (d[1] - BS_wrap.corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place the caption somewhere on the longest arm, parametrizaed by xAlpha & yAlpha
  var xAlpha = 0.1;
  var yAlpha = 0.5;
//   var xAlpha = 1;
//   var yAlpha = 1;
  var xPos = d[0] * (1-xAlpha) + BS_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + BS_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(BS_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / BS_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / BS_wrap.totHeight;
  
  xPos = (xPos + BS_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + BS_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function BS_mousemove(d) {
  var newPos = BS_getTooltipPos(d3.mouse(this));
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = d.x + "<br>機場 = " + d.h1+ "<br>港口 = " + d.h2 + "<br>無細節 = " + d.h3 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3)
  else if (lang == 'fr')
    tooltipText = d.x + "<br>Aéroports = " + d.h1+ "<br>Ports maritimes = " + d.h2 + "<br>Sans précisions = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  else
    tooltipText = d.x + "<br>Airports = " + d.h1+ "<br>Seaports = " + d.h2 + "<br>Not specified = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  
  BS_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function BS_mouseleave(d) {
  BS_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function BS_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, BS_wrap.width])
    .domain(BS_wrap.dateList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return BS_wrap.xticklabel[i]});
  
  BS_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + BS_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, BS_wrap.dateList.length])
    .range([0, BS_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(BS_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  BS_wrap.svg.append("g")
    .attr("transform", "translate(0," + BS_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, BS_wrap.ymax])
    .range([BS_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-BS_wrap.width)
    .tickValues(BS_wrap.ytick)
  
  BS_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  BS_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + BS_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '旅客人數';
  else if (lang == 'fr') ylabel = 'Nombre de voyageurs';
  else ylabel = 'Number of people';
  BS_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-BS_wrap.margin.left*0.75).toString() + ", " + (BS_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = cList.slice(0, BS_wrap.nbCol);
  var colTagList = BS_wrap.colTagList.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(colTagList)
    .range(colorList);
  
  //-- Bar
  var bar = BS_wrap.svg.selectAll('.content.bar')
    .data(BS_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", BS_mouseover)
    .on("mousemove", BS_mousemove)
    .on("mouseleave", BS_mouseleave)

  BS_wrap.colorList = colorList;
  BS_wrap.bar = bar;
}

function BS_update() {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, BS_wrap.ymax])
    .range([BS_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-BS_wrap.width)
    .tickValues(BS_wrap.ytick)
  
  BS_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  BS_wrap.bar.selectAll('.content.bar')
    .data(BS_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = BS_wrap.colorList.slice();
  colorList.push('#000000');
  
  //-- Legend - value
  var lPos = {x: 450, y: 45, dx: 12, dy: 30};
  var lValue = BS_wrap.lValue.slice();
  var sum = lValue.reduce((a, b) => a + b, 0);
  lValue.push(sum);
  
  BS_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(lValue)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", lPos.x)
      .attr("y", function(d,i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return colorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
  
  //-- Legend - label
  var lLabel;
  if (lang == 'zh-tw') {
    lLabel = ["機場", "港口", "無細節", "合計"];
  }
  else if (lang == 'fr') {
    lLabel = ["Aéroports", "Ports maritimes", "Sans précisions", "Total"];
  }
  else {
    lLabel = ["Airports", "Seaports", "Not specified", 'Total'];
  }
  
  BS_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(lLabel)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", lPos.x+lPos.dx)
      .attr("y", function(d, i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return colorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "start")
}

BS_wrap.doExit = 0;

d3.csv(BS_wrap.dataPathList[BS_wrap.doExit], function(error, data) {
  if (error) return console.warn(error);
  
  BS_makeCanvas();
  BS_formatData(data);
  BS_initialize();
  BS_update();
});

//-- Button listener
$(document).on("change", "input:radio[name='" + BS_wrap.tag + "_doExit']", function(event) {
  BS_wrap.doExit = this.value;
  
  d3.csv(BS_wrap.dataPathList[BS_wrap.doExit], function(error, data) {
    if (error) return console.warn(error);
    
    BS_formatData(data);
    BS_update();
  });
});

d3.select(BS_wrap.id + '_button_4').on('click', function(){
  var tag1;
  
  if (BS_wrap.doExit == 0)      tag1 = 'arrival';
  else if (BS_wrap.doExit == 1) tag1 = 'departure';
  else                          tag1 = 'both';

  name = BS_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(BS_wrap.id).select('svg').node(), name);
});

