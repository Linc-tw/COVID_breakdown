
//-- Filename:
//--   vaccination_progress_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VP_overall_wrap = {
  tag: 'vaccination_progress_overall',
  data_path_list: [
    '../processed_data/key_numbers.csv',
    '../processed_data/overall/vaccination_progress_deliveries.csv',
    '../processed_data/overall/vaccination_progress_administrated.csv',
  ],

  iso_begin: GP_wrap.iso_ref_vacc,
  xticklabel_min_space: GP_wrap.xticklabel_min_space_vacc,
  overall_type: 'dot',
  x_max_factor: 1.19,
  
  y_max_factor: 1.4,
  y_max_fixed: 0,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};
