
//-- Filename:
//--   travel_history_symptom_correlations_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var THSC_2020_wrap = {};

//-- ID
THSC_2020_wrap.tag = 'travel_history_symptom_correlations_2020'

//-- File path
THSC_2020_wrap.data_path_list = [
  "processed_data/2020/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/2020/travel_history_symptom_correlations_counts.csv", 
  "processed_data/2020/travel_history_symptom_counts.csv"
];

//-- Parameters
THSC_2020_wrap.legend_pos_x = 50;

//-- Main
THSC_Main(THSC_2020_wrap);
