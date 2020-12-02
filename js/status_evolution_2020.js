
//-- File:
//--   status_evolution_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- ID
var SE_20_WRAP = {};
SE_20_WRAP.tag = 'status_evolution_2020';
SE_20_WRAP.id = '#' + SE_20_WRAP.tag;

//-- File path
SE_20_WRAP.data_path_list = [
  "processed_data/2020/status_evolution.csv"
];

//-- Tooltip
SE_20_WRAP.tooltip = d3.select(SE_20_WRAP.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
SE_20_WRAP.y_max_factor = 1.2;
SE_20_WRAP.y_path = 250;
SE_20_WRAP.xlabel_path = GLOBAL_VAR.xlabel_path_2020;
SE_20_WRAP.r_list = GLOBAL_VAR.r_list_2020;

//-- Plot
d3.csv(SE_20_WRAP.data_path_list[0], function(error, data) {
  if (error) return console.warn(error);
  
  SE_Make_Canvas(SE_20_WRAP);
  SE_Format_Data(SE_20_WRAP, data);
  SE_Initialize(SE_20_WRAP);
  SE_Update(SE_20_WRAP);
});

//-- Button
d3.select(SE_20_WRAP.id + '_button_1').on('click', function(){
  name = SE_20_WRAP.tag + '_' + lang + '.png';
  saveSvgAsPng(d3.select(SE_20_WRAP.id).select('svg').node(), name);
});
