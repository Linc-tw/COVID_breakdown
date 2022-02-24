
    //--------------------------------------//
    //--  vaccination_by_county_param.js  --//
    //--  Chieh-An Lin                    --//
    //--  2021.12.13                      --//
    //--------------------------------------//

var VBC_latest_wrap = {
  tag: 'vaccination_by_county_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_county.csv', 
  ],

  nb_yticks: 9,
  legend_pos_x_: {en: 460, fr: 460, 'zh-tw': 580},
};

var VBC_overall_wrap = {
  tag: 'vaccination_by_county_overall', 
  data_path_list: [
    '../processed_data/overall/vaccination_by_county.csv', 
  ],
  
  nb_yticks: 4,
  legend_pos_x: 115, 
};

var VBC_2021_wrap = {
  tag: 'vaccination_by_county_2021',
  data_path_list: [
    '../processed_data/2021/vaccination_by_county.csv', 
  ],

  nb_yticks: 4,
  legend_pos_x: 115, 
};