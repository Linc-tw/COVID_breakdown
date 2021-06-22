
//-- Filename:
//--   various_rates_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var VR_2020_wrap = {};

//-- ID
VR_2020_wrap.tag = 'various_rates_2020'

//-- File path
VR_2020_wrap.data_path_list = [
  "processed_data/2020/various_rates.csv"
];

//-- Parameters
VR_2020_wrap.xlabel_path = GS_wrap.xlabel_path_2020;
VR_2020_wrap.r_list = GS_wrap.r_list_2020;
VR_2020_wrap.y_max_factor = 1.2;
VR_2020_wrap.y_max_fix = 0.033;
VR_2020_wrap.y_path = 0.01;
VR_2020_wrap.legend_pos_x = 240;
VR_2020_wrap.r = 2.5;

//-- Main
VR_Main(VR_2020_wrap);
