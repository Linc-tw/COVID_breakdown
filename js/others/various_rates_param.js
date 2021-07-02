
//-- Filename:
//--   various_rates_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VR_latest_wrap = {
  tag: 'various_rates_latest',
  data_path_list: [
    'processed_data/latest/various_rates.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  y_max_factor: 1.2,
  y_max_fix: 0.058,
  y_path: 0.01,
  legend_pos_x: 90,
  r: 3.5, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var VR_2021_wrap = {
  tag: 'various_rates_2021',
  data_path_list: [
    'processed_data/2021/various_rates.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.2,
  y_max_fix: 0.058,
  y_path: 0.01,
  legend_pos_x: 90,
  r: 3.5,
  trans_delay: GP_wrap.trans_delay,
};

var VR_2020_wrap = {
  tag: 'various_rates_2020',
  data_path_list: [
    'processed_data/2020/various_rates.csv',
  ],
  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.2,
  y_max_fix: 0.053,
  y_path: 0.01,
  legend_pos_x: 90,
  r: 2.5,
  trans_delay: GP_wrap.trans_delay,
};
