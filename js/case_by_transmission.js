

//-- Dimension & margin
var totWidth = 800;
var totHeight = 500;
var margin = {left: 70, right: 0, bottom: 90, top: 0};
// var margin = {left: 0, right: 0, bottom: 0, top: 0};
var width = totWidth - margin.left - margin.right;
var height = totHeight - margin.top - margin.bottom;
var corner = [[0, 0], [width, 0], [0, height], [width, height]];

//-- Convert date format
function ISODateToMDDate(d) {
  var dateFormat = d3.timeFormat("%b %d");
  return dateFormat(d3.isoParse(d));
}

//-- Append svg object to the body of the page
var svg = d3.select("#case_by_transmission")
  .append("svg")
    .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//-- Parse data
d3.csv("processed_data/Taiwan_simplified.csv", function(error, data) {
  if (error) throw error;
  
  //-- Settings for xticklabels
  var xlabel_path = 7;
  var q = data.length % xlabel_path;
  var rList = [3, 3, 4, 1, 1, 2, 2];
  var r = rList[q];
  
  var xtick = [];
  var xticklabel = [];
  var ymax = 0;
  var i;
  
  function dailySum(d) {
    return Number(d["indigenous unlinked"]) + Number(d["indigenous linked"]) + Number(d["imported"]);
  }
  
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
  
//     console.log(d3.map(data, function(d){return(d["imported"])}));
  
  //-- Calculate ymax
  ymax *= 1.09;
  var ypath = 5; //Math.floor(ymax / 4);
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
    .attr("class", "case_by_transmission xaxis")
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
    .attr("class", "case_by_transmission xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleLinear()
    .domain([0, ymax])
    .range([height, 0]);
  var yAxis = d3.axisLeft(y)
    .tickSize(-width)
    .tickValues(ytick)
  svg.append("g")
    .attr("class", "case_by_transmission xaxis")
    .call(yAxis)

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  svg.append("g")
    .attr("class", "case_by_transmission xaxis")
    .attr("transform", "translate("+width+",0)")
    .call(yAxis2)

  //-- Colors
  var color = d3.scaleOrdinal()
    .domain([colList[2], colList[1], colList[0]])
    .range(['#3366BB', '#CC6677', '#55BB44'])

  //-- ylabel
  svg.append("text")
    .attr("class", "case_by_transmission xaxis")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-margin.left*0.75).toString() + ", " + (height/2).toString() + ")rotate(-90)")
    .text("Number counts");
    
  //-- Legend
  var x_legend = 100;
  var y_legend = 50;
  
  label = ["Imported", "Indigenous linked to known cases", "Indigenous unlinked"]
  svg.selectAll("dot")
    .data(label)
    .enter()
    .append("circle")
      .attr("cx", x_legend)
      .attr("cy", function(d,i){ return y_legend + i*25})
      .attr("r", 7)
      .style("fill", function(d){ return color(d)})
      
  svg.selectAll("label")
    .data(label)
    .enter()
    .append("text")
      .attr("class", "case_by_transmission xaxis")
      .attr("x", x_legend+20)
      .attr("y", function(d,i){ return y_legend + i*25 + 7})
      .style("fill", function(d){ return color(d)})
      .text(function(d){return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  
  var Im_sum = d3.sum(data, function(d){return parseInt(d["imported"]);});
  var IL_sum = d3.sum(data, function(d){return parseInt(d["indigenous linked"]);});
  var IU_sum = d3.sum(data, function(d){return parseInt(d["indigenous unlinked"]);});
  svg.selectAll("sum")
    .data([Im_sum, IL_sum, IU_sum])
    .enter()
    .append("text")
      .attr("class", "case_by_transmission xaxis")
      .attr("x", x_legend-20)
      .attr("y", function(d,i){ return y_legend + i*25 + 7})
      .style("fill", function(d){ return color(d)})
      .text(function(d){return d})
      .attr("text-anchor", "end")
      .style("alignment-baseline", "middle")
  
  //-- Tooltip
  var Tooltip = d3.select("#case_by_transmission")
    .append("div")
    .attr("class", "tooltip")

  var mouseover = function(d) {
    Tooltip.transition()
      .duration(200)
      .style("opacity", 0.9)
    d3.select(this)
      .style("opacity", 0.8)
  }
  
  function getLoc (d) {
    var dist = [];
    var i;
    
    var l_max = 0;
    var j = 0;
    
    for (i=0; i<4; i++) {
      dist.push((d[0] - corner[i][0])**2 + (d[1] - corner[i][1])**2);
      if (dist[i] > l_max) {
        l_max = dist[i];
        j = i;
      }
    }
    
    l_max = Math.sqrt(l_max);
    
    var xAlpha = 0.1; //0.35 - l_max*0.00025;
    var yAlpha = 0.35; //0.35 - l_max*0.00025;
    var xPos = d[0] * (1-xAlpha) + corner[j][0] * xAlpha;
    var yPos = d[1] * (1-yAlpha) + corner[j][1] * yAlpha;
    
    var svgDim = d3.select("#case_by_transmission").node().getBoundingClientRect();
    var xAspect = (svgDim.width - 2* 1.25*16) / totWidth,
        yAspect = (svgDim.height - 2* 1.25*16) / totHeight;
    
    var xPos2 = (xPos + margin.left) * xAspect + 1.25*16;//; (xPos - margin.left)
    var yPos2 = (yPos + margin.top) * yAspect + 1.25*16 + 3.125*16; // + svgDim.top; (yPos - margin.top)
    
    
//     console.log(d, svgDim.left, svgDim.width, margin.left, aspectX);
    return [xPos2, yPos2];
  }
//   document.write()
  
  
  var mousemove = function(d) {
    var newLoc = getLoc(d3.mouse(this));
    
    Tooltip
      .html(d.data["date"] + "<br>Total = " + dailySum(d.data) + "<br>Imported = " + d.data["imported"] + "<br>Ind. linked = " + d.data["indigenous linked"] + "<br>Ind. unlinked = " + d.data["indigenous unlinked"])
      .style("left", (newLoc[0]) + "px")
      .style("top", (newLoc[1]) + "px")
//       .style("left", "0px")
//       .style("top", "0px")
  }
  
  var mouseleave = function(d) {
    Tooltip.transition()
      .duration(10)
      .style("opacity", 0)
    d3.select(this)
      .style("opacity", 1)
  }
      
  
  //-- Stack data
  var stackedData = d3.stack()
    .keys(colList)(data)
  
  
  //-- Show the bars
  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) {return color(d.key);})
      .selectAll("rect")
      .data(function(d) {return d;})
      .enter().append("rect")
        .attr("x", function(d) {return x(d.data["date"]);})
        .attr("y", function(d) {return y(d[1]);})
        .attr("height", function(d) {return y(d[0]) - y(d[1]);})
        .attr("width", x.bandwidth())
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

