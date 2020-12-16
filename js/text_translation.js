
//-- Filename:
//--   text_translation.js
//--
//-- Author:
//--   Chieh-An Lin

//-- Global variable
var TT_wrap = {};

//-- Insert plain text
function TT_Add_Str(id, string) {
  var node = document.getElementById(id)
  if (null !== node) {
    node.textContent = '';
    node.appendChild(document.createTextNode(string));
  }
}

//-- Insert html
function TT_Add_Html(id, string) {
  var node = document.getElementById(id)
  if (null !== node) {
    node.textContent = '';
    node.innerHTML = string;
  }
}

//-- Text content
function text_translation() {
  if (GS_lang == 'zh-tw') {
    //-- Header + menu + footer
    TT_Add_Str("title", "嚴重特殊傳染性肺炎 台灣疫情");
    TT_Add_Str("menu_summary", "近90日統計摘要");
    TT_Add_Str("menu_policy", "防疫措施");
    TT_Add_Str("menu_source", "資料來源");
    TT_Add_Str("menu_copyleft", "版權沒有");
    TT_Add_Str("footer_last_update", '最後更新：' + TT_wrap.timestamp + ' \u00A0 - \u00A0 模板：Start Bootstrap \u00A0 - \u00A0 視覺化：D3');
    
    //-- Data source page
    TT_Add_Str("data_source_original_title", "原始資料");
    TT_Add_Html("data_source_original_body", "<p><a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>原始資料 <i class='fas fa-external-link-alt'></i></a> 乃由PTT網友們所整理，需從每天疾管署新聞稿及指揮中心記者會將單獨個案資料彙整成統一表單。作者由衷感謝資料整理團隊，若無如此熱心之舉本站勢必難以完成。</p>");
    TT_Add_Str("data_source_raw_title", "初階資料");
    TT_Add_Html("data_source_raw_body", "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>初階資料 <i class='fas fa-external-link-alt'></i></a> 則是原始資料中本站所使用的兩個分頁：病例清單和檢驗人數。檔案格式為csv。</p>");
    TT_Add_Str("data_source_processed_title", "高階資料");
    TT_Add_Html("data_source_processed_body", "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>高階資料 <i class='fas fa-external-link-alt'></i></a> 為整理過後，讓Javascript直接用來畫圖的檔案。絕大部分都只使用ASCII編碼，檔案格式皆為csv。</p>");
    
    //-- Copyleft page
    TT_Add_Str("no_right_reserved_title", "啊就真的沒有版權");
    TT_Add_Html("no_right_reserved_body", "<p>本站所創作之所有文字及圖像均以<a href='https://creativecommons.org/publicdomain/zero/1.0/deed.zh_TW' target='_blank'>CC0 1.0 通用 公眾領域貢獻宣告 <i class='fas fa-external-link-alt'></i></a> 條款發布。</p><p>意即使用者可自由用作營利或非營利之途，且不需經許可或標示來源。</p><p>原始碼授權條款請洽此<a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>連結 <i class='fas fa-external-link-alt'></i></a>。</p>");
    
    //-- Status evolution
    TT_Add_Str("status_evolution_title", "疫情變化");
    
    //-- Various rates
    TT_Add_Str("various_rates_title", "各種比率之七日平均");
    
    //-- Difference by transmission
    TT_Add_Str("difference_by_transmission_title", "確診等多久？");
    TT_Add_Str("difference_by_transmission_button_1", "全部");
    TT_Add_Str("difference_by_transmission_button_2", "境外移入");
    TT_Add_Str("difference_by_transmission_button_3", "本土");
    TT_Add_Str("difference_by_transmission_button_4", "敦睦艦隊");
    
    //-- Case by transmission
    TT_Add_Str("case_by_transmission_title", "依感染源之確診人數");
    TT_Add_Str("case_by_transmission_button_1", "逐日");
    TT_Add_Str("case_by_transmission_button_2", "累計");
    TT_Add_Str("case_by_transmission_button_3", "確診日");
    TT_Add_Str("case_by_transmission_button_4", "發病日");
    
    //-- Case by detection
    TT_Add_Str("case_by_detection_title", "依檢驗管道之確診人數");
    TT_Add_Str("case_by_detection_button_1", "逐日");
    TT_Add_Str("case_by_detection_button_2", "累計");
    TT_Add_Str("case_by_detection_button_3", "確診日");
    TT_Add_Str("case_by_detection_button_4", "發病日");
    
    //-- Travel history-symptom correlations
    TT_Add_Str("travel_history_symptom_correlations_title", "旅遊史與症狀相關程度");
    TT_Add_Str("travel_history_symptom_correlations_button_1", "相關係數");
    TT_Add_Str("travel_history_symptom_correlations_button_2", "案例數");
    
    //-- Age-symptom correlations
    TT_Add_Str("age_symptom_correlations_title", "個案年齡與症狀相關程度");
    TT_Add_Str("age_symptom_correlations_button_1", "相關係數");
    TT_Add_Str("age_symptom_correlations_button_2", "案例數");
    
    //-- Test by criterion
    TT_Add_Str("test_by_criterion_title", "檢驗數量");
    TT_Add_Str("test_by_criterion_button_1", "逐日");
    TT_Add_Str("test_by_criterion_button_2", "累計");
    
    //-- Border statistics
    TT_Add_Str("border_statistics_title", "入出境人數統計");
    TT_Add_Str("border_statistics_button_1", "入境");
    TT_Add_Str("border_statistics_button_2", "出境");
    TT_Add_Str("border_statistics_button_3", "合計");
    
    //-- Criteria timeline
    TT_Add_Str("criteria_timeline_title", "檢驗通報標準沿革");
    TT_Add_Str("criteria_timeline_button_1", "精選");
    TT_Add_Str("criteria_timeline_button_2", "完整");
    TT_Add_Str("criteria_timeline_button_3", "軸狀");
    TT_Add_Str("criteria_timeline_button_4", "碟狀");
    
    //-- Event timeline
    TT_Add_Str("event_timeline_title", "疫情爆發時間軸");
    TT_Add_Str("event_timeline_button_1", "週日為首");
    TT_Add_Str("event_timeline_button_2", "週一為首");
  }
  
  else if (GS_lang == 'fr') {
    //-- Header + menu + footer
    TT_Add_Str("title", "Statistiques de COVID-19 à Taïwan");
    TT_Add_Str("menu_summary", "Derniers 90 jours");
    TT_Add_Str("menu_policy", "Mesures de prévention");
    TT_Add_Str("menu_source", "Source des données");
    TT_Add_Str("menu_copyleft", "Sans droit d'auteur");
    TT_Add_Str("footer_last_update", 'Dernière mise à jour : ' + TT_wrap.timestamp + ' \u00A0 - \u00A0 Modèle : Start Bootstrap \u00A0 - \u00A0 Visualisation : D3');
    
    //-- Data source page
    TT_Add_Str("data_source_original_title", "Données d'origine");
    TT_Add_Html("data_source_original_body", "<p>Les <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>données d'origine <i class='fas fa-external-link-alt'></i></a> sont mises à jour par de nombreux internautes anonymes du forum PTT, qui est souvent considéré comme le <i>Reddit</i> taïwanais. Ils rassemblent les informations à partir des communiqués et des conférences de presse quotidiens, pour produire des feuilles de calcul consolidées.</p><p>Bien évidemment, ce site n'aurait pas pu voir le jour sans le travail de ces bénévoles bienveillants. Je leur en suis très reconnaissant.</p><p>Le jeu de données est en mandarin.</p>");
    TT_Add_Str("data_source_raw_title", "Données brutes");
    TT_Add_Html("data_source_raw_body", "<p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>données brutes <i class='fas fa-external-link-alt'></i></a> sont 2 feuilles de calcul parmi les données d'origine. La première est une liste des cas confirmés avec certains détails ; la seconde est la statistique quotidienne des dépistages.</p><p>Ces données sont en format csv et contiennent beaucoup de caractères en mandarin.</p>");
    TT_Add_Str("data_source_processed_title", "Données traitées");
    TT_Add_Html("data_source_processed_body", "<p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>données traitées <i class='fas fa-external-link-alt'></i></a> comprennent de nombreux fichiers directement utilisés par Javascript pour afficher les figures.</p><p>Ces données sont en format csv. La plupart d'entre elles contient seulement des caractères ASCII.</p>");
    
    //-- Copyleft page
    TT_Add_Str("no_right_reserved_title", "Fièrement sans droit d'auteur");
    TT_Add_Html("no_right_reserved_body", "<p>Tous les textes et les graphes créés sur ce site sont distribués sous <a href='https://creativecommons.org/publicdomain/zero/1.0/deed.fr' target='_blank'>CC0 1.0 universel Transfert dans le Domaine Public <i class='fas fa-external-link-alt'></i></a>.</p><p>Cela signifie que vous pouvez en faire presque tout ce que vous voulez : usages personnel et/ou commercial, sans avoir besoin d'autorisation ou d'attribution d'auteur.</p><p>La license pour les codes et les scripts se trouve <a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>ici <i class='fas fa-external-link-alt'></i></a>.</p>");
    
    //-- Status evolution
    TT_Add_Str("status_evolution_title", "Évolution de la situation");
    
    //-- Various rates
    TT_Add_Str("various_rates_title", "Taux en moyenne glissante sur 7 jours");
    
    //-- Difference by transmission
    TT_Add_Str("difference_by_transmission_title", "Combien de temps pour identifier un cas ?");
    TT_Add_Str("difference_by_transmission_button_1", "Tous");
    TT_Add_Str("difference_by_transmission_button_2", "Importés");
    TT_Add_Str("difference_by_transmission_button_3", "Locaux");
    TT_Add_Str("difference_by_transmission_button_4", "Flotte");
    
    //-- Case by transmission
    TT_Add_Str("case_by_transmission_title", "Cas confirmés par moyen de transmission");
    TT_Add_Str("case_by_transmission_button_1", "Quotidiens");
    TT_Add_Str("case_by_transmission_button_2", "Cumulés");
    TT_Add_Str("case_by_transmission_button_3", "Date du diagnostic");
    TT_Add_Str("case_by_transmission_button_4", "Date du début des sympt.");
    
    //-- Case by detection
    TT_Add_Str("case_by_detection_title", "Cas confirmés par canal de détection");
    TT_Add_Str("case_by_detection_button_1", "Quotidiens");
    TT_Add_Str("case_by_detection_button_2", "Cumulés");
    TT_Add_Str("case_by_detection_button_3", "Date du diagnostic");
    TT_Add_Str("case_by_detection_button_4", "Date du début des sympt.");
    
    //-- Travel history-symptom correlations
    TT_Add_Str("travel_history_symptom_correlations_title", "Corrélations entre antécédents de voyage & symptômes");
    TT_Add_Str("travel_history_symptom_correlations_button_1", "Coefficients");
    TT_Add_Str("travel_history_symptom_correlations_button_2", "Nombres");
    
    //-- Age-symptom correlations
    TT_Add_Str("age_symptom_correlations_title", "Corrélations entre âge & symptômes");
    TT_Add_Str("age_symptom_correlations_button_1", "Coefficients");
    TT_Add_Str("age_symptom_correlations_button_2", "Nombres");
    
    //-- Test by criterion
    TT_Add_Str("test_by_criterion_title", "Nombre de tests par critère");
    TT_Add_Str("test_by_criterion_button_1", "Quotidiens");
    TT_Add_Str("test_by_criterion_button_2", "Cumulés");
    
    //-- Border statistics
    TT_Add_Str("border_statistics_title", "Statistiques frontalières");
    TT_Add_Str("border_statistics_button_1", "Arrivée");
    TT_Add_Str("border_statistics_button_2", "Départ");
    TT_Add_Str("border_statistics_button_3", "Total");
    
    //-- Criteria timeline
    TT_Add_Str("criteria_timeline_title", "Chronologie des dépistages systématiques");
    TT_Add_Str("criteria_timeline_button_1", "Selectionnée");
    TT_Add_Str("criteria_timeline_button_2", "Complète");
    TT_Add_Str("criteria_timeline_button_3", "Frise");
    TT_Add_Str("criteria_timeline_button_4", "Disques");
    
    //-- Event timeline
    TT_Add_Str("event_timeline_title", "Chronologie de la pandémie");
    TT_Add_Str("event_timeline_button_1", "1er jour dimanche");
    TT_Add_Str("event_timeline_button_2", "1er jour lundi");
  }
  
  else { //-- En
    //-- Header + menu + footer
    TT_Add_Str("title", "COVID-19 Statistics in Taiwan");
    TT_Add_Str("menu_summary", "90-day dashboard");
    TT_Add_Str("menu_policy", "Policy");
    TT_Add_Str("menu_source", "Data Source");
    TT_Add_Str("menu_copyleft", "No right reserved");
    TT_Add_Str("footer_last_update", 'Last updates: ' + TT_wrap.timestamp + ' \u00A0 - \u00A0 Template by Start Bootstrap \u00A0 - \u00A0 Visualization by D3');
    
    //-- Data source page
    TT_Add_Str("data_source_original_title", "Original dataset");
    TT_Add_Html("data_source_original_body", "<p>The <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>original dataset <i class='fas fa-external-link-alt'></i></a> is maintained by various anonymous users of the PTT forum, often considered as Taiwanese Reddit. They collect information from daily press releases and conferences, and sort them into comprehensive worksheets.</p><p>Obviously this website cannot be done without the goodwill of these volunteers that I am fully grateful to.</p><p>This dataset has been edited in Mandarin.</p>");
    TT_Add_Str("data_source_raw_title", "Raw data");
    TT_Add_Html("data_source_raw_body", "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>Raw data <i class='fas fa-external-link-alt'></i></a> are 2 worksheets from the original set that are used here. The first one is a list of confirmed cases with available details; the other one is daily statistics in testing.</p><p>These are csv files containing Mandarin strings.</p>");
    TT_Add_Str("data_source_processed_title", "Processed data");
    TT_Add_Html("data_source_processed_body", "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>Processed data <i class='fas fa-external-link-alt'></i></a> contain various files that are directly used by Javascript for plotting.</p><p>These are csv files. Most of them are ASCII-compatible.</p>");
    
    //-- Copyleft page
    TT_Add_Str("no_right_reserved_title", "Proudly No Right Reserved");
    TT_Add_Html("no_right_reserved_body", "<p>All texts and plots created by this site are released under <a href='https://creativecommons.org/publicdomain/zero/1.0/deed.en' target='_blank'>CC0 1.0 Universal Public Domain Dedication <i class='fas fa-external-link-alt'></i></a>.</p><p>That basically means you can do almost whatever you want with them: personal and commercial use, no permission or attribution needed.</p><p>The license for codes and scripts can be found <a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>here <i class='fas fa-external-link-alt'></i></a>.</p>");
    
    //-- Status evolution
    TT_Add_Str("status_evolution_title", "Status Evolution");
    
    //-- Various rates
    TT_Add_Str("various_rates_title", "7-day Average of Various Rates");
    
    //-- Difference by transmission
    TT_Add_Str("difference_by_transmission_title", "How many days to identify cases?");
    TT_Add_Str("difference_by_transmission_button_1", "All");
    TT_Add_Str("difference_by_transmission_button_2", "Imported");
    TT_Add_Str("difference_by_transmission_button_3", "Local");
    TT_Add_Str("difference_by_transmission_button_4", "Fleet");
    
    //-- Case by transmission
    TT_Add_Str("case_by_transmission_title", "Confirmed Cases by Transmission Type");
    TT_Add_Str("case_by_transmission_button_1", "Daily");
    TT_Add_Str("case_by_transmission_button_2", "Cumulative");
    TT_Add_Str("case_by_transmission_button_3", "Report date");
    TT_Add_Str("case_by_transmission_button_4", "Onset date");
    
    //-- Case by detection
    TT_Add_Str("case_by_detection_title", "Confirmed Cases by Detection Channel");
    TT_Add_Str("case_by_detection_button_1", "Daily");
    TT_Add_Str("case_by_detection_button_2", "Cumulative");
    TT_Add_Str("case_by_detection_button_3", "Report date");
    TT_Add_Str("case_by_detection_button_4", "Onset date");
    
    //-- Travel history-symptom correlations
    TT_Add_Str("travel_history_symptom_correlations_title", "Correlations between Travel History & Symptoms");
    TT_Add_Str("travel_history_symptom_correlations_button_1", "Coefficients");
    TT_Add_Str("travel_history_symptom_correlations_button_2", "Counts");
    
    //-- Age-symptom correlations
    TT_Add_Str("age_symptom_correlations_title", "Correlations between Age & Symptoms");
    TT_Add_Str("age_symptom_correlations_button_1", "Coefficients");
    TT_Add_Str("age_symptom_correlations_button_2", "Counts");
    
    //-- Test by criterion
    TT_Add_Str("test_by_criterion_title", "Number of Tests by Reporting Criterion");
    TT_Add_Str("test_by_criterion_button_1", "Daily");
    TT_Add_Str("test_by_criterion_button_2", "Cumulative");
    
    //-- Border statistics
    TT_Add_Str("border_statistics_title", "Border Crossing");
    TT_Add_Str("border_statistics_button_1", "Arrival");
    TT_Add_Str("border_statistics_button_2", "Departure");
    TT_Add_Str("border_statistics_button_3", "Both");
    
    //-- Criteria timeline
    TT_Add_Str("criteria_timeline_title", "Chronology of Systematic Testing");
    TT_Add_Str("criteria_timeline_button_1", "Selected");
    TT_Add_Str("criteria_timeline_button_2", "Full");
    TT_Add_Str("criteria_timeline_button_3", "Timeline");
    TT_Add_Str("criteria_timeline_button_4", "Disks");
    
    //-- Event timeline
    TT_Add_Str("event_timeline_title", "Pandemic Timeline");
    TT_Add_Str("event_timeline_button_1", "1st day Sunday");
    TT_Add_Str("event_timeline_button_2", "1st day Monday");
  }
}

//-- Load key nb & print texts
d3.csv("processed_data/key_numbers.csv", function (error, data) {
  if (error) return console.warn(error);
  
  var timestamp;
  var i;
  
  for (i=0; i<data.length; i++) {
    if ('timestamp' == data[i]['key']) {
      timestamp = data[i]['value'];
    }
  }
  
  TT_wrap.timestamp = timestamp;

  text_translation();
});

//-- Language button
$(document).on("change", "input:radio[name='index_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  text_translation();
});

$(document).on("change", "input:radio[name='2020_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  text_translation();
});

$(document).on("change", "input:radio[name='policy_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  text_translation();
});

$(document).on("change", "input:radio[name='source_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  text_translation();
});

$(document).on("change", "input:radio[name='copyleft_language']", function (event) {
  GS_lang = this.value;
  Cookies.set("lang", GS_lang);
  text_translation();
});
