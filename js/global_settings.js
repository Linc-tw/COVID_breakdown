
//-- Filename:
//--   global_settings.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Language settings
var lang = Cookies.get("lang"); // 'en', 'fr', 'zh-tw'
if (!lang) {
  lang = "en";
  Cookies.set("lang", lang);
}

let el = document.getElementById('lang_'+lang);
el.classList.add("active");

//-- Global variables
var GS_var = {};
GS_var.xlabel_path_latest = 7;
GS_var.r_list_latest = [3, 3, 4, 1, 1, 2, 2];
GS_var.xlabel_path_2020 = 25;
GS_var.r_list_2020 = [7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
GS_var.c_list = ['#3366BB', '#CC6677', '#55BB44', '#EE9977', '#9977AA', '#AAAA55', '#222288', '#660022'];

//-- General functions
function GS_ISO_Date_To_MD_Date(iso_date) {
  var md_date_format;
  if (lang == 'zh-tw')   md_date_format = d3.timeFormat("%-m月%-d日");
  else if (lang == 'fr') md_date_format = d3.timeFormat("%d/%m");
  else md_date_format = d3.timeFormat("%b %d");
  
  var date = d3.isoParse(iso_date);
  return md_date_format(date);
}

function GS_CumSum(data, colTagList) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<colTagList.length; j++) {
      data[i][colTagList[j]] = +data[i][colTagList[j]] + +data[i-1][colTagList[j]];
    }
  }
}

//TODO
//case by transmission
//case by detection
//th-symp corr
//age-symp corr
//test
//border
//Taux de positivité
//lang




//-- Obsolete
var global_var = {};
global_var.xlabel_path = 7;
global_var.rList = [3, 3, 4, 1, 1, 2, 2];
global_var.cList = ['#3366BB', '#CC6677', '#55BB44', '#EE9977', '#9977AA', '#AAAA55', '#222288', '#660022'];

function ISODateToMDDate(ISODate) {
  var fmtStr;
  var MDDateFormat;
  if (lang == 'zh-tw')   MDDateFormat = d3.timeFormat("%-m月%-d日");
  else if (lang == 'fr') MDDateFormat = d3.timeFormat("%d/%m");
  else MDDateFormat = d3.timeFormat("%b %d");
  
  var date = d3.isoParse(ISODate);
  return MDDateFormat(date);
}

function cumsum(data, colTagList) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<colTagList.length; j++) {
      data[i][colTagList[j]] = +data[i][colTagList[j]] + +data[i-1][colTagList[j]];
    }
  }
}
