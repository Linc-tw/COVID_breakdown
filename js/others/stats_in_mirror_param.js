
    //--------------------------------//
    //--  stats_in_mirror_param.js  --//
    //--  Chieh-An Lin              --//
    //--  2021.12.13                --//
    //--------------------------------//

var SIM_latest_wrap = {
  tag: 'stats_in_mirror_latest', 
  data_path_list: [
    '../processed_data/latest/test_counts.csv', 
    '../processed_data/latest/case_counts_by_report_day.csv', 
    '../processed_data/latest/hospitalization_or_isolation.csv', 
    '../processed_data/latest/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
};

var SIM_overall_wrap = {
  tag: 'stats_in_mirror_overall', 
  data_path_list: [
    '../processed_data/overall/test_counts.csv', 
    '../processed_data/overall/case_counts_by_report_day.csv', 
    '../processed_data/overall/hospitalization_or_isolation.csv', 
    '../processed_data/overall/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.15, 
  nb_yticks: 3,
};

var SIM_2021_wrap = {
  tag: 'stats_in_mirror_2021',
  data_path_list: [
    '../processed_data/2021/test_counts.csv', 
    '../processed_data/2021/case_counts_by_report_day.csv', 
    '../processed_data/2021/hospitalization_or_isolation.csv', 
    '../processed_data/2021/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
};

var SIM_2020_wrap = {
  tag: 'stats_in_mirror_2020',
  data_path_list: [
    '../processed_data/2020/test_counts.csv', 
    '../processed_data/2020/case_counts_by_report_day.csv', 
    '../processed_data/2020/hospitalization_or_isolation.csv', 
    '../processed_data/2020/death_counts.csv', 
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
};
