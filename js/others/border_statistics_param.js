
//-- Filename:
//--   border_statistics_param.js
//--
//-- Author:
//--   Chieh-An Lin

var BS_latest_wrap = {
  tag: 'border_statistics_latest', 
  data_path_list: [
    'processed_data/latest/border_statistics_entry.csv',
    'processed_data/latest/border_statistics_exit.csv',
    'processed_data/latest/border_statistics_both.csv', 
  ], 

  xlabel_path: GP_wrap.xlabel_path_latest, 
  r_list: GP_wrap.r_list_latest, 
  y_max_factor: 1.8, 
  nb_yticks: 4,
  legend_pos_x: 470, 
  trans_delay: GP_wrap.trans_delay,
};

var BS_2021_wrap = {
  tag: 'border_statistics_2021',
  data_path_list: [
    'processed_data/2021/border_statistics_entry.csv',
    'processed_data/2021/border_statistics_exit.csv',
    'processed_data/2021/border_statistics_both.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.5,
  nb_yticks: 4,
  legend_pos_x: 470,
  trans_delay: GP_wrap.trans_delay,
};


var BS_2020_wrap = {
  tag: 'border_statistics_2020',
  data_path_list: [
    'processed_data/2020/border_statistics_entry.csv',
    'processed_data/2020/border_statistics_exit.csv',
    'processed_data/2020/border_statistics_both.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.15,
  nb_yticks: 4,
  legend_pos_x: 470,
  trans_delay: GP_wrap.trans_delay_long,
};

