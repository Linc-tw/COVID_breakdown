
//-- Filename:
//--   age_symptom_correlations_2021.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var ASC_2021_wrap = {};

//-- ID
ASC_2021_wrap.tag = 'age_symptom_correlations_2021'
ASC_2021_wrap.id = '#' + ASC_2021_wrap.tag

//-- File path
ASC_2021_wrap.data_path_list = [
  "processed_data/2021/age_symptom_correlations_coefficient.csv",
  "processed_data/2021/age_symptom_correlations_counts.csv", 
  "processed_data/2021/age_symptom_counts.csv"
];

//-- Parameters

//-- Variables
ASC_2021_wrap.do_count = 0;

//-- Plot
function ASC_Latest_Plot() {
  d3.csv(ASC_2021_wrap.data_path_list[ASC_2021_wrap.do_count], function (error, data) {
    d3.csv(ASC_2021_wrap.data_path_list[2], function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Make_Canvas(ASC_2021_wrap);
      ASC_Format_Data(ASC_2021_wrap, data);
      ASC_FormatData_2(ASC_2021_wrap, data2);
      ASC_Initialize(ASC_2021_wrap);
      ASC_Update(ASC_2021_wrap);
    });
  });
}

ASC_Latest_Plot();

//-- Buttons
$(document).on("change", "input:radio[name='" + ASC_2021_wrap.tag + "_doCount']", function (event) {
  ASC_2021_wrap.do_count = this.value;
  dataPath = ASC_2021_wrap.data_path_list[ASC_2021_wrap.do_count]
  dataPath2 = ASC_2021_wrap.data_path_list[2]
  
  d3.csv(dataPath, function (error, data) {
    d3.csv(dataPath2, function (error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_Format_Data(ASC_2021_wrap, data);
      ASC_FormatData_2(ASC_2021_wrap, data2);
      ASC_Update(ASC_2021_wrap);
    });
  });
});

//-- Save button
d3.select(ASC_2021_wrap.id + '_save').on('click', function(){
  var tag1;
  
  if (ASC_2021_wrap.do_count == 1) tag1 = 'count';
  else tag1 = 'coefficient';
  
  name = ASC_2021_wrap.tag + '_' + tag1 + '_' + GS_lang + '.png'
  saveSvgAsPng(d3.select(ASC_2021_wrap.id).select('svg').node(), name);
});

//-- Language button
$(document).on("change", "input:radio[name='2021_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  
  //-- Remove
  d3.selectAll(ASC_2021_wrap.id+' .plot').remove()
  
  //-- Replot
  ASC_Latest_Plot();
});
