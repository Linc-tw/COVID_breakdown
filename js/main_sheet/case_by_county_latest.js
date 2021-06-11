
//-- Filename:
//--   case_by_county_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBC_latest_wrap = {};

//-- ID
CBC_latest_wrap.tag = 'case_by_county_latest';
CBC_latest_wrap.id = '#' + CBC_latest_wrap.tag;

//-- File path
CBC_latest_wrap.data_path_list = [
  "processed_data/adminMap_byCounties_offsetIslands_sphe.geojson",
  //"processed_data/latest/status_evolution.csv"
];

//-- Tooltip
CBC_latest_wrap.tooltip = d3.select(CBC_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBC_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
CBC_latest_wrap.r_list = GS_var.r_list_latest;
CBC_latest_wrap.y_max_factor = 1.2;
CBC_latest_wrap.y_path = '4'; //-- 4 ticks
CBC_latest_wrap.legend_pos_x = 80;

//-- Plot
function CBC_Latest_Plot() {
  d3.json(CBC_latest_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    CBC_Make_Canvas(CBC_latest_wrap);
    CBC_Format_Data(CBC_latest_wrap, data);
//     CBC_Initialize(CBC_latest_wrap);
//     CBC_Update(CBC_latest_wrap);
  });
}

CBC_Latest_Plot();

//-- Save button
// d3.select(CBC_latest_wrap.id + '_save').on('click', function () {
//   name = CBC_latest_wrap.tag + '_' + GS_lang + '.png';
//   saveSvgAsPng(d3.select(CBC_latest_wrap.id).select('svg').node(), name);
// });
// 
// //-- Language button
// $(document).on("change", "input:radio[name='index_language']", function (event) {
//   GS_lang = this.value;
//   Cookies.set("lang", GS_lang);
//   
//   //-- Remove
//   d3.selectAll(CBC_latest_wrap.id+' .plot').remove();
//   
//   //-- Replot
//   CBC_Latest_Plot();
// });
