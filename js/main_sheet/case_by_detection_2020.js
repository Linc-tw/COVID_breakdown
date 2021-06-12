
//-- Filename:
//--   case_by_detection_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBD_2020_wrap = {};

//-- ID
CBD_2020_wrap.tag = "case_by_detection_2020"
CBD_2020_wrap.id = '#' + CBD_2020_wrap.tag

//-- Data path
CBD_2020_wrap.data_path_list = [
  "processed_data/2020/case_by_detection_by_report_day.csv",
  "processed_data/2020/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBD_2020_wrap.tooltip = d3.select(CBD_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
CBD_2020_wrap.n_tot_key = 'n_2020';
CBD_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
CBD_2020_wrap.r_list = GS_var.r_list_2020;
CBD_2020_wrap.y_max_factor = 1.3;
CBD_2020_wrap.y_max_fix_1_1 = 0;
CBD_2020_wrap.y_max_fix_1_0 = 0;
CBD_2020_wrap.y_max_fix_0_1 = 0;
CBD_2020_wrap.y_max_fix_0_0 = 0;
CBD_2020_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBD_2020_wrap.y_path_1_0 = '4';
CBD_2020_wrap.y_path_0_1 = '4';
CBD_2020_wrap.y_path_0_0 = '4';
CBD_2020_wrap.legend_pos_x_0_i_ = {'zh-tw': 280, fr: 290, en: 290};
CBD_2020_wrap.legend_pos_x_1_i_ = {'zh-tw': 0, fr: 0, en: 0};
CBD_2020_wrap.legend_pos_x1_ = {'zh-tw': 0, fr: 0, en: 0};

//-- Variables
CBD_2020_wrap.do_cumul = document.querySelector("input[name='" + CBD_2020_wrap.tag + "_cumul']:checked").value;
CBD_2020_wrap.do_onset = document.querySelector("input[name='" + CBD_2020_wrap.tag + "_onset']:checked").value;

//-- Plot
function CBD_2020_Plot() {
  d3.queue()
    .defer(d3.csv, CBD_2020_wrap.data_path_list[CBD_2020_wrap.do_onset])
    .defer(d3.csv, CBD_2020_wrap.data_path_list[2])
    .await(function (error, data, data2) {CBD_Plot(CBD_2020_wrap, error, data, data2);});
}

function CBD_2020_Replot() {
  d3.queue()
    .defer(d3.csv, CBD_2020_wrap.data_path_list[CBD_2020_wrap.do_onset])
    .await(function (error, data) {CBD_Replot(CBD_2020_wrap, error, data);});
}

CBD_2020_Plot();

//-- Buttons
GS_PressRadioButton(CBD_2020_wrap, 'cumul', 0, CBD_2020_wrap.do_cumul); //-- 0 from .html
GS_PressRadioButton(CBD_2020_wrap, 'onset', 0, CBD_2020_wrap.do_onset); //-- 0 from .html

$(document).on("change", "input:radio[name='" + CBD_2020_wrap.tag + "_cumul']", function (event) {
  GS_PressRadioButton(CBD_2020_wrap, 'cumul', CBD_2020_wrap.do_cumul, this.value);
  CBD_2020_wrap.do_cumul = this.value;
  CBD_2020_Replot();
});

$(document).on("change", "input:radio[name='" + CBD_2020_wrap.tag + "_onset']", function (event) {
  GS_PressRadioButton(CBD_2020_wrap, 'onset', CBD_2020_wrap.do_onset, this.value);
  CBD_2020_wrap.do_onset = this.value
  CBD_2020_Replot();
});

//-- Save
d3.select(CBD_2020_wrap.id + '_save').on('click', function (){
  var tag1, tag2;
  
  if (CBD_2020_wrap.do_cumul == 1)
    tag1 = 'cumulative';
  else
    tag1 = 'daily';
  
  if (CBD_2020_wrap.do_onset == 1)
    tag2 = 'onset';
  else
    tag2 = 'report';
  
  name = CBD_2020_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBD_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBD_2020_wrap.id+' .plot').remove()
  
  //-- Replot
  CBD_2020_Plot();
});
