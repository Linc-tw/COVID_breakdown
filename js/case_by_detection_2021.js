
//-- Filename:
//--   case_by_detection_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBD_2021_wrap = {};

//-- ID
CBD_2021_wrap.tag = "case_by_detection_2021"
CBD_2021_wrap.id = '#' + CBD_2021_wrap.tag

//-- Data path
CBD_2021_wrap.data_path_list = [
  "processed_data/2021/case_by_detection_by_report_day.csv",
  "processed_data/2021/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBD_2021_wrap.tooltip = d3.select(CBD_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
CBD_2021_wrap.n_tot_key = '2021_total';
CBD_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
CBD_2021_wrap.r_list = GS_var.r_list_2021;
CBD_2021_wrap.y_max_factor = 1.3;
CBD_2021_wrap.y_max_fix_1_1 = 0;
CBD_2021_wrap.y_max_fix_1_0 = 0;
CBD_2021_wrap.y_max_fix_0_1 = 0;
CBD_2021_wrap.y_max_fix_0_0 = 14;
CBD_2021_wrap.y_path_1_1 = 150;
CBD_2021_wrap.y_path_1_0 = 200;
CBD_2021_wrap.y_path_0_1 = 5;
CBD_2021_wrap.y_path_0_0 = 3;
CBD_2021_wrap.legend_pos_x_0__ = {};
CBD_2021_wrap.legend_pos_x_0__['zh-tw'] = 300;
CBD_2021_wrap.legend_pos_x_0__['fr'] = 330;
CBD_2021_wrap.legend_pos_x_0__['en'] = 310;

//-- Variables
CBD_2021_wrap.do_cumul = 0;
CBD_2021_wrap.do_onset = 0;

//-- Plot
function CBD_Latest_Plot() {
  d3.csv(CBD_2021_wrap.data_path_list[CBD_2021_wrap.do_onset], function (error, data) {
    d3.csv(CBD_2021_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBD_Make_Canvas(CBD_2021_wrap);
      CBD_Format_Data(CBD_2021_wrap, data);
      CBD_Format_Data_2(CBD_2021_wrap, data2);
      CBD_Initialize(CBD_2021_wrap);
      CBD_Update(CBD_2021_wrap);
    });
  });
}

CBD_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CBD_2021_wrap.tag + "_doCumul']", function (event) {
  CBD_2021_wrap.do_cumul = this.value;
  dataPath = CBD_2021_wrap.data_path_list[CBD_2021_wrap.do_onset]
  
  d3.csv(dataPath, function (error, data) {
    if (error) return console.warn(error);
    
    CBD_Format_Data(CBD_2021_wrap, data);
    CBD_Update(CBD_2021_wrap);
  });
});

$(document).on("change", "input:radio[name='" + CBD_2021_wrap.tag + "_doOnset']", function (event) {
  CBD_2021_wrap.do_onset = this.value
  dataPath = CBD_2021_wrap.data_path_list[CBD_2021_wrap.do_onset]
  
  d3.csv(dataPath, function (error, data) {
    if (error) return console.warn(error);
    
    CBD_Format_Data(CBD_2021_wrap, data);
    CBD_Update(CBD_2021_wrap);
  });
});

//-- Save
d3.select(CBD_2021_wrap.id + '_save').on('click', function (){
  var tag1, tag2;
  
  if (CBD_2021_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBD_2021_wrap.do_onset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBD_2021_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBD_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBD_2021_wrap.id+' .plot').remove()
  
  //-- Replot
  CBD_Latest_Plot();
});