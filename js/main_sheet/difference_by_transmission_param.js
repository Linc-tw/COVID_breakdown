
//-- Filename:
//--   difference_by_transmission_param.js
//--
//-- Author:
//--   Chieh-An Lin

var DBT_latest_wrap = {
  tag: 'difference_by_transmission_latest',
  data_path_list: [
    'processed_data/latest/difference_by_transmission.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_latest',
  y_max_factor: 1.2,
  y_path_0: '4', //-- 4 ticks
  y_path_1: '4',
  y_path_2: '4',
  y_path_3: '4',
};

var DBT_2021_wrap = {
  tag: 'difference_by_transmission_2021',
  data_path_list: [
    'processed_data/2021/difference_by_transmission.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_2021',
  y_max_factor: 1.2,
  y_path_0: '4', //-- 4 ticks
  y_path_1: '4',
  y_path_2: '4',
  y_path_3: '4',
};

var DBT_2020_wrap = {
  tag: 'difference_by_transmission_2020',
  data_path_list: [
    'processed_data/2020/difference_by_transmission.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_2020',
  y_max_factor: 1.11,
  y_path_0: '4', //-- 4 ticks
  y_path_1: '4',
  y_path_2: '4',
  y_path_3: '4',
};
