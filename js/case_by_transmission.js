

//-- Dimension & margin
var totWidth = 800;
var totHeight = 400;
var margin = {left: 70, right: 0, bottom: 90, top: 0};
var width = totWidth - margin.left - margin.right;
var height = totHeight - margin.top - margin.bottom;
var corner = [[0, 0], [width, 0], [0, height], [width, height]];

//-- Convert date format
function ISODateToMDDate(ISODate) {
  var MDDateFormat = d3.timeFormat("%b %d");
  return MDDateFormat(d3.isoParse(ISODate));
}

//-- Calculations
function dailySum(row) {
  return +row["indigenous unlinked"] + +row["indigenous linked"] + +row["imported"];
}

//-- Tooltip
var tooltip = d3.select("#case_by_transmission")
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
    l = (d[0] - corner[i][0])**2 + (d[1] - corner[i][1])**2;
    if (l > l_max) {
      l_max = l;
      i_max = i;
    }
  }
  
  //-- Place the caption somewhere on the longest arm, parametrizaed by xAlpha & yAlpha
  var xAlpha = 0.1;
//   var yAlpha = 0.5;
  var yAlpha = 1;
  var xPos = d[0] * (1-xAlpha) + corner[i_max][0] * xAlpha;
  var yPos = d[1] * (1-yAlpha) + corner[i_max][1] * yAlpha;
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select("#case_by_transmission").node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / totWidth;
  var yAspect = (svgDim.height - 2*buffer) / totHeight;
  
  xPos = (xPos + margin.left) * xAspect + buffer;
  yPos = (yPos + margin.top) * yAspect + buffer + cardHdr + button;
  
  return [xPos, yPos];
}

