
    //---------------------------------//
    //--  infectiodynamics_param.js  --//
    //--  Chieh-An Lin               --//
    //--  2022.05.08                 --//
    //---------------------------------//

var ID_overall_wrap = {
  tag: 'infectiodynamics_overall', 
  data_path_list: [
    '../processed_data/overall/hospitalization_or_isolation.csv',
    '../processed_data/overall/case_counts_by_report_day.csv',  
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.15, 
  nb_yticks: 3,
  r: 4.5, //-- Dot radius
};
