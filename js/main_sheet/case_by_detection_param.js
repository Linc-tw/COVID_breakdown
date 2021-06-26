
//-- Filename:
//--   case_by_detection_param.js
//--
//-- Author:
//--   Chieh-An Lin

var CBD_latest_wrap = {
  tag: 'case_by_detection_latest', 
  data_path_list: [
    'processed_data/latest/case_by_detection_by_report_day.csv',
    'processed_data/latest/case_by_detection_by_onset_day.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_latest',
  xlabel_path: GS_wrap.xlabel_path_latest,
  r_list: GS_wrap.r_list_latest,
  y_max_factor: 1.2,
  y_max_fix_1_1: 0,
  y_max_fix_1_0: 0,
  y_max_fix_0_1: 0,
  y_max_fix_0_0: 0,
  y_path_1_1: '4', //-- 4 ticks
  y_path_1_0: '4',
  y_path_0_1: '4',
  y_path_0_0: '4',
  legend_pos_x_0_i_: {'zh-tw': 65, fr: 65, en: 65}, //320, 280, 320
  legend_pos_x_1_i_: {'zh-tw': 65, fr: 65, en: 65},
  legend_pos_x1_: {'zh-tw': 240, fr: 210, en: 190},
  trans_delay: GS_wrap.trans_delay,
};

var CBD_2021_wrap = {
  tag: 'case_by_detection_2021',
  data_path_list: [
    'processed_data/2021/case_by_detection_by_report_day.csv',
    'processed_data/2021/case_by_detection_by_onset_day.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_2021',
  xlabel_path: GS_wrap.xlabel_path_2021,
  r_list: GS_wrap.r_list_2021,
  y_max_factor: 1.2,
  y_max_fix_1_1: 0,
  y_max_fix_1_0: 0,
  y_max_fix_0_1: 0,
  y_max_fix_0_0: 0,
  y_path_1_1: '4', //-- 4 ticks
  y_path_1_0: '4',
  y_path_0_1: '4',
  y_path_0_0: '4',
  legend_pos_x_0_i_: {'zh-tw': 65, fr: 65, en: 65},
  legend_pos_x_1_i_: {'zh-tw': 65, fr: 65, en: 65},
  legend_pos_x1_: {'zh-tw': 240, fr: 210, en: 190},
  trans_delay: GS_wrap.trans_delay_long,
};

var CBD_2020_wrap = {
  tag: 'case_by_detection_2020',
  data_path_list: [
    'processed_data/2020/case_by_detection_by_report_day.csv',
    'processed_data/2020/case_by_detection_by_onset_day.csv',
    'processed_data/key_numbers.csv',
  ],

  n_tot_key: 'n_2020',
  xlabel_path: GS_wrap.xlabel_path_2020,
  r_list: GS_wrap.r_list_2020,
  y_max_factor: 1.3,
  y_max_fix_1_1: 0,
  y_max_fix_1_0: 0,
  y_max_fix_0_1: 0,
  y_max_fix_0_0: 0,
  y_path_1_1: '4', //-- 4 ticks
  y_path_1_0: '4',
  y_path_0_1: '4',
  y_path_0_0: '4',
  legend_pos_x_0_i_: {'zh-tw': 280, fr: 290, en: 290},
  legend_pos_x_1_i_: {'zh-tw': 0, fr: 0, en: 0},
  legend_pos_x1_: {'zh-tw': 0, fr: 0, en: 0},
  trans_delay: GS_wrap.trans_delay_long,
};
