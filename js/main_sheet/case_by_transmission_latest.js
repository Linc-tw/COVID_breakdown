
//-- Filename:
//--   case_by_transmission_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBT_latest_wrap = {};

//-- ID
CBT_latest_wrap.tag = 'case_by_transmission_latest'
CBT_latest_wrap.id = '#' + CBT_latest_wrap.tag

//-- File path
CBT_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_transmission_by_report_day.csv",
  "processed_data/latest/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBT_latest_wrap.tooltip = d3.select(CBT_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBT_latest_wrap.n_tot_key = 'n_latest';
CBT_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
CBT_latest_wrap.r_list = GS_var.r_list_latest;
CBT_latest_wrap.y_max_factor = 1.2;
CBT_latest_wrap.y_max_fix_1_1 = 0;
CBT_latest_wrap.y_max_fix_1_0 = 0;
CBT_latest_wrap.y_max_fix_0_1 = 0;
CBT_latest_wrap.y_max_fix_0_0 = 0;
CBT_latest_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBT_latest_wrap.y_path_1_0 = '4';
CBT_latest_wrap.y_path_0_1 = '4';
CBT_latest_wrap.y_path_0_0 = '4';
CBT_latest_wrap.legend_pos_x_0_i_ = {'zh-tw': 80, fr: 80, en: 80}; //800, 350, 380;
CBT_latest_wrap.legend_pos_x_1_i_ = {'zh-tw': 80, fr: 80, en: 80};
CBT_latest_wrap.legend_pos_x1_ = {'zh-tw': 220, fr: 280, en: 240};

//-- Variables
CBT_latest_wrap.do_cumul = document.querySelector("input[name='" + CBT_latest_wrap.tag + "_cumul']:checked").value;
CBT_latest_wrap.do_onset = document.querySelector("input[name='" + CBT_latest_wrap.tag + "_onset']:checked").value;

//-- Plot
function CBT_Latest_Plot() {
  d3.queue()
    .defer(d3.csv, CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset])
    .defer(d3.csv, CBT_latest_wrap.data_path_list[2])
    .await(function (error, data, data2) {CBT_Plot(CBT_latest_wrap, error, data, data2);});
}

function CBT_Latest_Replot() {
  d3.queue()
    .defer(d3.csv, CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset])
    .await(function (error, data) {CBT_Replot(CBT_latest_wrap, error, data);});
}

CBT_Latest_Plot();

//-- Buttons
GS_PressRadioButton(CBT_latest_wrap, 'cumul', 0, CBT_latest_wrap.do_cumul); //-- 0 from .html
GS_PressRadioButton(CBT_latest_wrap, 'onset', 0, CBT_latest_wrap.do_onset); //-- 0 from .html

$(document).on("change", "input:radio[name='" + CBT_latest_wrap.tag + "_cumul']", function (event) {
  GS_PressRadioButton(CBT_latest_wrap, 'cumul', CBT_latest_wrap.do_cumul, this.value);
  CBT_latest_wrap.do_cumul = this.value;
  CBT_Latest_Replot();
});

$(document).on("change", "input:radio[name='" + CBT_latest_wrap.tag + "_onset']", function (event) {
  GS_PressRadioButton(CBT_latest_wrap, 'onset', CBT_latest_wrap.do_onset, this.value);
  CBT_latest_wrap.do_onset = this.value
  CBT_Latest_Replot();
});

//-- Save button
d3.select(CBT_latest_wrap.id + '_save').on('click', function() {
  var tag1, tag2;
  
  if (CBT_latest_wrap.do_cumul == 1)
    tag1 = 'cumulative';
  else
    tag1 = 'daily';
  
  if (CBT_latest_wrap.do_onset == 1)
    tag2 = 'onset';
  else
    tag2 = 'report';
  
  name = CBT_latest_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBT_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBT_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  CBT_Latest_Plot();
});
