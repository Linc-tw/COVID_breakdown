//-- Language settings
var lang = Cookies.get("lang"); // 'en', 'fr', 'zh-tw'
if (!lang) {
  lang = "en";
  Cookies.set("lang", lang);
}

let el = document.getElementById('lang_'+lang);
el.classList.add("active");


//-- Global variables
var global_var = {};
// global_var.xlabel_path = 25;
// global_var.rList = [7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
global_var.xlabel_path = 7;
global_var.rList = [3, 3, 4, 1, 1, 2, 2];
global_var.cList = ['#3366BB', '#CC6677', '#55BB44', '#EE9977', '#9977AA', '#AAAA55', '#222288', '#660022'];

var GLOBAL_VAR = {};
GLOBAL_VAR.xlabel_path_latest = 7;
GLOBAL_VAR.r_list_latest = [3, 3, 4, 1, 1, 2, 2];
GLOBAL_VAR.xlabel_path_2020 = 25;
GLOBAL_VAR.r_list_2020 = [7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
GLOBAL_VAR.c_list = ['#3366BB', '#CC6677', '#55BB44', '#EE9977', '#9977AA', '#AAAA55', '#222288', '#660022'];

var KN_wrap = {};






//TODO
//Taux de positivité
//2020 page
//Last 3 months





//-- General functions
function ISODateToMDDate(ISODate) {
  var fmtStr;
  var MDDateFormat;
  if (lang == 'zh-tw')   MDDateFormat = d3.timeFormat("%-m月%-d日");
  else if (lang == 'fr') MDDateFormat = d3.timeFormat("%d/%m");
  else MDDateFormat = d3.timeFormat("%b %d");
  
  var date = d3.isoParse(ISODate);
  return MDDateFormat(date);
}

function TT_ISO_Date_To_MD_Date(iso_date) {
  var md_date_format;
  if (lang == 'zh-tw')   md_date_format = d3.timeFormat("%-m月%-d日");
  else if (lang == 'fr') md_date_format = d3.timeFormat("%d/%m");
  else md_date_format = d3.timeFormat("%b %d");
  
  var date = d3.isoParse(iso_date);
  return md_date_format(date);
}

function cumsum(data, colTagList) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<colTagList.length; j++) {
      data[i][colTagList[j]] = +data[i][colTagList[j]] + +data[i-1][colTagList[j]];
    }
  }
}


//-- Text in html
function TT_Add_Str(id, string) {
  var node = document.getElementById(id)
  if (null !== node) {
    node.textContent = '';
    node.appendChild(document.createTextNode(string));
  }
}

function TT_Add_Html(id, string) {
  var node = document.getElementById(id)
  if (null !== node) {
    node.textContent = '';
    node.innerHTML = string;
  }
}

var node;

