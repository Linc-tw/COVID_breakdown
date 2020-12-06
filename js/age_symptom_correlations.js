
//-- Filename:
//--   age_symptom_correlations.js
//--
//-- Author:
//--   Chieh-An Lin

function ASC_Make_Canvas(wrap) {
  var tot_width = 800;
  var tot_height, top;
  if (lang == 'zh-tw') {
    tot_height = 540;
    left = 200;
    top = 155;
  }
  else if (lang == 'fr') {
    tot_height = 600;
    left = 235;
    top = 225;
  }
  else {
    tot_height = 600;
    left = 235;
    top = 215;
  }
  
  var margin = {left: left, right: 2, bottom: 2, top: top};
  var width = tot_width - margin.left - margin.right;
  var height = tot_height - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(ASC_latest_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + tot_width + " " + tot_height)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  ASC_latest_wrap.tot_width = tot_width;
  ASC_latest_wrap.tot_height = tot_height;
  ASC_latest_wrap.margin = margin;
  ASC_latest_wrap.width = width;
  ASC_latest_wrap.height = height;
  ASC_latest_wrap.corner = corner;
  ASC_latest_wrap.svg = svg;
}

function ASC_Format_Data(wrap, data) {
  var symptom_list = [];
  var age_list = [];
  var i, j, age, symptom;
  
  for (i=0; i<data.length; i++) {
    age = data[i]["age"];
    symptom = data[i]["symptom"];
    
    for (j=0; j<age_list.length; j++) {
      if (age == age_list[j]) break;
    }
    if (j == age_list.length) age_list.push(age);
    
    for (j=0; j<symptom_list.length; j++) {
      if (symptom == symptom_list[j]) break;
    }
    if (j == symptom_list.length) symptom_list.push(symptom);
  }
  
  ASC_latest_wrap.formatted_data = data;
  ASC_latest_wrap.age_list = age_list;
  ASC_latest_wrap.symptom_list = symptom_list;
}

