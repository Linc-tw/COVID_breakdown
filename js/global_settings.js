
//-- Filename:
//--   global_settings.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Language settings
var GS_lang = Cookies.get("lang"); // 'en', 'fr', 'zh-tw'
if (!GS_lang) {
  GS_lang = "en";
  Cookies.set("lang", GS_lang);
}

let el = document.getElementById('lang_'+GS_lang);
el.classList.add("active");

//-- Global variables
var GS_var = {};
GS_var.xlabel_path_latest = 7;
GS_var.r_list_latest = [3, 3, 4, 1, 1, 2, 2];
GS_var.xlabel_path_2020 = 25;
GS_var.r_list_2020 = [7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
//GS_var.xlabel_path_2021 = 25;
//GS_var.r_list_2021 = [7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
GS_var.xlabel_path_2021 = 2;
GS_var.r_list_2021 = [1, 1];
GS_var.c_list = ['#3366BB', '#CC6677', '#55BB44', '#EE9977', '#9977AA', '#AAAA55', '#222288', '#660022'];
GS_var.trans_duration = 800;

//-- General functions
function GS_ISO_Date_To_MD_Date(iso_date) {
  var md_date_format;
  if (GS_lang == 'zh-tw')   md_date_format = d3.timeFormat("%-m月%-d日");
  else if (GS_lang == 'fr') md_date_format = d3.timeFormat("%d/%m");
  else md_date_format = d3.timeFormat("%b %d");
  
  var date = d3.isoParse(iso_date);
  return md_date_format(date);
}

function GS_CumSum(data, col_tag_list) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<col_tag_list.length; j++) {
      data[i][col_tag_list[j]] = +data[i][col_tag_list[j]] + +data[i-1][col_tag_list[j]];
    }
  }
}

//TODO
//show data table
//separate on-plane & unknown from imported (CBT)
