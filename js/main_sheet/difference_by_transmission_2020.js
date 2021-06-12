
//-- Filename:
//--   difference_by_transmission_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DBT_2020_wrap = {};

//-- ID
DBT_2020_wrap.tag = 'difference_by_transmission_2020'

//-- File path
DBT_2020_wrap.data_path_list = [
  "processed_data/2020/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
DBT_2020_wrap.n_tot_key = 'n_2020';
DBT_2020_wrap.y_max_factor = 1.11;
DBT_2020_wrap.y_path_0 = '4'; //-- 4 ticks
DBT_2020_wrap.y_path_1 = '4';
DBT_2020_wrap.y_path_2 = '4';
DBT_2020_wrap.y_path_3 = '4';

//-- Main
DBT_Main(DBT_2020_wrap);
