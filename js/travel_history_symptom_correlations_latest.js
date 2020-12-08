
//-- Filename:
//--   travel_history_symptom_correlations_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var THSC_latest_wrap = {};

//-- ID
THSC_latest_wrap.tag = 'travel_history_symptom_correlations_latest'
THSC_latest_wrap.id = '#' + THSC_latest_wrap.tag

//-- File path
THSC_latest_wrap.data_path_list = [
  "processed_data/latest/travel_history_symptom_correlations_coefficient.csv",
  "processed_data/latest/travel_history_symptom_correlations_counts.csv", 
  "processed_data/latest/travel_history_symptom_counts.csv"
];

//-- Parameters

//-- Variables
THSC_latest_wrap.do_count = 0;

//-- Plot
function THSC_Latest_Plot() {
  d3.csv(THSC_latest_wrap.data_path_list[THSC_latest_wrap.do_count], function (error, data) {
    d3.csv(THSC_latest_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_Make_Canvas(THSC_latest_wrap);
      THSC_Format_Data(THSC_latest_wrap, data);
      THSC_Format_Data_2(THSC_latest_wrap, data2);
      THSC_Initialize(THSC_latest_wrap);
      THSC_Update(THSC_latest_wrap);
    });
  });
}

THSC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + THSC_latest_wrap.tag + "_doCount']", function (event) {
  THSC_latest_wrap.do_count = this.value;
  data_path = THSC_latest_wrap.data_path_list[THSC_latest_wrap.do_count]
  data_path_2 = THSC_latest_wrap.data_path_list[2]
  
  d3.csv(data_path, function (error, data) {
    d3.csv(data_path_2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_Format_Data(THSC_latest_wrap, data);
      THSC_Format_Data_2(THSC_latest_wrap, data2);
      THSC_Update(THSC_latest_wrap);
    });
  });
});

//-- Save button
d3.select(THSC_latest_wrap.id + '_save').on('click', function () {
  var tag1;
  
  if (THSC_latest_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = THSC_latest_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(THSC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(THSC_latest_wrap.id+' .plot').remove()
  
  //-- Replot
  THSC_Latest_Plot();
});