function text_translation() {
  if (lang == 'zh-tw') {
    node = document.getElementById("title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("嚴重特殊傳染性肺炎 台灣疫情"));
    }
    node = document.getElementById("menu_summary")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("近90日統計摘要"));
    }
    node = document.getElementById("menu_policy")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("防疫措施"));
    }
    node = document.getElementById("menu_source")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("資料來源"));
    }
    node = document.getElementById("menu_copyleft")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("版權沒有"));
    }
    node = document.getElementById("footer_last_update")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('最後更新：' + KN_wrap.timestamp));
      node.appendChild(document.createTextNode(' \u00A0 - \u00A0 模板：Start Bootstrap \u00A0 - \u00A0 視覺化：D3'));
    }
    
    
    node = document.getElementById("data_source_original_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("原始資料"));
    }
    node = document.getElementById("data_source_original_body")
    if (node !== null) {
      node.innerHTML = "<p><a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>原始資料 <i class='fas fa-external-link-alt'></i></a> 乃由PTT網友們所整理，需從每天疾管署新聞稿及指揮中心記者會將單獨個案資料彙整成統一表單。作者由衷感謝資料整理團隊，若無如此熱心之舉本站勢必難以完成。</p>";
    }
    node = document.getElementById("data_source_raw_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('初階資料'));
    }
    node = document.getElementById("data_source_raw_body")
    if (node !== null) {
      node.innerHTML = "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>初階資料 <i class='fas fa-external-link-alt'></i></a> 則是原始資料中本站所使用的兩個分頁：病例清單和檢驗人數。檔案格式為csv。</p>";
    }
    node = document.getElementById("data_source_processed_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('高階資料'));
    }
    node = document.getElementById("data_source_processed_body")
    if (node !== null) {
      node.innerHTML = "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>高階資料 <i class='fas fa-external-link-alt'></i></a> 為整理過後，讓Javascript直接用來畫圖的檔案。絕大部分都只使用ASCII編碼，檔案格式皆為csv。</p>";
    }
    
    
    node = document.getElementById("no_right_reserved_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("啊就真的沒有版權"));
    }
    node = document.getElementById("no_right_reserved_body")
    if (node !== null) {
      node.innerHTML = "<p>本站所創作之所有文字及圖像均以<a href='https://creativecommons.org/publicdomain/zero/1.0/deed.zh_TW' target='_blank'>CC0 1.0 通用 公眾領域貢獻宣告 <i class='fas fa-external-link-alt'></i></a> 條款發布。</p><p>意即使用者可自由用作營利或非營利之途，且不需經許可或標示來源。</p><p>原始碼授權條款請洽此<a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>連結 <i class='fas fa-external-link-alt'></i></a>。</p>";
    }
    
    
    node = document.getElementById("status_evolution_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("疫情變化"));
    }
    
    
    TT_Add_Str("status_evolution_title", "Évolution de la situation");
    
    TT_Add_Str("difference_by_transmission_title", "多久抓到帶原者？");
    TT_Add_Str("difference_by_transmission_button_1", "全部");
    TT_Add_Str("difference_by_transmission_button_2", "境外移入");
    TT_Add_Str("difference_by_transmission_button_3", "本土");
    TT_Add_Str("difference_by_transmission_button_4", "敦睦艦隊");
    
    
    node = document.getElementById("case_by_transmission_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("依感染源之確診人數"));
    }
    node = document.getElementById("case_by_transmission_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("逐日"));
    }
    node = document.getElementById("case_by_transmission_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("累計"));
    }
    node = document.getElementById("case_by_transmission_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("確診日"));
    }
    node = document.getElementById("case_by_transmission_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("發病日"));
    }
    
    
    node = document.getElementById("case_by_detection_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("依檢驗管道之確診人數"));
    }
    node = document.getElementById("case_by_detection_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("逐日"));
    }
    node = document.getElementById("case_by_detection_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("累計"));
    }
    node = document.getElementById("case_by_detection_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("確診日"));
    }
    node = document.getElementById("case_by_detection_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("發病日"));
    }
    
    
    node = document.getElementById("travel_history_symptom_correlations_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("境外移入之旅遊史與症狀之相關性"));
    }
    node = document.getElementById("travel_history_symptom_correlations_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("相關係數"));
    }
    node = document.getElementById("travel_history_symptom_correlations_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("案例數"));
    }
    
    
    node = document.getElementById("age_symptom_correlations_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("個案年齡與症狀之相關性"));
    }
    node = document.getElementById("age_symptom_correlations_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("相關係數"));
    }
    node = document.getElementById("age_symptom_correlations_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("案例數"));
    }
    
    
    node = document.getElementById("test_by_criterion_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("檢驗數量"));
    }
    node = document.getElementById("test_by_criterion_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("逐日"));
    }
    node = document.getElementById("test_by_criterion_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("累計"));
    }
    
    
    node = document.getElementById("border_statistics_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("入出境人數統計"));
    }
    node = document.getElementById("border_statistics_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("入境"));
    }
    node = document.getElementById("border_statistics_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("出境"));
    }
    node = document.getElementById("border_statistics_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("合計"));
    }
    
    
    node = document.getElementById("criteria_timeline_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("檢驗通報標準沿革"));
    }
    node = document.getElementById("criteria_timeline_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("精選"));
    }
    node = document.getElementById("criteria_timeline_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("完整"));
    }
    node = document.getElementById("criteria_timeline_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("軸狀"));
    }
    node = document.getElementById("criteria_timeline_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("碟狀"));
    }
    
    
    node = document.getElementById("event_timeline_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("疫情爆發時間軸"));
    }
    node = document.getElementById("event_timeline_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("週日開始"));
    }
    node = document.getElementById("event_timeline_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("週一開始"));
    }
    
  }
  else if (lang == 'fr') {
    node = document.getElementById("title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Statistiques de COVID-19 à Taïwan"));
    }
    node = document.getElementById("menu_summary")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Derniers 90 jours"));
    }
    node = document.getElementById("menu_policy")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Mesures de prévention"));
    }
    node = document.getElementById("menu_source")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Source des données"));
    }
    node = document.getElementById("menu_copyleft")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Sans droit d'auteur"));
    }
    node = document.getElementById("footer_last_update")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Dernière mise à jour : ' + KN_wrap.timestamp));
      node.appendChild(document.createTextNode(' \u00A0 - \u00A0 Modèle : Start Bootstrap \u00A0 - \u00A0 Visualisation : D3'));
    }
    
    
    node = document.getElementById("data_source_original_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Données d'origine"));
    }
    node = document.getElementById("data_source_original_body")
    if (node !== null) {
      node.innerHTML = "<p>Les <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>données d'origine <i class='fas fa-external-link-alt'></i></a> sont mises à jour par de nombreux internautes anonymes du forum PTT, qui est souvent considéré comme le <i>Reddit</i> taïwanais. Ils rassemblent les informations à partir des communiqués et des conférences de presse quotidiens, pour produire des feuilles de calcul consolidées.</p><p>Bien évidemment, ce site n'aurait pas pu voir le jour sans le travail de ces bénévoles bienveillants. Je leur en suis très reconnaissant.</p><p>Le jeu de données est en mandarin.</p>";
    }
    node = document.getElementById("data_source_raw_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Données brutes'));
    }
    node = document.getElementById("data_source_raw_body")
    if (node !== null) {
      node.innerHTML = "<p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>données brutes <i class='fas fa-external-link-alt'></i></a> sont 2 feuilles de calcul parmi les données d'origine. La première est une liste des cas confirmés avec certains détails ; la seconde est la statistique quotidienne des dépistages.</p><p>Ces données sont en format csv et contiennent beaucoup de caractères en mandarin.</p>";
    }
    node = document.getElementById("data_source_processed_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Données traitées'));
    }
    node = document.getElementById("data_source_processed_body")
    if (node !== null) {
      node.innerHTML = "<p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>données traitées <i class='fas fa-external-link-alt'></i></a> comprennent de nombreux fichiers directement utilisés par Javascript pour afficher les figures.</p><p>Ces données sont en format csv. La plupart d'entre elles contient seulement des caractères ASCII.</p>";
    }
    
    TT_Add_Str("no_right_reserved_title", "Fièrement sans droit d'auteur");
    TT_Add_Html("no_right_reserved_body", "<p>Tous les textes et les graphes créés sur ce site sont distribués sous <a href='https://creativecommons.org/publicdomain/zero/1.0/deed.fr' target='_blank'>CC0 1.0 universel Transfert dans le Domaine Public <i class='fas fa-external-link-alt'></i></a>.</p><p>Cela signifie que vous pouvez en faire presque tout ce que vous voulez : usages personnel et/ou commercial, sans avoir besoin d'autorisation ou d'attribution d'auteur.</p><p>La license pour les codes et les scripts se trouve <a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>ici <i class='fas fa-external-link-alt'></i></a>.</p>");
    
    //-- Plots
    TT_Add_Str("status_evolution_title", "Évolution de la situation");
    
    TT_Add_Str("difference_by_transmission_title", "Combien de temps pour identifier un cas ?");
    TT_Add_Str("difference_by_transmission_button_1", "Tous");
    TT_Add_Str("difference_by_transmission_button_2", "Importés");
    TT_Add_Str("difference_by_transmission_button_3", "Locaux");
    TT_Add_Str("difference_by_transmission_button_4", "Flotte");
    
    
    node = document.getElementById("case_by_transmission_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cas confirmés par moyen de transmission"));
    }
    node = document.getElementById("case_by_transmission_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Quotidiens"));
    }
    node = document.getElementById("case_by_transmission_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cumulés"));
    }
    node = document.getElementById("case_by_transmission_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Date du diagnostic"));
    }
    node = document.getElementById("case_by_transmission_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Date du début des sympt."));
    }
    
    
    node = document.getElementById("case_by_detection_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cas confirmés par canal de détection"));
    }
    node = document.getElementById("case_by_detection_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Quotidiens"));
    }
    node = document.getElementById("case_by_detection_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cumulés"));
    }
    node = document.getElementById("case_by_detection_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Date du diagnostic"));
    }
    node = document.getElementById("case_by_detection_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Date du début des sympt."));
    }
    
    
    node = document.getElementById("travel_history_symptom_correlations_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Corrélations entre antécédents de voyage & symptômes"));
    }
    node = document.getElementById("travel_history_symptom_correlations_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Coefficients"));
    }
    node = document.getElementById("travel_history_symptom_correlations_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Nombres"));
    }
    
    
    node = document.getElementById("age_symptom_correlations_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Corrélations entre âge & symptômes"));
    }
    node = document.getElementById("age_symptom_correlations_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Coefficients"));
    }
    node = document.getElementById("age_symptom_correlations_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Nombres"));
    }
    
    
    node = document.getElementById("test_by_criterion_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Nombre de tests par critère"));
    }
    node = document.getElementById("test_by_criterion_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Quotidiens"));
    }
    node = document.getElementById("test_by_criterion_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cumulés"));
    }
    
    
    node = document.getElementById("border_statistics_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Statistiques frontalières"));
    }
    node = document.getElementById("border_statistics_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Arrivée"));
    }
    node = document.getElementById("border_statistics_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Départ"));
    }
    node = document.getElementById("border_statistics_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Total"));
    }
    
    
    node = document.getElementById("criteria_timeline_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Chronologie des dépistages systématiques"));
    }
    node = document.getElementById("criteria_timeline_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Selectionnée"));
    }
    node = document.getElementById("criteria_timeline_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Complète"));
    }
    node = document.getElementById("criteria_timeline_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Frise"));
    }
    node = document.getElementById("criteria_timeline_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Disques"));
    }
    
    
    node = document.getElementById("event_timeline_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Chronologie de la pandémie"));
    }
    node = document.getElementById("event_timeline_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("1er jour dimanche"));
    }
    node = document.getElementById("event_timeline_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("1er jour lundi"));
    }
    
  }
  else {
    node = document.getElementById("title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("COVID-19 Statistics in Taiwan"));
    }
    node = document.getElementById("menu_summary")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("90-day dashboard"));
    }
    node = document.getElementById("menu_policy")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Policy"));
    }
    node = document.getElementById("menu_source")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Data Source"));
    }
    node = document.getElementById("menu_copyleft")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("No right reserved"));
    }
    node = document.getElementById("footer_last_update")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Last updates: ' + KN_wrap.timestamp));
      node.appendChild(document.createTextNode(' \u00A0 - \u00A0 Template by Start Bootstrap \u00A0 - \u00A0 Visualization by D3'));
    }
    
    
    node = document.getElementById("data_source_original_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Original dataset'));
    }
    node = document.getElementById("data_source_original_body")
    if (node !== null) {
      node.innerHTML = "<p>The <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>original dataset <i class='fas fa-external-link-alt'></i></a> is maintained by various anonymous users of the PTT forum, often considered as Taiwanese Reddit. They collect information from daily press releases and conferences, and sort them into comprehensive worksheets.</p><p>Obviously this website cannot be done without the goodwill of these volunteers that I am fully grateful to.</p><p>This dataset has been edited in Mandarin.</p>";
    }
    node = document.getElementById("data_source_raw_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Raw data'));
    }
    node = document.getElementById("data_source_raw_body")
    if (node !== null) {
      node.innerHTML = "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>Raw data <i class='fas fa-external-link-alt'></i></a> are 2 worksheets from the original set that are used here. The first one is a list of confirmed cases with available details; the other one is daily statistics in testing.</p><p>These are csv files containing Mandarin strings.</p>";
    }
    node = document.getElementById("data_source_processed_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode('Processed data'));
    }
    node = document.getElementById("data_source_processed_body")
    if (node !== null) {
      node.innerHTML = "<p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>Processed data <i class='fas fa-external-link-alt'></i></a> contain various files that are directly used by Javascript for plotting.</p><p>These are csv files. Most of them are ASCII-compatible.</p>";
    }
    
    
    TT_Add_Str("no_right_reserved_title", "Proudly No Right Reserved");
    TT_Add_Html("no_right_reserved_body", "<p>All texts and plots created by this site are released under <a href='https://creativecommons.org/publicdomain/zero/1.0/deed.en' target='_blank'>CC0 1.0 Universal Public Domain Dedication <i class='fas fa-external-link-alt'></i></a>.</p><p>That basically means you can do almost whatever you want with them: personal and commercial use, no permission or attribution needed.</p><p>The license for codes and scripts can be found <a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>here <i class='fas fa-external-link-alt'></i></a>.</p>");
    
    
    TT_Add_Str("status_evolution_title", "Status Evolution");
    
    TT_Add_Str("difference_by_transmission_title", "How many days to identify cases?");
    TT_Add_Str("difference_by_transmission_button_1", "All");
    TT_Add_Str("difference_by_transmission_button_2", "Imported");
    TT_Add_Str("difference_by_transmission_button_3", "Local");
    TT_Add_Str("difference_by_transmission_button_4", "Fleet");
    
    
    node = document.getElementById("case_by_transmission_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Confirmed Cases by Transmission Type"));
    }
    node = document.getElementById("case_by_transmission_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Daily"));
    }
    node = document.getElementById("case_by_transmission_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cumulative"));
    }
    node = document.getElementById("case_by_transmission_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Report date"));
    }
    node = document.getElementById("case_by_transmission_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Onset date"));
    }
    
    
    node = document.getElementById("case_by_detection_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Confirmed Cases by Detection Channel"));
    }
    node = document.getElementById("case_by_detection_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Daily"));
    }
    node = document.getElementById("case_by_detection_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cumulative"));
    }
    node = document.getElementById("case_by_detection_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Report date"));
    }
    node = document.getElementById("case_by_detection_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Onset date"));
    }
    
    
    node = document.getElementById("travel_history_symptom_correlations_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Correlations between Travel History & Symptoms"));
    }
    node = document.getElementById("travel_history_symptom_correlations_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Coefficients"));
    }
    node = document.getElementById("travel_history_symptom_correlations_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Counts"));
    }
    
    
    node = document.getElementById("age_symptom_correlations_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Correlations between Age & Symptoms"));
    }
    node = document.getElementById("age_symptom_correlations_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Coefficients"));
    }
    node = document.getElementById("age_symptom_correlations_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Counts"));
    }
    
    
    node = document.getElementById("test_by_criterion_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Number of Tests by Reporting Criterion"));
    }
    node = document.getElementById("test_by_criterion_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Daily"));
    }
    node = document.getElementById("test_by_criterion_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Cumulative"));
    }
    
    
    node = document.getElementById("border_statistics_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Border Crossing"));
    }
    node = document.getElementById("border_statistics_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Arrival"));
    }
    node = document.getElementById("border_statistics_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Departure"));
    }
    node = document.getElementById("border_statistics_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Both"));
    }
    
    
    node = document.getElementById("criteria_timeline_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Chronology of Systematic Testing"));
    }
    node = document.getElementById("criteria_timeline_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Selected"));
    }
    node = document.getElementById("criteria_timeline_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Full"));
    }
    node = document.getElementById("criteria_timeline_button_3")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Timeline"));
    }
    node = document.getElementById("criteria_timeline_button_4")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Disks"));
    }
    
    
    node = document.getElementById("event_timeline_title")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("Pandemic Timeline"));
    }
    node = document.getElementById("event_timeline_button_1")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("1st day Sunday"));
    }
    node = document.getElementById("event_timeline_button_2")
    if (node !== null) {
      node.textContent = '';
      node.appendChild(document.createTextNode("1st day Monday"));
    }
    
  }
}


