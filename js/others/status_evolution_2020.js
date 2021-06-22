
//-- Filename:
//--   status_evolution_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var SE_2020_wrap = {};

//-- ID
SE_2020_wrap.tag = 'status_evolution_2020';

//-- File path
SE_2020_wrap.data_path_list = [
  "processed_data/2020/status_evolution.csv"
];

//-- Parameters
SE_2020_wrap.xlabel_path = GS_wrap.xlabel_path_2020;
SE_2020_wrap.r_list = GS_wrap.r_list_2020;
SE_2020_wrap.y_max_factor = 1.15;
SE_2020_wrap.y_path = '4'; //-- 4 ticks
SE_2020_wrap.legend_pos_x = 70;

//-- Main
SE_Main(SE_2020_wrap);
