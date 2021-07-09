
//-- Filename:
//--   vaccination_progress_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VP_latest_wrap = {
  tag: 'vaccination_progress_latest',
  data_path_list: [
    'processed_data/key_numbers.csv',
    'processed_data/latest/vaccination_progress_deliveries.csv',
    'processed_data/latest/vaccination_progress_administrated.csv',
  ],

  iso_ref: '2020-01-01',
  iso_begin: '2021-03-21',
  extra_factor: 1.2,
  xticklabel_width_min: 9,
  
  y_max_factor: 1.3,
  y_max_fixed: 0,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};
