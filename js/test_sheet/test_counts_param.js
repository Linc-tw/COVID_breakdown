
//-- Filename:
//--   test_counts_param.js
//--
//-- Author:
//--   Chieh-An Lin

var TC_mini_wrap = {
  tag: 'test_counts_mini',
  data_path_list: [
    '../processed_data/latest/test_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
  trans_delay: GP_wrap.trans_delay,
};

var TC_latest_wrap = {
  tag: 'test_counts_latest', 
  data_path_list: [
    '../processed_data/latest/test_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.5, 
  nb_yticks: 4,
  legend_pos_x: 115,
  trans_delay: GP_wrap.trans_delay,
};

var TC_overall_wrap = {
  tag: 'test_counts_overall', 
  data_path_list: [
    '../processed_data/overall/test_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var TC_2021_wrap = {
  tag: 'test_counts_2021',
  data_path_list: [
    '../processed_data/2021/test_counts.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var TC_2020_wrap = {
  tag: 'test_counts_2020',
  data_path_list: [
    '../processed_data/2020/test_counts.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
