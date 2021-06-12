
//-- Filename:
//--   difference_by_transmission_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DBT_2021_wrap = {};

//-- ID
DBT_2021_wrap.tag = 'difference_by_transmission_2021'

//-- File path
DBT_2021_wrap.data_path_list = [
  "processed_data/2021/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Parameters
DBT_2021_wrap.n_tot_key = 'n_2021';
DBT_2021_wrap.y_max_factor = 1.2;
DBT_2021_wrap.y_path_0 = '4'; //-- 4 ticks
DBT_2021_wrap.y_path_1 = '4';
DBT_2021_wrap.y_path_2 = '4';
DBT_2021_wrap.y_path_3 = '4';

//-- Main
DBT_Main(DBT_2021_wrap);
