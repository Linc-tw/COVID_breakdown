
//-- Filename:
//--   case_by_transmission_param.js
//--
//-- Author:
//--   Chieh-An Lin

var CBT_mini_wrap = {
  tag: 'case_by_transmission_mini',
  data_path_list: [
    '../processed_data/latest/case_by_transmission_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.1,
  trans_delay: GP_wrap.trans_delay,
};

var CBT_latest_wrap = {
  tag: 'case_by_transmission_latest',
  data_path_list: [
    '../processed_data/latest/case_by_transmission_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.6,
  nb_yticks: 5,
  legend_pos_x: 85,
  legend_pos_x1_: {en: 170, fr: 180, 'zh-tw': 170},
  trans_delay: GP_wrap.trans_delay,
};

var CBT_overall_wrap = {
  tag: 'case_by_transmission_overall',
  data_path_list: [
    '../processed_data/overall/case_by_transmission_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.1, 
  nb_yticks: 5,
  legend_pos_x: 85,
  legend_pos_x1_: {en: 170, fr: 180, 'zh-tw': 170},
  trans_delay: GP_wrap.trans_delay,
};

var CBT_2021_wrap = {
  tag: 'case_by_transmission_2021',
  data_path_list: [
    '../processed_data/2021/case_by_transmission_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.6,
  nb_yticks: 5,
  legend_pos_x: 80,
  legend_pos_x1_: {en: 190, fr: 270, 'zh-tw': 240},
  trans_delay: GP_wrap.trans_delay,
};

var CBT_2020_wrap = {
  tag: 'case_by_transmission_2020',
  data_path_list: [
    '../processed_data/2020/case_by_transmission_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.5,
  nb_yticks: 5,
  legend_pos_x: 80,
  legend_pos_x1_: {en: 240, fr: 250, 'zh-tw': 210},
  trans_delay: GP_wrap.trans_delay,
};