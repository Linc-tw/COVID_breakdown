
//-- Filename:
//--   difference_by_transmission_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- ID
var DBT_2020_WRAP = {};
DBT_2020_WRAP.tag = 'difference_by_transmission_2020'
DBT_2020_WRAP.id = '#' + DBT_2020_WRAP.tag

//-- File path
DBT_2020_WRAP.data_path_list = [
  "processed_data/2020/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
DBT_2020_WRAP.tooltip = d3.select(DBT_2020_WRAP.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
DBT_2020_WRAP.n_tot_key = '2020_total';
DBT_2020_WRAP.y_max_factor = 1.11;
DBT_2020_WRAP.y_path_0 = 40;
DBT_2020_WRAP.y_path_1 = 40;
DBT_2020_WRAP.y_path_2 = 1;
DBT_2020_WRAP.y_path_3 = 4;

//-- Variables
DBT_2020_WRAP.col_ind = 0;

//-- Plot
d3.csv(DBT_2020_WRAP.data_path_list[0], function(error, data) {
  d3.csv(DBT_2020_WRAP.data_path_list[1], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    DBT_Make_Canvas(DBT_2020_WRAP);
    DBT_Format_Data(DBT_2020_WRAP, data);
    DBT_Format_Data_2(DBT_2020_WRAP, data2);
    DBT_Initialize(DBT_2020_WRAP);
    DBT_Update(DBT_2020_WRAP);
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + DBT_2020_WRAP.tag + "_colInd']", function(event) {
  DBT_2020_WRAP.col_ind = this.value;
  data_path = DBT_2020_WRAP.data_path_list[0]
  
  d3.csv(data_path, function(error, data) {
    if (error) return console.warn(error);
    
    DBT_Format_Data(DBT_2020_WRAP, data);
    DBT_Update(DBT_2020_WRAP);
  });
});

//-- Save
d3.select(DBT_2020_WRAP.id + '_save').on('click', function() {
  var tag1;
  
  if (DBT_2020_WRAP.col_ind == 0) tag1 = 'all';
  else if (DBT_2020_WRAP.col_ind == 1) tag1 = 'imported';
  else if (DBT_2020_WRAP.col_ind == 2) tag1 = 'local';
  else tag1 = 'fleet';
  
  name = DBT_2020_WRAP.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(DBT_2020_WRAP.id).select('svg').node(), name);
});

