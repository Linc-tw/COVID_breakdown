
//-- Filename:
//--   age_symptom_correlations_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_2021_wrap = {};

//-- ID
ASC_2021_wrap.tag = 'age_symptom_correlations_2021'

//-- File path
ASC_2021_wrap.data_path_list = [
  "processed_data/2021/age_symptom_correlations_coefficient.csv",
  "processed_data/2021/age_symptom_correlations_counts.csv", 
  "processed_data/2021/age_symptom_correlations_total.csv"
];

//-- Parameters
ASC_2021_wrap.legend_pos_x = 65;

//-- Main
ASC_Main(ASC_2021_wrap);
