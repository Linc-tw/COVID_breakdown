
//-- Filename:
//--   plot_latest_highlight.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- Status evolution

//-- Global variable
var SE_latest_wrap = {};

//-- ID
SE_latest_wrap.tag = 'status_evolution_latest';

//-- File path
SE_latest_wrap.data_path_list = [
  "processed_data/latest/status_evolution.csv"
];

//-- Parameters
SE_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
SE_latest_wrap.r_list = GS_wrap.r_list_latest;
SE_latest_wrap.y_max_factor = 1.2;
SE_latest_wrap.y_path = '4'; //-- 4 ticks
SE_latest_wrap.legend_pos_x = 85;

//------------------------------------------------------------------------------
//-- Various rates

//-- Global variable
var VR_latest_wrap = {};

//-- ID
VR_latest_wrap.tag = 'various_rates_latest'

//-- File path
VR_latest_wrap.data_path_list = [
  "processed_data/latest/various_rates.csv"
];

//-- Parameters
VR_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
VR_latest_wrap.r_list = GS_wrap.r_list_latest;
VR_latest_wrap.y_max_factor = 1.2;
VR_latest_wrap.y_max_fix = 0.043;
VR_latest_wrap.y_path = 0.01;
VR_latest_wrap.legend_pos_x = 40;
VR_latest_wrap.r = 3.5; //-- Dot radius

//------------------------------------------------------------------------------
//-- Case by transmission

//-- Global variable
var CBT_latest_wrap = {};

//-- ID
CBT_latest_wrap.tag = 'case_by_transmission_latest'

//-- File path
CBT_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_transmission_by_report_day.csv",
  "processed_data/latest/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
CBT_latest_wrap.n_tot_key = 'n_latest';
CBT_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
CBT_latest_wrap.r_list = GS_wrap.r_list_latest;
CBT_latest_wrap.y_max_factor = 1.2;
CBT_latest_wrap.y_max_fix_1_1 = 0;
CBT_latest_wrap.y_max_fix_1_0 = 0;
CBT_latest_wrap.y_max_fix_0_1 = 0;
CBT_latest_wrap.y_max_fix_0_0 = 0;
CBT_latest_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBT_latest_wrap.y_path_1_0 = '4';
CBT_latest_wrap.y_path_0_1 = '4';
CBT_latest_wrap.y_path_0_0 = '4';
CBT_latest_wrap.legend_pos_x_0_i_ = {'zh-tw': 85, fr: 85, en: 85};
CBT_latest_wrap.legend_pos_x_1_i_ = {'zh-tw': 85, fr: 85, en: 85};
CBT_latest_wrap.legend_pos_x1_ = {'zh-tw': 230, fr: 290, en: 250};

//------------------------------------------------------------------------------
//-- Incidence map

//-- Global variable
var IM_latest_wrap = {};

//-- ID
IM_latest_wrap.tag = 'incidence_map_latest';

//-- File path
IM_latest_wrap.data_path_list = [
  "processed_data/adminMap_byCounties_offsetIslands_sphe.geojson",
  "processed_data/latest/incidence_map_population.csv",
  "processed_data/latest/incidence_map.csv",
];

//-- Parameters
IM_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
IM_latest_wrap.r_list = GS_wrap.r_list_latest;
IM_latest_wrap.y_max_factor = 1.4;
IM_latest_wrap.y_path = '4'; //-- 4 ticks
IM_latest_wrap.legend_pos_x = 90;

//------------------------------------------------------------------------------
//-- Test by criterion

//-- Global variable
var TBC_latest_wrap = {};

//-- ID
TBC_latest_wrap.tag = "test_by_criterion_latest";

//-- File path
TBC_latest_wrap.data_path = "processed_data/latest/test_by_criterion.csv";

//-- Parameters
TBC_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
TBC_latest_wrap.r_list = GS_wrap.r_list_latest;
TBC_latest_wrap.y_max_factor = 1.2;
TBC_latest_wrap.y_path_1 = '4'; //-- 4 ticks
TBC_latest_wrap.y_path_0 = '4';
TBC_latest_wrap.legend_pos_x_0_ = {'zh-tw': 110, fr: 110, en: 110};
TBC_latest_wrap.legend_pos_x_1_ = {'zh-tw': 110, fr: 110, en: 110};

//------------------------------------------------------------------------------
//-- Border statistics

//-- Global variable
var BS_latest_wrap = {};

//-- ID
BS_latest_wrap.tag = 'border_statistics_latest'

//-- File path
BS_latest_wrap.data_path_list = [
  "processed_data/latest/border_statistics_entry.csv",
  "processed_data/latest/border_statistics_exit.csv",
  "processed_data/latest/border_statistics_both.csv"
];

//-- Parameters
BS_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
BS_latest_wrap.r_list = GS_wrap.r_list_latest;
BS_latest_wrap.y_max_factor = 1.99;
BS_latest_wrap.y_path_0 = '4'; //-- 4 ticks
BS_latest_wrap.y_path_1 = '4';
BS_latest_wrap.y_path_2 = '4';
BS_latest_wrap.legend_pos_x = 500;

//------------------------------------------------------------------------------
//-- Main functions

SE_Main(SE_latest_wrap);
VR_Main(VR_latest_wrap);
CBT_Main(CBT_latest_wrap);
IM_Main(IM_latest_wrap);
TBC_Main(TBC_latest_wrap);
BS_Main(BS_latest_wrap);

//   $(window).scroll(function() {
//     if ($(window).scrollTop() + $(window).height() + wrap.plotted >= $(document).height()) {
//   $(window).mousemove(function() {
//     if ($(window).scrollTop() + $(window).height() + wrap.plotted >= $(document).height()) {
//     }
//   });
// console.log($(window).scrollTop());
// console.log($(window).height());
// console.log($(document).height());

// $(window).mousemove(function() {
//   var element_test = document.getElementById('border_statistics_title');
//   var rect = element_test.getBoundingClientRect();
//   console.log(rect.top, rect.left, rect.bottom, rect.right);
// });

//------------------------------------------------------------------------------
