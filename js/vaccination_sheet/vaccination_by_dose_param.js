
//-- Filename:
//--   vaccination_by_dose_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VBD_overall_wrap = {
  tag: 'vaccination_by_dose_overall',
  data_path_list: [
    '../processed_data/key_numbers.csv',
    '../processed_data/overall/vaccination_by_dose.csv',
  ],

  iso_ref: '2020-01-01',
  iso_begin: '2021-03-21',
  xticklabel_width_min: 9,
  
  y_max_factor: 1.45,
  y_max_fixed: 0,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};
