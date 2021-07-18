
//-- Filename:
//--   vaccination_by_county_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VBC_latest_wrap = {
  tag: 'vaccination_by_county_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_county_total.csv', 
    '../processed_data/latest/vaccination_by_county_AZ.csv', 
    '../processed_data/latest/vaccination_by_county_Moderna.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 4,
  legend_pos_x: 115, 
  trans_delay: GP_wrap.trans_delay,
};

var VBC_overall_wrap = {
  tag: 'vaccination_by_county_overall', 
  data_path_list: [
    '../processed_data/overall/vaccination_by_county_total.csv', 
    '../processed_data/overall/vaccination_by_county_AZ.csv', 
    '../processed_data/overall/vaccination_by_county_Moderna.csv', 
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.2, 
  nb_yticks: 4,
  legend_pos_x: 115, 
  trans_delay: GP_wrap.trans_delay,
};

var VBC_2021_wrap = {
  tag: 'vaccination_by_county_2021',
  data_path_list: [
    '../processed_data/2021/vaccination_by_county_total.csv',
    '../processed_data/2021/vaccination_by_county_AZ.csv', 
    '../processed_data/2021/vaccination_by_county_Moderna.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 115, 
  trans_delay: GP_wrap.trans_delay,
};
