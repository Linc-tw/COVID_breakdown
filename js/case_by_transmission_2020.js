
//-- Filename:
//--   case_by_transmission_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var CBT_2020_wrap = {};

//-- ID
CBT_2020_wrap.tag = 'case_by_transmission_2020'
CBT_2020_wrap.id = '#' + CBT_2020_wrap.tag

//-- File path
CBT_2020_wrap.data_path_list = [
  "processed_data/2020/case_by_transmission_by_report_day.csv",
  "processed_data/2020/case_by_transmission_by_onset_day.csv",
  "processed_data/key_numbers.csv"
];

//-- Tooltip
CBT_2020_wrap.tooltip = d3.select(CBT_2020_wrap.id)
  .append("div")
  .attr("class", "tooltip");

//-- Parameters
CBT_2020_wrap.n_tot_key = 'n_2020';
CBT_2020_wrap.xlabel_path = GS_var.xlabel_path_2020;
CBT_2020_wrap.r_list = GS_var.r_list_2020;
CBT_2020_wrap.y_max_factor = 1.3;
CBT_2020_wrap.y_max_fix_1_1 = 0;
CBT_2020_wrap.y_max_fix_1_0 = 0;
CBT_2020_wrap.y_max_fix_0_1 = 0;
CBT_2020_wrap.y_max_fix_0_0 = 0;
CBT_2020_wrap.y_path_1_1 = 150;
CBT_2020_wrap.y_path_1_0 = 240;
CBT_2020_wrap.y_path_0_1 = 7;
CBT_2020_wrap.y_path_0_0 = 8;
CBT_2020_wrap.legend_pos_x_0__ = {};
CBT_2020_wrap.legend_pos_x_0__['zh-tw'] = 330;
CBT_2020_wrap.legend_pos_x_0__['fr'] = 290;
CBT_2020_wrap.legend_pos_x_0__['en'] = 300;

//-- Variables
CBT_2020_wrap.do_cumul = 0;
CBT_2020_wrap.do_onset = 0;

//-- Plot
function CBT_Latest_Plot() {
  d3.csv(CBT_2020_wrap.data_path_list[CBT_2020_wrap.do_onset], function (error, data) {
    d3.csv(CBT_2020_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBT_Make_Canvas(CBT_2020_wrap);
      CBT_Format_Data(CBT_2020_wrap, data);
      CBT_Format_Data_2(CBT_2020_wrap, data2);
      CBT_Initialize(CBT_2020_wrap);
      CBT_Update(CBT_2020_wrap);
    });
  });
}

CBT_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + CBT_2020_wrap.tag + "_doCumul']", function (event) {
  CBT_2020_wrap.do_cumul = this.value;
  data_path = CBT_2020_wrap.data_path_list[CBT_2020_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_2020_wrap, data);
    CBT_Update(CBT_2020_wrap);
  });
});

$(document).on("change", "input:radio[name='" + CBT_2020_wrap.tag + "_doOnset']", function (event) {
  CBT_2020_wrap.do_onset = this.value
  data_path = CBT_2020_wrap.data_path_list[CBT_2020_wrap.do_onset]
  
  d3.csv(data_path, function (error, data) {
    if (error) return console.warn(error);
    
    CBT_Format_Data(CBT_2020_wrap, data);
    CBT_Update(CBT_2020_wrap);
  });
});

//-- Save button
d3.select(CBT_2020_wrap.id + '_save').on('click', function() {
  var tag1, tag2;
  
  if (CBT_2020_wrap.do_cumul == 1) tag1 = 'cumulative';
  else tag1 = 'daily';
  if (CBT_2020_wrap.do_onset == 1) tag2 = 'onset';
  else tag2 = 'report';
  
  name = CBT_2020_wrap.tag + '_' + tag1 + '_' + tag2 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(CBT_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(CBT_2020_wrap.id+' .plot').remove();
  
  //-- Replot
  CBT_Latest_Plot();
});
