
    //------------------------------------//
    //--  vaccination_by_dose_param.js  --//
    //--  Chieh-An Lin                  --//
    //--  2022.02.13                    --//
    //------------------------------------//

var VBD_latest_wrap = {
  tag: 'vaccination_by_dose_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_dose.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.55,
  nb_yticks: 4,
  legend_pos_x: 110,
  legend_pos_x1: 190,
  r: 3, //-- Dot radius
};

var VBD_overall_wrap = {
  tag: 'vaccination_by_dose_overall',
  data_path_list: [
    '../processed_data/overall/vaccination_by_dose.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.3,
  nb_yticks: 4,
  legend_pos_x: 110,
//   legend_pos_x1: 190,
  r: 1.5, //-- Dot radius
};
