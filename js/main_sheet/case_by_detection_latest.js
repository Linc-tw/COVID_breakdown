
//-- Filename:
//--   case_by_detection_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBD_latest_wrap = {};

//-- ID
CBD_latest_wrap.tag = "case_by_detection_latest"

//-- Data path
CBD_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_detection_by_report_day.csv",
  "processed_data/latest/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
CBD_latest_wrap.n_tot_key = 'n_latest';
CBD_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
CBD_latest_wrap.r_list = GS_wrap.r_list_latest;
CBD_latest_wrap.y_max_factor = 1.2;
CBD_latest_wrap.y_max_fix_1_1 = 0;
CBD_latest_wrap.y_max_fix_1_0 = 0;
CBD_latest_wrap.y_max_fix_0_1 = 0;
CBD_latest_wrap.y_max_fix_0_0 = 0;
CBD_latest_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBD_latest_wrap.y_path_1_0 = '4';
CBD_latest_wrap.y_path_0_1 = '4';
CBD_latest_wrap.y_path_0_0 = '4';
CBD_latest_wrap.legend_pos_x_0_i_ = {'zh-tw': 70, fr: 70, en: 70}; //320, 280, 320
CBD_latest_wrap.legend_pos_x_1_i_ = {'zh-tw': 70, fr: 70, en: 70};
CBD_latest_wrap.legend_pos_x1_ = {'zh-tw': 240, fr: 210, en: 190};

//-- Main
CBD_Main(CBD_latest_wrap);
