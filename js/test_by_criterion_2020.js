
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
TBC_2020_wrap.y_path_1 = 35000;
TBC_2020_wrap.y_path_0 = '4'; //-- 4 ticks
TBC_2020_wrap.legend_pos_x_0_ = {'zh-tw': 510, fr: 320, en: 350};
TBC_2020_wrap.legend_pos_x_1_ = {'zh-tw': 0, fr: 0, en: 0};

//-- Variables
TBC_2020_wrap.do_cumul = 0;;

//-- Plot
function TBC_2020_Plot() {
  d3.queue()
    .defer(d3.csv, TBC_2020_wrap.data_path)
    .await(function (error, data) {TBC_Plot(TBC_2020_wrap, error, data);});
}

function TBC_2020_Replot() {
  d3.queue()
    .defer(d3.csv, TBC_2020_wrap.data_path)
    .await(function (error, data) {TBC_Replot(TBC_2020_wrap, error, data);});
}

TBC_2020_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + TBC_2020_wrap.tag + "_doCumul']", function (event) {
  TBC_2020_wrap.do_cumul = this.value;
  TBC_2020_Replot();
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
  TBC_2020_Plot();
});
