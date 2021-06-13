
//-- Filename:
//--   case_by_age_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBA_2021_wrap = {};

//-- ID
CBA_2021_wrap.tag = 'case_by_age_2021';

//-- File path
CBA_2021_wrap.data_path_list = [
  "processed_data/2021/case_by_age.csv",
];

//-- Parameters
CBA_2021_wrap.y_max_factor = 1.4;
CBA_2021_wrap.y_path = '4'; //-- 4 ticks
CBA_2021_wrap.legend_pos_x = 90;

//-- Main
CBA_Main(CBA_2021_wrap);
