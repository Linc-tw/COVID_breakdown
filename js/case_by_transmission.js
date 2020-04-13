
//-- Convert date format
function ISODateToMDDate(ISODate) {
  var fmtStr;
  if (lang == 'zh-tw') fmtStr = "%-m月%-d日"
  else fmtStr = "%b %d"
  
  var MDDateFormat = d3.timeFormat(fmtStr);
  return MDDateFormat(d3.isoParse(ISODate));
}

function cumsum(data, colTagList) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<colTagList.length; j++) {
      data[i][colTagList[j]] = +data[i][colTagList[j]] + +data[i-1][colTagList[j]];
    }
  }
}

var DC_wrap = {};
DC_wrap.id = "#case_by_transmission"
DC_wrap.dataPathList = [
  "processed_data/case_by_transmission_by_report_day.csv",
  "processed_data/case_by_transmission_by_onset_day.csv"
];

function DC_makeCanvas() {
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
  
  var margin = {left: 70, right: 0, bottom: bottom, top: 0};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(DC_wrap.id)
    .append("svg")
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  DC_wrap.totWidth = totWidth;
  DC_wrap.totHeight = totHeight;
  DC_wrap.margin = margin;
  DC_wrap.width = width;
  DC_wrap.height = height;
  DC_wrap.corner = corner;
  DC_wrap.svg = svg;
}

