
//-- Filename:
//--   various_rates_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VR_mini_wrap = {
  tag: 'various_rates_mini',
  data_path_list: [
    '../processed_data/latest/various_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  y_max_factor: 1.1,
  nb_yticks: 4,
  legend_pos_x: 85,
  r: 2, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var VR_latest_wrap = {
  tag: 'various_rates_latest',
  data_path_list: [
    '../processed_data/latest/various_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  y_max_factor: 1.8,
  nb_yticks: 4,
  legend_pos_x: 85,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var VR_overall_wrap = {
  tag: 'various_rates_overall',
  data_path_list: [
    '../processed_data/overall/various_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: 0,
  r_list: [],
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 190,
  r: 1.5, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var VR_2021_wrap = {
  tag: 'various_rates_2021',
  data_path_list: [
//     '../processed_data/2021/various_rates.csv',
//     '../processed_data/key_numbers.csv',
    'processed_data/2021/various_rates.csv',
    'processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 85,
  r: 2,
  trans_delay: GP_wrap.trans_delay,
};

var VR_2020_wrap = {
  tag: 'various_rates_2020',
  data_path_list: [
//     '../processed_data/2020/various_rates.csv',
//     '../processed_data/key_numbers.csv',
    'processed_data/2020/various_rates.csv',
    'processed_data/key_numbers.csv',
  ],
  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 290,
  r: 1.5,
  trans_delay: GP_wrap.trans_delay,
};
