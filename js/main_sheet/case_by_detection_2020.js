
//-- Filename:
//--   case_by_detection_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBD_2020_wrap = {};

//-- ID
CBD_2020_wrap.tag = "case_by_detection_2020"

//-- Data path
CBD_2020_wrap.data_path_list = [
  "processed_data/2020/case_by_detection_by_report_day.csv",
  "processed_data/2020/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

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

//-- Main
CBD_Main(CBD_2020_wrap);
