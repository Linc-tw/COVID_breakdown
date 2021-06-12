
//-- Filename:
//--   border_statistics_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var BS_2021_wrap = {};

//-- ID
BS_2021_wrap.tag = 'border_statistics_2021'

//-- File path
BS_2021_wrap.data_path_list = [
  "processed_data/2021/border_statistics_entry.csv",
  "processed_data/2021/border_statistics_exit.csv",
  "processed_data/2021/border_statistics_both.csv"
];

//-- Parameters
BS_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
BS_2021_wrap.r_list = GS_var.r_list_2021;
BS_2021_wrap.y_max_factor = 1.5;
BS_2021_wrap.y_path_0 = '4'; //-- 4 ticks
BS_2021_wrap.y_path_1 = '4';
BS_2021_wrap.y_path_2 = '4';
BS_2021_wrap.legend_pos_x = 500;

//-- Main
BS_Main(BS_2021_wrap);
