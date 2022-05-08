
    //----------------------------------//
    //--  border_statistics_param.js  --//
    //--  Chieh-An Lin                --//
    //--  2022.05.08                  --//
    //----------------------------------//

var BS_latest_wrap = {
  tag: 'border_statistics_latest', 
  data_path_list: [
    '../processed_data/latest/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ], 

  y_max_factor: 2.0, 
  nb_yticks: 4,
  legend_pos_x: 480,
};

var BS_overall_wrap = {
  tag: 'border_statistics_overall', 
  data_path_list: [
    '../processed_data/overall/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ], 

  y_max_factor: 1.15, 
  nb_yticks: 4,
  legend_pos_x: 480, 
};
