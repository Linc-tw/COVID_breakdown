
//-- Filename:
//--   daily_case_per_county_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DCPC_latest_wrap = {};

//-- ID
DCPC_latest_wrap.tag = 'daily_case_per_county_latest';

//-- File path
DCPC_latest_wrap.data_path_list = [
  "processed_data/latest/daily_case_per_county.csv",
];

//-- Parameters
DCPC_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
DCPC_latest_wrap.r_list = GS_wrap.r_list_latest;
DCPC_latest_wrap.y_max_factor = 1.4;
DCPC_latest_wrap.y_path = '4'; //-- 4 ticks
DCPC_latest_wrap.legend_pos_x = 90;

//-- Main
DCPC_Main(DCPC_latest_wrap);
