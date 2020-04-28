var TBC_wrap = {};
TBC_wrap.tag = "test_by_criterion"
TBC_wrap.id = '#' + TBC_wrap.tag
TBC_wrap.dataPath = "processed_data/test_by_criterion.csv";

function TBC_makeCanvas() {
  var totWidth = 800;
  var totHeight;
  if (lang == 'zh-tw') {
    totHeight = 415;
    bottom = 105;
  }
  else {
    totHeight = 400;
    bottom = 90;
  }
  
  var margin = {left: 110, right: 2, bottom: bottom, top: 2};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(TBC_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  TBC_wrap.totWidth = totWidth;
  TBC_wrap.totHeight = totHeight;
  TBC_wrap.margin = margin;
  TBC_wrap.width = width;
  TBC_wrap.height = height;
  TBC_wrap.corner = corner;
  TBC_wrap.svg = svg;
}

function TBC_formatData(data) {
  //-- Settings for xticklabels
  var xlabel_path = 7;
  var q = data.length % xlabel_path;
  var rList = [3, 3, 4, 1, 1, 2, 2];
  var r = rList[q];
  var xtick = [];
  var xticklabel = [];
  var ymax = 0;
  
  var colTagList = data.columns.slice(1);
  var nbCol = colTagList.length;
  var dateList = [];
  var formattedData = [];
  var i, j, x, y, height, block;

  if (TBC_wrap.doCumul == 1) {
    cumsum(data, colTagList);
  }
  
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
  if (TBC_wrap.doCumul == 1) ypath = 20000;
  else                       ypath = 500;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Calculate seperate sum
  var ext, QT, clin;
  if (TBC_wrap.doCumul == 1) {
    ext = d3.max(formattedData, function(d) {if (d.col == 'extended') return +d.height;});
    QT = d3.max(formattedData, function(d) {if (d.col == 'quarantine') return +d.height;});
    clin = d3.max(formattedData, function(d) {if (d.col == 'clinical') return +d.height;});
  }
  else {
    ext = d3.sum(formattedData, function(d) {if (d.col == 'extended') return +d.height;});
    QT = d3.sum(formattedData, function(d) {if (d.col == 'quarantine') return +d.height;});
    clin = d3.sum(formattedData, function(d) {if (d.col == 'clinical') return +d.height;});
  }
  var lValue = [ext, QT, clin];
  
  TBC_wrap.formattedData = formattedData;
  TBC_wrap.dateList = dateList;
  TBC_wrap.colTagList = colTagList;
  TBC_wrap.nbCol = nbCol;
  TBC_wrap.ymax = ymax;
  TBC_wrap.xtick = xtick;
  TBC_wrap.xticklabel = xticklabel;
  TBC_wrap.ytick = ytick;
  TBC_wrap.lValue = lValue;
}

//-- Tooltip
var TBC_tooltip = d3.select(TBC_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function TBC_mouseover(d) {
  TBC_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function TBC_getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - TBC_wrap.corner[i][0])**2 + (d[1] - TBC_wrap.corner[i][1])**2;
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
  var xPos = d[0] * (1-xAlpha) + TBC_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + TBC_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(TBC_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / TBC_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / TBC_wrap.totHeight;
  
  xPos = (xPos + TBC_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + TBC_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function TBC_mousemove(d) {
  var newPos = TBC_getTooltipPos(d3.mouse(this));
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = d.x + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3) + "<br>擴大監測 = " + d.h1+ "<br>居家檢疫 = " + d.h2 + "<br>法定通報 = " + d.h3
  else
    tooltipText = d.x + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3) + "<br>Community = " + d.h1+ "<br>Quarantine = " + d.h2 + "<br>Clinical = " + d.h3
  
  
  TBC_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function TBC_mouseleave(d) {
  TBC_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function TBC_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, TBC_wrap.width])
    .domain(TBC_wrap.dateList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return TBC_wrap.xticklabel[i]});
  
  TBC_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + TBC_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, TBC_wrap.dateList.length])
    .range([0, TBC_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(TBC_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  TBC_wrap.svg.append("g")
    .attr("transform", "translate(0," + TBC_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, TBC_wrap.ymax])
    .range([TBC_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-TBC_wrap.width)
    .tickValues(TBC_wrap.ytick)
  
  TBC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  TBC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + TBC_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '檢驗數';
  else ylabel = 'Number of tests';
  TBC_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-TBC_wrap.margin.left*0.75).toString() + ", " + (TBC_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = cList.slice(0, TBC_wrap.nbCol);
  var colTagList = TBC_wrap.colTagList.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(colTagList)
    .range(colorList);
  
  //-- Bar
  var bar = TBC_wrap.svg.selectAll('.content.bar')
    .data(TBC_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", TBC_mouseover)
    .on("mousemove", TBC_mousemove)
    .on("mouseleave", TBC_mouseleave)

  TBC_wrap.colorList = colorList;
  TBC_wrap.bar = bar;
}

function TBC_update() {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, TBC_wrap.ymax])
    .range([TBC_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-TBC_wrap.width)
    .tickValues(TBC_wrap.ytick)
  
  TBC_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  TBC_wrap.bar.selectAll("rect")
    .data(TBC_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = TBC_wrap.colorList.slice();
  colorList.push('#000000');
  
  //-- Legend - value
  var lPos = {x: 95, y: 45, dx: 10, dy: 27};
  var lValue = TBC_wrap.lValue.slice();
  var sum = lValue.reduce((a, b) => a + b, 0);
  lValue.push(sum);
  
  TBC_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(lValue)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", lPos.x)
      .attr("y", function(d, i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return colorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
      
  //-- Legend - label
  var lLabel;
  if (lang == 'zh-tw') lLabel = ["擴大社區監測", "居家檢疫", "法定定義通報", "合計"];
  else lLabel = ['Possible community transmission', 'Quarantine (merged into clinical)', 'Suspicious clinical cases', "Total"];
  
  TBC_wrap.svg.selectAll(".legend.label")
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

TBC_wrap.doCumul = 0;;

d3.csv(TBC_wrap.dataPath, function(error, data) {
  if (error) return console.warn(error);
  
  TBC_makeCanvas();
  TBC_formatData(data);
  TBC_initialize();
  TBC_update();
});

//-- Button listener
$(document).on("change", "input:radio[name='" + TBC_wrap.tag + "_doCumul']", function(event) {
  TBC_wrap.doCumul = this.value;
  
  d3.csv(TBC_wrap.dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    TBC_formatData(data);
    TBC_update();
  });
});

d3.select(TBC_wrap.id + '_button_3').on('click', function(){
  var tag1;
  
  if (TBC_wrap.doCumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  
  name = TBC_wrap.tag + '_' + tag1 + '.png'
  saveSvgAsPng(d3.select(TBC_wrap.id).select('svg').node(), name);
});

