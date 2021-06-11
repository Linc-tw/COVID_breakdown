
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
DBT_2021_wrap.n_tot_key = 'n_2021';
DBT_2021_wrap.y_max_factor = 1.2;
DBT_2021_wrap.y_path_0 = '4'; //-- 4 ticks
DBT_2021_wrap.y_path_1 = '4';
DBT_2021_wrap.y_path_2 = '4';
DBT_2021_wrap.y_path_3 = '4';

//-- Variables
DBT_2021_wrap.col_ind = 0;

//-- Plot
function DBT_2021_Plot() {
  d3.queue()
    .defer(d3.csv, DBT_2021_wrap.data_path_list[0])
    .defer(d3.csv, DBT_2021_wrap.data_path_list[1])
    .await(function (error, data, data2) {DBT_Plot(DBT_2021_wrap, error, data, data2);});
}

function DBT_2021_Replot() {
  d3.queue()
    .defer(d3.csv, DBT_2021_wrap.data_path_list[0])
    .await(function (error, data) {DBT_Replot(DBT_2021_wrap, error, data);});
}

DBT_2021_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + DBT_2021_wrap.tag + "_ind']", function (event) {
  var old_btn = document.getElementById(DBT_2021_wrap.tag + '_ind_' + DBT_2021_wrap.col_ind);
  var new_btn = document.getElementById(DBT_2021_wrap.tag + '_ind_' + this.value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
  
  DBT_2021_wrap.col_ind = this.value;
  DBT_2021_Replot();
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
