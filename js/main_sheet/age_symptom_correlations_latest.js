
//-- Filename:
//--   age_symptom_correlations_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_latest_wrap = {};

//-- ID
ASC_latest_wrap.tag = 'age_symptom_correlations_latest'
ASC_latest_wrap.id = '#' + ASC_latest_wrap.tag

//-- File path
ASC_latest_wrap.data_path_list = [
  "processed_data/latest/age_symptom_correlations_coefficient.csv",
  "processed_data/latest/age_symptom_correlations_counts.csv", 
  "processed_data/latest/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_latest_wrap.do_count = 0;

//-- Plot
function ASC_Latest_Plot() {
  d3.queue()
    .defer(d3.csv, ASC_latest_wrap.data_path_list[ASC_latest_wrap.do_count])
    .defer(d3.csv, ASC_latest_wrap.data_path_list[2])
    .await(function (error, data, data2) {ASC_Plot(ASC_latest_wrap, error, data, data2);});
}

function ASC_Latest_Replot() {
  d3.queue()
    .defer(d3.csv, ASC_latest_wrap.data_path_list[ASC_latest_wrap.do_count])
    .await(function (error, data) {ASC_Replot(ASC_latest_wrap, error, data);});
}

ASC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_latest_wrap.tag + "_count']", function (event) {
  var old_btn = document.getElementById(ASC_latest_wrap.tag + '_count_' + ASC_latest_wrap.do_count);
  var new_btn = document.getElementById(ASC_latest_wrap.tag + '_count_' + this.value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
  
  ASC_latest_wrap.do_count = this.value;
  ASC_Latest_Replot();
});

//-- Save button
d3.select(ASC_latest_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_latest_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_latest_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(ASC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(ASC_latest_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_Latest_Plot();
});
