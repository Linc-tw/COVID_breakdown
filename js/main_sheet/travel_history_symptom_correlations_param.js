
//-- Filename:
//--   travel_history_symptom_correlations_param.js
//--
//-- Author:
//--   Chieh-An Lin

var THSC_latest_wrap = {
  tag: 'travel_history_symptom_correlations_latest',
  data_path_list: [
    'processed_data/latest/travel_history_symptom_correlations.csv',
    'processed_data/latest/travel_history_symptom_correlations_label.csv',
  ],

  legend_pos_x: 70,
  trans_delay: GP_wrap.trans_delay,
};

var THSC_2021_wrap = {
  tag: 'travel_history_symptom_correlations_2021',
  data_path_list: [
    'processed_data/2021/travel_history_symptom_correlations.csv',
    'processed_data/2021/travel_history_symptom_correlations_label.csv',
  ],

  legend_pos_x: 70,
  trans_delay: GP_wrap.trans_delay,
};

var THSC_2020_wrap = {
  tag: 'travel_history_symptom_correlations_2020',
  data_path_list: [
    'processed_data/2020/travel_history_symptom_correlations.csv',
    'processed_data/2020/travel_history_symptom_correlations_label.csv',
  ],

  legend_pos_x: 50,
  trans_delay: GP_wrap.trans_delay,
};
