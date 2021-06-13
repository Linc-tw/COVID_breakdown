
//-- Filename:
//--   various_rates_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var VR_latest_wrap = {};

//-- ID
VR_latest_wrap.tag = 'various_rates_latest'

//-- File path
VR_latest_wrap.data_path_list = [
  "processed_data/latest/various_rates.csv"
];

//-- Parameters
VR_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
VR_latest_wrap.r_list = GS_wrap.r_list_latest;
VR_latest_wrap.y_max_factor = 1.2;
VR_latest_wrap.y_max_fix = 0.043;
VR_latest_wrap.y_path = 0.01;
VR_latest_wrap.legend_pos_x = 40;
VR_latest_wrap.r = 3.5; //-- Dot radius

//-- Main
VR_Main(VR_latest_wrap);
