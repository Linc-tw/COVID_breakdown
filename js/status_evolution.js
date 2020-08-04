var SE_wrap = {};
SE_wrap.tag = 'status_evolution'
SE_wrap.id = '#' + SE_wrap.tag
SE_wrap.dataPathList = [
  "processed_data/status_evolution.csv"
];

function SE_makeCanvas() {
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
  
  var margin = {left: 70, right: 2, bottom: bottom, top: 2};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(SE_wrap.id)
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
  
  SE_wrap.totWidth = totWidth;
  SE_wrap.totHeight = totHeight;
  SE_wrap.margin = margin;
  SE_wrap.width = width;
  SE_wrap.height = height;
  SE_wrap.corner = corner;
  SE_wrap.svg = svg;
}

function SE_formatData(data) {
  //-- Settings for xticklabels
  var xlabel_path = 15;
  var q = data.length % xlabel_path;
//   var rList = [3, 3, 4, 1, 1, 2, 2];
//   var rList = [4, 5, 5, 1, 1, 2, 2, 3, 3, 4];
  var rList = [5, 5, 6, 6, 7, 7, 8, 1, 1, 2, 2, 3, 3, 4, 4];
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
  var ypath = 150;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Calculate separate sum
  var last = data.length - 1;
  var death = +data[last]['death'];
  while (death == 0) {
    last -= 1;
    death = +data[last]['death'];
  }
  
  var dis    = +data[last]['discharged'];
  var hosp   = +data[last]['hospitalized'];
  var lValue = [dis, hosp, death];
  
  SE_wrap.formattedData = formattedData;
  SE_wrap.dateList = dateList;
  SE_wrap.colTagList = colTagList;
  SE_wrap.nbCol = nbCol;
  SE_wrap.ymax = ymax;
  SE_wrap.xtick = xtick;
  SE_wrap.xticklabel = xticklabel;
  SE_wrap.ytick = ytick;
  SE_wrap.lValue = lValue;
}

//-- Tooltip
var SE_tooltip = d3.select(SE_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function SE_mouseover(d) {
  SE_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function SE_getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - SE_wrap.corner[i][0])**2 + (d[1] - SE_wrap.corner[i][1])**2;
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
  var xPos = d[0] * (1-xAlpha) + SE_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + SE_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(SE_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / SE_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / SE_wrap.totHeight;
  
  xPos = (xPos + SE_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + SE_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function SE_mousemove(d) {
  var newPos = SE_getTooltipPos(d3.mouse(this));
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = d.x + "<br>解隔離 = " + d.h1+ "<br>隔離中 = " + d.h2 + "<br>死亡 = " + d.h3 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3)
  else if (lang == 'fr')
    tooltipText = d.x + "<br>Rétablis = " + d.h1+ "<br>Hospitalisés = " + d.h2 + "<br>Décédés = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  else
    tooltipText = d.x + "<br>Discharged = " + d.h1+ "<br>Hospitalized = " + d.h2 + "<br>Deaths = " + d.h3 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3)
  
  SE_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function SE_mouseleave(d) {
  SE_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function SE_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, SE_wrap.width])
    .domain(SE_wrap.dateList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return SE_wrap.xticklabel[i]});
  
  SE_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + SE_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, SE_wrap.dateList.length])
    .range([0, SE_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(SE_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  SE_wrap.svg.append("g")
    .attr("transform", "translate(0," + SE_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, SE_wrap.ymax])
    .range([SE_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-SE_wrap.width)
    .tickValues(SE_wrap.ytick)
  
  SE_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  SE_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + SE_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '案例數';
  else if (lang == 'fr') ylabel = 'Nombre de cas';
  else ylabel = 'Number of cases';
  SE_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-SE_wrap.margin.left*0.75).toString() + ", " + (SE_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = cList.slice(0, SE_wrap.nbCol);
  var colTagList = SE_wrap.colTagList.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(colTagList)
    .range(colorList);
  
  //-- Bar
  var bar = SE_wrap.svg.selectAll('.content.bar')
    .data(SE_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", SE_mouseover)
    .on("mousemove", SE_mousemove)
    .on("mouseleave", SE_mouseleave)

  SE_wrap.colorList = colorList;
  SE_wrap.bar = bar;
}

function SE_update() {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, SE_wrap.ymax])
    .range([SE_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-SE_wrap.width)
    .tickValues(SE_wrap.ytick)
  
  SE_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  SE_wrap.bar.selectAll('.content.bar')
    .data(SE_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = SE_wrap.colorList.slice();
  colorList.push('#000000');
  
  //-- Legend - value
  var lPos = {x: 70, y: 45, dx: 12, dy: 30};
  var lValue = SE_wrap.lValue.slice();
  var sum = lValue.reduce((a, b) => a + b, 0);
  lValue.push(sum);
  
  SE_wrap.svg.selectAll(".legend.value")
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
    lLabel = ["解隔離", "隔離中", "死亡", "合計"];
  }
  else if (lang == 'fr') {
    lLabel = ["Rétablis", "Hospitalisés", "Décédés", "Total"];
  }
  else {
    lLabel = ["Discharged", "Hospitalized", "Deaths", 'Total'];
  }
  
  SE_wrap.svg.selectAll(".legend.label")
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

d3.csv(SE_wrap.dataPathList[0], function(error, data) {
  if (error) return console.warn(error);
  
  SE_makeCanvas();
  SE_formatData(data);
  SE_initialize();
  SE_update();
});

d3.select(SE_wrap.id + '_button_1').on('click', function(){
  name = SE_wrap.tag + '_' + lang + '.png'
  saveSvgAsPng(d3.select(SE_wrap.id).select('svg').node(), name);
});

