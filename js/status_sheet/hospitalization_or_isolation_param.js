
    //---------------------------------------------//
    //--  hospitalization_or_isolation_param.js  --//
    //--  Chieh-An Lin                           --//
    //--  2021.12.13                             --//
    //---------------------------------------------//

var HOI_latest_wrap = {
  tag: 'hospitalization_or_isolation_latest',
  data_path_list: [
    '../processed_data/latest/hospitalization_or_isolation.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.5,
  nb_yticks: 4,
  legend_pos_x: 85,
};

var HOI_overall_wrap = {
  tag: 'hospitalization_or_isolation_overall',
  data_path_list: [
    '../processed_data/overall/hospitalization_or_isolation.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 85,
};

var HOI_2021_wrap = {
  tag: 'hospitalization_or_isolation_2021',
  data_path_list: [
    '../processed_data/2021/hospitalization_or_isolation.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
};

var HOI_2020_wrap = {
  tag: 'hospitalization_or_isolation_2020',
  data_path_list: [
    '../processed_data/2020/hospitalization_or_isolation.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.4,
  nb_yticks: 4,
  legend_pos_x: 90,
};
