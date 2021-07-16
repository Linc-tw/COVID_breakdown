
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

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  
  y_max_factor: 1.5,
  nb_yticks: 4,
  legend_pos_x: 95,
  trans_delay: GP_wrap.trans_delay,
};

var LCPC_overall_wrap = {
  tag: 'local_case_per_county_overall',
  data_path_list: [
    '../processed_data/overall/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],

  iso_begin: GP_wrap.iso_ref,
  xticklabel_min_space: GP_wrap.xticklabel_min_space,
  overall_type: 'band',
  
  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 95,
  trans_delay: GP_wrap.trans_delay,
};

var LCPC_2021_wrap = {
  tag: 'local_case_per_county_2021',
  data_path_list: [
    '../processed_data/2021/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 95,
  trans_delay: GP_wrap.trans_delay,
};

var LCPC_2020_wrap = {
  tag: 'local_case_per_county_2020',
  data_path_list: [
    '../processed_data/2020/local_case_per_county.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  
  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
