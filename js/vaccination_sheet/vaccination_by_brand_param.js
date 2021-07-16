
//-- Filename:
//--   vaccination_by_brand_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VBB_mini_wrap = {
  tag: 'vaccination_by_brand_mini', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_brand.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
  trans_delay: GP_wrap.trans_delay,
};

var VBB_latest_wrap = {
  tag: 'vaccination_by_brand_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_brand.csv', 
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest, 
  r_list: GP_wrap.r_list_latest, 
  
  y_max_factor: 1.2, 
  nb_yticks: 4,
  legend_pos_x: 115, 
  trans_delay: GP_wrap.trans_delay,
};

var VBB_overall_wrap = {
  tag: 'vaccination_by_brand_overall', 
  data_path_list: [
    '../processed_data/overall/vaccination_by_brand.csv', 
    '../processed_data/key_numbers.csv',
  ],

  iso_begin: GP_wrap.iso_ref_vacc,
  xticklabel_min_space: GP_wrap.xticklabel_min_space_vacc,
  overall_type: 'band',
  
  y_max_factor: 1.2, 
  nb_yticks: 4,
  legend_pos_x: 115, 
  trans_delay: GP_wrap.trans_delay,
};

var VBB_2021_wrap = {
  tag: 'vaccination_by_brand_2021',
  data_path_list: [
    '../processed_data/2021/vaccination_by_brand.csv',
    '../processed_data/key_numbers.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 115, 
  trans_delay: GP_wrap.trans_delay,
};
