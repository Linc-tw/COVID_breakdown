
//-- Filename:
//--   vaccination_by_brand_param.js
//--
//-- Author:
//--   Chieh-An Lin

var VBB_latest_wrap = {
  tag: 'vaccination_by_brand_latest', 
  data_path: [
    'processed_data/latest/vaccination_by_brand.csv', 
  ],

  xlabel_path: GS_wrap.xlabel_path_latest, 
  r_list: GS_wrap.r_list_latest, 
  y_max_factor: 1.2, 
  y_path_1: '4',  //-- 4 ticks
  y_path_0: '4', 
  legend_pos_x_0_: {'zh-tw': 110, fr: 110, en: 110},
  legend_pos_x_1_: {'zh-tw': 110, fr: 110, en: 110}, 
  trans_delay: GS_wrap.trans_delay,
};

var VBB_2021_wrap = {
  tag: 'vaccination_by_brand_2021',
  data_path: [
    'processed_data/2021/vaccination_by_brand.csv'
  ],

  xlabel_path: GS_wrap.xlabel_path_2021,
  r_list: GS_wrap.r_list_2021,
  y_max_factor: 1.2,
  y_path_1: '4', //-- 4 ticks
  y_path_0: '4',
  legend_pos_x_0_: {'zh-tw': 110, fr: 110, en: 110},
  legend_pos_x_1_: {'zh-tw': 110, fr: 110, en: 110},
  trans_delay: GS_wrap.trans_delay,
};