var ASC_wrap = {};
ASC_wrap.tag = 'age_symptom_correlations'
ASC_wrap.id = '#' + ASC_wrap.tag
ASC_wrap.dataPathList = [
  "processed_data/age_symptom_correlations_coefficient.csv",
  "processed_data/age_symptom_correlations_counts.csv", 
  "processed_data/age_symptom_counts.csv"
];

function ASC_makeCanvas() {
  var totWidth = 800;
  var totHeight, top;
  if (lang == 'zh-tw') {
    totHeight = 540;
    left = 200;
    top = 155;
  }
  else if (lang == 'fr') {
    totHeight = 600;
    left = 235;
    top = 225;
  }
  else {
    totHeight = 600;
    left = 235;
    top = 215;
  }
  
  var margin = {left: left, right: 2, bottom: 2, top: top};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(ASC_wrap.id)
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
  
  ASC_wrap.totWidth = totWidth;
  ASC_wrap.totHeight = totHeight;
  ASC_wrap.margin = margin;
  ASC_wrap.width = width;
  ASC_wrap.height = height;
  ASC_wrap.corner = corner;
  ASC_wrap.svg = svg;
}

function ASC_formatData(data) {
  var symptomList = [];
  var ageList = [];
  var i, j, age, symptom;
  
  for (i=0; i<data.length; i++) {
    age = data[i]["age"];
    symptom = data[i]["symptom"];
    
    for (j=0; j<ageList.length; j++) {
      if (age == ageList[j]) break;
    }
    if (j == ageList.length) ageList.push(age);
    
    for (j=0; j<symptomList.length; j++) {
      if (symptom == symptomList[j]) break;
    }
    if (j == symptomList.length) symptomList.push(symptom);
  }
  
  ASC_wrap.formattedData = data;
  ASC_wrap.ageList = ageList;
  ASC_wrap.symptomList = symptomList;
}

