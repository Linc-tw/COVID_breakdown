
    //-------------------------------------//
    //--  vaccination_by_brand_param.js  --//
    //--  Chieh-An Lin                   --//
    //--  2022.05.08                     --//
    //-------------------------------------//

var VBB_mini_wrap = {
  tag: 'vaccination_by_brand_mini', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_brand.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.1, 
};

var VBB_latest_wrap = {
  tag: 'vaccination_by_brand_latest', 
  data_path_list: [
    '../processed_data/latest/vaccination_by_brand.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.55, 
  nb_yticks: 4,
  legend_pos_x: 115, 
  legend_pos_x1_: {en: 225, fr: 245, 'zh-tw': 210},
};

var VBB_overall_wrap = {
  tag: 'vaccination_by_brand_overall', 
  data_path_list: [
    '../processed_data/overall/vaccination_by_brand.csv', 
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.55, 
  nb_yticks: 4,
  legend_pos_x: 125, 
  legend_pos_x1_: {en: 225, fr: 235, 'zh-tw': 200},
};
