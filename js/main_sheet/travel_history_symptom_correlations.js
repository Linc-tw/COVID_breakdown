
//-- Filename:
//--   travel_history_symptom_correlations.js
//--
//-- Author:
//--   Chieh-An Lin

function THSC_InitFig(wrap) {
  wrap.tot_width = 800;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 540;
  wrap.tot_height_['fr'] = 600;
  wrap.tot_height_['en'] = 600;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 230, right: 2, bottom: 2, top: 145};
  wrap.margin_['fr'] = {left: 280, right: 2, bottom: 2, top: 220};
  wrap.margin_['en'] = {left: 250, right: 2, bottom: 2, top: 200};
  
  GS_InitFig(wrap);
}

function THSC_ResetText() {
  if (GS_lang == 'zh-tw') {
    TT_AddStr("travel_history_symptom_correlations_title", "旅遊史與症狀相關程度");
    TT_AddStr("travel_history_symptom_correlations_button_1", "相關係數");
    TT_AddStr("travel_history_symptom_correlations_button_2", "案例數");
  }
  
  else if (GS_lang == 'fr') {
    TT_AddStr("travel_history_symptom_correlations_title", "Corrélations entre antécédents de voyage & symptômes");
    TT_AddStr("travel_history_symptom_correlations_button_1", "Coefficients");
    TT_AddStr("travel_history_symptom_correlations_button_2", "Nombres");
  }
  
  else { //-- En
    TT_AddStr("travel_history_symptom_correlations_title", "Correlations between Travel History & Symptoms");
    TT_AddStr("travel_history_symptom_correlations_button_1", "Coefficients");
    TT_AddStr("travel_history_symptom_correlations_button_2", "Counts");
  }
}

function THSC_FormatData(wrap, data) {
  var symptom_list = [];
  var trav_hist_list = [];
  var i, j, trav_hist, symptom;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    trav_hist = data[i]["trav_hist"];
    symptom = data[i]["symptom"];
    
    //-- Search if `trav_hist` is already there
    for (j=0; j<trav_hist_list.length; j++) {
      if (trav_hist == trav_hist_list[j])
        break;
    }
    
    //-- If not, stock in list
    if (j == trav_hist_list.length)
      trav_hist_list.push(trav_hist);
    
    //-- Search if `symptom` is already there
    for (j=0; j<symptom_list.length; j++) {
      if (symptom == symptom_list[j])
        break;
    }
    
    //-- If not, stock in list
    if (j == symptom_list.length)
      symptom_list.push(symptom);
  }
  
  //-- Save to wrapper
  wrap.formatted_data = data;
  wrap.trav_hist_list = trav_hist_list;
  wrap.symptom_list = symptom_list;
}

