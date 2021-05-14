
//-- Filename:
//--   status_evolution_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var SE_2021_wrap = {};

//-- ID
SE_2021_wrap.tag = 'status_evolution_2021';
SE_2021_wrap.id = '#' + SE_2021_wrap.tag;

//-- File path
SE_2021_wrap.data_path_list = [
  "processed_data/2021/status_evolution.csv"
];

//-- Tooltip
SE_2021_wrap.tooltip = d3.select(SE_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
SE_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
SE_2021_wrap.r_list = GS_var.r_list_2021;
SE_2021_wrap.y_max_factor = 1.6;
SE_2021_wrap.y_path = 500;

//-- Plot
function SE_2021_Plot() {
  d3.csv(SE_2021_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    SE_Make_Canvas(SE_2021_wrap);
    SE_Format_Data(SE_2021_wrap, data);
    SE_Initialize(SE_2021_wrap);
    SE_Update(SE_2021_wrap);
  });
}

SE_2021_Plot();

//-- Save button
d3.select(SE_2021_wrap.id + '_save').on('click', function () {
  name = SE_2021_wrap.tag + '_' + GS_lang + '.png';
  saveSvgAsPng(d3.select(SE_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(SE_2021_wrap.id+' .plot').remove();
  
  //-- Replot
  SE_2021_Plot();
});
