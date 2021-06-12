
//-- Filename:
//--   border_statistics_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var BS_2020_wrap = {};

//-- ID
BS_2020_wrap.tag = 'border_statistics_2020'
BS_2020_wrap.id = '#' + BS_2020_wrap.tag

//-- File path
BS_2020_wrap.data_path_list = [
  "processed_data/2020/border_statistics_entry.csv",
  "processed_data/2020/border_statistics_exit.csv",
  "processed_data/2020/border_statistics_both.csv"
];

//-- Tooltip
BS_2020_wrap.tooltip = d3.select(BS_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
BS_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
BS_2020_wrap.r_list = GS_var.r_list_2020;
BS_2020_wrap.y_max_factor = 1.15;
BS_2020_wrap.y_path_0 = '4'; //-- 4 ticks
BS_2020_wrap.y_path_1 = '4';
BS_2020_wrap.y_path_2 = '4';
BS_2020_wrap.legend_pos_x = 500;

//-- Variables
BS_2020_wrap.do_exit = document.querySelector("input[name='" + BS_2020_wrap.tag + "_exit']:checked").value;

//-- Plot
function BS_2020_Plot() {
  d3.queue()
    .defer(d3.csv, BS_2020_wrap.data_path_list[BS_2020_wrap.do_exit])
    .await(function (error, data) {BS_Plot(BS_2020_wrap, error, data);});
}

function BS_2020_Replot() {
  d3.queue()
    .defer(d3.csv, BS_2020_wrap.data_path_list[BS_2020_wrap.do_exit])
    .await(function (error, data) {BS_Replot(BS_2020_wrap, error, data);});
}

BS_2020_Plot();

//-- Buttons
GS_PressRadioButton(BS_2020_wrap, 'exit', 0, BS_2020_wrap.do_exit); //-- 0 from .html

$(document).on("change", "input:radio[name='" + BS_2020_wrap.tag + "_exit']", function (event) {
  GS_PressRadioButton(BS_2020_wrap, 'exit', BS_2020_wrap.do_exit, this.value);
  BS_2020_wrap.do_exit = this.value;
  BS_2020_Replot();
});

//-- Save button
d3.select(BS_2020_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (BS_2020_wrap.do_exit == 0)
    tag1 = 'arrival';
  else if (BS_2020_wrap.do_exit == 1)
    tag1 = 'departure';
  else
    tag1 = 'both';

  name = BS_2020_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(BS_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(BS_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  BS_2020_Plot();
});
