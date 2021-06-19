
//-- Filename:
//--   case_by_transmission_latest.js
//--
//-- Author:
//--   Chieh-An Lin

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

//-- Main
CBT_Main(CBT_latest_wrap);
