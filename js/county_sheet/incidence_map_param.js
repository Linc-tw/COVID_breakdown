
//-- Filename:
//--   incidence_map_param.js
//--
//-- Author:
//--   Chieh-An Lin

var IM_latest_wrap = {
  tag: 'incidence_map_latest',
  data_path_list: [
    '../processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    '../processed_data/latest/incidence_map_label.csv',
    '../processed_data/latest/incidence_map.csv',
  ],

  trans_delay: GP_wrap.trans_delay,
};

var IM_overall_wrap = {
  tag: 'incidence_map_overall',
  data_path_list: [
    '../processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    '../processed_data/overall/incidence_map_label.csv',
    '../processed_data/overall/incidence_map.csv',
  ],

  trans_delay: GP_wrap.trans_delay,
};

var IM_2021_wrap = {
  tag: 'incidence_map_2021',
  data_path_list: [
    'processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    'processed_data/2021/incidence_map_label.csv',
    'processed_data/2021/incidence_map.csv',
  ],

  trans_delay: GP_wrap.trans_delay,
};

var IM_2020_wrap = {
  tag: 'incidence_map_2020',
  data_path_list: [
    'processed_data/adminMap_byCounties_offsetIslands_sphe.geojson',
    'processed_data/2020/incidence_map_label.csv',
    'processed_data/2020/incidence_map.csv',
  ],

  trans_delay: GP_wrap.trans_delay,
};
