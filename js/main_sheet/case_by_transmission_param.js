
//-- Filename:
//--   case_by_transmission_param.js
//--
//-- Author:
//--   Chieh-An Lin

var CBT_latest_wrap = {
  tag: 'case_by_transmission_latest',
  data_path_list: [
    'processed_data/latest/case_by_transmission_by_report_day.csv',
    'processed_data/latest/case_by_transmission_by_onset_day.csv',
    'processed_data/key_numbers.csv',
  ],
  
  n_tot_key: 'n_latest',
  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  y_max_factor: 1.6,
  nb_yticks: 5,
  legend_pos_x_0_i_: {en: 80, fr: 80, 'zh-tw': 80},
  legend_pos_x_1_i_: {en: 80, fr: 80, 'zh-tw': 80},
  legend_pos_x1_0_i_: {en: 200, fr: 250, 'zh-tw': 220},
  legend_pos_x1_1_i_: {en: 200, fr: 250, 'zh-tw': 220},
  trans_delay: GP_wrap.trans_delay,
};

var CBT_2021_wrap = {
  tag: 'case_by_transmission_2021',
  data_path_list: [
    'processed_data/2021/case_by_transmission_by_report_day.csv',
    'processed_data/2021/case_by_transmission_by_onset_day.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_2021',
  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.6,
  nb_yticks: 5,
  legend_pos_x_0_i_: {en: 80, fr: 80, 'zh-tw': 80},
  legend_pos_x_1_i_: {en: 80, fr: 80, 'zh-tw': 80},
  legend_pos_x1_0_i_: {en: 190, fr: 270, 'zh-tw': 240},
  legend_pos_x1_1_i_: {en: 220, fr: 270, 'zh-tw': 240},
  trans_delay: GP_wrap.trans_delay_long,
};

var CBT_2020_wrap = {
  tag: 'case_by_transmission_2020',
  data_path_list: [
    'processed_data/2020/case_by_transmission_by_report_day.csv',
    'processed_data/2020/case_by_transmission_by_onset_day.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_2020',
  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.5,
  nb_yticks: 5,
  legend_pos_x_0_i_: {en: 290, fr: 270, 'zh-tw': 290},
  legend_pos_x_1_i_: {en: 55, fr: 55, 'zh-tw': 55},
  legend_pos_x1_0_i_: {en: 240, fr: 250, 'zh-tw': 210},
  legend_pos_x1_1_i_: {en: 240, fr: 250, 'zh-tw': 210},
  trans_delay: GP_wrap.trans_delay_long,
};