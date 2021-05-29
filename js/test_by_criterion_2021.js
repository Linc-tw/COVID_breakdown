
//-- Filename:
//--   test_by_criterion_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TBC_2021_wrap = {};

//-- ID
TBC_2021_wrap.tag = "test_by_criterion_2021"
TBC_2021_wrap.id = '#' + TBC_2021_wrap.tag

//-- File path
TBC_2021_wrap.data_path = "processed_data/2021/test_by_criterion.csv";

//-- Tooltip
TBC_2021_wrap.tooltip = d3.select(TBC_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
TBC_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
TBC_2021_wrap.r_list = GS_var.r_list_2021;
TBC_2021_wrap.y_max_factor = 1.2;
TBC_2021_wrap.y_path_1 = '4'; //-- 4 ticks
TBC_2021_wrap.y_path_0 = '4';
TBC_2021_wrap.legend_pos_x_0_ = {'zh-tw': 100, fr: 100, en: 100};
TBC_2021_wrap.legend_pos_x_1_ = {'zh-tw': 100, fr: 100, en: 100};

//-- Variables
TBC_2021_wrap.do_cumul = 0;;

//-- Plot
function TBC_Latest_Plot() {
  d3.csv(TBC_2021_wrap.data_path, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Make_Canvas(TBC_2021_wrap);
    TBC_Format_Data(TBC_2021_wrap, data);
    TBC_Initialize(TBC_2021_wrap);
    TBC_Update(TBC_2021_wrap);
  });
}

TBC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + TBC_2021_wrap.tag + "_doCumul']", function (event) {
  TBC_2021_wrap.do_cumul = this.value;
  
  d3.csv(TBC_2021_wrap.data_path, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Format_Data(TBC_2021_wrap, data);
    TBC_Update(TBC_2021_wrap);
  });
});

//-- Save button
d3.select(TBC_2021_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (TBC_2021_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  
  name = TBC_2021_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(TBC_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(TBC_2021_wrap.id+' .plot').remove();
  
  //-- Replot
  TBC_Latest_Plot();
});
