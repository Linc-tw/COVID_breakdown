
//-- Filename:
//--   age_symptom_correlations_param.js
//--
//-- Author:
//--   Chieh-An Lin

var ASC_latest_wrap = {
  tag: 'age_symptom_correlations_latest', 
  data_path_list: [
    'processed_data/latest/age_symptom_correlations.csv',
    'processed_data/latest/age_symptom_correlations_label.csv'
  ],

  legend_pos_x: 70,
  trans_delay: GP_wrap.trans_delay,
};

var ASC_2021_wrap = {
  tag: 'age_symptom_correlations_2021', 
  data_path_list: [
    'processed_data/2021/age_symptom_correlations.csv',
    'processed_data/2021/age_symptom_correlations_label.csv'
  ],

  legend_pos_x: 70,
  trans_delay: GP_wrap.trans_delay,
};

var ASC_2020_wrap = {
  tag: 'age_symptom_correlations_2020', 
  data_path_list: [
    'processed_data/2020/age_symptom_correlations.csv',
    'processed_data/2020/age_symptom_correlations_label.csv'
  ],

  legend_pos_x: 50,
  trans_delay: GP_wrap.trans_delay,
};
