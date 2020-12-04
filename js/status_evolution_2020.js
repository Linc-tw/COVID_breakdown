
//-- Filename:
//--   status_evolution_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var SE_2020_wrap = {};

//-- ID
SE_2020_wrap.tag = 'status_evolution_2020';
SE_2020_wrap.id = '#' + SE_2020_wrap.tag;

//-- File path
SE_2020_wrap.data_path_list = [
  "processed_data/2020/status_evolution.csv"
];

//-- Tooltip
SE_2020_wrap.tooltip = d3.select(SE_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
SE_2020_wrap.y_max_factor = 1.2;
SE_2020_wrap.y_path = 250;
SE_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
SE_2020_wrap.r_list = GS_var.r_list_2020;

//-- Plot
function SE_2020_Plot() {
  d3.csv(SE_2020_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    SE_Make_Canvas(SE_2020_wrap);
    SE_Format_Data(SE_2020_wrap, data);
    SE_Initialize(SE_2020_wrap);
    SE_Update(SE_2020_wrap);
  });
}

SE_2020_Plot();

//-- Save button
d3.select(SE_2020_wrap.id + '_save').on('click', function () {
  name = SE_2020_wrap.tag + '_' + lang + '.png';
  saveSvgAsPng(d3.select(SE_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(SE_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  SE_2020_Plot();
});