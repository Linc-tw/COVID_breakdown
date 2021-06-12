
//-- Filename:
//--   difference_by_transmission_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DBT_latest_wrap = {};

//-- ID
DBT_latest_wrap.tag = 'difference_by_transmission_latest'

//-- File path
DBT_latest_wrap.data_path_list = [
  "processed_data/latest/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
DBT_latest_wrap.n_tot_key = 'n_latest';
DBT_latest_wrap.y_max_factor = 1.2;
DBT_latest_wrap.y_path_0 = '4'; //-- 4 ticks
DBT_latest_wrap.y_path_1 = '4';
DBT_latest_wrap.y_path_2 = '4';
DBT_latest_wrap.y_path_3 = '4';

//-- Main
DBT_Main(DBT_latest_wrap);
