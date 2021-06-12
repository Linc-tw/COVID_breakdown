
//-- Filename:
//--   case_by_age_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBA_latest_wrap = {};

//-- ID
CBA_latest_wrap.tag = 'case_by_age_latest';
CBA_latest_wrap.id = '#' + CBA_latest_wrap.tag;

//-- File path
CBA_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_age.csv",
];

//-- Tooltip
CBA_latest_wrap.tooltip = d3.select(CBA_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBA_latest_wrap.y_max_factor = 1.2;
CBA_latest_wrap.y_path = '4'; //-- 4 ticks
CBA_latest_wrap.legend_pos_x = 90;

//-- Variables
CBA_latest_wrap.col_ind = 12; //document.querySelector("input[name='" + DBT_latest_wrap.tag + "_ind']:checked").value;

//-- Plot
function CBA_Latest_Plot() {
  d3.queue()
    .defer(d3.csv, CBA_latest_wrap.data_path_list[0])
    .await(function (error, data) {CBA_Plot(CBA_latest_wrap, error, data);});
}

CBA_Latest_Plot();

//-- Save button
d3.select(CBA_latest_wrap.id + '_save').on('click', function () {
  name = CBA_latest_wrap.tag + '_' + GS_lang + '.png';
  saveSvgAsPng(d3.select(CBA_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBA_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  CBA_Latest_Plot();
});
