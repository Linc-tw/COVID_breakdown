
//-- Filename:
//--   age_symptom_correlations_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_2021_wrap = {};

//-- ID
ASC_2021_wrap.tag = 'age_symptom_correlations_2021'
ASC_2021_wrap.id = '#' + ASC_2021_wrap.tag

//-- File path
ASC_2021_wrap.data_path_list = [
  "processed_data/2021/age_symptom_correlations_coefficient.csv",
  "processed_data/2021/age_symptom_correlations_counts.csv", 
  "processed_data/2021/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_2021_wrap.do_count = 0;

//-- Plot
function ASC_2021_Plot() {
  d3.queue()
    .defer(d3.csv, ASC_2021_wrap.data_path_list[ASC_2021_wrap.do_count])
    .defer(d3.csv, ASC_2021_wrap.data_path_list[2])
    .await(function (error, data, data2) {ASC_Plot(ASC_2021_wrap, error, data, data2);});
}

function ASC_2021_Replot() {
  d3.queue()
    .defer(d3.csv, ASC_2021_wrap.data_path_list[ASC_2021_wrap.do_count])
    .await(function (error, data) {ASC_Replot(ASC_2021_wrap, error, data);});
}

ASC_2021_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_2021_wrap.tag + "_count']", function (event) {
  var old_btn = document.getElementById(ASC_2021_wrap.tag + '_count_' + ASC_2020_wrap.do_count);
  var new_btn = document.getElementById(ASC_2021_wrap.tag + '_count_' + this.value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
  
  ASC_2021_wrap.do_count = this.value;
  ASC_2021_Replot();
});

//-- Save button
d3.select(ASC_2021_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_2021_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_2021_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(ASC_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(ASC_2021_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_2021_Plot();
});
