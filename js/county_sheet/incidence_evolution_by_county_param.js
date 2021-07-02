
//-- Filename:
//--   incidence_evolution_by_county_param.js
//--
//-- Author:
//--   Chieh-An Lin

var IEBC_latest_wrap = {
  tag: 'incidence_evolution_by_county_latest',
  data_path_list: [
    'processed_data/latest/incidence_evolution_by_county.csv',
    'processed_data/latest/incidence_evolution_by_county_label.csv',
  ],

  xlabel_path: 3,
  r_list: [1, 0, 1],
  trans_delay: GP_wrap.trans_delay_long,
};
