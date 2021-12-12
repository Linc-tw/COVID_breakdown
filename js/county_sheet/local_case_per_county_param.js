
//-- Filename:
//--   local_case_per_county_param.js
//--
//-- Author:
//--   Chieh-An Lin

var LCPC_latest_wrap = {
  tag: 'local_case_per_county_latest',
  data_path_list: [
    '../processed_data/latest/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.55,
  nb_yticks: 4,
  legend_pos_x: 95,
};

var LCPC_overall_wrap = {
  tag: 'local_case_per_county_overall',
  data_path_list: [
    '../processed_data/overall/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2, 
  nb_yticks: 4,
  legend_pos_x: 95,
};

var LCPC_2021_wrap = {
  tag: 'local_case_per_county_2021',
  data_path_list: [
    '../processed_data/2021/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 95,
};

var LCPC_2020_wrap = {
  tag: 'local_case_per_county_2020',
  data_path_list: [
    '../processed_data/2020/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
};
