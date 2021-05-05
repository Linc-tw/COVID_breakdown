
//-- Filename:
//--   case_by_transmission_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBT_2021_wrap = {};

//-- ID
CBT_2021_wrap.tag = 'case_by_transmission_2021'
CBT_2021_wrap.id = '#' + CBT_2021_wrap.tag

//-- File path
CBT_2021_wrap.data_path_list = [
  "processed_data/2021/case_by_transmission_by_report_day.csv",
  "processed_data/2021/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBT_2021_wrap.tooltip = d3.select(CBT_2021_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBT_2021_wrap.n_tot_key = '2021_total';
CBT_2021_wrap.xlabel_path = GS_var.xlabel_path_2021;
CBT_2021_wrap.r_list = GS_var.r_list_2021;
CBT_2021_wrap.y_max_factor = 1.3;
CBT_2021_wrap.y_max_fix_1_1 = 0;
CBT_2021_wrap.y_max_fix_1_0 = 0;
CBT_2021_wrap.y_max_fix_0_1 = 9;
CBT_2021_wrap.y_max_fix_0_0 = 23;
CBT_2021_wrap.y_path_1_1 = 40;
CBT_2021_wrap.y_path_1_0 = 120;
CBT_2021_wrap.y_path_0_1 = 2;
CBT_2021_wrap.y_path_0_0 = 5;
CBT_2021_wrap.legend_pos_x_0__ = {};
CBT_2021_wrap.legend_pos_x_0__['zh-tw'] = 70;
CBT_2021_wrap.legend_pos_x_0__['fr'] = 70;
CBT_2021_wrap.legend_pos_x_0__['en'] = 70;

//-- Variables
CBT_2021_wrap.do_cumul = 0;
CBT_2021_wrap.do_onset = 0;

//-- Plot
function CBT_Latest_Plot() {
  d3.csv(CBT_2021_wrap.data_path_list[CBT_2021_wrap.do_onset], function (error, data) {
    d3.csv(CBT_2021_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBT_Make_Canvas(CBT_2021_wrap);
      CBT_Format_Data(CBT_2021_wrap, data);
      CBT_Format_Data_2(CBT_2021_wrap, data2);
      CBT_Initialize(CBT_2021_wrap);
      CBT_Update(CBT_2021_wrap);
    });
  });
}

CBT_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CBT_2021_wrap.tag + "_doCumul']", function (event) {
  CBT_2021_wrap.do_cumul = this.value;
  data_path = CBT_2021_wrap.data_path_list[CBT_2021_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_2021_wrap, data);
    CBT_Update(CBT_2021_wrap);
  });
});

$(document).on("change", "input:radio[name='" + CBT_2021_wrap.tag + "_doOnset']", function (event) {
  CBT_2021_wrap.do_onset = this.value
  data_path = CBT_2021_wrap.data_path_list[CBT_2021_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_2021_wrap, data);
    CBT_Update(CBT_2021_wrap);
  });
});

//-- Save button
d3.select(CBT_2021_wrap.id + '_save').on('click', function() {
  var tag1, tag2;
  
  if (CBT_2021_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBT_2021_wrap.do_onset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBT_2021_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBT_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBT_2021_wrap.id+' .plot').remove();
  
  //-- Replot
  CBT_Latest_Plot();
});
