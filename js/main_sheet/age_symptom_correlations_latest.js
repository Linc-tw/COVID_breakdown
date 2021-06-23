
//-- Filename:
//--   age_symptom_correlations_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_latest_wrap = {};

//-- ID
ASC_latest_wrap.tag = 'age_symptom_correlations_latest'

//-- File path
ASC_latest_wrap.data_path_list = [
  "processed_data/latest/age_symptom_correlations_coefficient.csv",
  "processed_data/latest/age_symptom_correlations_counts.csv", 
  "processed_data/latest/age_symptom_correlations_total.csv"
];

//-- Parameters
ASC_latest_wrap.legend_pos_x = 65;

//-- Main
ASC_Main(ASC_latest_wrap);
