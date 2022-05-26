
    //-----------------------------------//
    //--  test_positive_rate_param.js  --//
    //--  Chieh-An Lin                 --//
    //--  2022.05.26                   --//
    //-----------------------------------//

var TPR_latest_wrap = {
  tag: 'test_positive_rate_latest',
  data_path_list: [
    '../processed_data/latest/test_positive_rate.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.75,
  nb_yticks: 4,
  legend_pos_x: 105,
  r: 3, //-- Dot radius
};

var TPR_overall_wrap = {
  tag: 'test_positive_rate_overall',
  data_path_list: [
    '../processed_data/overall/test_positive_rate.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 105,
  r: 1.5, //-- Dot radius
};