function THSC_FormatData2(wrap, data2) {
  var xticklabel = [];
  var yticklabel = [];
  var i, j, n_total, n_imported, n_data;
  
  //-- Loop over row
  for (j=0; j<data2.length; j++) {
    //-- Get value of `n_total`
    if ('N_total' == data2[j]['label']) {
      n_total = data2[j]['count'];
    }
    
    //-- Get value of `n_imported`
    else if ('N_imported' == data2[j]['label']) {
      n_imported = data2[j]['count'];
    }
    
    //-- Get value of `n_data`
    else if ('N_data' == data2[j]['label']) {
      n_data = data2[j]['count'];
    }
  }
  
  //-- Loop over symptom list
  for (i=0; i<wrap.symptom_list.length; i++) {
    //-- Lookup in list
    for (j=0; j<data2.length; j++) {
      //-- If find match
      if (wrap.symptom_list[i] == data2[j]['label']) {
        //-- Switch between languages
        if (GS_lang == 'zh-tw')
          xticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
        else if (GS_lang == 'fr')
          xticklabel.push(data2[j]['label_fr'].charAt(0).toUpperCase() + data2[j]['label_fr'].slice(1) + ' (' + data2[j]['count'] + ')'); //-- First capital
        else
          xticklabel.push(wrap.symptom_list[i].charAt(0).toUpperCase() + wrap.symptom_list[i].slice(1) + ' (' + data2[j]['count'] + ')'); //-- First capital
        break; //-- If matched, stop
      }
    }
  }
  
  //-- Loop over travel history list
  for (i=0; i<wrap.trav_hist_list.length; i++) {
    //-- Lookup in list
    for (j=0; j<data2.length; j++) {
      //-- If find match
      if (wrap.trav_hist_list[i] == data2[j]['label']) {
        //-- Switch between languages
        if (GS_lang == 'zh-tw')
          yticklabel.push(data2[j]['label_zh'] + ' (' + data2[j]['count'] + ')');
        else if (GS_lang == 'fr')
          yticklabel.push(data2[j]['label_fr'] + ' (' + data2[j]['count'] + ')');
        else
          yticklabel.push(wrap.trav_hist_list[i] + ' (' + data2[j]['count'] + ')');
        break; //-- If matched, stop
      }
    }
  }
  
  //-- Save to wrapper
  wrap.n_total = n_total;
  wrap.n_imported = n_imported;
  wrap.n_data = n_data;
  wrap.xticklabel = xticklabel;
  wrap.yticklabel = yticklabel;
}

function THSC_Plot(wrap) {
  //-- Define x-axis
  var x = d3.scaleBand()
    .domain(wrap.symptom_list)
    .range([0, wrap.width])
    .padding(0.04);
    
  //-- No xtick, only xticklabel 
  var x_axis = d3.axisTop(x)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.xticklabel[i];});
  
  //-- Add x-axis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .call(x_axis)
    .selectAll("text")
      .attr("transform", "translate(8,-5) rotate(-90)")
      .style("text-anchor", "start");
    
  //-- Define a 2nd x-axis for the frameline at bottom
  var x_axis_2 = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat("");
  
  //-- Add 2nd x-axis
  wrap.svg.append("g")
    .attr("transform", "translate(0," + wrap.height + ")")
    .attr("class", "xaxis")
    .call(x_axis_2);
  
  //-- Define y-axis
  var y = d3.scaleBand()
    .domain(wrap.trav_hist_list)
    .range([0, wrap.height])
    .padding(0.04);
  
  //-- No ytick, only yticklabel 
  var y_axis = d3.axisLeft(y)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.yticklabel[i];});
  
  //-- Add y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .call(y_axis)
    .selectAll("text")
      .attr("transform", "translate(-3,0)");

  //-- Define a 2nd y-axis for the frameline at right
  var y_axis_2 = d3.axisRight(y)
    .tickSize(0);
  
  //-- Add 2nd y-axis
  wrap.svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + wrap.width + ",0)")
    .call(y_axis_2);
    
  //-- Define legend position
  var legend_pos = {x: wrap.legend_pos_x, y: -0.8*wrap.margin.top, dx: 12, dy: 30};
  
  //-- Define legend color
  var legend_color = [GS_wrap.c_list[0], GS_wrap.gray, GS_wrap.gray, '#000000'];
  
  //-- Define legend value
  var legend_value = [wrap.n_data, wrap.n_imported-wrap.n_data, wrap.n_total-wrap.n_imported, wrap.n_total];
  
  //-- Define square color
  var color = d3.scaleSequential()
    .domain([-0.3, 0.3])
    .interpolator(t => d3.interpolateRdBu(1-t));
  
  //-- Add legend value
  wrap.svg.selectAll(".legend.value")
    .remove()
    .exit()
    .data(legend_value)
    .enter()
    .append("text")
      .attr("class", "legend value")
      .attr("x", -wrap.margin.left + legend_pos.x)
      .attr("y", function (d, i) {return legend_pos.y + i*legend_pos.dy;})
      .style("fill", function (d, i) {return legend_color[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "end");
  
  //-- Add square
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
      .on("mouseover", function (d) {GS_MouseOver2(wrap, d);})
      .on("mouseleave", function (d) {GS_MouseLeave2(wrap, d);})
    
  //-- Add text
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return x(d['symptom']) + 0.5*+x.bandwidth();})
      .attr("y", function (d) {return y(d['trav_hist']) + 0.5*+y.bandwidth();})
      .style("fill", function (d) {if (Math.abs(d['value'])<0.205) return '#000000'; return '#FFFFFF';})
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Save to wrapper
  wrap.x = x;
  wrap.y = y;
  wrap.legend_color = legend_color;
  wrap.legend_pos = legend_pos;
}

