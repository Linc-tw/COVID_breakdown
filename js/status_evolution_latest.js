
//-- Filename:
//--   status_evolution_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var SE_latest_wrap = {};

//-- ID
SE_latest_wrap.tag = 'status_evolution_latest';

//-- File path
SE_latest_wrap.data_path_list = [
  "processed_data/latest/status_evolution.csv"
];

//-- Parameters
SE_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
SE_latest_wrap.r_list = GS_wrap.r_list_latest;
SE_latest_wrap.y_max_factor = 1.2;
SE_latest_wrap.y_path = '4'; //-- 4 ticks
SE_latest_wrap.legend_pos_x = 80;

//-- Main
SE_Main(SE_latest_wrap);
