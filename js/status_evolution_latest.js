
//-- Filename:
//--   status_evolution_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var SE_latest_wrap = {};

//-- ID
SE_latest_wrap.tag = 'status_evolution_latest';
SE_latest_wrap.id = '#' + SE_latest_wrap.tag;

//-- File path
SE_latest_wrap.data_path_list = [
  "processed_data/latest/status_evolution.csv"
];

//-- Tooltip
SE_latest_wrap.tooltip = d3.select(SE_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
SE_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
SE_latest_wrap.r_list = GS_var.r_list_latest;
SE_latest_wrap.y_max_factor = 1.6;
SE_latest_wrap.y_path = 200;

//-- Plot
function SE_Latest_Plot() {
  d3.csv(SE_latest_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    SE_Make_Canvas(SE_latest_wrap);
    SE_Format_Data(SE_latest_wrap, data);
    SE_Initialize(SE_latest_wrap);
    SE_Update(SE_latest_wrap);
  });
}

SE_Latest_Plot();

//-- Save button
d3.select(SE_latest_wrap.id + '_save').on('click', function () {
  name = SE_latest_wrap.tag + '_' + lang + '.png';
  saveSvgAsPng(d3.select(SE_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(SE_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  SE_Latest_Plot();
});
