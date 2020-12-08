
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
BS_2020_wrap.dataPathList = [
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
BS_2020_wrap.y_max_factor = 1.2;
BS_2020_wrap.y_path_0 = 30000;
BS_2020_wrap.y_path_1 = 30000;
BS_2020_wrap.y_path_2 = 50000;

//-- Variables
BS_2020_wrap.doExit = 0;

//-- Plot
function BS_Latest_Plot() {
  d3.csv(BS_2020_wrap.dataPathList[BS_2020_wrap.doExit], function (error, data) {
    if (error) return console.warn(error);
    
    BS_Make_Canvas(BS_2020_wrap);
    BS_Format_Data(BS_2020_wrap, data);
    BS_Initialize(BS_2020_wrap);
    BS_update(BS_2020_wrap);
  });
}

BS_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + BS_2020_wrap.tag + "_doExit']", function (event) {
  BS_2020_wrap.doExit = this.value;
  
  d3.csv(BS_2020_wrap.dataPathList[BS_2020_wrap.doExit], function (error, data) {
    if (error) return console.warn(error);
    
    BS_Format_Data(BS_2020_wrap, data);
    BS_update(BS_2020_wrap);
  });
});

//-- Save button
d3.select(BS_2020_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (BS_2020_wrap.doExit == 0)      tag1 = 'arrival';
  else if (BS_2020_wrap.doExit == 1) tag1 = 'departure';
  else                               tag1 = 'both';

  name = BS_2020_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(BS_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(BS_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  BS_Latest_Plot();
});