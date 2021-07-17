
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
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 290,
  r: 1.5,
  trans_delay: GP_wrap.trans_delay,
};
