
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

  xlabel_path: GP_wrap.xlabel_path_latest, 
  r_list: GP_wrap.r_list_latest, 
  y_max_factor: 1.5, 
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var DC_overall_wrap = {
  tag: 'death_counts_overall', 
  data_path_list: [
    '../processed_data/overall/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: 0, 
  r_list: [], 
  y_max_factor: 1.2, 
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var DC_2021_wrap = {
  tag: 'death_counts_2021',
  data_path_list: [
//     '../processed_data/2021/death_counts.csv',
//     '../processed_data/key_numbers.csv',
    'processed_data/2021/death_counts.csv',
    'processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};

var DC_2020_wrap = {
  tag: 'death_counts_2020',
  data_path_list: [
//     '../processed_data/2020/death_counts.csv',
//     '../processed_data/key_numbers.csv',
    'processed_data/2020/death_counts.csv',
    'processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