//-- Load key nb
d3.csv("processed_data/key_numbers.csv", function(error, data) {
  if (error) return console.warn(error);
  
  var overallTot = 0;
  var timestamp;
  var i;
  
  for (i=0; i<data.length; i++) {
    if ('overall_total' == data[i]['key']) {
      overallTot = +data[i]['value'];
    }
    else if ('timestamp' == data[i]['key']) {
      timestamp = data[i]['value'];
    }
  }
  
  KN_wrap.overallTot = overallTot;
  KN_wrap.timestamp = timestamp;

  text_translation()
});


//-- Button listener
$(document).on("change", "input:radio[name='index_language']", function(event) {
  lang = this.value;
  Cookies.set("lang", lang);
  text_translation();
  
  d3.selectAll('.plot').remove()
  
  d3.csv(SE_wrap.dataPathList[0], function(error, data) {
    if (error) return console.warn(error);
    
    SE_makeCanvas();
    SE_formatData(data);
    SE_initialize();
    SE_update();
  });

  d3.csv(DBT_wrap.dataPathList[0], function(error, data) {
    d3.csv(DBT_wrap.dataPathList[1], function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      DBT_makeCanvas();
      DBT_formatData(data);
      DBT_formatData2(data2);
      DBT_initialize();
      DBT_update();
    });
  });
  
  d3.csv(CBT_wrap.dataPathList[CBT_wrap.doOnset], function(error, data) {
    d3.csv(CBT_wrap.dataPathList[2], function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBT_makeCanvas();
      CBT_formatData(data);
      CBT_formatData2(data2);
      CBT_initialize();
      CBT_update();
    });
  });
  
  d3.csv(CBD_wrap.dataPathList[CBD_wrap.doOnset], function(error, data) {
    d3.csv(CBD_wrap.dataPathList[2], function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      CBD_makeCanvas();
      CBD_formatData(data);
      CBD_formatData2(data2);
      CBD_initialize();
      CBD_update();
    });
  });
  
  d3.csv(THSC_wrap.dataPathList[THSC_wrap.doCount], function(error, data) {
    d3.csv(THSC_wrap.dataPathList[2], function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      THSC_makeCanvas();
      THSC_formatData(data);
      THSC_formatData2(data2);
      THSC_initialize();
      THSC_update();
    });
  });
  
  d3.csv(ASC_wrap.dataPathList[ASC_wrap.doCount], function(error, data) {
    d3.csv(ASC_wrap.dataPathList[2], function(error2, data2) {
      if (error) return console.warn(error);
      if (error2) return console.warn(error2);
      
      ASC_makeCanvas();
      ASC_formatData(data);
      ASC_formatData2(data2);
      ASC_initialize();
      ASC_update();
    });
  });

});

