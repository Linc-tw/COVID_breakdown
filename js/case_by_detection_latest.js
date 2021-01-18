
//-- Filename:
//--   case_by_detection_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBD_latest_wrap = {};

//-- ID
CBD_latest_wrap.tag = "case_by_detection_latest"
CBD_latest_wrap.id = '#' + CBD_latest_wrap.tag

//-- Data path
CBD_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_detection_by_report_day.csv",
  "processed_data/latest/case_by_detection_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBD_latest_wrap.tooltip = d3.select(CBD_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip")

//-- Parameters
CBD_latest_wrap.n_tot_key = 'latest_total';
CBD_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
CBD_latest_wrap.r_list = GS_var.r_list_latest;
CBD_latest_wrap.y_max_factor = 1.2;
CBD_latest_wrap.y_max_fix_1_1 = 0;
CBD_latest_wrap.y_max_fix_1_0 = 0;
CBD_latest_wrap.y_max_fix_0_1 = 9;
CBD_latest_wrap.y_max_fix_0_0 = 0;
CBD_latest_wrap.y_path_1_1 = 25;
CBD_latest_wrap.y_path_1_0 = 80;
CBD_latest_wrap.y_path_0_1 = 2;
CBD_latest_wrap.y_path_0_0 = 5;
CBD_latest_wrap.legend_pos_x_0__ = {};
CBD_latest_wrap.legend_pos_x_0__['zh-tw'] = 0;
CBD_latest_wrap.legend_pos_x_0__['fr'] = 0;
CBD_latest_wrap.legend_pos_x_0__['en'] = 0;

//-- Variables
CBD_latest_wrap.do_cumul = 0;
CBD_latest_wrap.do_onset = 0;

//-- Plot
function CBD_Latest_Plot() {
  d3.csv(CBD_latest_wrap.data_path_list[CBD_latest_wrap.do_onset], function (error, data) {
    d3.csv(CBD_latest_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBD_Make_Canvas(CBD_latest_wrap);
      CBD_Format_Data(CBD_latest_wrap, data);
      CBD_Format_Data_2(CBD_latest_wrap, data2);
      CBD_Initialize(CBD_latest_wrap);
      CBD_Update(CBD_latest_wrap);
    });
  });
}

CBD_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CBD_latest_wrap.tag + "_doCumul']", function (event) {
  CBD_latest_wrap.do_cumul = this.value;
  dataPath = CBD_latest_wrap.data_path_list[CBD_latest_wrap.do_onset]
  
  d3.csv(dataPath, function (error, data) {
    if (error) return console.warn(error);
    
    CBD_Format_Data(CBD_latest_wrap, data);
    CBD_Update(CBD_latest_wrap);
  });
});

$(document).on("change", "input:radio[name='" + CBD_latest_wrap.tag + "_doOnset']", function (event) {
  CBD_latest_wrap.do_onset = this.value
  dataPath = CBD_latest_wrap.data_path_list[CBD_latest_wrap.do_onset]
  
  d3.csv(dataPath, function (error, data) {
    if (error) return console.warn(error);
    
    CBD_Format_Data(CBD_latest_wrap, data);
    CBD_Update(CBD_latest_wrap);
  });
});

//-- Save
d3.select(CBD_latest_wrap.id + '_save').on('click', function (){
  var tag1, tag2;
  
  if (CBD_latest_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBD_latest_wrap.do_onset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBD_latest_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBD_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBD_latest_wrap.id+' .plot').remove()
  
  //-- Replot
  CBD_Latest_Plot();
});
