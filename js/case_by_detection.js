var CBD_wrap = {};
CBD_wrap.tag = "case_by_detection"
CBD_wrap.id = '#' + CBD_wrap.tag
CBD_wrap.dataPathList = [
  "processed_data/case_by_detection_by_report_day.csv",
  "processed_data/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

function CBD_makeCanvas() {
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
  
  var svg = d3.select(CBD_wrap.id)
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
  var xlabel_path = 10;
  var q = data.length % xlabel_path;
//   var rList = [3, 3, 4, 1, 1, 2, 2];
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
  
  if (CBD_wrap.doCumul == 1) {
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
        'h4': +data[i][colTagList[nbCol-4]],
        'h5': +data[i][colTagList[nbCol-5]],
        'h6': +data[i][colTagList[nbCol-6]],
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
  if (CBD_wrap.doCumul == 1) ypath = 100; //Math.floor(ymax / 5);
  else                       ypath = 5;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Calculate separate sum
  var air, QT, iso, moni, hosp, noData;
  if (CBD_wrap.doCumul == 1) {
    air = d3.max(formattedData, function(d) {if (d.col == 'airport') return +d.height;});
    QT = d3.max(formattedData, function(d) {if (d.col == 'quarantine') return +d.height;});
    iso = d3.max(formattedData, function(d) {if (d.col == 'isolation') return +d.height;});
    moni = d3.max(formattedData, function(d) {if (d.col == 'monitoring') return +d.height;});
    hosp = d3.max(formattedData, function(d) {if (d.col == 'hospital') return +d.height;});
    noData = d3.max(formattedData, function(d) {if (d.col == 'no_data') return +d.height;});
  }
  else {
    air = d3.sum(formattedData, function(d) {if (d.col == 'airport') return +d.height;});
    QT = d3.sum(formattedData, function(d) {if (d.col == 'quarantine') return +d.height;});
    iso = d3.sum(formattedData, function(d) {if (d.col == 'isolation') return +d.height;});
    moni = d3.sum(formattedData, function(d) {if (d.col == 'monitoring') return +d.height;});
    hosp = d3.sum(formattedData, function(d) {if (d.col == 'hospital') return +d.height;});
    noData = d3.sum(formattedData, function(d) {if (d.col == 'no_data') return +d.height;});
  }
  var lValue = [air, QT, iso, moni, hosp, noData];
  
  CBD_wrap.formattedData = formattedData;
  CBD_wrap.dateList = dateList;
  CBD_wrap.colTagList = colTagList;
  CBD_wrap.nbCol = nbCol;
  CBD_wrap.ymax = ymax;
  CBD_wrap.xtick = xtick;
  CBD_wrap.xticklabel = xticklabel;
  CBD_wrap.ytick = ytick;
  CBD_wrap.lValue = lValue;
}

function CBD_formatData2(data2) {
  var overallTot = 0;
  var i;
  
  for (i=0; i<data2.length; i++) {
    if ('overall_total' == data2[i]['key']) {
      overallTot = +data2[i]['value'];
    }
  }
  
  CBD_wrap.overallTot = overallTot;
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
  var yAlpha = 0.7;
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
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = d.x + "<br>機場 = " + d.h1 + "<br>居家檢疫 = " + d.h2 + "<br>居家隔離 = " + d.h3 + "<br>自主健康管理 = " + d.h4 + "<br>自行就醫 = " + d.h5 + "<br>無管道資料 = " + d.h6 + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4 + +d.h5 + +d.h6)
  else if (lang == 'fr')
    tooltipText = d.x + "<br>Aéroports = " + d.h1 + "<br>Quarantine = " + d.h2 + "<br>Isolation = " + d.h3 + "<br>Auto-contrôle = " + d.h4 + "<br>Hôpitaux = " + d.h5 + "<br>Pas annoncés = " + d.h6 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4 + +d.h5 + +d.h6)
  else
    tooltipText = d.x + "<br>Airports = " + d.h1 + "<br>Quarantine = " + d.h2 + "<br>Isolation = " + d.h3 + "<br>Monitoring = " + d.h4 + "<br>Hospitals = " + d.h5 + "<br>Not announced = " + d.h6 + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4 + +d.h5 + +d.h6)
  
  CBD_tooltip
    .html(tooltipText)
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
  else if (lang == 'fr') ylabel = 'Nombre de cas';
  else ylabel = 'Number of cases';
  CBD_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-CBD_wrap.margin.left*0.75).toString() + ", " + (CBD_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = cList.slice(0, CBD_wrap.nbCol-1);
  colorList.push('#99cccc')
  var colTagList = CBD_wrap.colTagList.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(colTagList)
    .range(colorList);
    
  //-- Bar
  var bar = CBD_wrap.svg.selectAll('.content.bar')
    .data(CBD_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", CBD_mouseover)
    .on("mousemove", CBD_mousemove)
    .on("mouseleave", CBD_mouseleave)

  CBD_wrap.colorList = colorList;
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
  CBD_wrap.bar.selectAll('.content.bar')
    .data(CBD_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = CBD_wrap.colorList.slice();
  colorList.push('#000000');
  if (CBD_wrap.doOnset == 1) colorList.splice(CBD_wrap.nbCol, 0, '#999999');
  
  //-- Legend - value
  var lPos = {x: 70, y: 40, dx: 12, dy: 30};
  var lValue = CBD_wrap.lValue.slice();
  var sum = lValue.reduce((a, b) => a + b, 0);
  if (CBD_wrap.doOnset == 1) lValue.push(CBD_wrap.overallTot-sum);
  lValue.push(CBD_wrap.overallTot);
  
  CBD_wrap.svg.selectAll(".legend.value")
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
  var lLabel, lLabel_plus;
  if (lang == 'zh-tw') {
    lLabel = ['機場', '居家或集中檢疫', '居家隔離', '自主健康管理', '自行就醫', '無檢驗管道資料', '合計'];
    lLabel_plus = '無發病日資料';
  }
  else if (lang == 'fr') {
    lLabel = ['Aéroports', 'Quarantaine', 'Isolation', 'Auto-contrôle', 'Hôpitaux', 'Pas annoncés', 'Total'];
    lLabel_plus = "Sans date début sympt.";
  }
  else {
    lLabel = ["Airports", "Quarantine", "Isolation", "Monitoring", "Hospitals", 'Not announced', 'Total'];
    lLabel_plus = 'No onset date';
  }
  if (CBD_wrap.doOnset == 1) lLabel.splice(CBD_wrap.nbCol, 0, lLabel_plus);
  
  CBD_wrap.svg.selectAll(".legend.label")
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

CBD_wrap.doCumul = 0;
CBD_wrap.doOnset = 0;

d3.csv(CBD_wrap.dataPathList[CBD_wrap.doOnset], function(error, data) {
  d3.csv(CBD_wrap.dataPathList[2], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    CBD_makeCanvas();
    CBD_formatData(data);
    CBD_formatData2(data2);
    CBD_initialize();
    CBD_update();
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + CBD_wrap.tag + "_doCumul']", function(event) {
  CBD_wrap.doCumul = this.value;
  dataPath = CBD_wrap.dataPathList[CBD_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    CBD_formatData(data);
    CBD_update();
  });
});

$(document).on("change", "input:radio[name='" + CBD_wrap.tag + "_doOnset']", function(event) {
  CBD_wrap.doOnset = this.value
  dataPath = CBD_wrap.dataPathList[CBD_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    CBD_formatData(data);
    CBD_update();
  });
});

d3.select(CBD_wrap.id + '_button_5').on('click', function(){
  var tag1, tag2;
  
  if (CBD_wrap.doCumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBD_wrap.doOnset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBD_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(CBD_wrap.id).select('svg').node(), name);
});

