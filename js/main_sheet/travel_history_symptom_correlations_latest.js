
//-- Filename:
//--   travel_history_symptom_correlations_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var THSC_latest_wrap = {};

//-- ID
THSC_latest_wrap.tag = 'travel_history_symptom_correlations_latest'

//-- File path
THSC_latest_wrap.data_path_list = [
  "processed_data/latest/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/latest/travel_history_symptom_correlations_counts.csv", 
  "processed_data/latest/travel_history_symptom_correlations_total.csv"
];

//-- Parameters
THSC_latest_wrap.legend_pos_x = 65;

//-- Main
THSC_Main(THSC_latest_wrap);
