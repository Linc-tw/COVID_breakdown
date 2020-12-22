
//-- Filename:
//--   various_rates_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var VR_2020_wrap = {};

//-- ID
VR_2020_wrap.tag = 'various_rates_2020'
VR_2020_wrap.id = '#' + VR_2020_wrap.tag

//-- File path
VR_2020_wrap.data_path_list = [
  "processed_data/2020/various_rates.csv"
];

//-- Tooltip
VR_2020_wrap.tooltip = d3.select(VR_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
VR_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
VR_2020_wrap.r_list = GS_var.r_list_2020;
VR_2020_wrap.y_max_factor = 1.2;
VR_2020_wrap.y_max_fix = 0.033;
VR_2020_wrap.y_path = 0.01;
VR_2020_wrap.legend_pos_x = 240;
VR_2020_wrap.r = 2.5;

//-- Plot
function VR_2020_Plot() {
  d3.csv(VR_2020_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    VR_Make_Canvas(VR_2020_wrap);
    VR_Format_Data(VR_2020_wrap, data);
    VR_Initialize(VR_2020_wrap);
    VR_update(VR_2020_wrap);
  });
}

VR_2020_Plot();

//-- Save button
d3.select(VR_2020_wrap.id + '_save').on('click', function () {
  name = VR_2020_wrap.tag + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(VR_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(VR_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  VR_2020_Plot();
});
