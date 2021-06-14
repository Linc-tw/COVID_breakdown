
//-- Filename:
//--   daily_case_per_county_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DCPC_2020_wrap = {};

//-- ID
DCPC_2020_wrap.tag = 'daily_case_per_county_2020';

//-- File path
DCPC_2020_wrap.data_path_list = [
  "processed_data/2020/daily_case_per_county.csv",
];

//-- Parameters
DCPC_2020_wrap.xlabel_path = GS_wrap.xlabel_path_2020;
DCPC_2020_wrap.r_list = GS_wrap.r_list_2020;
DCPC_2020_wrap.y_max_factor = 1.4;
DCPC_2020_wrap.y_path = '4'; //-- 4 ticks
DCPC_2020_wrap.legend_pos_x = 90;

//-- Main
DCPC_Main(DCPC_2020_wrap);
