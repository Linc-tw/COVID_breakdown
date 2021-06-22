
//-- Filename:
//--   incidence_map_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var IM_2020_wrap = {};

//-- ID
IM_2020_wrap.tag = 'incidence_map_2020';

//-- File path
IM_2020_wrap.data_path_list = [
  "processed_data/adminMap_byCounties_offsetIslands_sphe.geojson",
  "processed_data/2020/incidence_map_population.csv",
  "processed_data/2020/incidence_map.csv",
];

//-- Parameters
IM_2020_wrap.xlabel_path = GS_wrap.xlabel_path_2020;
IM_2020_wrap.r_list = GS_wrap.r_list_2020;
IM_2020_wrap.y_max_factor = 1.4;
IM_2020_wrap.y_path = '4'; //-- 4 ticks
IM_2020_wrap.legend_pos_x = 90;

//-- Main
IM_Main(IM_2020_wrap);
