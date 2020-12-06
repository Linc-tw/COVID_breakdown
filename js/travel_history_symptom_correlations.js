
//-- Filename:
//--   travel_history_symptom_correlations.js
//--
//-- Author:
//--   Chieh-An Lin

function THSC_Make_Canvas(wrap) {
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
    top = 235;
  }
  else {
    tot_height = 600;
    left = 225;
    top = 215;
  }
  
  var margin = {left: left, right: 2, bottom: 2, top: top};
  var width = tot_width - margin.left - margin.right;
  var height = tot_height - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(wrap.id)
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
  
  wrap.tot_width = tot_width;
  wrap.tot_height = tot_height;
  wrap.margin = margin;
  wrap.width = width;
  wrap.height = height;
  wrap.corner = corner;
  wrap.svg = svg;
}

function THSC_Format_Data(wrap, data) {
  var symptom_list = [];
  var trav_hist_list = [];
  var i, j, trav_hist, symptom;
  
  for (i=0; i<data.length; i++) {
    trav_hist = data[i]["trav_hist"];
    symptom = data[i]["symptom"];
    
    for (j=0; j<trav_hist_list.length; j++) {
      if (trav_hist == trav_hist_list[j]) break;
    }
    if (j == trav_hist_list.length) trav_hist_list.push(trav_hist);
    
    for (j=0; j<symptom_list.length; j++) {
      if (symptom == symptom_list[j]) break;
    }
    if (j == symptom_list.length) symptom_list.push(symptom);
  }
  
  wrap.formatted_data = data;
  wrap.trav_hist_list = trav_hist_list;
  wrap.symptom_list = symptom_list;
}

