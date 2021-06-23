
//-- Filename:
//--   travel_history_symptom_correlations_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var THSC_2021_wrap = {};

//-- ID
THSC_2021_wrap.tag = 'travel_history_symptom_correlations_2021'

//-- File path
THSC_2021_wrap.data_path_list = [
  "processed_data/2021/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/2021/travel_history_symptom_correlations_counts.csv", 
  "processed_data/2021/travel_history_symptom_correlations_total.csv"
];

//-- Parameters
THSC_2021_wrap.legend_pos_x = 65;

//-- Main
THSC_Main(THSC_2021_wrap);
