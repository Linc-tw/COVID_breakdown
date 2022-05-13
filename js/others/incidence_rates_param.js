
    //--------------------------------//
    //--  incidence_rates_param.js  --//
    //--  Chieh-An Lin              --//
    //--  2022.05.13                --//
    //--------------------------------//

var IR_mini_wrap = {
  tag: 'incidence_rates_mini',
  data_path_list: [
    '../processed_data/latest/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15,
  nb_yticks: 4,
  r: 2, //-- Dot radius
};

var IR_latest_wrap = {
  tag: 'incidence_rates_latest',
  data_path_list: [
    '../processed_data/latest/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.75,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
};

var IR_overall_wrap = {
  tag: 'incidence_rates_overall',
  data_path_list: [
    '../processed_data/overall/incidence_rates.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 1.5, //-- Dot radius
};
