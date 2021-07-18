
//-- Filename:
//--   border_statistics_param.js
//--
//-- Author:
//--   Chieh-An Lin

var BS_latest_wrap = {
  tag: 'border_statistics_latest', 
  data_path_list: [
    '../processed_data/latest/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ], 

  y_max_factor: 2.0, 
  nb_yticks: 4,
  legend_pos_x: 480,
  trans_delay: GP_wrap.trans_delay,
};

var BS_overall_wrap = {
  tag: 'border_statistics_overall', 
  data_path_list: [
    '../processed_data/overall/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ], 

  y_max_factor: 1.15, 
  nb_yticks: 4,
  legend_pos_x: 480, 
  trans_delay: GP_wrap.trans_delay,
};

var BS_2021_wrap = {
  tag: 'border_statistics_2021',
  data_path_list: [
    '../processed_data/2021/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.9,
  nb_yticks: 4,
  legend_pos_x: 480,
  trans_delay: GP_wrap.trans_delay,
};


var BS_2020_wrap = {
  tag: 'border_statistics_2020',
  data_path_list: [
    '../processed_data/2020/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15,
  nb_yticks: 4,
  legend_pos_x: 480,
  trans_delay: GP_wrap.trans_delay,
};

