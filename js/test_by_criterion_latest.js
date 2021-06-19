
//-- Filename:
//--   test_by_criterion_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TBC_latest_wrap = {};

//-- ID
TBC_latest_wrap.tag = "test_by_criterion_latest";

//-- File path
TBC_latest_wrap.data_path = "processed_data/latest/test_by_criterion.csv";

//-- Parameters
TBC_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
TBC_latest_wrap.r_list = GS_wrap.r_list_latest;
TBC_latest_wrap.y_max_factor = 1.2;
TBC_latest_wrap.y_path_1 = '4'; //-- 4 ticks
TBC_latest_wrap.y_path_0 = '4';
TBC_latest_wrap.legend_pos_x_0_ = {'zh-tw': 110, fr: 110, en: 110};
TBC_latest_wrap.legend_pos_x_1_ = {'zh-tw': 110, fr: 110, en: 110};

//-- Main
TBC_Main(TBC_latest_wrap);
