
//-- Filename:
//--   border_statistics_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var BS_2021_wrap = {};

//-- ID
BS_2021_wrap.tag = 'border_statistics_2021'
BS_2021_wrap.id = '#' + BS_2021_wrap.tag

//-- File path
BS_2021_wrap.data_path_list = [
  "processed_data/2021/border_statistics_entry.csv",
  "processed_data/2021/border_statistics_exit.csv",
  "processed_data/2021/border_statistics_both.csv"
];

//-- Tooltip
BS_2021_wrap.tooltip = d3.select(BS_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
BS_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
BS_2021_wrap.r_list = GS_var.r_list_2021;
BS_2021_wrap.y_max_factor = 1.5;
BS_2021_wrap.y_path_0 = '4'; //-- 4 ticks
BS_2021_wrap.y_path_1 = '4';
BS_2021_wrap.y_path_2 = '4';
BS_2021_wrap.legend_pos_x = 500;

//-- Variables
BS_2021_wrap.do_exit = 0;

//-- Plot
function BS_2021_Plot() {
  d3.queue()
    .defer(d3.csv, BS_2021_wrap.data_path_list[BS_2021_wrap.do_exit])
    .await(function (error, data) {BS_Plot(BS_2021_wrap, error, data);});
}

function BS_2021_Replot() {
  d3.queue()
    .defer(d3.csv, BS_2021_wrap.data_path_list[BS_2021_wrap.do_exit])
    .await(function (error, data) {BS_Replot(BS_2021_wrap, error, data);});
}

BS_2021_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + BS_2021_wrap.tag + "_exit']", function (event) {
  var old_btn = document.getElementById(BS_2021_wrap.tag + '_exit_' + BS_2021_wrap.do_exit);
  var new_btn = document.getElementById(BS_2021_wrap.tag + '_exit_' + this.value);
  old_btn.classList.remove("active");
  new_btn.classList.add("active");
  
  BS_2021_wrap.do_exit = this.value;
  BS_2021_Replot();
});

//-- Save button
d3.select(BS_2021_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (BS_2021_wrap.do_exit == 0)      tag1 = 'arrival';
  else if (BS_2021_wrap.do_exit == 1) tag1 = 'departure';
  else                                tag1 = 'both';

  name = BS_2021_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(BS_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(BS_2021_wrap.id+' .plot').remove();
  
  //-- Replot
  BS_2021_Plot();
});
