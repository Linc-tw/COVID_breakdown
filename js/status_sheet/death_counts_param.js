
    //--------------------------------//
    //--  death_counts_param.js     --//
    //--  Chieh-An Lin              --//
    //--  2022.05.08                --//
    //--------------------------------//

var DC_latest_wrap = {
  tag: 'death_counts_latest', 
  data_path_list: [
    '../processed_data/latest/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.55, 
  nb_yticks: 4,
  legend_pos_x: 75,
};

var DC_overall_wrap = {
  tag: 'death_counts_overall', 
  data_path_list: [
    '../processed_data/overall/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
  nb_yticks: 4,
  legend_pos_x: 75,
};
