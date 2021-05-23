
//-- Filename:
//--   age_symptom_correlations_latest.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_latest_wrap = {};

//-- ID
ASC_latest_wrap.tag = 'age_symptom_correlations_latest'
ASC_latest_wrap.id = '#' + ASC_latest_wrap.tag

//-- File path
ASC_latest_wrap.data_path_list = [
  "processed_data/latest/age_symptom_correlations_coefficient.csv",
  "processed_data/latest/age_symptom_correlations_counts.csv", 
  "processed_data/latest/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_latest_wrap.do_count = 0;

//-- Plot
function ASC_Latest_Plot() {
  d3.csv(ASC_latest_wrap.data_path_list[ASC_latest_wrap.do_count], function (error, data) {
    d3.csv(ASC_latest_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Make_Canvas(ASC_latest_wrap);
      ASC_Format_Data(ASC_latest_wrap, data);
      ASC_FormatData_2(ASC_latest_wrap, data2);
      ASC_Initialize(ASC_latest_wrap);
      ASC_Update(ASC_latest_wrap);
    });
  });
}

ASC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_latest_wrap.tag + "_doCount']", function (event) {
  ASC_latest_wrap.do_count = this.value;
  dataPath = ASC_latest_wrap.data_path_list[ASC_latest_wrap.do_count]
  dataPath2 = ASC_latest_wrap.data_path_list[2]
  
  d3.csv(dataPath, function (error, data) {
    d3.csv(dataPath2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Format_Data(ASC_latest_wrap, data);
      ASC_FormatData_2(ASC_latest_wrap, data2);
      ASC_Update(ASC_latest_wrap);
    });
  });
});

//-- Save button
d3.select(ASC_latest_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_latest_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_latest_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(ASC_latest_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(ASC_latest_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_Latest_Plot();
});
