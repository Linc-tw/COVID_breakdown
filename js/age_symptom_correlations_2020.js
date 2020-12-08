
//-- Filename:
//--   age_symptom_correlations_2020.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_2020_wrap = {};

//-- ID
ASC_2020_wrap.tag = 'age_symptom_correlations_2020'
ASC_2020_wrap.id = '#' + ASC_2020_wrap.tag

//-- File path
ASC_2020_wrap.data_path_list = [
  "processed_data/2020/age_symptom_correlations_coefficient.csv",
  "processed_data/2020/age_symptom_correlations_counts.csv", 
  "processed_data/2020/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_2020_wrap.do_count = 0;

//-- Plot
function ASC_Latest_Plot() {
  d3.csv(ASC_2020_wrap.data_path_list[ASC_2020_wrap.do_count], function (error, data) {
    d3.csv(ASC_2020_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Make_Canvas(ASC_2020_wrap);
      ASC_Format_Data(ASC_2020_wrap, data);
      ASC_FormatData_2(ASC_2020_wrap, data2);
      ASC_initialize(ASC_2020_wrap);
      ASC_update(ASC_2020_wrap);
    });
  });
}

ASC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_2020_wrap.tag + "_doCount']", function (event) {
  ASC_2020_wrap.do_count = this.value;
  dataPath = ASC_2020_wrap.data_path_list[ASC_2020_wrap.do_count]
  dataPath2 = ASC_2020_wrap.data_path_list[2]
  
  d3.csv(dataPath, function (error, data) {
    d3.csv(dataPath2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Format_Data(ASC_2020_wrap, data);
      ASC_FormatData_2(ASC_2020_wrap, data2);
      ASC_update(ASC_2020_wrap);
    });
  });
});

//-- Save button
d3.select(ASC_2020_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_2020_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_2020_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(ASC_2020_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2020_language']", function (event) {
  lang = this.value;
  Cookies.set("lang", lang);
  
  //-- Remove
  d3.selectAll(ASC_2020_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_Latest_Plot();
});
