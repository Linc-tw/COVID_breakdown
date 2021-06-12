
//-- Filename:
//--   case_by_transmission_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBT_2020_wrap = {};

//-- ID
CBT_2020_wrap.tag = 'case_by_transmission_2020'

//-- File path
CBT_2020_wrap.data_path_list = [
  "processed_data/2020/case_by_transmission_by_report_day.csv",
  "processed_data/2020/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
CBT_2020_wrap.n_tot_key = 'n_2020';
CBT_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
CBT_2020_wrap.r_list = GS_var.r_list_2020;
CBT_2020_wrap.y_max_factor = 1.3;
CBT_2020_wrap.y_max_fix_1_1 = 0;
CBT_2020_wrap.y_max_fix_1_0 = 0;
CBT_2020_wrap.y_max_fix_0_1 = 0;
CBT_2020_wrap.y_max_fix_0_0 = 0;
CBT_2020_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBT_2020_wrap.y_path_1_0 = '4';
CBT_2020_wrap.y_path_0_1 = '4';
CBT_2020_wrap.y_path_0_0 = '4';
CBT_2020_wrap.legend_pos_x_0_i_ = {'zh-tw': 260, fr: 250, en: 290};
CBT_2020_wrap.legend_pos_x_1_i_ = {'zh-tw': 0, fr: 55, en: 55};
CBT_2020_wrap.legend_pos_x1_ = {'zh-tw': 0, fr: 270, en: 0};

//-- Main
CBT_Main(CBT_2020_wrap);
