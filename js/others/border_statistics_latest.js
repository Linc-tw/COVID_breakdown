
//-- Filename:
//--   border_statistics_latest.js
//--
//-- Author:
//--   Chieh-An Lin

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

//-- Main
BS_Main(BS_latest_wrap);
