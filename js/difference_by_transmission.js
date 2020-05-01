var DBT_wrap = {};
DBT_wrap.tag = 'difference_by_transmission'
DBT_wrap.id = '#' + DBT_wrap.tag
DBT_wrap.dataPathList = [
  "processed_data/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

function DBT_makeCanvas() {
  var totWidth = 800;
  var totHeight;
  if (lang == 'zh-tw') {
    totHeight = 415;
    bottom = 90;
  }
  else if (lang == 'fr') {
    totHeight = 400;
    bottom = 80;
  }
  else {
    totHeight = 400;
    bottom = 80;
  }
  
  var margin = {left: 70, right: 2, bottom: bottom, top: 2};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(DBT_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  DBT_wrap.totWidth = totWidth;
  DBT_wrap.totHeight = totHeight;
  DBT_wrap.margin = margin;
  DBT_wrap.width = width;
  DBT_wrap.height = height;
  DBT_wrap.corner = corner;
  DBT_wrap.svg = svg;
}

function DBT_formatData(data) {
  //-- Settings for xticklabels
  var xlabel_path = 3;
  var r = 0;
  var xtick = [];
  var xticklabel = [];
  var ymax = 0;
  
  var colTagList = data.columns.slice(1);
  var colTag = colTagList[DBT_wrap.colInd];
  var nbCol = colTagList.length;
  var diffList = [];
  var i, j, x, y, height, block;
  
  for (i=0; i<data.length; i++) {
    x = data[i]["difference"];
    y = data[i][colTag];
    diffList.push(x);
    
    ymax = Math.max(ymax, y);
    
    if (i % xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate ymax
  ymax *= 1.11;
  var ypath;
  if      (DBT_wrap.colInd == 0) ypath = 30;
  else if (DBT_wrap.colInd == 1) ypath = 30;
  else if (DBT_wrap.colInd == 2) ypath = 1;
  else                           ypath = 4;
  
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Calculate separate sum
  var all = d3.sum(data, function(d) {return d['all'];});
  var imp = d3.sum(data, function(d) {return d['imported'];});
  var ind = d3.sum(data, function(d) {return d['indigenous'];});
  var fle = d3.sum(data, function(d) {return d['fleet'];});
  var lValue = [all, imp, ind, fle];
  
  DBT_wrap.formattedData = data;
  DBT_wrap.diffList = diffList;
  DBT_wrap.colTagList = colTagList;
  DBT_wrap.nbCol = nbCol;
  DBT_wrap.ymax = ymax;
  DBT_wrap.xtick = xtick;
  DBT_wrap.xticklabel = xticklabel;
  DBT_wrap.ytick = ytick;
  DBT_wrap.lValue = lValue;
}

function DBT_formatData2(data2) {
  var overallTot = 0;
  var i;
  
  for (i=0; i<data2.length; i++) {
    if ('overall_total' == data2[i]['key']) {
      overallTot = +data2[i]['value'];
    }
  }
  
  DBT_wrap.overallTot = overallTot;
}

//-- Tooltip
var DBT_tooltip = d3.select(DBT_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function DBT_mouseover(d) {
  DBT_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function DBT_getTooltipPos(d) {
  var l_max = 0;
  var i_max = -1;
  var i, l;
  
  //-- Look for the furthest vertex
  for (i=0; i<4; i++) {
    l = (d[0] - DBT_wrap.corner[i][0])**2 + (d[1] - DBT_wrap.corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place the caption somewhere on the longest arm, parametrizaed by xAlpha & yAlpha
  var xAlpha = 0.1;
  var yAlpha = 0.35;
//   var xAlpha = 1;
//   var yAlpha = 1;
  var xPos = d[0] * (1-xAlpha) + DBT_wrap.corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + DBT_wrap.corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(DBT_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / DBT_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / DBT_wrap.totHeight;
  
  xPos = (xPos + DBT_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + DBT_wrap.margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function DBT_mousemove(d) {
  var newPos = DBT_getTooltipPos(d3.mouse(this));
  var colTag, colTag2, tooltipText;
  
  if (lang == 'zh-tw') {
    colTag = DBT_wrap.colTagList[DBT_wrap.colInd];
    if (colTag == 'all') colTag2 = '全部';
    else if (colTag == 'imported') colTag2 = '境外移入';
    else if (colTag == 'indigenous') colTag2 = '本土';
    else if (colTag == 'fleet') colTag2 = '敦睦艦隊';
    tooltipText = colTag2 + '案例中有' + d[colTag] + '位<br>發病或入境後' + d['difference'] + '日確診';
  }
  else if (lang == 'fr') {
    colTag = DBT_wrap.colTagList[DBT_wrap.colInd];
    if (colTag == 'all') colTag2 = "de l'ensemble des cas";
    else if (colTag == 'imported') colTag2 = 'des cas importés';
    else if (colTag == 'indigenous') colTag2 = 'des cas locaux';
    else if (colTag == 'fleet') colTag2 = 'des cas en flotte';
    tooltipText = d[colTag] + ' ' + colTag2 + ' attend(ent)<br>' + d['difference'] + " jour(s) avant d'être identifié(s)";
  }
  else {
    colTag = DBT_wrap.colTagList[DBT_wrap.colInd];
    if (colTag == 'imported') colTag2 = 'local';
    else colTag2 = colTag;
    tooltipText = d[colTag] + ' of ' + colTag2 + ' cases required<br>' + d['difference'] + ' day(s) to be identified'
  }
  
  DBT_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function DBT_mouseleave(d) {
  DBT_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

function DBT_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, DBT_wrap.width])
    .domain(DBT_wrap.diffList)
    .padding(0.2);
    
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return DBT_wrap.xticklabel[i]});
  
  DBT_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + DBT_wrap.height + ')')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(0,15)")
      .style("text-anchor", "middle")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, DBT_wrap.diffList.length])
    .range([0, DBT_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(DBT_wrap.xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  
  DBT_wrap.svg.append("g")
    .attr("transform", "translate(0," + DBT_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, DBT_wrap.ymax])
    .range([DBT_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-DBT_wrap.width)
    .tickValues(DBT_wrap.ytick)
  
  DBT_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  DBT_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + DBT_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- xlabel
  var xlabel;
  if (lang == 'zh-tw') xlabel = '發病或入境後到確診所需天數';
  if (lang == 'fr') xlabel = "Nombre de jours avant identification";
  else xlabel = "Days required for each case to be identified";
  DBT_wrap.svg.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "bottom")
    .attr("transform", "translate(" + (DBT_wrap.width*0.5).toString() + ", " + (DBT_wrap.totHeight-0.2*DBT_wrap.margin.bottom).toString() + ")")
    .text(xlabel);
  
  //-- ylabel
  var ylabel;
  if (lang == 'zh-tw') ylabel = '案例數';
  else if (lang == 'fr') ylabel = 'Nombre de cas';
  else ylabel = 'Number of cases';
  DBT_wrap.svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-DBT_wrap.margin.left*0.75).toString() + ", " + (DBT_wrap.height/2).toString() + ")rotate(-90)")
    .text(ylabel);
    
  //-- Color
  var colorList = [cList[4], cList[0], cList[1], cList[3], '#999999', '#000000']; 
  var colTagList = DBT_wrap.colTagList.slice();
  var color = d3.scaleOrdinal()
    .domain(colTagList)
    .range(colorList);
  
  //-- Bar
  var bar = DBT_wrap.svg.selectAll('.content.bar')
    .data(DBT_wrap.formattedData)
    .enter();
  
  bar.append('rect')
    .attr('class', 'content bar')
    .attr('fill', function(d) {return color(colTagList[DBT_wrap.colInd]);})
    .attr('x', function(d) {return x(d['difference']);})
    .attr('y', function(d) {return y(0);})
    .attr('width', x.bandwidth())
    .attr('height', function(d) {return 0;})
    .on("mouseover", DBT_mouseover)
    .on("mousemove", DBT_mousemove)
    .on("mouseleave", DBT_mouseleave)

  DBT_wrap.colorList = colorList;
  DBT_wrap.color = color;
  DBT_wrap.bar = bar;
}

function DBT_update() {
  var transDuration = 800;
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, DBT_wrap.ymax])
    .range([DBT_wrap.height, 0]);
  
  var yAxis = d3.axisLeft(y)
    .tickSize(-DBT_wrap.width)
    .tickValues(DBT_wrap.ytick)
    .tickFormat(d3.format("d"));
  
  DBT_wrap.svg.select('.yaxis')
    .transition()
    .duration(transDuration)
    .call(yAxis);
  
  //-- Update bars
  var colTagList = DBT_wrap.colTagList.slice();
  DBT_wrap.bar.selectAll("rect")
    .data(DBT_wrap.formattedData)
    .transition()
    .duration(transDuration)
    .attr('fill', function(d) {return DBT_wrap.color(colTagList[DBT_wrap.colInd]);})
    .attr('y', function(d) {return y(d[colTagList[DBT_wrap.colInd]]);})
    .attr('height', function(d) {return y(0)-y(d[colTagList[DBT_wrap.colInd]]);});
  
  //-- Legend
  var lPos = {x: 450, y: 45, dx: 12, dy: 30};
  var lColorList, lLabel, lLabel2, lValue2;
  if (lang == 'zh-tw')
    lLabel = ['有資料案例數', "境外移入", "本土", '敦睦艦隊', '資料不全', '合計'];
  else if (lang == 'fr')
    lLabel = ['Données complètes', "Importé", "Local", 'Flotte diplomatique', 'Données incomplètes', 'Total'];
  else 
    lLabel = ['Data complete', 'Imported', 'Local', 'Diplomatic fleet cluster', 'Data incomplete', 'Total'];
  var lValue = DBT_wrap.lValue.slice(0);
  var sum = DBT_wrap.lValue.slice(1).reduce((a, b) => a + b, 0);
  lValue.push(DBT_wrap.overallTot-sum);
  lValue.push(DBT_wrap.overallTot);
  
  if (DBT_wrap.colInd == 0) {
    lColorList = [DBT_wrap.colorList[0], DBT_wrap.colorList[4], DBT_wrap.colorList[5]]
    lLabel2 = [lLabel[0], lLabel[4], lLabel[5]]
    lValue2 = [lValue[0], lValue[4], lValue[5]]
  }
  else {
    lColorList = [DBT_wrap.colorList[DBT_wrap.colInd], DBT_wrap.colorList[5]]
    lLabel2 = [lLabel[DBT_wrap.colInd], lLabel[5]]
    lValue2 = [lValue[DBT_wrap.colInd], lValue[5]]
  }
  
  //-- Legend - value
  DBT_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(lValue2)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", lPos.x)
      .attr("y", function(d,i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return lColorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
    
  //-- Legend - label
  DBT_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(lLabel2)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", lPos.x+lPos.dx)
      .attr("y", function(d, i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return lColorList[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "start")
}

DBT_wrap.colInd = 0;

d3.csv(DBT_wrap.dataPathList[0], function(error, data) {
  d3.csv(DBT_wrap.dataPathList[1], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    DBT_makeCanvas();
    DBT_formatData(data);
    DBT_formatData2(data2);
    DBT_initialize();
    DBT_update();
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + DBT_wrap.tag + "_colInd']", function(event) {
  DBT_wrap.colInd = this.value;
  dataPath = DBT_wrap.dataPathList[0]
  
  d3.csv(dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    DBT_formatData(data);
    DBT_update();
  });
});

d3.select(DBT_wrap.id + '_button_5').on('click', function(){
  var tag1;
  
  if (DBT_wrap.colInd == 0) tag1 = 'all';
  else if (DBT_wrap.colInd == 1) tag1 = 'imported';
  else if (DBT_wrap.colInd == 2) tag1 = 'indigenous';
  else tag1 = 'fleet';
  
  name = DBT_wrap.tag + '_' + tag1 + '.png'
  saveSvgAsPng(d3.select(DBT_wrap.id).select('svg').node(), name);
});

