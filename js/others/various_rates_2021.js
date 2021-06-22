
//-- Filename:
//--   various_rates_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var VR_2021_wrap = {};

//-- ID
VR_2021_wrap.tag = 'various_rates_2021'

//-- File path
VR_2021_wrap.data_path_list = [
  "processed_data/2021/various_rates.csv"
];

//-- Parameters
VR_2021_wrap.xlabel_path = GS_wrap.xlabel_path_2021;
VR_2021_wrap.r_list = GS_wrap.r_list_2021;
VR_2021_wrap.y_max_factor = 1.2;
VR_2021_wrap.y_max_fix = 0.043;
VR_2021_wrap.y_path = 0.01;
VR_2021_wrap.legend_pos_x = 40;
VR_2021_wrap.r = 3.5;

//-- Main
VR_Main(VR_2021_wrap);
