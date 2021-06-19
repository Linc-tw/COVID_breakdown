
//-- Filename:
//--   case_by_transmission_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBT_2021_wrap = {};

//-- ID
CBT_2021_wrap.tag = 'case_by_transmission_2021'

//-- File path
CBT_2021_wrap.data_path_list = [
  "processed_data/2021/case_by_transmission_by_report_day.csv",
  "processed_data/2021/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
CBT_2021_wrap.n_tot_key = 'n_2021';
CBT_2021_wrap.xlabel_path = GS_wrap.xlabel_path_2021;
CBT_2021_wrap.r_list = GS_wrap.r_list_2021;
CBT_2021_wrap.y_max_factor = 1.2;
CBT_2021_wrap.y_max_fix_1_1 = 0;
CBT_2021_wrap.y_max_fix_1_0 = 0;
CBT_2021_wrap.y_max_fix_0_1 = 0;
CBT_2021_wrap.y_max_fix_0_0 = 0;
CBT_2021_wrap.y_path_1_1 = '4'; //-- 4 ticks
CBT_2021_wrap.y_path_1_0 = '4';
CBT_2021_wrap.y_path_0_1 = '4';
CBT_2021_wrap.y_path_0_0 = '4';
CBT_2021_wrap.legend_pos_x_0_i_ = {'zh-tw': 85, fr: 85, en: 85};
CBT_2021_wrap.legend_pos_x_1_i_ = {'zh-tw': 85, fr: 85, en: 85};
CBT_2021_wrap.legend_pos_x1_ = {'zh-tw': 240, fr: 310, en: 250};

//-- Main
CBT_Main(CBT_2021_wrap);
