
//-- Filename:
//--   positivity_and_fatality_param.js
//--
//-- Author:
//--   Chieh-An Lin

var PAF_mini_wrap = {
  tag: 'positivity_and_fatality_mini',
  data_path_list: [
    '../processed_data/latest/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1,
  nb_yticks: 4,
  r: 2, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var PAF_latest_wrap = {
  tag: 'positivity_and_fatality_latest',
  data_path_list: [
    '../processed_data/latest/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.8,
  nb_yticks: 4,
  legend_pos_x: 95,
  r: 3, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var PAF_overall_wrap = {
  tag: 'positivity_and_fatality_overall',
  data_path_list: [
    '../processed_data/overall/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 190,
  r: 1.5, //-- Dot radius
  trans_delay: GP_wrap.trans_delay,
};

var PAF_2021_wrap = {
  tag: 'positivity_and_fatality_2021',
  data_path_list: [
    '../processed_data/2021/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 85,
  r: 2,
  trans_delay: GP_wrap.trans_delay,
};

var PAF_2020_wrap = {
  tag: 'positivity_and_fatality_2020',
  data_path_list: [
    '../processed_data/2020/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 290,
  r: 1.5,
  trans_delay: GP_wrap.trans_delay,
};
