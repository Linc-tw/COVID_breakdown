
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
TBC_latest_wrap.y_max_factor = 1.2;
TBC_latest_wrap.y_path_1 = '4'; //-- 4 ticks
TBC_latest_wrap.y_path_0 = '4';
TBC_latest_wrap.legend_pos_x_0_ = {'zh-tw': 100, fr: 100, en: 100};
TBC_latest_wrap.legend_pos_x_1_ = {'zh-tw': 100, fr: 100, en: 100};

//-- Variables
TBC_latest_wrap.do_cumul = 0;;

//-- Plot
function TBC_Latest_Plot() {
  d3.queue()
    .defer(d3.csv, TBC_latest_wrap.data_path)
    .await(function (error, data) {TBC_Plot(TBC_latest_wrap, error, data);});
}

function TBC_Latest_Replot() {
  d3.queue()
    .defer(d3.csv, TBC_latest_wrap.data_path)
    .await(function (error, data) {TBC_Replot(TBC_latest_wrap, error, data);});
}

TBC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + TBC_latest_wrap.tag + "_cumul']", function (event) {
  var old_btn = document.getElementById(TBC_latest_wrap.tag + '_cumul_' + TBC_latest_wrap.do_cumul);
  var new_btn = document.getElementById(TBC_latest_wrap.tag + '_cumul_' + this.value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
  
  TBC_latest_wrap.do_cumul = this.value;
  TBC_Latest_Replot();
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
