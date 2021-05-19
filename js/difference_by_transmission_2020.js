
//-- Filename:
//--   difference_by_transmission_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var DBT_2020_wrap = {};

//-- ID
DBT_2020_wrap.tag = 'difference_by_transmission_2020'
DBT_2020_wrap.id = '#' + DBT_2020_wrap.tag

//-- File path
DBT_2020_wrap.data_path_list = [
  "processed_data/2020/difference_by_transmission.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
DBT_2020_wrap.tooltip = d3.select(DBT_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
DBT_2020_wrap.n_tot_key = 'n_2020';
DBT_2020_wrap.y_max_factor = 1.11;
DBT_2020_wrap.y_path_0 = 40;
DBT_2020_wrap.y_path_1 = 40;
DBT_2020_wrap.y_path_2 = 1;
DBT_2020_wrap.y_path_3 = 4;

//-- Variables
DBT_2020_wrap.col_ind = 0;

//-- Plot
function DBT_2020_Plot() {
  d3.csv(DBT_2020_wrap.data_path_list[0], function (error, data) {
    d3.csv(DBT_2020_wrap.data_path_list[1], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      DBT_Make_Canvas(DBT_2020_wrap);
      DBT_Format_Data(DBT_2020_wrap, data);
      DBT_Format_Data_2(DBT_2020_wrap, data2);
      DBT_Initialize(DBT_2020_wrap);
      DBT_Update(DBT_2020_wrap);
    });
  });
}

DBT_2020_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + DBT_2020_wrap.tag + "_colInd']", function (event) {
  DBT_2020_wrap.col_ind = this.value;
  data_path = DBT_2020_wrap.data_path_list[0]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    DBT_Format_Data(DBT_2020_wrap, data);
    DBT_Update(DBT_2020_wrap);
  });
});

//-- Save button
d3.select(DBT_2020_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (DBT_2020_wrap.col_ind == 0) tag1 = 'all';
  else if (DBT_2020_wrap.col_ind == 1) tag1 = 'imported';
  else if (DBT_2020_wrap.col_ind == 2) tag1 = 'local';
  else tag1 = 'others';
  
  name = DBT_2020_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(DBT_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(DBT_2020_wrap.id+' .plot').remove()
  
  //-- Replot
  DBT_2020_Plot();
});
