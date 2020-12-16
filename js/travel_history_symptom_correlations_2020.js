
//-- Filename:
//--   travel_history_symptom_correlations_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var THSC_2020_wrap = {};

//-- ID
THSC_2020_wrap.tag = 'travel_history_symptom_correlations_2020'
THSC_2020_wrap.id = '#' + THSC_2020_wrap.tag

//-- File path
THSC_2020_wrap.data_path_list = [
  "processed_data/2020/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/2020/travel_history_symptom_correlations_counts.csv", 
  "processed_data/2020/travel_history_symptom_counts.csv"
];

//-- Parameters

//-- Variables
THSC_2020_wrap.do_count = 0;

//-- Plot
function THSC_Latest_Plot() {
  d3.csv(THSC_2020_wrap.data_path_list[THSC_2020_wrap.do_count], function (error, data) {
    d3.csv(THSC_2020_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_Make_Canvas(THSC_2020_wrap);
      THSC_Format_Data(THSC_2020_wrap, data);
      THSC_Format_Data_2(THSC_2020_wrap, data2);
      THSC_Initialize(THSC_2020_wrap);
      THSC_Update(THSC_2020_wrap);
    });
  });
}

THSC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + THSC_2020_wrap.tag + "_doCount']", function (event) {
  THSC_2020_wrap.do_count = this.value;
  data_path = THSC_2020_wrap.data_path_list[THSC_2020_wrap.do_count]
  data_path_2 = THSC_2020_wrap.data_path_list[2]
  
  d3.csv(data_path, function (error, data) {
    d3.csv(data_path_2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_Format_Data(THSC_2020_wrap, data);
      THSC_Format_Data_2(THSC_2020_wrap, data2);
      THSC_Update(THSC_2020_wrap);
    });
  });
});

//-- Save button
d3.select(THSC_2020_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (THSC_2020_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = THSC_2020_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(THSC_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(THSC_2020_wrap.id+' .plot').remove()
  
  //-- Replot
  THSC_Latest_Plot();
});
