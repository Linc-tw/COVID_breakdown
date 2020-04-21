var THSC_wrap = {};
THSC_wrap.tag = 'travel_history_symptom_correlations'
THSC_wrap.id = '#' + THSC_wrap.tag
THSC_wrap.dataPathList = [
  "processed_data/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/travel_history_symptom_correlations_counts.csv", 
  "processed_data/travel_history_symptom_counts.csv"
];

function THSC_makeCanvas() {
  var totWidth = 800;
  var totHeight, top;
  if (lang == 'zh-tw') {
    totHeight = 540;
    left = 200;
    top = 155;
  }
  else {
    totHeight = 600;
    left = 235;
    top = 205;
  }
  
  var margin = {left: left, right: 2, bottom: 2, top: top};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(THSC_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  THSC_wrap.totWidth = totWidth;
  THSC_wrap.totHeight = totHeight;
  THSC_wrap.margin = margin;
  THSC_wrap.width = width;
  THSC_wrap.height = height;
  THSC_wrap.corner = corner;
  THSC_wrap.svg = svg;
}

function THSC_formatData(data, data2) {
  var symptomList = [];
  var travHistList = [];
  var i, j, travHist, symptom;
  
  for (i=0; i<data.length; i++) {
    travHist = data[i]["trav_hist"];
    symptom = data[i]["symptom"];
    
    for (j=0; j<travHistList.length; j++) {
      if (travHist == travHistList[j]) break;
    }
    if (j == travHistList.length) travHistList.push(travHist);
    
    for (j=0; j<symptomList.length; j++) {
      if (symptom == symptomList[j]) break;
    }
    if (j == symptomList.length) symptomList.push(symptom);
  }
  
  for (j=0; j<data2.length; j++) {
    if ('N_imported' == data2[j]['label']) {
      N_imported = data2[j]['count'];
    }
    else if ('N_data' == data2[j]['label']) {
      N_data = data2[j]['count'];
    }
  }
  
  var xticklabel = [];
  var yticklabel = [];
  var N_imported, N_data;
  
  if (lang == 'zh-tw') {
    for (i=0; i<symptomList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (symptomList[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<travHistList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (travHistList[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else {
    for (i=0; i<symptomList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (symptomList[i] == data2[j]['label']) {
          xticklabel.push(symptomList[i].charAt(0).toUpperCase() + symptomList[i].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<travHistList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (travHistList[i] == data2[j]['label']) {
          yticklabel.push(travHistList[i] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  
  THSC_wrap.formattedData = data;
  THSC_wrap.travHistList = travHistList;
  THSC_wrap.symptomList = symptomList;
  THSC_wrap.N_imported = N_imported;
  THSC_wrap.N_data = N_data;
  THSC_wrap.xticklabel = xticklabel;
  THSC_wrap.yticklabel = yticklabel;
}

//-- Hoover
function THSC_mouseover(d) {
  d3.select(this)
    .style("opacity", 0.8)
}

function THSC_mouseleave(d) {
  d3.select(this)
    .style("opacity", 1)
}

function THSC_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, THSC_wrap.width])
    .domain(THSC_wrap.symptomList)
    .padding(0.04);
    
  var xAxis = d3.axisTop(x)
    .tickFormat(function(d, i){return THSC_wrap.xticklabel[i]})
    .tickSize(0)
  
  THSC_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(8,-5) rotate(-90)")
      .style("text-anchor", "start")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, THSC_wrap.symptomList.length])
    .range([0, THSC_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickSize(0)
    .tickFormat(function(d, i){return ""});
  
  THSC_wrap.svg.append("g")
    .attr("transform", "translate(0," + THSC_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleBand()
    .domain(THSC_wrap.travHistList)
    .range([0, THSC_wrap.height])
    .padding(0.04);
  
  var yAxis = d3.axisLeft(y)
    .tickFormat(function(d, i){return THSC_wrap.yticklabel[i]})
    .tickSize(0)
  
  THSC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)
    .selectAll("text")
      .attr("transform", "translate(-3,0)")

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  THSC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + THSC_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- Legend - value
  var lPos = {x: 40, y: -120, dx: 10, dy: 25};
  var lColor = [cList[0], '#999999', '#000000'];
  var lValue = [THSC_wrap.N_data, THSC_wrap.N_imported-THSC_wrap.N_data, THSC_wrap.N_imported];
  THSC_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(lValue)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", -THSC_wrap.margin.left + lPos.x)
      .attr("y", function(d, i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return lColor[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
  
  //-- Color
  var color = d3.scaleSequential()
    .domain([-0.3, 0.3])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Squares
  THSC_wrap.svg.selectAll()
      .data(THSC_wrap.formattedData)
      .enter()
      .append("rect")
        .attr("class", "content square")
        .attr("x", function(d) {return x(d['symptom']);})
        .attr("y", function(d) {return y(d['trav_hist']);})
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) {return color(d['value']);})  
        .on("mouseover", THSC_mouseover)
        .on("mouseleave", THSC_mouseleave)
    
  //-- Texts
  THSC_wrap.svg.selectAll()
    .data(THSC_wrap.formattedData)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function(d) {return x(d['symptom']) + 0.5*+x.bandwidth();})
      .attr("y", function(d) {return y(d['trav_hist']) + 0.5*+y.bandwidth();})
      .style("fill", '#000')
      .text(function(d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  THSC_wrap.x = x;
  THSC_wrap.y = y;
  THSC_wrap.lColor = lColor;
  THSC_wrap.lPos = lPos;
}

function THSC_update() {
  //-- Texts
  THSC_wrap.svg.selectAll(".content.text")
    .remove()
    .exit()
    .data(THSC_wrap.formattedData)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function(d) {return THSC_wrap.x(d['symptom']) + 0.5*+THSC_wrap.x.bandwidth();})
      .attr("y", function(d) {return THSC_wrap.y(d['trav_hist']) + 0.5*+THSC_wrap.y.bandwidth();})
      .style("fill", '#000')
      .text(function(d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Legend - label
  var lLabel;
  if (lang == 'zh-tw') lLabel = ['有資料案例數', '資料不全', '境外移入總數'];
  else lLabel = ['Data complete', 'Data incomplete', 'Total (imported)'];
  
  THSC_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(lLabel)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", -THSC_wrap.margin.left + THSC_wrap.lPos.x + THSC_wrap.lPos.dx)
      .attr("y", function(d, i) {return THSC_wrap.lPos.y + i*THSC_wrap.lPos.dy})
      .style("fill", function(d, i) {return THSC_wrap.lColor[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "start")
}

THSC_wrap.doCount = 0;

d3.csv(THSC_wrap.dataPathList[THSC_wrap.doCount], function(error, data) {
  d3.csv(THSC_wrap.dataPathList[2], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    THSC_makeCanvas();
    THSC_formatData(data, data2);
    THSC_initialize();
    THSC_update();
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + THSC_wrap.tag + "_doCount']", function(event) {
  THSC_wrap.doCount = this.value;
  dataPath = THSC_wrap.dataPathList[THSC_wrap.doCount]
  dataPath2 = THSC_wrap.dataPathList[2]
  
  d3.csv(dataPath, function(error, data) {
    d3.csv(dataPath2, function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_formatData(data, data2);
      THSC_update();
    });
  });
});

d3.select(THSC_wrap.id + '_button_3').on('click', function(){
  var tag1;
  
  if (THSC_wrap.doCount == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = THSC_wrap.tag + '_' + tag1 + '.png'
  saveSvgAsPng(d3.select(THSC_wrap.id).select('svg').node(), name);
});

