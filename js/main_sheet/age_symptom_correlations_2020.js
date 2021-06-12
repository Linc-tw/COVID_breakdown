
//-- Filename:
//--   age_symptom_correlations_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_2020_wrap = {};

//-- ID
ASC_2020_wrap.tag = 'age_symptom_correlations_2020'

//-- File path
ASC_2020_wrap.data_path_list = [
  "processed_data/2020/age_symptom_correlations_coefficient.csv",
  "processed_data/2020/age_symptom_correlations_counts.csv", 
  "processed_data/2020/age_symptom_counts.csv"
];

//-- Parameters
ASC_2020_wrap.legend_pos_x = 50;

//-- Main
ASC_Main(ASC_2020_wrap);
