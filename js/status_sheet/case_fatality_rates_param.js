
    //------------------------------------//
    //--  case_fatality_rates_param.js  --//
    //--  Chieh-An Lin                  --//
    //--  2022.05.28                    --//
    //------------------------------------//

var CFR_latest_wrap = {
  tag: 'case_fatality_rates_latest',
  data_path_list: [
    '../processed_data/latest/case_fatality_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.75,
  nb_yticks: 4,
  legend_pos_x: 105,
  r: 3, //-- Dot radius
};

var CFR_overall_wrap = {
  tag: 'case_fatality_rates_overall',
  data_path_list: [
    '../processed_data/overall/case_fatality_rates.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.75,
  nb_yticks: 4,
  legend_pos_x: 105,
  r: 1.5, //-- Dot radius
};
