
//-- Filename:
//--   border_statistics_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var BS_latest_wrap = {};

//-- ID
BS_latest_wrap.tag = 'border_statistics_latest'
BS_latest_wrap.id = '#' + BS_latest_wrap.tag

//-- File path
BS_latest_wrap.dataPathList = [
  "processed_data/latest/border_statistics_entry.csv",
  "processed_data/latest/border_statistics_exit.csv",
  "processed_data/latest/border_statistics_both.csv"
];

//-- Tooltip
BS_latest_wrap.tooltip = d3.select(BS_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
BS_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
BS_latest_wrap.r_list = GS_var.r_list_latest;
BS_latest_wrap.y_max_factor = 1.8;
BS_latest_wrap.y_path_0 = 2500;
BS_latest_wrap.y_path_1 = 1500;
BS_latest_wrap.y_path_2 = 2500;

//-- Variables
BS_latest_wrap.doExit = 0;

//-- Plot
function BS_Latest_Plot() {
  d3.csv(BS_latest_wrap.dataPathList[BS_latest_wrap.doExit], function (error, data) {
    if (error) return console.warn(error);
    
    BS_Make_Canvas(BS_latest_wrap);
    BS_Format_Data(BS_latest_wrap, data);
    BS_Initialize(BS_latest_wrap);
    BS_update(BS_latest_wrap);
  });
}

BS_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + BS_latest_wrap.tag + "_doExit']", function (event) {
  BS_latest_wrap.doExit = this.value;
  
  d3.csv(BS_latest_wrap.dataPathList[BS_latest_wrap.doExit], function (error, data) {
    if (error) return console.warn(error);
    
    BS_Format_Data(BS_latest_wrap, data);
    BS_update(BS_latest_wrap);
  });
});

//-- Save button
d3.select(BS_latest_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (BS_latest_wrap.doExit == 0)      tag1 = 'arrival';
  else if (BS_latest_wrap.doExit == 1) tag1 = 'departure';
  else                                 tag1 = 'both';

  name = BS_latest_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(BS_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='policy_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(BS_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  BS_Latest_Plot();
});