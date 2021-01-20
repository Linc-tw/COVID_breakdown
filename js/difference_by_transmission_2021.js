
//-- Filename:
//--   difference_by_transmission_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DBT_2021_wrap = {};

//-- ID
DBT_2021_wrap.tag = 'difference_by_transmission_2021'
DBT_2021_wrap.id = '#' + DBT_2021_wrap.tag

//-- File path
DBT_2021_wrap.data_path_list = [
  "processed_data/2021/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
DBT_2021_wrap.tooltip = d3.select(DBT_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
DBT_2021_wrap.n_tot_key = '2021_total';
DBT_2021_wrap.y_max_factor = 1.15;
DBT_2021_wrap.y_path_0 = 3;
DBT_2021_wrap.y_path_1 = 3;
DBT_2021_wrap.y_path_2 = 1;
DBT_2021_wrap.y_path_3 = 1;

//-- Variables
DBT_2021_wrap.col_ind = 0;

//-- Plot
function DBT_2021_Plot() {
  d3.csv(DBT_2021_wrap.data_path_list[0], function (error, data) {
    d3.csv(DBT_2021_wrap.data_path_list[1], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      DBT_Make_Canvas(DBT_2021_wrap);
      DBT_Format_Data(DBT_2021_wrap, data);
      DBT_Format_Data_2(DBT_2021_wrap, data2);
      DBT_Initialize(DBT_2021_wrap);
      DBT_Update(DBT_2021_wrap);
    });
  });
}

DBT_2021_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + DBT_2021_wrap.tag + "_colInd']", function (event) {
  DBT_2021_wrap.col_ind = this.value;
  data_path = DBT_2021_wrap.data_path_list[0]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    DBT_Format_Data(DBT_2021_wrap, data);
    DBT_Update(DBT_2021_wrap);
  });
});

//-- Save button
d3.select(DBT_2021_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (DBT_2021_wrap.col_ind == 0) tag1 = 'all';
  else if (DBT_2021_wrap.col_ind == 1) tag1 = 'imported';
  else if (DBT_2021_wrap.col_ind == 2) tag1 = 'local';
  else tag1 = 'others';
  
  name = DBT_2021_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(DBT_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(DBT_2021_wrap.id+' .plot').remove()
  
  //-- Replot
  DBT_2021_Plot();
});
