
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
SE_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
SE_2020_wrap.r_list = GS_var.r_list_2020;
SE_2020_wrap.y_max_factor = 1.15;
SE_2020_wrap.y_path = '4'; //-- 4 ticks
SE_2020_wrap.legend_pos_x = 70;

//-- Plot
function SE_2020_Plot() {
  d3.queue()
    .defer(d3.csv, SE_2020_wrap.data_path_list[0])
    .await(function (error, data) {SE_Plot(SE_2020_wrap, error, data);});
}

SE_2020_Plot();

//-- Save button
d3.select(SE_2020_wrap.id + '_save').on('click', function () {
  name = SE_2020_wrap.tag + '_' + GS_lang + '.png';
  saveSvgAsPng(d3.select(SE_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(SE_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  SE_2020_Plot();
});