function mousemove(d) {
  var newPos = getTooltipPos(d3.mouse(this));
  tooltip
    .html(d.data["date"] + "<br>Total = " + dailySum(d.data) + "<br>Imported = " + d.data["imported"] + "<br>Ind. linked = " + d.data["indigenous linked"] + "<br>Ind. unlinked = " + d.data["indigenous unlinked"])
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

function cumsum(data) {
  var i;
  
  for (i=1; i<data.length; i++) {
    data[i]["imported"]          = +data[i]["imported"] + +data[i-1]["imported"];
    data[i]["indigenous linked"] = +data[i]["indigenous linked"] + +data[i-1]["indigenous linked"];
    data[i]["indigenous unlinked"] = +data[i]["indigenous unlinked"] + +data[i-1]["indigenous unlinked"];
  }
}

//-- Append svg object to the body of the page
var svg = d3.select("#case_by_transmission")
  .append("svg")
    .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function plotBase(error, data, doCumul) {
  if (error) throw error;
  
  if (doCumul == 1) {
    cumsum(data);
  }
  
//   console.log(data)
  
  
  //-- Settings for xticklabels
  var xlabel_path = 7;
  var q = data.length % xlabel_path;
  var rList = [3, 3, 4, 1, 1, 2, 2];
  var r = rList[q];
  
  var xtick = [];
  var xticklabel = [];
  var ymax = 0;
  var i;
  
  //-- Get xticks, xticklabels, & ymax
  for (i=0; i<data.length; i++) {
    ymax = Math.max(ymax, dailySum(data[i]));
    
    if (i % xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(ISODateToMDDate(data[i]["date"]));
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate ymax
  ymax *= 1.25;
  var ypath;
  if (doCumul == 1) ypath = 100; //Math.floor(ymax / 5);
  else              ypath = 5;
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Rows & columns
  var colList = data.columns.slice(1);
  var dateList = d3.map(data, function(d){return(d["date"])}).keys();

  //-- Add x-axis
  var x = d3.scaleBand()
    .domain(dateList)
    .range([0, width])
    .padding([0.2])
  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function(d, i){return xticklabel[i]});
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "plot")
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-8,15) rotate(-90)")
      .style("text-anchor", "end")
  
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width])
  var xAxis2 = d3.axisBottom(x2)
    .tickValues(xtick)
    .tickSize(10)
    .tickSizeOuter(0)
    .tickFormat(function(d, i){return ""});
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "plot")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, ymax])
    .range([height, 0]);
  var yAxis = d3.axisLeft(y)
    .tickSize(-width)
    .tickValues(ytick)
  svg.append("g")
    .attr("class", "plot")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  svg.append("g")
    .attr("class", "plot")
    .attr("transform", "translate("+width+",0)")
    .call(yAxis2)

  //-- Colors
  var color = d3.scaleOrdinal()
    .domain([colList[2], colList[1], colList[0]])
    .range(['#3366BB', '#CC6677', '#55BB44'])

  //-- ylabel
  svg.append("text")
    .attr("class", "plot")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-margin.left*0.75).toString() + ", " + (height/2).toString() + ")rotate(-90)")
    .text("Number counts");
    
  //-- Legend
  var x_legend = 90;
  var y_legend = 45;
  
  //-- Legend - circles
  label = ["Imported", "Indigenous linked to known cases", "Indigenous unlinked"]
  svg.selectAll("dot")
    .data(label)
    .enter()
    .append("circle")
      .attr("class", "plot")
      .attr("cx", x_legend)
      .attr("cy", function(d,i) {return y_legend + i*25})
      .attr("r", 7)
      .style("fill", function(d) {return color(d)})
      
  //-- Legend - texts
  svg.selectAll("label")
    .data(label)
    .enter()
    .append("text")
      .attr("class", "plot")
      .attr("x", x_legend+20)
      .attr("y", function(d,i){ return y_legend + i*25 + 7})
      .style("fill", function(d){ return color(d)})
      .text(function(d){return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  
  //-- Legend - total cases
  var Im_sum, IL_sum, IU_sum;
  if (doCumul == 1) {
    Im_sum = data[data.length-1]["imported"];
    IL_sum = data[data.length-1]["indigenous linked"];
    IU_sum = data[data.length-1]["indigenous unlinked"];
  }
  else {
    Im_sum = d3.sum(data, function(d){return +d["imported"];});
    IL_sum = d3.sum(data, function(d){return +d["indigenous linked"];});
    IU_sum = d3.sum(data, function(d){return +d["indigenous unlinked"];});
  }
  
  svg.selectAll("sum")
    .data([Im_sum, IL_sum, IU_sum])
    .enter()
    .append("text")
      .attr("class", "plot")
      .attr("x", x_legend-20)
      .attr("y", function(d,i){ return y_legend + i*25 + 7})
      .style("fill", function(d){ return color(d)})
      .text(function(d){return d})
      .attr("text-anchor", "end")
      .style("alignment-baseline", "middle")
  
  //-- Stack data
  var stackedData = d3.stack()
    .keys(colList)(data)
  
  //-- Plot
  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) {return color(d.key);})
      .selectAll("rect")
      .data(function(d) {return d;})
      .enter().append("rect")
        .attr("class", "plot")
        .attr("x", function(d) {return x(d.data["date"]);})
        .attr("y", function(d) {return y(d[1]);})
        .attr("height", function(d) {return y(d[0]) - y(d[1]);})
        .attr("width", x.bandwidth())
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

function plotDaily(error, data) {
  plotBase(error, data, 0)
}

function plotCumul(error, data) {
  plotBase(error, data, 1)
}

//-- Parse data
d3.csv("processed_data/Taiwan_simplified.csv", plotDaily)

//-- Button listener
$(document).on("change", "input:radio[name='doCumul']", function (event) {
  if (this.value == "daily") {
    d3.select("#case_by_transmission").selectAll(".plot").remove();
    d3.csv("processed_data/Taiwan_simplified.csv", plotDaily);
  }
  else {
    d3.select("#case_by_transmission").selectAll(".plot").remove();
    d3.csv("processed_data/Taiwan_simplified.csv", plotCumul);
  }
});

