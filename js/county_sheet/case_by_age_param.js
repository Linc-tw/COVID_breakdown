
//-- Filename:
//--   case_by_age_param.js
//--
//-- Author:
//--   Chieh-An Lin

var CBA_latest_wrap = {
  tag: 'case_by_age_latest',
  data_path_list: [
    '../processed_data/latest/case_by_age.csv',
  ],

  y_max_factor: 1.6,
  nb_yticks: 4,
  legend_pos_x: 95,
  trans_delay: GP_wrap.trans_delay,
};

var CBA_overall_wrap = {
  tag: 'case_by_age_overall',
  data_path_list: [
    '../processed_data/overall/case_by_age.csv',
  ],

  y_max_factor: 1.6,
  nb_yticks: 4,
  legend_pos_x: 95,
  trans_delay: GP_wrap.trans_delay,
};

var CBA_2021_wrap = {
  tag: 'case_by_age_2021',
  data_path_list: [
    '../processed_data/2021/case_by_age.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 95,
  trans_delay: GP_wrap.trans_delay,
};

var CBA_2020_wrap = {
  tag: 'case_by_age_2020',
  data_path_list: [
    '../processed_data/2020/case_by_age.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
