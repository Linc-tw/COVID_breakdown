
    //--------------------------------//
    //--  case_counts_param.js      --//
    //--  Chieh-An Lin              --//
    //--  2022.05.20                --//
    //--------------------------------//

var CC_mini_wrap = {
  tag: 'case_counts_mini',
  data_path_list: [
    '../processed_data/latest/case_counts_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.2,
};

var CC_latest_wrap = {
  tag: 'case_counts_latest',
  data_path_list: [
    '../processed_data/latest/case_counts_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.55,
  nb_yticks: 5,
  legend_pos_x: 115,
  legend_pos_x1_: {en: 190, fr: 200, 'zh-tw': 190},
};

var CC_overall_wrap = {
  tag: 'case_counts_overall',
  data_path_list: [
    '../processed_data/overall/case_counts_by_report_day.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.2, 
  nb_yticks: 5,
  legend_pos_x: 115,
  legend_pos_x1_: {en: 190, fr: 200, 'zh-tw': 190},
};
