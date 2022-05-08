
    //----------------------------------------//
    //--  positivity_and_fatality_param.js  --//
    //--  Chieh-An Lin                      --//
    //--  2022.05.08                        --//
    //----------------------------------------//

var PAF_latest_wrap = {
  tag: 'positivity_and_fatality_latest',
  data_path_list: [
    '../processed_data/latest/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.75,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 3, //-- Dot radius
};

var PAF_overall_wrap = {
  tag: 'positivity_and_fatality_overall',
  data_path_list: [
    '../processed_data/overall/positivity_and_fatality.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.2,
  nb_yticks: 4,
  legend_pos_x: 110,
  r: 1.5, //-- Dot radius
};
