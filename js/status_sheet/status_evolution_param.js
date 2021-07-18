
//-- Filename:
//--   status_evolution_param.js
//--
//-- Author:
//--   Chieh-An Lin

var SE_latest_wrap = {
  tag: 'status_evolution_latest',
  data_path_list: [
    '../processed_data/latest/status_evolution.csv',
  ],
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 80,
  trans_delay: GP_wrap.trans_delay,
};

var SE_2021_wrap = {
  tag: 'status_evolution_2021',
  data_path_list: [
    '../processed_data/2021/status_evolution.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 80,
  trans_delay: GP_wrap.trans_delay,
};


var SE_2020_wrap = {
  tag: 'status_evolution_2020',
  data_path_list: [
    '../processed_data/2020/status_evolution.csv',
  ],

  y_max_factor: 1.15,
  nb_yticks: 4,
  legend_pos_x: 70,
  trans_delay: GP_wrap.trans_delay,
};

