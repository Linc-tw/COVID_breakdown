
    //--------------------------------//
    //--  death_delay_param.js      --//
    //--  Chieh-An Lin              --//
    //--  2022.05.24                --//
    //--------------------------------//

var DD_latest_wrap = {
  tag: 'death_delay_latest',
  data_path_list: [
    '../processed_data/latest/death_delay.csv',
    '../processed_data/latest/death_delay_label.csv',
  ],
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 460,
};

var DD_overall_wrap = {
  tag: 'death_delay_overall',
  data_path_list: [
    '../processed_data/overall/death_delay.csv',
    '../processed_data/overall/death_delay_label.csv',
  ],
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 460,
};
