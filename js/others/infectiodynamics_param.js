
    //---------------------------------//
    //--  infectiodynamics_param.js  --//
    //--  Chieh-An Lin               --//
    //--  2021.12.13                 --//
    //---------------------------------//

var ID_latest_wrap = {
  tag: 'infectiodynamics_latest', 
  data_path_list: [
    '../processed_data/latest/hospitalization_or_isolation.csv', 
    '../processed_data/latest/case_counts_by_report_day.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
  r: 4.5, //-- Dot radius
};

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

var ID_2021_wrap = {
  tag: 'infectiodynamics_2021',
  data_path_list: [
    '../processed_data/2021/hospitalization_or_isolation.csv', 
    '../processed_data/2021/case_counts_by_report_day.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
  r: 3, //-- Dot radius
};

var ID_2020_wrap = {
  tag: 'infectiodynamics_2020',
  data_path_list: [
    '../processed_data/2020/hospitalization_or_isolation.csv', 
    '../processed_data/2020/case_counts_by_report_day.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
  r: 3, //-- Dot radius
};
