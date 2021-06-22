
//-- Filename:
//--   test_by_criterion_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TBC_2021_wrap = {};

//-- ID
TBC_2021_wrap.tag = "test_by_criterion_2021"

//-- File path
TBC_2021_wrap.data_path = "processed_data/2021/test_by_criterion.csv";

//-- Parameters
TBC_2021_wrap.xlabel_path = GS_wrap.xlabel_path_2021;
TBC_2021_wrap.r_list = GS_wrap.r_list_2021;
TBC_2021_wrap.y_max_factor = 1.2;
TBC_2021_wrap.y_path_1 = '4'; //-- 4 ticks
TBC_2021_wrap.y_path_0 = '4';
TBC_2021_wrap.legend_pos_x_0_ = {'zh-tw': 110, fr: 110, en: 110};
TBC_2021_wrap.legend_pos_x_1_ = {'zh-tw': 110, fr: 110, en: 110};

//-- Main
TBC_Main(TBC_2021_wrap);
