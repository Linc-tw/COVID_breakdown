
//-- Filename:
//--   death_counts_param.js
//--
//-- Author:
//--   Chieh-An Lin

var DC_latest_wrap = {
  tag: 'death_counts_latest', 
  data_path_list: [
    '../processed_data/latest/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.5, 
  nb_yticks: 4,
  legend_pos_x: 75,
  trans_delay: GP_wrap.trans_delay,
};

var DC_overall_wrap = {
  tag: 'death_counts_overall', 
  data_path_list: [
    '../processed_data/overall/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 75,
  trans_delay: GP_wrap.trans_delay,
};

var DC_2021_wrap = {
  tag: 'death_counts_2021',
  data_path_list: [
    '../processed_data/2021/death_counts.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 75,
  trans_delay: GP_wrap.trans_delay,
};

var DC_2020_wrap = {
  tag: 'death_counts_2020',
  data_path_list: [
    '../processed_data/2020/death_counts.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 75,
  trans_delay: GP_wrap.trans_delay,
};
