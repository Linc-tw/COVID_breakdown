
//-- Filename:
//--   local_case_per_county_param.js
//--
//-- Author:
//--   Chieh-An Lin

var LCPC_latest_wrap = {
  tag: 'local_case_per_county_latest',
  data_path_list: [
    'processed_data/latest/local_case_per_county.csv',
  ],

  xlabel_path: GS_wrap.xlabel_path_latest,
  r_list: GS_wrap.r_list_latest,
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
};

var LCPC_2021_wrap = {
  tag: 'local_case_per_county_2021',
  data_path_list: [
    'processed_data/2021/local_case_per_county.csv',
  ],

  xlabel_path: GS_wrap.xlabel_path_2021,
  r_list: GS_wrap.r_list_2021,
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
};

var LCPC_2020_wrap = {
  tag: 'local_case_per_county_2020',
  data_path_list: [
    'processed_data/2020/local_case_per_county.csv',
  ],

  xlabel_path: GS_wrap.xlabel_path_2020,
  r_list: GS_wrap.r_list_2020,
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
};