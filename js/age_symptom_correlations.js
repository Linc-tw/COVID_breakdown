
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
    left = 205;
    top = 155;
  }
  else if (lang == 'fr') {
    tot_height = 600;
    left = 260;
    top = 235;
  }
  else {
    tot_height = 600;
    left = 230;
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
  
  wrap.formatted_data = data;
  wrap.age_list = age_list;
  wrap.symptom_list = symptom_list;
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
    for (i=0; i<wrap.symptom_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.symptom_list[i] == data2[j]['label']) {
          xticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
    
    for (i=0; i<wrap.age_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.age_list[i] == data2[j]['label']) {
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
    
    for (i=0; i<wrap.age_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.age_list[i] == data2[j]['label']) {
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
    
    for (i=0; i<wrap.age_list.length; i++) {
      for (j=0; j<data2.length; j++) {
        if (wrap.age_list[i] == data2[j]['label']) {
          yticklabel.push(wrap.age_list[i] + ' (' + data2[j]['count'] + ')');
          break;
        }
      }
    }
  }
  
  wrap.n_total = n_total;
  wrap.n_data = n_data;
  wrap.xticklabel = xticklabel;
  wrap.yticklabel = yticklabel;
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
    .range([0, wrap.width])
    .domain(wrap.symptom_list)
    .padding(0.04);
    
  var x_axis = d3.axisTop(x)
    .tickFormat(function (d, i) {return wrap.xticklabel[i]})
    .tickSize(0)
  
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .call(x_axis)
    .selectAll("text")
      .attr("transform", "translate(8,-5) rotate(-90)")
      .style("text-anchor", "start")
    
  //-- Add a 2nd x-axis for ticks
  var x_2 = d3.scaleLinear()
    .domain([0, wrap.symptom_list.length])
    .range([0, wrap.width])
  
  var x_axis_2 = d3.axisBottom(x_2)
    .tickSize(0)
    .tickFormat(function (d, i) {return ""});
  
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2)
  
  //-- Add y-axis
  var y = d3.scaleBand()
    .domain(wrap.age_list)
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
  var legend_color = [GS_var.c_list[0], '#999999', '#000000'];
  var legend_value = [wrap.n_data, wrap.n_total-wrap.n_data, wrap.n_total];
  
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
    .domain([-0.3, 0.3])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Squares
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
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
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return x(d['symptom']) + 0.5*+x.bandwidth();})
      .attr("y", function (d) {return y(d['age']) + 0.5*+y.bandwidth();})
      .style("fill", function (d) {if (Math.abs(d['value'])<0.25) return '#000'; return '#fff';})
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  wrap.x = x;
  wrap.y = y;
  wrap.legend_color = legend_color;
  wrap.legend_pos = legend_pos;
}

function ASC_update(wrap) {
  //-- Texts
  wrap.svg.selectAll(".content.text")
    .remove()
    .exit()
    .data(wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return wrap.x(d['symptom']) + 0.5*+wrap.x.bandwidth();})
      .attr("y", function (d) {return wrap.y(d['age']) + 0.5*+wrap.y.bandwidth();})
      .style("fill", function (d) {if (Math.abs(d['value'])<0.25) return '#000'; return '#fff';})
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Legend - label
  var legend_label;
  if (lang == 'zh-tw') legend_label = ['有資料案例數', '資料不全', '合計'];
  else if (lang == 'fr') legend_label = ['Données complètes', 'Données incomplètes', 'Total'];
  else legend_label = ['Data complete', 'Data incomplete', 'Total'];
  
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
