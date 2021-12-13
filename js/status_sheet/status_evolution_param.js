
    //---------------------------------//
    //--  status_evolution_param.js  --//
    //--  Chieh-An Lin               --//
    //--  2021.12.13                 --//
    //---------------------------------//

var SE_latest_wrap = {
  tag: 'status_evolution_latest',
  data_path_list: [
    '../processed_data/latest/status_evolution.csv',
  ],
  
  y_max_factor: 1.6,
  nb_yticks: 4,
  legend_pos_x: 80,
  legend_pos_x1_: {en: 190, fr: 190, 'zh-tw': 150},
};

var SE_2021_wrap = {
  tag: 'status_evolution_2021',
  data_path_list: [
    '../processed_data/2021/status_evolution.csv',
  ],

  y_max_factor: 1.5,
  nb_yticks: 4,
  legend_pos_x: 80,
  legend_pos_x1_: {en: 190, fr: 190, 'zh-tw': 150},
};


var SE_2020_wrap = {
  tag: 'status_evolution_2020',
  data_path_list: [
    '../processed_data/2020/status_evolution.csv',
  ],

  y_max_factor: 1.15,
  nb_yticks: 4,
  legend_pos_x: 70,
  legend_pos_x1_: {en: 190, fr: 190, 'zh-tw': 150},
};

