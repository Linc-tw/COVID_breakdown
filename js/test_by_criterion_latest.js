
//-- Filename:
//--   test_by_criterion_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TBC_latest_wrap = {};

//-- ID
TBC_latest_wrap.tag = "test_by_criterion_latest";
TBC_latest_wrap.id = '#' + TBC_latest_wrap.tag;

//-- File path
TBC_latest_wrap.data_path = "processed_data/latest/test_by_criterion.csv";

//-- Tooltip
TBC_latest_wrap.tooltip = d3.select(TBC_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
TBC_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
TBC_latest_wrap.r_list = GS_var.r_list_latest;
TBC_latest_wrap.y_max_factor = 1.3;
TBC_latest_wrap.y_path_1 = 15000;
TBC_latest_wrap.y_path_0 = 700;
TBC_latest_wrap.yticklabel_format_1 = ".2s";
TBC_latest_wrap.yticklabel_format_0 = "d";
TBC_latest_wrap.legend_pos_x_0_i_ = {};
TBC_latest_wrap.legend_pos_x_0_i_['zh-tw'] = 0;
TBC_latest_wrap.legend_pos_x_0_i_['fr'] = 0;
TBC_latest_wrap.legend_pos_x_0_i_['en'] = 0;

//-- Variables
TBC_latest_wrap.do_cumul = 0;;

//-- Plot
function TBC_Latest_Plot() {
  d3.csv(TBC_latest_wrap.data_path, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Make_Canvas(TBC_latest_wrap);
    TBC_Format_Data(TBC_latest_wrap, data);
    TBC_Initialize(TBC_latest_wrap);
    TBC_Update(TBC_latest_wrap);
  });
}

TBC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + TBC_latest_wrap.tag + "_doCumul']", function (event) {
  TBC_latest_wrap.do_cumul = this.value;
  
  d3.csv(TBC_latest_wrap.data_path, function (error, data) {
    if (error) return console.warn(error);
    
    TBC_Format_Data(TBC_latest_wrap, data);
    TBC_Update(TBC_latest_wrap);
  });
});

//-- Save button
d3.select(TBC_latest_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (TBC_latest_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  
  name = TBC_latest_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(TBC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='policy_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(TBC_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  TBC_Latest_Plot();
});
