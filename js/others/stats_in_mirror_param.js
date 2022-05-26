
    //--------------------------------//
    //--  stats_in_mirror_param.js  --//
    //--  Chieh-An Lin              --//
    //--  2022.05.26                --//
    //--------------------------------//

var SIM_latest_wrap = {
  tag: 'stats_in_mirror_latest', 
  data_path_list: [
    '../processed_data/latest/case_counts_by_report_day.csv', 
    '../processed_data/latest/case_counts_by_report_day.csv', 
    '../processed_data/latest/case_counts_by_report_day.csv', 
    '../processed_data/latest/incidence_rates.csv',
    '../processed_data/latest/incidence_rates.csv',
    '../processed_data/latest/vaccination_by_brand.csv', 
    '../processed_data/latest/vaccination_by_dose.csv', 
    '../processed_data/latest/vaccination_by_dose.csv', 
    '../processed_data/latest/vaccination_by_dose.csv', 
    '../processed_data/latest/death_counts.csv', 
    '../processed_data/latest/case_fatality_rates.csv',
    '../processed_data/latest/case_fatality_rates.csv',
    '../processed_data/latest/test_counts.csv', 
    '../processed_data/latest/test_positive_rate.csv',
    '../processed_data/latest/border_statistics.csv',
    '../processed_data/latest/border_statistics.csv',
    '../processed_data/latest/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ],

  y_max_factor: 1.15, 
  nb_yticks: 3,
};

var SIM_overall_wrap = {
  tag: 'stats_in_mirror_overall', 
  data_path_list: [
    '../processed_data/overall/case_counts_by_report_day.csv', 
    '../processed_data/overall/case_counts_by_report_day.csv', 
    '../processed_data/overall/case_counts_by_report_day.csv', 
    '../processed_data/overall/incidence_rates.csv',
    '../processed_data/overall/incidence_rates.csv',
    '../processed_data/overall/vaccination_by_brand.csv', 
    '../processed_data/overall/vaccination_by_dose.csv', 
    '../processed_data/overall/vaccination_by_dose.csv', 
    '../processed_data/overall/vaccination_by_dose.csv', 
    '../processed_data/overall/death_counts.csv', 
    '../processed_data/overall/case_fatality_rates.csv',
    '../processed_data/overall/case_fatality_rates.csv',
    '../processed_data/overall/test_counts.csv', 
    '../processed_data/overall/test_positive_rate.csv',
    '../processed_data/overall/border_statistics.csv',
    '../processed_data/overall/border_statistics.csv',
    '../processed_data/overall/border_statistics.csv',
    '../processed_data/key_numbers.csv',
  ],
  
  y_max_factor: 1.15, 
  nb_yticks: 3,
};