function THSC_Replot(wrap) {
  //-- Define legend label
  var legend_label;
  if (GS_lang == 'zh-tw')
    legend_label = ['有資料案例數', '資料不全', '無旅遊史', '合計'];
  else if (GS_lang == 'fr')
    legend_label = ['Données complètes', 'Données incomplètes', 'Sans anté. de voyage', 'Total'];
  else
    legend_label = ['Data complete', 'Data incomplete', 'No travel history', 'Total'];
  
  //-- Update text
  wrap.svg.selectAll(".content.text")
    .remove()
    .exit()
    .data(wrap.formatted_data)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", function (d) {return wrap.x(d['symptom']) + 0.5*+wrap.x.bandwidth();})
      .attr("y", function (d) {return wrap.y(d['trav_hist']) + 0.5*+wrap.y.bandwidth();})
      .style("fill", function (d) {if (Math.abs(d['value'])<0.205) return '#000'; return '#fff';})
      .text(function (d) {return d['label'];})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
  
  //-- Update legend label
  wrap.svg.selectAll(".legend.label")
    .remove()
    .exit()
    .data(legend_label)
    .enter()
    .append("text")
      .attr("class", "legend label")
      .attr("x", -wrap.margin.left + wrap.legend_pos.x + wrap.legend_pos.dx)
      .attr("y", function (d, i) {return wrap.legend_pos.y + i*wrap.legend_pos.dy;})
      .style("fill", function (d, i) {return wrap.legend_color[i];})
      .text(function (d) {return d;})
      .attr("text-anchor", "start")
}

//-- Load
function THSC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.do_count])
    .defer(d3.csv, wrap.data_path_list[2])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      THSC_FormatData(wrap, data);
      THSC_FormatData2(wrap, data2);
      THSC_Plot(wrap);
      THSC_Replot(wrap);
    });
}

function THSC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[wrap.do_count])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      THSC_FormatData(wrap, data);
      THSC_Replot(wrap);
    });
}

function THSC_ButtonListener(wrap) {
  //-- Correlation or count
  $(document).on("change", "input:radio[name='" + wrap.tag + "_count']", function (event) {
    GS_PressRadioButton(wrap, 'count', wrap.do_count, this.value);
    wrap.do_count = this.value;
    THSC_Reload(wrap);
  });

  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    var tag1;
    
    if (wrap.do_count == 1)
      tag1 = 'count';
    else
      tag1 = 'coefficient';
    
    name = wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Remove
    d3.selectAll(wrap.id+' .plot').remove()
    
    //-- Reload
    THSC_InitFig(wrap);
    THSC_ResetText();
    THSC_Load(wrap);
  });
}

//-- Main
function THSC_Main(wrap) {
  //-- Variables
  wrap.id = '#' + wrap.tag
  
  //-- Swap active to current value
  wrap.do_count = document.querySelector("input[name='" + wrap.tag + "_count']:checked").value;
  GS_PressRadioButton(wrap, 'count', 0, wrap.do_count); //-- 0 from .html

  //-- Load
  THSC_InitFig(wrap);
  THSC_ResetText();
  THSC_Load(wrap);
  
  //-- Setup button listeners
  THSC_ButtonListener(wrap);
}
