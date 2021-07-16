
//-- Filename:
//--   vaccination_by_dose_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VBD_overall_wrap = {
  tag: 'vaccination_by_dose_overall',
  data_path_list: [
    '../processed_data/overall/vaccination_by_dose.csv',
    '../processed_data/key_numbers.csv',
  ],

  iso_begin: GP_wrap.iso_ref_vacc,
  xticklabel_min_space: GP_wrap.xticklabel_min_space_vacc,
  overall_type: 'dot',
  
  y_max_factor: 1.3,
  y_max_fixed: 0,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};
