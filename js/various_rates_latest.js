
//-- Filename:
//--   various_rates_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var VR_latest_wrap = {};

//-- ID
VR_latest_wrap.tag = 'various_rates_latest'
VR_latest_wrap.id = '#' + VR_latest_wrap.tag

//-- File path
VR_latest_wrap.data_path_list = [
  "processed_data/latest/various_rates.csv"
];

//-- Tooltip
VR_latest_wrap.tooltip = d3.select(VR_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
VR_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
VR_latest_wrap.r_list = GS_var.r_list_latest;
VR_latest_wrap.y_max_factor = 1.2;
VR_latest_wrap.y_max_fix = 0.053;
VR_latest_wrap.y_path = 0.01;
VR_latest_wrap.legend_pos_x = 40;
VR_latest_wrap.r = 3.5; //-- Dot radius

//-- Plot
function VR_Latest_Plot() {
  d3.csv(VR_latest_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    VR_Make_Canvas(VR_latest_wrap);
    VR_Format_Data(VR_latest_wrap, data);
    VR_Initialize(VR_latest_wrap);
    VR_update(VR_latest_wrap);
  });
}

VR_Latest_Plot();

//-- Save button
d3.select(VR_latest_wrap.id + '_save').on('click', function () {
  name = VR_latest_wrap.tag + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(VR_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(VR_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  VR_Latest_Plot();
});
