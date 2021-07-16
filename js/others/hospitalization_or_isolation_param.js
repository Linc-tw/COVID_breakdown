
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

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  
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

  iso_begin: GP_wrap.iso_ref,
  xticklabel_min_space: GP_wrap.xticklabel_min_space,
  overall_type: 'band',
  
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

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var HOI_2020_wrap = {
  tag: 'hospitalization_or_isolation_2020',
  data_path_list: [
    '../processed_data/2020/hospitalization_or_isolation.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
