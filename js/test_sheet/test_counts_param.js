
    //--------------------------------//
    //--  test_counts_param.js      --//
    //--  Chieh-An Lin              --//
    //--  2022.05.02                --//
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

var TC_2021_wrap = {
  tag: 'test_counts_2021',
  data_path_list: [
    '../processed_data/2021/test_counts.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
};

var TC_2020_wrap = {
  tag: 'test_counts_2020',
  data_path_list: [
    '../processed_data/2020/test_counts.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 90,
};
