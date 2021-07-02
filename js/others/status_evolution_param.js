
//-- Filename:
//--   status_evolution_param.js
//--
//-- Author:
//--   Chieh-An Lin

var SE_latest_wrap = {
  tag: 'status_evolution_latest',
  data_path_list: [
    'processed_data/latest/status_evolution.csv',
  ],
  
  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var SE_2021_wrap = {
  tag: 'status_evolution_2021',
  data_path_list: [
    'processed_data/2021/status_evolution.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};


var SE_2020_wrap = {
  tag: 'status_evolution_2020',
  data_path_list: [
    'processed_data/2020/status_evolution.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.15,
  nb_yticks: 4,
  legend_pos_x: 70,
  trans_delay: GP_wrap.trans_delay,
};

