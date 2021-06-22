
//-- Filename:
//--   case_by_age_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBA_latest_wrap = {};

//-- ID
CBA_latest_wrap.tag = 'case_by_age_latest';

//-- File path
CBA_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_age.csv",
];

//-- Parameters
CBA_latest_wrap.y_max_factor = 1.4;
CBA_latest_wrap.y_path = '4'; //-- 4 ticks
CBA_latest_wrap.legend_pos_x = 90;

//-- Main
CBA_Main(CBA_latest_wrap);