function THSC_Format_Data_2(wrap, data2) {
  var xticklabel = [];
  var yticklabel = [];
  var i, j, n_total, n_imported, n_data;
  
  for (j=0; j<data2.length; j++) {
    if ('N_total' == data2[j]['label']) {
      n_total = data2[j]['count'];
    }
    else if ('N_imported' == data2[j]['label']) {
      n_imported = data2[j]['count'];
    }
    else if ('N_data' == data2[j]['label']) {
      n_data = data2[j]['count'];
    }
  }
  
  if (lang == 'zh-tw') {
    for (i=0; i<wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<wrap.trav_hist_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.trav_hist_list[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else if (lang == 'fr') {
    for (i=0; i<wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_fr'].charAt(0).toUpperCase() + data2[j]['label_fr'].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<wrap.trav_hist_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.trav_hist_list[i] == data2[j]['label']) {
          yticklabel.push(data2[j]['label_fr'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  else {
    for (i=0; i<wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(wrap.symptom_list[i].charAt(0).toUpperCase() + wrap.symptom_list[i].slice(1) + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<wrap.trav_hist_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.trav_hist_list[i] == data2[j]['label']) {
          yticklabel.push(wrap.trav_hist_list[i] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  
  wrap.n_total = n_total;
  wrap.n_imported = n_imported;
  wrap.n_data = n_data;
  wrap.xticklabel = xticklabel;
  wrap.yticklabel = yticklabel;
}

function THSC_Mouse_Over(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 0.8)
}

function THSC_Mouse_Leave(wrap, d) {
  d3.select(d3.event.target)
    .style("opacity", 1)
}

function THSC_Initialize(wrap) {
  //-- Add x-axis
  var x = d3.scaleBand()
    .range([0, wrap.width])
    .domain(wrap.symptom_list)
    .padding(0.04);
    
  var y_axis = d3.axisTop(x)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]})
    .tickSize(0)
  
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .call(y_axis)
    .selectAll("text")
      .attr("transform", "translate(8,-5) rotate(-90)")
      .style("text-anchor", "start")
    
  //-- Add a 2nd x-axis for ticks
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.symptom_list.length])
    .range([0, wrap.width])
  
  var y_axis_2 = d3.axisBottom(x_2)
    .tickSize(0)
    .tickFormat(function (d, i) {return ""});
  
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(y_axis_2)
  
  //-- Add y-axis
  var y = d3.scaleBand()
    .domain(wrap.trav_hist_list)
    .range([0, wrap.height])
    .padding(0.04);
  
  var y_axis = d3.axisLeft(y)
    .tickFormat(function (d, i) {return wrap.yticklabel[i]})
    .tickSize(0)
  
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis)
    .selectAll("text")
      .attr("transform", "translate(-3,0)")

  //-- Add a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .ticks(0)
    .tickSize(0)
  
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2)
    
  //-- Legend - value
  var legend_pos = {x: 50, y: -0.8*wrap.margin.top, dx: 12, dy: 30};
  var legend_color = [GS_var.c_list[0], '#999999', '#999999', '#000000'];
  var legend_value = [wrap.n_data, wrap.n_imported-wrap.n_data, wrap.n_total-wrap.n_imported, wrap.n_total];
  
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", -wrap.margin.left + legend_pos.x)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy})
      .style("fill", function (d, i) {return legend_color[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "end")
  
  //-- Color
  var color = d3.scaleSequential()
    .domain([-0.42, 0.42])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Squares
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append("rect")
      .attr("class", "content square")
      .attr("x", function (d) {return x(d['symptom']);})
      .attr("y", function (d) {return y(d['trav_hist']);})
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {return color(d['value']);})
      .on("mouseover", function (d) {THSC_Mouse_Over(wrap, d);})
      .on("mouseleave", function (d) {THSC_Mouse_Leave(wrap, d);})
    
  //-- Texts
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return x(d['symptom']) + 0.5*+x.bandwidth();})
      .attr("y", function (d) {return y(d['trav_hist']) + 0.5*+y.bandwidth();})
      .style("fill", '#000')
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  wrap.x = x;
  wrap.y = y;
  wrap.legend_color = legend_color;
  wrap.legend_pos = legend_pos;
}

function THSC_Update(wrap) {
  //-- Texts
  wrap.svg.selectAll(".content.text")
    .remove()
    .exit()
    .data(wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return wrap.x(d['symptom']) + 0.5*+wrap.x.bandwidth();})
      .attr("y", function (d) {return wrap.y(d['trav_hist']) + 0.5*+wrap.y.bandwidth();})
      .style("fill", '#000')
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Legend - label
  var legend_label;
  if (lang == 'zh-tw') legend_label = ['有資料案例數', '資料不全', '無旅遊史', '合計'];
  else if (lang == 'fr') legend_label = ['Données complètes', 'Données incomplètes', 'Sans anté. de voyage', 'Total'];
  else legend_label = ['Data complete', 'Data incomplete', 'No travel history', 'Total'];
  
  wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", -wrap.margin.left + wrap.legend_pos.x + wrap.legend_pos.dx)
      .attr("y", function (d, i) {return wrap.legend_pos.y + i*wrap.legend_pos.dy})
      .style("fill", function (d, i) {return wrap.legend_color[i]})
      .text(function (d) {return d})
      .attr("text-anchor", "start")
}

//-- Global variable
var THSC_latest_wrap = {};

//-- ID
THSC_latest_wrap.tag = 'travel_history_symptom_correlations_latest'
THSC_latest_wrap.id = '#' + THSC_latest_wrap.tag

//-- File path
THSC_latest_wrap.data_path_list = [
  "processed_data/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/travel_history_symptom_correlations_counts.csv", 
  "processed_data/travel_history_symptom_counts.csv"
];

//-- Parameters

//-- Variables
THSC_latest_wrap.do_count = 0;

//-- Plot
function THSC_Latest_Plot() {
  d3.csv(THSC_latest_wrap.data_path_list[THSC_latest_wrap.do_count], function (error, data) {
    d3.csv(THSC_latest_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_Make_Canvas(THSC_latest_wrap);
      THSC_Format_Data(THSC_latest_wrap, data);
      THSC_Format_Data_2(THSC_latest_wrap, data2);
      THSC_Initialize(THSC_latest_wrap);
      THSC_Update(THSC_latest_wrap);
    });
  });
}

THSC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + THSC_latest_wrap.tag + "_doCount']", function (event) {
  THSC_latest_wrap.do_count = this.value;
  data_path = THSC_latest_wrap.data_path_list[THSC_latest_wrap.do_count]
  data_path_2 = THSC_latest_wrap.data_path_list[2]
  
  d3.csv(data_path, function (error, data) {
    d3.csv(data_path_2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_Format_Data(THSC_latest_wrap, data);
      THSC_Format_Data_2(THSC_latest_wrap, data2);
      THSC_Update(THSC_latest_wrap);
    });
  });
});

//-- Save button
d3.select(THSC_latest_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (THSC_latest_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = THSC_latest_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(THSC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(THSC_latest_wrap.id+' .plot').remove()
  
  //-- Replot
  THSC_Latest_Plot();
});
