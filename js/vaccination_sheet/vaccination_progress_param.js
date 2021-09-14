
//-- Filename:
//--   vaccination_progress_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VP_latest_wrap = {
  tag: 'vaccination_progress_latest',
  data_path_list: [
    '../processed_data/key_numbers.csv',
    '../processed_data/latest/vaccination_progress_supplies.csv',
    '../processed_data/latest/vaccination_progress_injections.csv',
  ],

  x_max_factor: 1.22,
  y_max_factor: 1.45,
  y_max_fixed: 0,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
};

var VP_overall_wrap = {
  tag: 'vaccination_progress_overall',
  data_path_list: [
    '../processed_data/key_numbers.csv',
    '../processed_data/overall/vaccination_progress_supplies.csv',
    '../processed_data/overall/vaccination_progress_injections.csv',
  ],

  x_max_factor: 1.19,
  y_max_factor: 1.3,
  y_max_fixed: 0,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 2, //-- Dot radius
};
