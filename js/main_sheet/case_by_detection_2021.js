
//-- Filename:
//--   case_by_detection_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBD_2021_wrap = {};

//-- ID
CBD_2021_wrap.tag = "case_by_detection_2021"

//-- Data path
CBD_2021_wrap.data_path_list = [
  "processed_data/2021/case_by_detection_by_report_day.csv",
  "processed_data/2021/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
CBD_2021_wrap.n_tot_key = 'n_2021';
CBD_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
CBD_2021_wrap.r_list = GS_var.r_list_2021;
CBD_2021_wrap.y_max_factor = 1.2;
CBD_2021_wrap.y_max_fix_1_1 = 0;
CBD_2021_wrap.y_max_fix_1_0 = 0;
CBD_2021_wrap.y_max_fix_0_1 = 0;
CBD_2021_wrap.y_max_fix_0_0 = 0;
CBD_2021_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBD_2021_wrap.y_path_1_0 = '4';
CBD_2021_wrap.y_path_0_1 = '4';
CBD_2021_wrap.y_path_0_0 = '4';
CBD_2021_wrap.legend_pos_x_0_i_ = {'zh-tw': 70, fr: 70, en: 70};
CBD_2021_wrap.legend_pos_x_1_i_ = {'zh-tw': 70, fr: 70, en: 70};
CBD_2021_wrap.legend_pos_x1_ = {'zh-tw': 240, fr: 210, en: 190};

//-- Main
CBD_Main(CBD_2021_wrap);
