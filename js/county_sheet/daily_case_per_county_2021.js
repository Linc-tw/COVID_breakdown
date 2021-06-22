
//-- Filename:
//--   daily_case_per_county_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DCPC_2021_wrap = {};

//-- ID
DCPC_2021_wrap.tag = 'daily_case_per_county_2021';

//-- File path
DCPC_2021_wrap.data_path_list = [
  "processed_data/2021/daily_case_per_county.csv",
];

//-- Parameters
DCPC_2021_wrap.xlabel_path = GS_wrap.xlabel_path_2021;
DCPC_2021_wrap.r_list = GS_wrap.r_list_2021;
DCPC_2021_wrap.y_max_factor = 1.4;
DCPC_2021_wrap.y_path = '4'; //-- 4 ticks
DCPC_2021_wrap.legend_pos_x = 90;

//-- Main
DCPC_Main(DCPC_2021_wrap);
