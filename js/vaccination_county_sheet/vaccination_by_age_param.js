
    //-----------------------------------//
    //--  vaccination_by_age_param.js  --//
    //--  Chieh-An Lin                 --//
    //--  2022.05.07                   --//
    //-----------------------------------//

var VBA_latest_wrap = {
  tag: 'vaccination_by_age_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_age.csv', 
  ],

  nb_yticks: 9,
  legend_pos_x_: {en: 570, fr: 560, 'zh-tw': 570},
};

var VBA_overall_wrap = {
  tag: 'vaccination_by_age_overall', 
  data_path_list: [
    '../processed_data/overall/vaccination_by_age.csv', 
  ],
  
  nb_yticks: 4,
  legend_pos_x: 115, 
};
