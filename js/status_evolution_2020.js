
//-- Filename:
//--   status_evolution_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- ID
var SE_2020_WRAP = {};
SE_2020_WRAP.tag = 'status_evolution_2020';
SE_2020_WRAP.id = '#' + SE_2020_WRAP.tag;

//-- File path
SE_2020_WRAP.data_path_list = [
  "processed_data/2020/status_evolution.csv"
];

//-- Tooltip
SE_2020_WRAP.tooltip = d3.select(SE_2020_WRAP.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
SE_2020_WRAP.y_max_factor = 1.2;
SE_2020_WRAP.y_path = 250;
SE_2020_WRAP.xlabel_path = GLOBAL_VAR.xlabel_path_2020;
SE_2020_WRAP.r_list = GLOBAL_VAR.r_list_2020;

//-- Plot
d3.csv(SE_2020_WRAP.data_path_list[0], function(error, data) {
  if (error) return console.warn(error);
  
  SE_Make_Canvas(SE_2020_WRAP);
  SE_Format_Data(SE_2020_WRAP, data);
  SE_Initialize(SE_2020_WRAP);
  SE_Update(SE_2020_WRAP);
});

//-- Save
d3.select(SE_2020_WRAP.id + '_save').on('click', function() {
  name = SE_2020_WRAP.tag + '_' + lang + '.png';
  saveSvgAsPng(d3.select(SE_2020_WRAP.id).select('svg').node(), name);
});