function ASC_FormatData_2(wrap, data2) {
  var xticklabel = [];
  var yticklabel = [];
  var i, j, n_total, n_data;
  
  for (j=0; j<data2.length; j++) {
    if ('N_total' == data2[j]['label']) {
      n_total = data2[j]['count'];
    }
    else if ('N_data' == data2[j]['label']) {
      n_data = data2[j]['count'];
    }
  }
  
  if (lang == 'zh-tw') {
    for (i=0; i<ASC_latest_wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_latest_wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<ASC_latest_wrap.age_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_latest_wrap.age_list[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else if (lang == 'fr') {
    for (i=0; i<ASC_latest_wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_latest_wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_fr'].charAt(0).toUpperCase() + data2[j]['label_fr'].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<ASC_latest_wrap.age_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_latest_wrap.age_list[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_fr'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else {
    for (i=0; i<ASC_latest_wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_latest_wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(ASC_latest_wrap.symptom_list[i].charAt(0).toUpperCase() + ASC_latest_wrap.symptom_list[i].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<ASC_latest_wrap.age_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (ASC_latest_wrap.age_list[i] == data2[j]['label']) {
          yticklabel.push(ASC_latest_wrap.age_list[i] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  
  ASC_latest_wrap.n_total = n_total;
  ASC_latest_wrap.n_data = n_data;
  ASC_latest_wrap.xticklabel = xticklabel;
  ASC_latest_wrap.yticklabel = yticklabel;
}

//-- Hoover
function ASC_mouseover(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function ASC_mouseleave(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function ASC_initialize(wrap) {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, ASC_latest_wrap.width])
    .domain(ASC_latest_wrap.symptom_list)
    .padding(0.04);
    
  var x_axis = d3.axisTop(x)
    .tickFormat(function (d, i) {return ASC_latest_wrap.xticklabel[i]})
    .tickSize(0)
  
  ASC_latest_wrap.svg.append('g')
    .attr('class', 'xaxis')
    .call(x_axis)
    .selectAll("text")
      .attr("transform", "translate(8,-5) rotate(-90)")
      .style("text-anchor", "start")
    
  //-- Add a 2nd x-axis for ticks
  var x_2 = d3.scaleLinear()
    .domain([0, ASC_latest_wrap.symptom_list.length])
    .range([0, ASC_latest_wrap.width])
  
  var x_axis_2 = d3.axisBottom(x_2)
    .tickSize(0)
    .tickFormat(function (d, i) {return ""});
  
  ASC_latest_wrap.svg.append("g")
    .attr("transform", "translate(0," + ASC_latest_wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
  
  //-- Add y-axis
  var y = d3.scaleBand()
    .domain(ASC_latest_wrap.age_list)
    .range([0, ASC_latest_wrap.height])
    .padding(0.04);
  
  var y_axis = d3.axisLeft(y)
    .tickFormat(function (d, i) {return ASC_latest_wrap.yticklabel[i]})
    .tickSize(0)
  
  ASC_latest_wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis)
    .selectAll("text")
      .attr("transform", "translate(-3,0)")

  //-- Add a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  ASC_latest_wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + ASC_latest_wrap.width + ",0)")
    .call(y_axis_2)
    
  //-- Legend - value
  var legend_pos = {x: 50, y: -0.8*ASC_latest_wrap.margin.top, dx: 12, dy: 30};
  var legend_color = [GS_var.c_list[0], '#999999', '#000000'];
  var legend_value = [ASC_latest_wrap.n_data, ASC_latest_wrap.n_total-ASC_latest_wrap.n_data, ASC_latest_wrap.n_total];
  
  ASC_latest_wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", -ASC_latest_wrap.margin.left + legend_pos.x)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return legend_color[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
  
  //-- Color
  var color = d3.scaleSequential()
    .domain([-0.42, 0.42])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Squares
  ASC_latest_wrap.svg.selectAll()
    .data(ASC_latest_wrap.formatted_data)
    .enter()
    .append("rect")
      .attr("class", "content square")
      .attr("x", function (d) {return x(d['symptom']);})
      .attr("y", function (d) {return y(d['age']);})
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {return color(d['value']);})  
      .on("mouseover", function (d) {ASC_mouseover(wrap, d);})
      .on("mouseleave", function (d) {ASC_mouseleave(wrap, d);})
    
  //-- Texts
  ASC_latest_wrap.svg.selectAll()
    .data(ASC_latest_wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return x(d['symptom']) + 0.5*+x.bandwidth();})
      .attr("y", function (d) {return y(d['age']) + 0.5*+y.bandwidth();})
      .style("fill", '#000')
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  ASC_latest_wrap.x = x;
  ASC_latest_wrap.y = y;
  ASC_latest_wrap.legend_color = legend_color;
  ASC_latest_wrap.legend_pos = legend_pos;
}

function ASC_update(wrap) {
  //-- Texts
  ASC_latest_wrap.svg.selectAll(".content.text")
    .remove()
    .exit()
    .data(ASC_latest_wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return ASC_latest_wrap.x(d['symptom']) + 0.5*+ASC_latest_wrap.x.bandwidth();})
      .attr("y", function (d) {return ASC_latest_wrap.y(d['age']) + 0.5*+ASC_latest_wrap.y.bandwidth();})
      .style("fill", '#000')
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Legend - label
  var legend_label;
  if (lang == 'zh-tw') legend_label = ['有資料案例數', '資料不全', '合計'];
  else if (lang == 'fr') legend_label = ['Données complètes', 'Données incomplètes', 'Total'];
  else legend_label = ['Data complete', 'Data incomplete', 'Total'];
  
  ASC_latest_wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", -ASC_latest_wrap.margin.left + ASC_latest_wrap.legend_pos.x + ASC_latest_wrap.legend_pos.dx)
      .attr("y", function (d, i) {return ASC_latest_wrap.legend_pos.y + i*ASC_latest_wrap.legend_pos.dy})
      .style("fill", function (d, i) {return ASC_latest_wrap.legend_color[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}

//-- Global variable
var ASC_latest_wrap = {};

//-- ID
ASC_latest_wrap.tag = 'age_symptom_correlations'
ASC_latest_wrap.id = '#' + ASC_latest_wrap.tag

//-- File path
ASC_latest_wrap.dataPathList = [
  "processed_data/age_symptom_correlations_coefficient.csv",
  "processed_data/age_symptom_correlations_counts.csv", 
  "processed_data/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_latest_wrap.doCount = 0;

//-- Plot
function ASC_Latest_Plot() {
  d3.csv(ASC_latest_wrap.dataPathList[ASC_latest_wrap.doCount], function (error, data) {
    d3.csv(ASC_latest_wrap.dataPathList[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Make_Canvas(ASC_latest_wrap);
      ASC_Format_Data(ASC_latest_wrap, data);
      ASC_FormatData_2(ASC_latest_wrap, data2);
      ASC_initialize(ASC_latest_wrap);
      ASC_update(ASC_latest_wrap);
    });
  });
}

ASC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_latest_wrap.tag + "_doCount']", function (event) {
  ASC_latest_wrap.doCount = this.value;
  dataPath = ASC_latest_wrap.dataPathList[ASC_latest_wrap.doCount]
  dataPath2 = ASC_latest_wrap.dataPathList[2]
  
  d3.csv(dataPath, function (error, data) {
    d3.csv(dataPath2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Format_Data(ASC_latest_wrap, data);
      ASC_FormatData_2(ASC_latest_wrap, data2);
      ASC_update(ASC_latest_wrap);
    });
  });
});

//-- Save button
d3.select(ASC_latest_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_latest_wrap.doCount == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_latest_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(ASC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(ASC_latest_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_Latest_Plot();
});
