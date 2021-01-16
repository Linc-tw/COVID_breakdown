
//-- Filename:
//--   various_rates_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var VR_2021_wrap = {};

//-- ID
VR_2021_wrap.tag = 'various_rates_2021'
VR_2021_wrap.id = '#' + VR_2021_wrap.tag

//-- File path
VR_2021_wrap.data_path_list = [
  "processed_data/2021/various_rates.csv"
];

//-- Tooltip
VR_2021_wrap.tooltip = d3.select(VR_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
VR_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
VR_2021_wrap.r_list = GS_var.r_list_2021;
VR_2021_wrap.y_max_factor = 1.2;
VR_2021_wrap.y_max_fix = 0.033;
VR_2021_wrap.y_path = 0.01;
VR_2021_wrap.legend_pos_x = 240;
VR_2021_wrap.r = 3.5; //2.5;

//-- Plot
function VR_2021_Plot() {
  d3.csv(VR_2021_wrap.data_path_list[0], function (error, data) {
    if (error) return console.warn(error);
    
    VR_Make_Canvas(VR_2021_wrap);
    VR_Format_Data(VR_2021_wrap, data);
    VR_Initialize(VR_2021_wrap);
    VR_update(VR_2021_wrap);
  });
}

VR_2021_Plot();

//-- Save button
d3.select(VR_2021_wrap.id + '_save').on('click', function () {
  name = VR_2021_wrap.tag + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(VR_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(VR_2021_wrap.id+' .plot').remove();
  
  //-- Replot
  VR_2021_Plot();
});
