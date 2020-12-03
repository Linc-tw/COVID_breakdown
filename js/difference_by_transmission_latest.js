
//-- Filename:
//--   difference_by_transmission_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- ID
var DBT_LATEST_WRAP = {};
DBT_LATEST_WRAP.tag = 'difference_by_transmission_latest'
DBT_LATEST_WRAP.id = '#' + DBT_LATEST_WRAP.tag

//-- File path
DBT_LATEST_WRAP.data_path_list = [
  "processed_data/latest/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
DBT_LATEST_WRAP.tooltip = d3.select(DBT_LATEST_WRAP.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
DBT_LATEST_WRAP.n_tot_key = 'latest_total';
DBT_LATEST_WRAP.y_max_factor = 1.11;
DBT_LATEST_WRAP.y_path_0 = 15;
DBT_LATEST_WRAP.y_path_1 = 15;
DBT_LATEST_WRAP.y_path_2 = 1;
DBT_LATEST_WRAP.y_path_3 = 1;

//-- Variables
DBT_LATEST_WRAP.col_ind = 0;

//-- Plot
d3.csv(DBT_LATEST_WRAP.data_path_list[0], function(error, data) {
  d3.csv(DBT_LATEST_WRAP.data_path_list[1], function(error2, data2) {
    if (error) return console.warn(error);
    if (error2) return console.warn(error2);
    
    DBT_Make_Canvas(DBT_LATEST_WRAP);
    DBT_Format_Data(DBT_LATEST_WRAP, data);
    DBT_Format_Data_2(DBT_LATEST_WRAP, data2);
    DBT_Initialize(DBT_LATEST_WRAP);
    DBT_Update(DBT_LATEST_WRAP);
  });
});

//-- Buttons
$(document).on("change", "input:radio[name='" + DBT_LATEST_WRAP.tag + "_colInd']", function(event) {
  DBT_LATEST_WRAP.col_ind = this.value;
  data_path = DBT_LATEST_WRAP.data_path_list[0]
  
  d3.csv(data_path, function(error, data) {
    if (error) return console.warn(error);
    
    DBT_Format_Data(DBT_LATEST_WRAP, data);
    DBT_Update(DBT_LATEST_WRAP);
  });
});

//-- Save
d3.select(DBT_LATEST_WRAP.id + '_save').on('click', function() {
  var tag1;
  
  if (DBT_LATEST_WRAP.col_ind == 0) tag1 = 'all';
  else if (DBT_LATEST_WRAP.col_ind == 1) tag1 = 'imported';
  else if (DBT_LATEST_WRAP.col_ind == 2) tag1 = 'local';
  else tag1 = 'fleet';
  
  name = DBT_LATEST_WRAP.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(DBT_LATEST_WRAP.id).select('svg').node(), name);
});
