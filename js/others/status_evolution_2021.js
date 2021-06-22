
//-- Filename:
//--   status_evolution_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var SE_2021_wrap = {};

//-- ID
SE_2021_wrap.tag = 'status_evolution_2021';

//-- File path
SE_2021_wrap.data_path_list = [
  "processed_data/2021/status_evolution.csv"
];

//-- Parameters
SE_2021_wrap.xlabel_path = GS_wrap.xlabel_path_2021;
SE_2021_wrap.r_list = GS_wrap.r_list_2021;
SE_2021_wrap.y_max_factor = 1.2;
SE_2021_wrap.y_path = '4'; //-- 4 ticks
SE_2021_wrap.legend_pos_x = 85;

//-- Main
SE_Main(SE_2021_wrap);