function ASC_formatData2(data2) {
  var xticklabel = [];
  var yticklabel = [];
  var i, j, N_total, N_data;
  
  for (j=0; j<data2.length; j++) {
    if ('N_total' == data2[j]['label']) {
      N_total = data2[j]['count'];
    }
    else if ('N_data' == data2[j]['label']) {
      N_data = data2[j]['count'];
    }
  }
  
  if (lang == 'zh-tw') {
    for (i=0; i<ASC_wrap.symptomList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_wrap.symptomList[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<ASC_wrap.ageList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_wrap.ageList[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else if (lang == 'fr') {
    for (i=0; i<ASC_wrap.symptomList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_wrap.symptomList[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_fr'].charAt(0).toUpperCase() + data2[j]['label_fr'].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<ASC_wrap.ageList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_wrap.ageList[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_fr'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else {
    for (i=0; i<ASC_wrap.symptomList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_wrap.symptomList[i] == data2[j]['label']) {
          xticklabel.push(ASC_wrap.symptomList[i].charAt(0).toUpperCase() + ASC_wrap.symptomList[i].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<ASC_wrap.ageList.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_wrap.ageList[i] == data2[j]['label']) {
          yticklabel.push(ASC_wrap.ageList[i] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  
  ASC_wrap.N_total = N_total;
  ASC_wrap.N_data = N_data;
  ASC_wrap.xticklabel = xticklabel;
  ASC_wrap.yticklabel = yticklabel;
}

//-- Hoover
function ASC_mouseover(d) {
  d3.select(this)
    .style("opacity", 0.8)
}

function ASC_mouseleave(d) {
  d3.select(this)
    .style("opacity", 1)
}

function ASC_initialize() {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, ASC_wrap.width])
    .domain(ASC_wrap.symptomList)
    .padding(0.04);
    
  var xAxis = d3.axisTop(x)
    .tickFormat(function(d, i){return ASC_wrap.xticklabel[i]})
    .tickSize(0)
  
  ASC_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(8,-5) rotate(-90)")
      .style("text-anchor", "start")
    
  //-- Add a 2nd x-axis for ticks
  var x2 = d3.scaleLinear()
    .domain([0, ASC_wrap.symptomList.length])
    .range([0, ASC_wrap.width])
  
  var xAxis2 = d3.axisBottom(x2)
    .tickSize(0)
    .tickFormat(function(d, i){return ""});
  
  ASC_wrap.svg.append("g")
    .attr("transform", "translate(0," + ASC_wrap.height + ")")
    .attr("class", "xaxis")
    .call(xAxis2)
  
  //-- Add y-axis
  var y = d3.scaleBand()
    .domain(ASC_wrap.ageList)
    .range([0, ASC_wrap.height])
    .padding(0.04);
  
  var yAxis = d3.axisLeft(y)
    .tickFormat(function(d, i){return ASC_wrap.yticklabel[i]})
    .tickSize(0)
  
  ASC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)
    .selectAll("text")
      .attr("transform", "translate(-3,0)")

  //-- Add a 2nd y-axis for the frameline at right
  var yAxis2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  ASC_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + ASC_wrap.width + ",0)")
    .call(yAxis2)
    
  //-- Legend - value
  var lPos = {x: 50, y: -0.8*ASC_wrap.margin.top, dx: 12, dy: 30};
  var lColor = [cList[0], '#999999', '#000000'];
  var lValue = [ASC_wrap.N_data, ASC_wrap.N_total-ASC_wrap.N_data, ASC_wrap.N_total];
  
  ASC_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(lValue)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", -ASC_wrap.margin.left + lPos.x)
      .attr("y", function(d, i) {return lPos.y + i*lPos.dy})
      .style("fill", function(d, i) {return lColor[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "end")
  
  //-- Color
  var color = d3.scaleSequential()
    .domain([-0.3, 0.3])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Squares
  ASC_wrap.svg.selectAll()
      .data(ASC_wrap.formattedData)
      .enter()
      .append("rect")
        .attr("class", "content square")
        .attr("x", function(d) {return x(d['symptom']);})
        .attr("y", function(d) {return y(d['age']);})
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) {return color(d['value']);})  
        .on("mouseover", ASC_mouseover)
        .on("mouseleave", ASC_mouseleave)
    
  //-- Texts
  ASC_wrap.svg.selectAll()
    .data(ASC_wrap.formattedData)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function(d) {return x(d['symptom']) + 0.5*+x.bandwidth();})
      .attr("y", function(d) {return y(d['age']) + 0.5*+y.bandwidth();})
      .style("fill", '#000')
      .text(function(d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  ASC_wrap.x = x;
  ASC_wrap.y = y;
  ASC_wrap.lColor = lColor;
  ASC_wrap.lPos = lPos;
}

function ASC_update() {
  //-- Texts
  ASC_wrap.svg.selectAll(".content.text")
    .remove()
    .exit()
    .data(ASC_wrap.formattedData)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function(d) {return ASC_wrap.x(d['symptom']) + 0.5*+ASC_wrap.x.bandwidth();})
      .attr("y", function(d) {return ASC_wrap.y(d['age']) + 0.5*+ASC_wrap.y.bandwidth();})
      .style("fill", '#000')
      .text(function(d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Legend - label
  var lLabel;
  if (lang == 'zh-tw') lLabel = ['有資料案例數', '資料不全', '合計'];
  else if (lang == 'fr') lLabel = ['Données complètes', 'Données incomplètes', 'Total'];
  else lLabel = ['Data complete', 'Data incomplete', 'Total'];
  
  ASC_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(lLabel)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", -ASC_wrap.margin.left + ASC_wrap.lPos.x + ASC_wrap.lPos.dx)
      .attr("y", function(d, i) {return ASC_wrap.lPos.y + i*ASC_wrap.lPos.dy})
      .style("fill", function(d, i) {return ASC_wrap.lColor[i]})
      .text(function(d) {return d})
      .attr("text-anchor", "start")
}

ASC_wrap.doCount = 0;

d3.csv(ASC_wrap.dataPathList[ASC_wrap.doCount], function(error, data) {
  d3.csv(ASC_wrap.dataPathList[2], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    ASC_makeCanvas();
    ASC_formatData(data);
    ASC_formatData2(data2);
    ASC_initialize();
    ASC_update();
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_wrap.tag + "_doCount']", function(event) {
  ASC_wrap.doCount = this.value;
  dataPath = ASC_wrap.dataPathList[ASC_wrap.doCount]
  dataPath2 = ASC_wrap.dataPathList[2]
  
  d3.csv(dataPath, function(error, data) {
    d3.csv(dataPath2, function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_formatData(data);
      ASC_formatData2(data2);
      ASC_update();
    });
  });
});

d3.select(ASC_wrap.id + '_button_3').on('click', function(){
  var tag1;
  
  if (ASC_wrap.doCount == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(ASC_wrap.id).select('svg').node(), name);
});

