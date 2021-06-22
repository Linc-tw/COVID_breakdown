
//-- Filename:
//--   incidence_map_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var IM_latest_wrap = {};

//-- ID
IM_latest_wrap.tag = 'incidence_map_latest';

//-- File path
IM_latest_wrap.data_path_list = [
  "processed_data/adminMap_byCounties_offsetIslands_sphe.geojson",
  "processed_data/latest/incidence_map_population.csv",
  "processed_data/latest/incidence_map.csv",
];

//-- Parameters
IM_latest_wrap.xlabel_path = GS_wrap.xlabel_path_latest;
IM_latest_wrap.r_list = GS_wrap.r_list_latest;
IM_latest_wrap.y_max_factor = 1.4;
IM_latest_wrap.y_path = '4'; //-- 4 ticks
IM_latest_wrap.legend_pos_x = 90;

//-- Main
IM_Main(IM_latest_wrap);
