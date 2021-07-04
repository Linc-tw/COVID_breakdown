
//-- Filename:
//--   incidence_map_param.js
//--
//-- Author:
//--   Chieh-An Lin

var IM_latest_wrap = {
  tag: 'incidence_map_latest',
  data_path_list: [
    'processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    'processed_data/latest/incidence_map_label.csv',
    'processed_data/latest/incidence_map.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_latest,
  r_list: GP_wrap.r_list_latest,
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var IM_2021_wrap = {
  tag: 'incidence_map_2021',
  data_path_list: [
    'processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    'processed_data/2021/incidence_map_label.csv',
    'processed_data/2021/incidence_map.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2021,
  r_list: GP_wrap.r_list_2021,
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};

var IM_2020_wrap = {
  tag: 'incidence_map_2020',
  data_path_list: [
    'processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    'processed_data/2020/incidence_map_label.csv',
    'processed_data/2020/incidence_map.csv',
  ],

  xlabel_path: GP_wrap.xlabel_path_2020,
  r_list: GP_wrap.r_list_2020,
  y_max_factor: 1.4,
  y_path: '4', //-- 4 ticks
  legend_pos_x: 90,
  trans_delay: GP_wrap.trans_delay,
};
