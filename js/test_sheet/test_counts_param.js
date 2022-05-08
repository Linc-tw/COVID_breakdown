
    //--------------------------------//
    //--  test_counts_param.js      --//
    //--  Chieh-An Lin              --//
    //--  2022.05.08                --//
    //--------------------------------//

var TC_mini_wrap = {
  tag: 'test_counts_mini',
  data_path_list: [
    '../processed_data/latest/test_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
};

var TC_latest_wrap = {
  tag: 'test_counts_latest', 
  data_path_list: [
    '../processed_data/latest/test_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.55, 
  nb_yticks: 4,
  legend_pos_x: 130,
};

var TC_overall_wrap = {
  tag: 'test_counts_overall', 
  data_path_list: [
    '../processed_data/overall/test_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 135,
};
