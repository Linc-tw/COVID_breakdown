
//-- Filename:
//--   status_evolution_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- ID
var SE_LATEST_WRAP = {};
SE_LATEST_WRAP.tag = 'status_evolution_latest';
SE_LATEST_WRAP.id = '#' + SE_LATEST_WRAP.tag;

//-- File path
SE_LATEST_WRAP.data_path_list = [
  "processed_data/latest/status_evolution.csv"
];

//-- Tooltip
SE_LATEST_WRAP.tooltip = d3.select(SE_LATEST_WRAP.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
SE_LATEST_WRAP.y_max_factor = 1.6;
SE_LATEST_WRAP.y_path = 200;
SE_LATEST_WRAP.xlabel_path = GLOBAL_VAR.xlabel_path_latest;
SE_LATEST_WRAP.r_list = GLOBAL_VAR.r_list_latest;

//-- Plot
d3.csv(SE_LATEST_WRAP.data_path_list[0], function(error, data) {
  if (error) return console.warn(error);
  
  SE_Make_Canvas(SE_LATEST_WRAP);
  SE_Format_Data(SE_LATEST_WRAP, data);
  SE_Initialize(SE_LATEST_WRAP);
  SE_Update(SE_LATEST_WRAP);
});

//-- Save
d3.select(SE_LATEST_WRAP.id + '_save').on('click', function() {
  name = SE_LATEST_WRAP.tag + '_' + lang + '.png';
  saveSvgAsPng(d3.select(SE_LATEST_WRAP.id).select('svg').node(), name);
});
