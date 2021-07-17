
//-- Filename:
//--   vaccination_by_dose_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VBD_latest_wrap = {
  tag: 'vaccination_by_dose_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_dose.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110, 
  trans_delay: GP_wrap.trans_delay,
};

var VBD_overall_wrap = {
  tag: 'vaccination_by_dose_overall',
  data_path_list: [
    '../processed_data/overall/vaccination_by_dose.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
  trans_delay: GP_wrap.trans_delay,
};
