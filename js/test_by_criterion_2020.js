
//-- Filename:
//--   test_by_criterion_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TBC_2020_wrap = {};

//-- ID
TBC_2020_wrap.tag = "test_by_criterion_2020"
TBC_2020_wrap.id = '#' + TBC_2020_wrap.tag

//-- File path
TBC_2020_wrap.data_path = "processed_data/2020/test_by_criterion.csv";

//-- Tooltip
TBC_2020_wrap.tooltip = d3.select(TBC_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
TBC_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
TBC_2020_wrap.r_list = GS_var.r_list_2020;
TBC_2020_wrap.y_max_factor = 1.2;
TBC_2020_wrap.y_path_1 = 40000;
TBC_2020_wrap.y_path_0 = 500;
TBC_2020_wrap.yticklabel_format_1 = ".2s";
TBC_2020_wrap.yticklabel_format_0 = "d";
TBC_2020_wrap.legend_pos_x_0__ = {};
TBC_2020_wrap.legend_pos_x_0__['zh-tw'] = 510;
TBC_2020_wrap.legend_pos_x_0__['fr'] = 305;
TBC_2020_wrap.legend_pos_x_0__['en'] = 350;

//-- Variables
TBC_2020_wrap.do_cumul = 0;;

//-- Plot
function TBC_Latest_Plot() {
  d3.csv(TBC_2020_wrap.data_path, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Make_Canvas(TBC_2020_wrap);
    TBC_Format_Data(TBC_2020_wrap, data);
    TBC_Initialize(TBC_2020_wrap);
    TBC_Update(TBC_2020_wrap);
  });
}

TBC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + TBC_2020_wrap.tag + "_doCumul']", function (event) {
  TBC_2020_wrap.do_cumul = this.value;
  
  d3.csv(TBC_2020_wrap.data_path, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Format_Data(TBC_2020_wrap, data);
    TBC_Update(TBC_2020_wrap);
  });
});

//-- Save button
d3.select(TBC_2020_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (TBC_2020_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  
  name = TBC_2020_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(TBC_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(TBC_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  TBC_Latest_Plot();
});
