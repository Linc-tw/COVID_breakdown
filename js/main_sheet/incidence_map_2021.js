
//-- Filename:
//--   incidence_map_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var IM_2021_wrap = {};

//-- ID
IM_2021_wrap.tag = 'incidence_map_2021';

//-- File path
IM_2021_wrap.data_path_list = [
  "processed_data/adminMap_byCounties_offsetIslands_sphe.geojson",
  "processed_data/2021/incidence_map_population.csv",
  "processed_data/2021/incidence_map.csv",
];

//-- Parameters
IM_2021_wrap.xlabel_path = GS_wrap.xlabel_path_2021;
IM_2021_wrap.r_list = GS_wrap.r_list_2021;
IM_2021_wrap.y_max_factor = 1.4;
IM_2021_wrap.y_path = '4'; //-- 4 ticks
IM_2021_wrap.legend_pos_x = 90;

//-- Main
IM_Main(IM_2021_wrap);
