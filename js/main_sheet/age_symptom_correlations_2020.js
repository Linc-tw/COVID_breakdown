
//-- Filename:
//--   age_symptom_correlations_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_2020_wrap = {};

//-- ID
ASC_2020_wrap.tag = 'age_symptom_correlations_2020'
ASC_2020_wrap.id = '#' + ASC_2020_wrap.tag

//-- File path
ASC_2020_wrap.data_path_list = [
  "processed_data/2020/age_symptom_correlations_coefficient.csv",
  "processed_data/2020/age_symptom_correlations_counts.csv", 
  "processed_data/2020/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_2020_wrap.do_count = document.querySelector("input[name='" + ASC_2020_wrap.tag + "_count']:checked").value;

//-- Plot
function ASC_2020_Plot() {
  d3.queue()
    .defer(d3.csv, ASC_2020_wrap.data_path_list[ASC_2020_wrap.do_count])
    .defer(d3.csv, ASC_2020_wrap.data_path_list[2])
    .await(function (error, data, data2) {ASC_Plot(ASC_2020_wrap, error, data, data2);});
}

function ASC_2020_Replot() {
  d3.queue()
    .defer(d3.csv, ASC_2020_wrap.data_path_list[ASC_2020_wrap.do_count])
    .await(function (error, data) {ASC_Replot(ASC_2020_wrap, error, data);});
}

ASC_2020_Plot();

//-- Buttons
GS_PressRadioButton(ASC_2020_wrap, 'count', 0, ASC_2020_wrap.do_count); //-- 0 from .html

$(document).on("change", "input:radio[name='" + ASC_2020_wrap.tag + "_count']", function (event) {
  GS_PressRadioButton(ASC_2020_wrap, 'count', ASC_2020_wrap.do_count, this.value);
  ASC_2020_wrap.do_count = this.value;
  ASC_2020_Replot();
});

//-- Save button
d3.select(ASC_2020_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_2020_wrap.do_count == 1)
    tag1 = 'count';
  else
    tag1 = 'coefficient';
  
  name = ASC_2020_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(ASC_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(ASC_2020_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_2020_Plot();
});
