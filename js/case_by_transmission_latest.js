
//-- Filename:
//--   case_by_transmission_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBT_latest_wrap = {};

//-- ID
CBT_latest_wrap.tag = 'case_by_transmission_latest'
CBT_latest_wrap.id = '#' + CBT_latest_wrap.tag

//-- File path
CBT_latest_wrap.data_path_list = [
  "processed_data/latest/case_by_transmission_by_report_day.csv",
  "processed_data/latest/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBT_latest_wrap.tooltip = d3.select(CBT_latest_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBT_latest_wrap.n_tot_key = 'latest_total';
CBT_latest_wrap.xlabel_path = GS_var.xlabel_path_latest;
CBT_latest_wrap.r_list = GS_var.r_list_latest;
CBT_latest_wrap.y_max_factor = 1.25;
CBT_latest_wrap.y_max_fix_1_1 = 0;
CBT_latest_wrap.y_max_fix_1_0 = 0;
CBT_latest_wrap.y_max_fix_0_1 = 0;
CBT_latest_wrap.y_max_fix_0_0 = 0;
CBT_latest_wrap.y_path_1_1 = 35;
CBT_latest_wrap.y_path_1_0 = 120;
CBT_latest_wrap.y_path_0_1 = 3;
CBT_latest_wrap.y_path_0_0 = 10;
CBT_latest_wrap.legend_pos_x_0__ = {};
CBT_latest_wrap.legend_pos_x_0__['zh-tw'] = 80; //800;
CBT_latest_wrap.legend_pos_x_0__['fr'] = 80; //350;
CBT_latest_wrap.legend_pos_x_0__['en'] = 80; //380;

//-- Variables
CBT_latest_wrap.do_cumul = 0;
CBT_latest_wrap.do_onset = 0;

//-- Plot
function CBT_Latest_Plot() {
  d3.csv(CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset], function (error, data) {
    d3.csv(CBT_latest_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBT_Make_Canvas(CBT_latest_wrap);
      CBT_Format_Data(CBT_latest_wrap, data);
      CBT_Format_Data_2(CBT_latest_wrap, data2);
      CBT_Initialize(CBT_latest_wrap);
      CBT_Update(CBT_latest_wrap);
    });
  });
}

CBT_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CBT_latest_wrap.tag + "_doCumul']", function (event) {
  CBT_latest_wrap.do_cumul = this.value;
  data_path = CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_latest_wrap, data);
    CBT_Update(CBT_latest_wrap);
  });
});

$(document).on("change", "input:radio[name='" + CBT_latest_wrap.tag + "_doOnset']", function (event) {
  CBT_latest_wrap.do_onset = this.value
  data_path = CBT_latest_wrap.data_path_list[CBT_latest_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_latest_wrap, data);
    CBT_Update(CBT_latest_wrap);
  });
});

//-- Save button
d3.select(CBT_latest_wrap.id + '_save').on('click', function() {
  var tag1, tag2;
  
  if (CBT_latest_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBT_latest_wrap.do_onset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBT_latest_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBT_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBT_latest_wrap.id+' .plot').remove();
  
  //-- Replot
  CBT_Latest_Plot();
});
