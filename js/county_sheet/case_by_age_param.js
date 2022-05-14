
    //--------------------------------//
    //--  case_by_age_param.js      --//
    //--  Chieh-An Lin              --//
    //--  2022.05.14                --//
    //--------------------------------//

var CBA_latest_wrap = {
  tag: 'case_by_age_latest',
  data_path_list: [
    '../processed_data/latest/case_by_age.csv',
    '../processed_data/latest/case_by_age_label.csv',
  ],

  y_max_factor: 1.55,
  nb_yticks: 4,
  legend_pos_x: 120,
};

var CBA_overall_wrap = {
  tag: 'case_by_age_overall',
  data_path_list: [
    '../processed_data/overall/case_by_age.csv',
    '../processed_data/overall/case_by_age_label.csv',
  ],

  y_max_factor: 1.55,
  nb_yticks: 4,
  legend_pos_x: 120,
};
