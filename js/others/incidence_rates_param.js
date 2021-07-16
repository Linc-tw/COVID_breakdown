
//-- Filename:
//--   incidence_rates_param.js
//--
//-- Author:
//--   Chieh-An Lin

var IR_mini_wrap = {
  tag: 'incidence_rates_mini',
  data_path_list: [
    '../processed_data/latest/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1,
  nb_yticks: 4,
  r: 2, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var IR_latest_wrap = {
  tag: 'incidence_rates_latest',
  data_path_list: [
    '../processed_data/latest/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  
  y_max_factor: 1.8,
  nb_yticks: 4,
  legend_pos_x: 95,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var IR_overall_wrap = {
  tag: 'incidence_rates_overall',
  data_path_list: [
    '../processed_data/overall/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  iso_begin: GP_wrap.iso_ref,
  xticklabel_min_space: GP_wrap.xticklabel_min_space,
  overall_type: 'dot',
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 95,
  r: 1.5, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var IR_2021_wrap = {
  tag: 'incidence_rates_2021',
  data_path_list: [
    '../processed_data/2021/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 85,
  r: 2,
  trans_delay: GP_wrap.trans_delay,
};

var IR_2020_wrap = {
  tag: 'incidence_rates_2020',
  data_path_list: [
    '../processed_data/2020/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 290,
  r: 1.5,
  trans_delay: GP_wrap.trans_delay,
};
