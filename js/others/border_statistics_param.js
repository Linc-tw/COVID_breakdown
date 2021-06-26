
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

  xlabel_path: GS_wrap.xlabel_path_latest, 
  r_list: GS_wrap.r_list_latest, 
  y_max_factor: 1.99, 
  y_path_0: '4', //-- 4 ticks
  y_path_1: '4', 
  y_path_2: '4', 
  legend_pos_x: 500, 
  trans_delay: GS_wrap.trans_delay,
};

var BS_2021_wrap = {
  tag: 'border_statistics_2021',
  data_path_list: [
    'processed_data/2021/border_statistics_entry.csv',
    'processed_data/2021/border_statistics_exit.csv',
    'processed_data/2021/border_statistics_both.csv',
  ],

  xlabel_path: GS_wrap.xlabel_path_2021,
  r_list: GS_wrap.r_list_2021,
  y_max_factor: 1.5,
  y_path_0: '4', //-- 4 ticks
  y_path_1: '4',
  y_path_2: '4',
  legend_pos_x: 500,
  trans_delay: GS_wrap.trans_delay,
};


var BS_2020_wrap = {
  tag: 'border_statistics_2020',
  data_path_list: [
    'processed_data/2020/border_statistics_entry.csv',
    'processed_data/2020/border_statistics_exit.csv',
    'processed_data/2020/border_statistics_both.csv',
  ],

  xlabel_path: GS_wrap.xlabel_path_2020,
  r_list: GS_wrap.r_list_2020,
  y_max_factor: 1.15,
  y_path_0: '4', //-- 4 ticks
  y_path_1: '4',
  y_path_2: '4',
  legend_pos_x: 500,
  trans_delay: GS_wrap.trans_delay_long,
};

