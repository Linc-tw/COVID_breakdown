
var totWidth = 800;
var totHeight = 500;

//-- Dimension & margin
var margin = {top: 0, right: 0, bottom: 90, left: 60},
    width = totWidth - margin.left - margin.right,
    height = totHeight - margin.top - margin.bottom;

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
  
  //-- Convert date format
  var convertDateLabel = function(i){
    var dateFormat = d3.timeFormat("%b %d");
    return dateFormat(d3.isoParse(data[i]["date"]));
  }
  
  //-- Calculate xticklabels
  var xlabel_path = 7;
  var q = data.length % xlabel_path;
  var r;
  if (q <= 1) r = 3;
  else if (q == 2) r = 4;
  else if (q <= 4) r = 1;
  else r = 2;
  
  var xtick = [];
  var xticklabel = [];
  var ymax = 0.0;
  var i;
  
  for (i=0; i<data.length; i++) {
    ymax = Math.max(ymax, Number(data[i]["indigenous unknown"])+Number(data[i]["indigenous known"])+Number(data[i]["imported"]));
    
    if (i % xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(convertDateLabel(i));
    }
    else {
      xticklabel.push("");
    }
  }
  
  //-- Calculate y_max
  ymax *= 1.09;
  var ypath = 5; //Math.floor(ymax / 4);
  var ytick = [];
  for (i=0; i<ymax; i+=ypath) ytick.push(i)
  
  //-- Columns
  var colList = data.columns.slice(1);
  
  //-- Rows
  var dateList = d3.map(data, function(d){return(d.date)}).keys();

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
    .domain(colList)
    .range(['#55BB44', '#CC6677', '#3366BB'])

  //-- Texts
  svg.append("text")
    .attr("class", "case_by_transmission xaxis")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (-margin.left*0.75).toString() + ", " + (height/2).toString() + ")rotate(-90)")
    .text("Number counts");
    
  //-- Legend
  // Add one dot in the legend for each name.
  var dx1 = 50;
  var dy1 = 75;
  
  svg.selectAll("dot")
    .data(colList)
    .enter()
    .append("circle")
      .attr("cx", dx1)
      .attr("cy", function(d,i){ return dy1 - i*25})
      .attr("r", 7)
      .style("fill", function(d){ return color(d)})
      
  label = ["Indigenous unlinked", "Indigenous linked to known cases", "Imported"]
  svg.selectAll("label")
    .data(label)
    .enter()
    .append("text")
      .attr("class", "case_by_transmission xaxis")
      .attr("x", dx1+20)
      .attr("y", function(d,i){ return dy1 - i*25 + 6})
      .style("fill", function(d){ return color(d)})
      .text(function(d){return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  
  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(colList)(data)
  
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) {return x(d.data.date);})
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
})

