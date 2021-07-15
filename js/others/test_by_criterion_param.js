
//-- Filename:
//--   test_by_criterion_param.js
//--
//-- Author:
//--   Chieh-An Lin

var TBC_mini_wrap = {
  tag: 'test_by_criterion_mini',
  data_path_list: [
    '../processed_data/latest/test_by_criterion.csv', 
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest, 
  r_list: GP_wrap.r_list_latest, 
  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var TBC_latest_wrap = {
  tag: 'test_by_criterion_latest', 
  data_path_list: [
    '../processed_data/latest/test_by_criterion.csv', 
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest, 
  r_list: GP_wrap.r_list_latest, 
  y_max_factor: 1.5, 
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var TBC_overall_wrap = {
  tag: 'test_by_criterion_overall', 
  data_path_list: [
    '../processed_data/overall/test_by_criterion.csv', 
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: 0, 
  r_list: [], 
  y_max_factor: 1.2, 
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var TBC_2021_wrap = {
  tag: 'test_by_criterion_2021',
  data_path_list: [
//     '../processed_data/2021/test_by_criterion.csv',
//     '../processed_data/key_numbers.csv',
    'processed_data/2021/test_by_criterion.csv',
    'processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var TBC_2020_wrap = {
  tag: 'test_by_criterion_2020',
  data_path_list: [
//     '../processed_data/2020/test_by_criterion.csv',
//     '../processed_data/key_numbers.csv',
    'processed_data/2020/test_by_criterion.csv',
    'processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
