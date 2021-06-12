
//-- Filename:
//--   test_by_criterion_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TBC_2020_wrap = {};

//-- ID
TBC_2020_wrap.tag = "test_by_criterion_2020"

//-- File path
TBC_2020_wrap.data_path = "processed_data/2020/test_by_criterion.csv";

//-- Parameters
TBC_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
TBC_2020_wrap.r_list = GS_var.r_list_2020;
TBC_2020_wrap.y_max_factor = 1.2;
TBC_2020_wrap.y_path_1 = 35000;
TBC_2020_wrap.y_path_0 = '4'; //-- 4 ticks
TBC_2020_wrap.legend_pos_x_0_ = {'zh-tw': 510, fr: 320, en: 350};
TBC_2020_wrap.legend_pos_x_1_ = {'zh-tw': 0, fr: 0, en: 0};

//-- Main
TBC_Main(TBC_2020_wrap);
