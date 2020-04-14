var CBD_wrap = {};
CBD_wrap.id = "#case_by_detection"
CBD_wrap.dataPathList = [
  "processed_data/case_by_detection_by_report_day.csv",
  "processed_data/case_by_detection_by_onset_day.csv"
];

function CBD_makeCanvas() {
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
  
  var svg = d3.select(CBD_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  CBD_wrap.totWidth = totWidth;
  CBD_wrap.totHeight = totHeight;
  CBD_wrap.margin = margin;
  CBD_wrap.width = width;
  CBD_wrap.height = height;
  CBD_wrap.corner = corner;
  CBD_wrap.svg = svg;
}

function CBD_formatData(data) {
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
  
  if (CBD_wrap.doCumul == 1) {
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
        'h1': +data[i][colTagList[4]],
        'h2': +data[i][colTagList[3]],
        'h3': +data[i][colTagList[2]],
        'h4': +data[i][colTagList[1]],
        'h5': +data[i][colTagList[0]],
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
  if (CBD_wrap.doCumul == 1) ypath = 80; //Math.floor(ymax / 5);
  else                       ypath = 5;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  CBD_wrap.formattedData = formattedData;
  CBD_wrap.dateList = dateList;
  CBD_wrap.colTagList = colTagList;
  CBD_wrap.ymax = ymax;
  CBD_wrap.xtick = xtick;
  CBD_wrap.xticklabel = xticklabel;
  CBD_wrap.ytick = ytick;
}

//-- Tooltip
var CBD_tooltip = d3.select(CBD_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function CBD_mouseover(d) {
  CBD_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function CBD_getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - CBD_wrap.corner[i][0])**2 + (d[1] - CBD_wrap.corner[i][1])**2;
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
  var xPos = d[0] * (1-xAlpha) + CBD_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + CBD_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(CBD_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / CBD_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / CBD_wrap.totHeight;
  
  xPos = (xPos + CBD_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + CBD_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function CBD_mousemove(d) {
  var newPos = CBD_getTooltipPos(d3.mouse(this));
  var tootipText;
  
  if (lang == 'zh-tw')
    tootipText = d.x + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4 + +d.h5) + "<br>境外移入 = " + d.h1 + "<br>本土已知 = " + d.h2 + "<br>本土未知 = " + d.h3 + d.h4 + d.h5
  else
    tootipText = d.x + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4 + +d.h5) + "<br>Airport = " + d.h1 + "<br>Quarantine = " + d.h2 + "<br>Isolation = " + d.h3 + "<br>Monitoring = " + d.h4 + "<br>Hospital = " + d.h5
  
  
  CBD_tooltip
    .html(tootipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function CBD_mouseleave(d) {
  CBD_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function CBD_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, CBD_wrap.width])
    .domain(CBD_wrap.dateList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return CBD_wrap.xticklabel[i]});
  
  CBD_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + CBD_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, CBD_wrap.dateList.length])
    .range([0, CBD_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(CBD_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  CBD_wrap.svg.append("g")
    .attr("transform", "translate(0," + CBD_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, CBD_wrap.ymax])
    .range([CBD_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-CBD_wrap.width)
    .tickValues(CBD_wrap.ytick)
  
  CBD_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  CBD_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + CBD_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '案例數';
  else ylabel = 'Number counts';
  CBD_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-CBD_wrap.margin.left*0.75).toString() + ", " + (CBD_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = cList.slice(0, 5);
  var color = d3.scaleOrdinal()
    .domain([CBD_wrap.colTagList[4], CBD_wrap.colTagList[3], CBD_wrap.colTagList[2], CBD_wrap.colTagList[1], CBD_wrap.colTagList[0]])
    .range(colorList);
    
  //-- Legend
  var legendPos = {x: 90, y: 40, dx: 20, dy: 25, r: 7};
  
  //-- Legend - circles
  CBD_wrap.svg.selectAll("dot")
    .data([0, 1, 2, 3, 4])
    .enter()
    .append("circle")
      .attr("class", "legend")
      .attr("cx", legendPos.x)
      .attr("cy", function(d,i) {return legendPos.y + i*legendPos.dy})
      .attr("r", legendPos.r)
      .style("fill", function(d, i) {return colorList[i]})
  
  //-- Legend - calculation for updates
  var totNb = d3.sum(CBD_wrap.formattedData, function(d){return +d.height;});
  
  //-- Bar
  var bar = CBD_wrap.svg.selectAll('.bar')
    .data(CBD_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", CBD_mouseover)
    .on("mousemove", CBD_mousemove)
    .on("mouseleave", CBD_mouseleave)

  CBD_wrap.colorList = colorList;
  CBD_wrap.legendPos = legendPos;
  CBD_wrap.bar = bar;
}

function CBD_update() {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, CBD_wrap.ymax])
    .range([CBD_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-CBD_wrap.width)
    .tickValues(CBD_wrap.ytick)
  
  CBD_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  CBD_wrap.bar.selectAll("rect")
    .data(CBD_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = CBD_wrap.colorList.slice();
  colorList.push('#999999');
  colorList.push('#000000');
  
  //-- Legend - texts
  var label;
  if (lang == 'zh-tw') 
    label = ['機場', '居家檢疫', '居家隔離', '自主健康管理', '自行就醫', '無資料', '合計'];
  else 
    label = ["Airport", "Quarantine", "Isolation", "Monitoring", "Hospital", 'No data', 'Total'];
  
  CBD_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", CBD_wrap.legendPos.x+CBD_wrap.legendPos.dx)
      .attr("y", function(d,i) {return CBD_wrap.legendPos.y + i*CBD_wrap.legendPos.dy + CBD_wrap.legendPos.r})
      .style("fill", function(d, i) {return colorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  
  //-- Legend - total cases
  var air_sum, QT_sum, iso_sum, mon_sum, hosp_sum;
  if (CBD_wrap.doCumul == 1) {
    air_sum = d3.max(CBD_wrap.formattedData, function(d){if (d.col == 'airport') return +d.height;});
    QT_sum = d3.max(CBD_wrap.formattedData, function(d){if (d.col == 'quarantine') return +d.height;});
    iso_sum = d3.max(CBD_wrap.formattedData, function(d){if (d.col == 'isolation') return +d.height;});
    mon_sum = d3.max(CBD_wrap.formattedData, function(d){if (d.col == 'monitoring') return +d.height;});
    hosp_sum = d3.max(CBD_wrap.formattedData, function(d){if (d.col == 'hospital') return +d.height;});
  }
  else {
    air_sum = d3.sum(CBD_wrap.formattedData, function(d){if (d.col == 'airport') return +d.height;});
    QT_sum = d3.sum(CBD_wrap.formattedData, function(d){if (d.col == 'quarantine') return +d.height;});
    iso_sum = d3.sum(CBD_wrap.formattedData, function(d){if (d.col == 'isolation') return +d.height;});
    mon_sum = d3.sum(CBD_wrap.formattedData, function(d){if (d.col == 'monitoring') return +d.height;});
    hosp_sum = d3.sum(CBD_wrap.formattedData, function(d){if (d.col == 'hospital') return +d.height;});
  }
  var sumData = [air_sum, QT_sum, iso_sum, mon_sum, hosp_sum, overallTotNb-(air_sum+QT_sum+iso_sum+mon_sum+hosp_sum), overallTotNb];
  
  CBD_wrap.svg.selectAll(".legend.sum")
    .remove()
    .exit()
    .data(sumData)
    .enter()
    .append("text")
      .attr("class", "legend sum")
      .attr("x", CBD_wrap.legendPos.x-CBD_wrap.legendPos.dx)
      .attr("y", function(d,i) {return CBD_wrap.legendPos.y + i*CBD_wrap.legendPos.dy + CBD_wrap.legendPos.r})
      .style("fill", function(d, i) {return colorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
      .style("alignment-baseline", "middle")
}

CBD_wrap.doCumul = 0;
CBD_wrap.doOnset = 0;

d3.csv(CBD_wrap.dataPathList[CBD_wrap.doOnset], function(error, data) {
  if (error) return console.warn(error);
  
  CBD_makeCanvas();
  CBD_formatData(data);
  CBD_initialize();
  CBD_update();
});

//-- Button listener
$(document).on("change", "input:radio[name='case_by_detection_doCumul']", function(event) {
  CBD_wrap.doCumul = this.value;
  dataPath = CBD_wrap.dataPathList[CBD_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    CBD_formatData(data);
    CBD_update();
  });
});

$(document).on("change", "input:radio[name='case_by_detection_doOnset']", function(event) {
  CBD_wrap.doOnset = this.value
  dataPath = CBD_wrap.dataPathList[CBD_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    CBD_formatData(data);
    CBD_update();
  });
});



