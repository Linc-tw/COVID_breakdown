
//-- Filename:
//--   hospitalization_or_isolation_param.js
//--
//-- Author:
//--   Chieh-An Lin

var HOI_latest_wrap = {
  tag: 'hospitalization_or_isolation_latest',
  data_path_list: [
    '../processed_data/latest/hospitalization_or_isolation.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.5,
  nb_yticks: 4,
  legend_pos_x: 85,
  trans_delay: GP_wrap.trans_delay,
};

var HOI_overall_wrap = {
  tag: 'hospitalization_or_isolation_overall',
  data_path_list: [
    '../processed_data/overall/hospitalization_or_isolation.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 85,
  trans_delay: GP_wrap.trans_delay,
};

var HOI_2021_wrap = {
  tag: 'hospitalization_or_isolation_2021',
  data_path_list: [
    '../processed_data/2021/hospitalization_or_isolation.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var HOI_2020_wrap = {
  tag: 'hospitalization_or_isolation_2020',
  data_path_list: [
    '../processed_data/2020/hospitalization_or_isolation.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
