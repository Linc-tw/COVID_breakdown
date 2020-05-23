var CBT_wrap = {};
CBT_wrap.tag = 'case_by_transmission'
CBT_wrap.id = '#' + CBT_wrap.tag
CBT_wrap.dataPathList = [
  "processed_data/case_by_transmission_by_report_day.csv",
  "processed_data/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

function CBT_makeCanvas() {
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
  
  var svg = d3.select(CBT_wrap.id)
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
  
  CBT_wrap.totWidth = totWidth;
  CBT_wrap.totHeight = totHeight;
  CBT_wrap.margin = margin;
  CBT_wrap.width = width;
  CBT_wrap.height = height;
  CBT_wrap.corner = corner;
  CBT_wrap.svg = svg;
}

function CBT_formatData(data) {
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

  if (CBT_wrap.doCumul == 1) {
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
  if (CBT_wrap.doCumul == 1) ypath = 100; //Math.floor(ymax / 5);
  else                       ypath = 5;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Calculate separate sum
  var imp, IL, IU, fle;
  
  if (CBT_wrap.doCumul == 1) {
    imp = d3.max(formattedData, function(d) {if (d.col == 'imported') return +d.height;});
    IL = d3.max(formattedData, function(d) {if (d.col == 'linked') return +d.height;});
    IU = d3.max(formattedData, function(d) {if (d.col == 'unlinked') return +d.height;});
    fle = d3.max(formattedData, function(d) {if (d.col == 'fleet') return +d.height;});
  }
  else {
    imp = d3.sum(formattedData, function(d) {if (d.col == 'imported') return +d.height;});
    IL = d3.sum(formattedData, function(d) {if (d.col == 'linked') return +d.height;});
    IU = d3.sum(formattedData, function(d) {if (d.col == 'unlinked') return +d.height;});
    fle = d3.sum(formattedData, function(d) {if (d.col == 'fleet') return +d.height;});
  }
  var lValue = [imp, IL, IU, fle];
  
  CBT_wrap.formattedData = formattedData;
  CBT_wrap.dateList = dateList;
  CBT_wrap.colTagList = colTagList;
  CBT_wrap.nbCol = nbCol;
  CBT_wrap.ymax = ymax;
  CBT_wrap.xtick = xtick;
  CBT_wrap.xticklabel = xticklabel;
  CBT_wrap.ytick = ytick;
  CBT_wrap.lValue = lValue;
}

function CBT_formatData2(data2) {
  var overallTot = 0;
  var i;
  
  for (i=0; i<data2.length; i++) {
    if ('overall_total' == data2[i]['key']) {
      overallTot = +data2[i]['value'];
    }
  }
  
  CBT_wrap.overallTot = overallTot;
}

//-- Tooltip
var CBT_tooltip = d3.select(CBT_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function CBT_mouseover(d) {
  CBT_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function CBT_getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - CBT_wrap.corner[i][0])**2 + (d[1] - CBT_wrap.corner[i][1])**2;
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
  var xPos = d[0] * (1-xAlpha) + CBT_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + CBT_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(CBT_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / CBT_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / CBT_wrap.totHeight;
  
  xPos = (xPos + CBT_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + CBT_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function CBT_mousemove(d) {
  var newPos = CBT_getTooltipPos(d3.mouse(this));
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = d.x + "<br>合計 = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4) + "<br>境外移入 = " + d.h1+ "<br>本土已知 = " + d.h2 + "<br>本土未知 = " + d.h3 + "<br>敦睦艦隊 = " + d.h4
  else if (lang == 'fr')
    tooltipText = d.x + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4) + "<br>Importés = " + d.h1+ "<br>Locaux connus = " + d.h2 + "<br>Locaux inconnus = " + d.h3 + "<br>Flotte = " + d.h4
  else
    tooltipText = d.x + "<br>Total = " + (+d.h1 + +d.h2 + +d.h3 + +d.h4) + "<br>Imported = " + d.h1+ "<br>Local linked = " + d.h2 + "<br>Local unlinked = " + d.h3 + "<br>Fleet = " + d.h4
  
  
  CBT_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function CBT_mouseleave(d) {
  CBT_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function CBT_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, CBT_wrap.width])
    .domain(CBT_wrap.dateList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return CBT_wrap.xticklabel[i]});
  
  CBT_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + CBT_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, CBT_wrap.dateList.length])
    .range([0, CBT_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(CBT_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  CBT_wrap.svg.append("g")
    .attr("transform", "translate(0," + CBT_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, CBT_wrap.ymax])
    .range([CBT_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-CBT_wrap.width)
    .tickValues(CBT_wrap.ytick)
  
  CBT_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  CBT_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + CBT_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '案例數';
  else if (lang == 'fr') ylabel = 'Nombre de cas';
  else ylabel = 'Number of cases';
  CBT_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-CBT_wrap.margin.left*0.75).toString() + ", " + (CBT_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = cList.slice(0, CBT_wrap.nbCol);
  var colTagList = CBT_wrap.colTagList.slice().reverse();
  var color = d3.scaleOrdinal()
    .domain(colTagList)
    .range(colorList);
  
  //-- Bar
  var bar = CBT_wrap.svg.selectAll('.content.bar')
    .data(CBT_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function(d) {return color(d.col);})
    .attr('x', function(d) {return x(d.x);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on("mouseover", CBT_mouseover)
    .on("mousemove", CBT_mousemove)
    .on("mouseleave", CBT_mouseleave)

  CBT_wrap.colorList = colorList;
  CBT_wrap.bar = bar;
}

function CBT_update() {
  var transDuration = 800;

  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, CBT_wrap.ymax])
    .range([CBT_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-CBT_wrap.width)
    .tickValues(CBT_wrap.ytick)
  
  CBT_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  CBT_wrap.bar.selectAll('.content.bar')
    .data(CBT_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('y', function(d) {return y(d.y1);})
    .attr('height', function(d) {return y(d.y0)-y(d.y1);});
    
  //-- Color
  colorList = CBT_wrap.colorList.slice();
  if (CBT_wrap.doOnset == 1) colorList.push('#999999');
  colorList.push('#000000');
  
  //-- Legend - value
  var lPos = {x: 70, y: 45, dx: 12, dy: 30};
  var lValue = CBT_wrap.lValue.slice();
  var sum = lValue.reduce((a, b) => a + b, 0);
  if (CBT_wrap.doOnset == 1) lValue.push(CBT_wrap.overallTot-sum);
  lValue.push(CBT_wrap.overallTot);
  
  CBT_wrap.svg.selectAll(".legend.value")
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
  var lLabel, lLabel_plus;
  if (lang == 'zh-tw') {
    lLabel = ["境外移入", "本土感染源已知", "本土感染源未知", '敦睦艦隊', "合計"];
    lLabel_plus = '無發病日資料';
  }
  else if (lang == 'fr') {
    lLabel = ["Importés", "Locaux & lien connu", "Locaux & lien inconnu", "Flotte diplomatique", "Total"];
    lLabel_plus = "Sans date début symp.";
  }
  else {
    lLabel = ["Imported", "Local & linked to known cases", "Local & unlinked", 'Diplomatic fleet cluster', "Total"];
    lLabel_plus = 'No onset date';
  }
  if (CBT_wrap.doOnset == 1) lLabel.splice(CBT_wrap.nbCol, 0, lLabel_plus);
  
  CBT_wrap.svg.selectAll(".legend.label")
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

CBT_wrap.doCumul = 0;
CBT_wrap.doOnset = 0;

d3.csv(CBT_wrap.dataPathList[CBT_wrap.doOnset], function(error, data) {
  d3.csv(CBT_wrap.dataPathList[2], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    CBT_makeCanvas();
    CBT_formatData(data);
    CBT_formatData2(data2);
    CBT_initialize();
    CBT_update();
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + CBT_wrap.tag + "_doCumul']", function(event) {
  CBT_wrap.doCumul = this.value;
  dataPath = CBT_wrap.dataPathList[CBT_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    CBT_formatData(data);
    CBT_update();
  });
});

$(document).on("change", "input:radio[name='" + CBT_wrap.tag + "_doOnset']", function(event) {
  CBT_wrap.doOnset = this.value
  dataPath = CBT_wrap.dataPathList[CBT_wrap.doOnset]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    CBT_formatData(data);
    CBT_update();
  });
});

d3.select(CBT_wrap.id + '_button_5').on('click', function(){
  var tag1, tag2;
  
  if (CBT_wrap.doCumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBT_wrap.doOnset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBT_wrap.tag + '_' + tag1 + '_' + tag2 + '.png'
  saveSvgAsPng(d3.select(CBT_wrap.id).select('svg').node(), name);
});