$(document).on("change", "input:radio[name='policy_language']", function(event) {
  lang = this.value;
  Cookies.set("lang", lang);
  text_translation();
  
  d3.selectAll('.plot').remove()
  
  d3.csv(TBC_wrap.dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    TBC_makeCanvas();
    TBC_formatData(data);
    TBC_initialize();
    TBC_update();
  });

  d3.csv(BS_wrap.dataPathList[BS_wrap.doExit], function(error, data) {
    if (error) return console.warn(error);
    
    BS_makeCanvas();
    BS_formatData(data);
    BS_initialize();
    BS_update();
  });

  d3.csv(CT_wrap.dataPathList[0], function(error, data) {
    if (error) return console.warn(error);
    
    CT_makeCanvas();
    CT_formatData(data);
    CT_initialize();
    CT_update();
  });
  
  d3.csv(ET_wrap.dataPathList[0], function(error, data) {
    if (error) return console.warn(error);
    
    ET_makeCanvas();
    ET_formatData(data);
    ET_initialize();
    ET_update();
  });

});

$(document).on("change", "input:radio[name='source_language']", function(event) {
  lang = this.value;
  Cookies.set("lang", lang);
  text_translation();
});

$(document).on("change", "input:radio[name='copyleft_language']", function(event) {
  lang = this.value;
  Cookies.set("lang", lang);
  text_translation();
});

