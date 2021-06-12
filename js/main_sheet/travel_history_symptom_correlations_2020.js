
//-- Filename:
//--   travel_history_symptom_correlations_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var THSC_2020_wrap = {};

//-- ID
THSC_2020_wrap.tag = 'travel_history_symptom_correlations_2020'
THSC_2020_wrap.id = '#' + THSC_2020_wrap.tag

//-- File path
THSC_2020_wrap.data_path_list = [
  "processed_data/2020/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/2020/travel_history_symptom_correlations_counts.csv", 
  "processed_data/2020/travel_history_symptom_counts.csv"
];

//-- Parameters

//-- Variables
THSC_2020_wrap.do_count = document.querySelector("input[name='" + THSC_2020_wrap.tag + "_count']:checked").value;

//-- Plot
function THSC_2020_Plot() {
  d3.queue()
    .defer(d3.csv, THSC_2020_wrap.data_path_list[THSC_2020_wrap.do_count])
    .defer(d3.csv, THSC_2020_wrap.data_path_list[2])
    .await(function (error, data, data2) {THSC_Plot(THSC_2020_wrap, error, data, data2);});
}

function THSC_2020_Replot() {
  d3.queue()
    .defer(d3.csv, THSC_2020_wrap.data_path_list[THSC_2020_wrap.do_count])
    .await(function (error, data) {THSC_Replot(THSC_2020_wrap, error, data);});
}

THSC_2020_Plot();

//-- Buttons
GS_PressRadioButton(THSC_2020_wrap, 'count', 0, THSC_2020_wrap.do_count); //-- 0 from .html

$(document).on("change", "input:radio[name='" + THSC_2020_wrap.tag + "_count']", function (event) {
  GS_PressRadioButton(THSC_2020_wrap, 'count', THSC_2020_wrap.do_count, this.value);
  THSC_2020_wrap.do_count = this.value;
  THSC_2020_Replot();
});

//-- Save button
d3.select(THSC_2020_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (THSC_2020_wrap.do_count == 1)
    tag1 = 'count';
  else
    tag1 = 'coefficient';
  
  name = THSC_2020_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(THSC_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(THSC_2020_wrap.id+' .plot').remove()
  
  //-- Replot
  THSC_2020_Plot();
});