function DC_formatData(data, doCumul) {
  //-- Settings for xticklabels
  var xlabel_path = 7;
  var q = data.length % xlabel_path;
  var rList = [3, 3, 4, 1, 1, 2, 2];
  var r = rList[q];
  var xtick = [];
  var xticklabel = [];
  var ymax = 0;
  
  var colTagList = data.columns.slice(1);
  var dateList = [];
  var formattedData = [];
  var i, j, x, y, height, block;

  if (doCumul == 1) {
    cumsum(data, colTagList);
  }
  
  for (i=0; i<data.length; i++) {
    y = 0;
    x = data[i]["date"];
    dateList.push(x);
    
    for (j=0; j<colTagList.length; j++) {
      height = +data[i][colTagList[j]];
      block = {
        'x': x,
        'y0': y,
        'y1': y + height,
        'height': height,
        'h1': +data[i][colTagList[2]],
        'h2': +data[i][colTagList[1]],
        'h3': +data[i][colTagList[0]],
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
  ymax *= 1.11;
  var ypath;
  if (doCumul == 1) ypath = 100; //Math.floor(ymax / 5);
  else              ypath = 5;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  DC_wrap.formattedData = formattedData;
  DC_wrap.dateList = dateList;
  DC_wrap.colTagList = colTagList;
  DC_wrap.ymax = ymax;
  DC_wrap.xtick = xtick;
  DC_wrap.xticklabel = xticklabel;
  DC_wrap.ytick = ytick;
}

//-- Tooltip
var tooltip = d3.select(DC_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function mouseover(d) {
  tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - DC_wrap.corner[i][0])**2 + (d[1] - DC_wrap.corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place the caption somewhere on the longest arm, parametrizaed by xAlpha & yAlpha
  var xAlpha = 0.1;
  var yAlpha = 0.5;
//   var yAlpha = 1;
  var xPos = d[0] * (1-xAlpha) + DC_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + DC_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(DC_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / DC_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / DC_wrap.totHeight;
  
  xPos = (xPos + DC_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + DC_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function mousemove(d) {
  var newPos = getTooltipPos(d3.mouse(this));
  var tootipText;
  
  if (lang == 'zh-tw')
    tootipText = d.x + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3) + "<br>境外移入 = " + d.h1+ "<br>本土已知 = " + d.h2 + "<br>本土未知 = " + d.h3
  else
    tootipText = d.x + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3) + "<br>Imported = " + d.h1+ "<br>Ind. linked = " + d.h2 + "<br>Ind. unlinked = " + d.h3
  
  
  tooltip
    .html(tootipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function mouseleave(d) {
  tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function DC_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, DC_wrap.width])
    .domain(DC_wrap.dateList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return DC_wrap.xticklabel[i]});
  
  DC_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + DC_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, DC_wrap.dateList.length])
    .range([0, DC_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(DC_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  DC_wrap.svg.append("g")
    .attr("transform", "translate(0," + DC_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, DC_wrap.ymax])
    .range([DC_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-DC_wrap.width)
    .tickValues(DC_wrap.ytick)
  
  DC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  DC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + DC_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '案例數';
  else ylabel = 'Number counts';
  DC_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-DC_wrap.margin.left*0.75).toString() + ", " + (DC_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  colorList = ['#3366BB', '#CC6677', '#55BB44']
  var color = d3.scaleOrdinal()
    .domain([DC_wrap.colTagList[2], DC_wrap.colTagList[1], DC_wrap.colTagList[0]])
    .range(colorList)
    
  //-- Legend
  var legendPos = {x: 90, y: 40, dx: 20, dy: 25, r: 7};
  
  //-- Legend - circles
  DC_wrap.svg.selectAll("dot")
    .data([0, 1, 2])
    .enter()
    .append("circle")
      .attr("class", "legend")
      .attr("cx", legendPos.x)
      .attr("cy", function(d,i) {return legendPos.y + i*legendPos.dy})
      .attr("r", legendPos.r)
      .style("fill", function(d) {return color(d)})
  
  //-- Legend - calculation for updates
  var totNb = d3.sum(DC_wrap.formattedData, function(d){return +d.height;});
  
  //-- Bar
  var bar = DC_wrap.svg.selectAll('.bar')
    .data(DC_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  DC_wrap.colorList = colorList;
  DC_wrap.color = color;
  DC_wrap.legendPos = legendPos;
  DC_wrap.totNb = totNb;
  DC_wrap.bar = bar;
}

function DC_update() {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, DC_wrap.ymax])
    .range([DC_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-DC_wrap.width)
    .tickValues(DC_wrap.ytick)
  
  DC_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  DC_wrap.bar.selectAll("rect")
    .data(DC_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = DC_wrap.color.range().slice();
  colorList.push('#000000');
  var domain = [-1, -2, -3, -4];
  
  if (DC_wrap.doOnset == 1) {
    colorList.splice(3, 0, '#999999');
    domain.push(-5);
  }
  var color = d3.scaleOrdinal()
    .domain(domain)
    .range(colorList);
  
  //-- Legend - texts
  var label;
  if (lang == 'zh-tw') {
    label = ["境外移入", "本土感染源已知", "本土感染源未知", "合計"];
    label_plus = '無資料';
  }
  else {
    label = ["Imported", "Indigenous linked to known cases", "Indigenous unlinked", "Total"];
    label_plus = 'No data';
  }
  if (DC_wrap.doOnset == 1) label.splice(3, 0, label_plus);
  
  DC_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", DC_wrap.legendPos.x+DC_wrap.legendPos.dx)
      .attr("y", function(d,i) {return DC_wrap.legendPos.y + i*DC_wrap.legendPos.dy + DC_wrap.legendPos.r})
      .style("fill", function(d) {return color(d)})
      .text(function(d) {return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  
  //-- Legend - total cases
  var Im_sum, IL_sum, IU_sum;
  if (DC_wrap.doCumul == 1) {
    Im_sum = d3.max(DC_wrap.formattedData, function(d){if (d.col == 'imported') return +d.height;});
    IL_sum = d3.max(DC_wrap.formattedData, function(d){if (d.col == 'linked') return +d.height;});
    IU_sum = d3.max(DC_wrap.formattedData, function(d){if (d.col == 'unlinked') return +d.height;});
  }
  else {
    Im_sum = d3.sum(DC_wrap.formattedData, function(d){if (d.col == 'imported') return +d.height;});
    IL_sum = d3.sum(DC_wrap.formattedData, function(d){if (d.col == 'linked') return +d.height;});
    IU_sum = d3.sum(DC_wrap.formattedData, function(d){if (d.col == 'unlinked') return +d.height;});
  }
  var sumData = [Im_sum, IL_sum, IU_sum, DC_wrap.totNb];
  if (DC_wrap.doOnset == 1) sumData.splice(3, 0, DC_wrap.totNb-(Im_sum+IL_sum+IU_sum))
  
  DC_wrap.svg.selectAll(".legend.sum")
    .remove()
    .exit()
    .data(sumData)
    .enter()
    .append("text")
      .attr("class", "legend sum")
      .attr("x", DC_wrap.legendPos.x-DC_wrap.legendPos.dx)
      .attr("y", function(d,i) {return DC_wrap.legendPos.y + i*DC_wrap.legendPos.dy + DC_wrap.legendPos.r})
      .style("fill", function(d) {return color(d)})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
      .style("alignment-baseline", "middle")
}

DC_wrap.doCumul = 0;
DC_wrap.doOnset = 0;

d3.csv(DC_wrap.dataPathList[DC_wrap.doOnset], function(error, data) {
  if (error) return console.warn(error);
  
  DC_makeCanvas();
  DC_formatData(data, DC_wrap.doCumul);
  DC_initialize();
  DC_update();
});

//-- Button listener
$(document).on("change", "input:radio[name='case_by_transmission_doCumul']", function(event) {
  DC_wrap.doCumul = this.value;
  dataPath = DC_wrap.dataPathList[DC_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    DC_formatData(data, DC_wrap.doCumul);
    DC_update();
  });
});

$(document).on("change", "input:radio[name='case_by_transmission_doOnset']", function(event) {
  DC_wrap.doOnset = this.value
  dataPath = DC_wrap.dataPathList[DC_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    DC_formatData(data, DC_wrap.doCumul);
    DC_update();
  });
});



