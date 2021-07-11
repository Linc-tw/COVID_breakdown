
//-- Filename:
//--   language_setting.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- Variable declarations - language setting

var LS_wrap = {}; //-- For timestamp

var LS_lang = Cookies.get('lang'); // 'en', 'fr', 'zh-tw'

if (!LS_lang) {
  LS_lang = 'en';
  Cookies.set('lang', LS_lang, {sameSite: 'lax'});
}

var LS_lang_btn = document.getElementById('menu_lang_'+LS_lang);
LS_lang_btn.classList.add('active');

//------------------------------------------------------------------------------
//-- Function declarations - label

function LS_ISODateToMDDate(iso_date) {
  var mmdd_format_dict = {
    'en': d3.timeFormat('%b %d'),
    'fr': d3.timeFormat('%d/%m'),
    'zh-tw': d3.timeFormat('%m/%d'),
  };
  var date = d3.isoParse(iso_date);
  return mmdd_format_dict[LS_lang](date);
}

function LS_GetLegendTitle_Page(wrap) {
  var str_latest;
  var str_overall;
  var str_2021;
  var str_2020;
  
  if (LS_lang == 'zh-tw') {
    str_latest = '近90日統計';
    str_overall = '整體統計';
    str_2021 = '2021統計';
    str_2020 = '2020統計';
  }
  
  else if (LS_lang == 'fr') {
    str_latest = '90 derniers jours';
    str_overall = 'Stat complète';
    str_2021 = 'Stat 2021';
    str_2020 = 'Stat 2020';
  }
  
  else { //-- En
    str_latest = 'Last 90 days';
    str_overall = 'Overall stats';
    str_2021 = 'Stats 2021';
    str_2020 = 'Stats 2020';
  }
  
  if (wrap.tag.includes('latest'))
    return str_latest;
  
  if (wrap.tag.includes('overall'))
    return str_overall;
  
  if (wrap.tag.includes('2021'))
    return str_2021;
  
  if (wrap.tag.includes('2020'))
    return str_2020;
  
  return '';
}

function LS_GetLegendTitle_Last(wrap) {
  var legend_title_dict = {
    'en': 'Latest value',
    'fr': 'Dernières données',
    'zh-tw': '最新數據',
  };
  return legend_title_dict[LS_lang];
}

//------------------------------------------------------------------------------
//-- Function declarations - html content

//-- Insert plain text
function LS_AddStr(id, string) {
  var node = document.getElementById(id)
  if (null !== node) {
    node.textContent = '';
    node.appendChild(document.createTextNode(string));
  }
}

//-- Insert html
function LS_AddHtml(id, string) {
  var node = document.getElementById(id)
  if (null !== node) {
    node.textContent = '';
    node.innerHTML = string;
  }
}

//------------------------------------------------------------------------------
//-- Function declarations - page

function LS_FillText_Menu() {
  var str_title;
  var str_index;
  var str_latest;
  var str_overall;
  var str_cases;
  var str_incidence;
  var str_vaccination;
  var str_others;
  var str_timeline;
  var str_source;
  var str_copyleft;
  var str_slow;
  
  var str_2021;
  var str_2020;
  var str_highlight;
  
  if (LS_lang == 'zh-tw') {
    str_title = '嚴重特殊傳染性肺炎 台灣疫情';
    str_index = '首頁';
    str_latest = '近90日統計';
    str_overall = '整體統計';
    str_cases = '個案分析';
    str_incidence = '感染率比較';
    str_vaccination = '疫苗進度';
    str_others = '其他統計';
    str_timeline = '時間軸';
    str_source = '資料來源';
    str_copyleft = '版權沒有';
    str_slow = '載入費時';
    str_update = '最後更新：' + LS_wrap.timestamp + ' \u00A0 - \u00A0 模板：Start Bootstrap \u00A0 - \u00A0 視覺化：D3';
    
    str_2021 = '2021統計';
    str_2020 = '2020統計';
    str_highlight = '儀表板';
  }
  
  else if (LS_lang == 'fr') {
    str_title = 'Statistiques de COVID-19 à Taïwan';
    str_index = 'Accueil';
    str_latest = '90 derniers jours';
    str_overall = 'Stat complète';
    str_cases = 'Analyse des cas';
    str_incidence = "Taux d'incidence";
    str_vaccination = 'Vaccination';
    str_others = 'Stats diverses';
    str_timeline = 'Chronologie';
    str_source = 'Sources des données';
    str_copyleft = "Sans droit d'auteur";
    str_slow = 'chargement lent';
    str_update = 'Dernière mise à jour : ' + LS_wrap.timestamp + ' \u00A0 - \u00A0 Modèle : Start Bootstrap \u00A0 - \u00A0 Visualisation : D3';
    
    str_2021 = 'Stat 2021';
    str_2020 = 'Stat 2020';
    str_highlight = 'Mise au point';
  }
  
  else { //-- En
    str_title = 'COVID-19 Statistics in Taiwan';
    str_index = 'Home';
    str_latest = 'Last 90 days';
    str_overall = 'Overall stats';
    str_cases = 'Case breakdown';
    str_incidence = 'Incidence rates';
    str_vaccination = 'Vaccination';
    str_others = 'Other stats';
    str_timeline = 'Timeline';
    str_source = 'Data Sources';
    str_copyleft = 'No right reserved';
    str_slow = 'slow loading';
    str_update = 'Last update: ' + LS_wrap.timestamp + ' \u00A0 - \u00A0 Template by Start Bootstrap \u00A0 - \u00A0 Visualization by D3';
    
    str_2021 = 'Stats 2021';
    str_2020 = 'Stats 2020';
    str_highlight = 'Highlight';
  }
  
  //-- Menu
  LS_AddStr('menu_index', str_index);
  LS_AddStr('menu_latest', str_latest);
  LS_AddStr('menu_latest_cases', str_cases);
  LS_AddStr('menu_latest_incidence', str_incidence);
  LS_AddStr('menu_latest_vaccination', str_vaccination);
  LS_AddStr('menu_latest_others', str_others);
  LS_AddStr('menu_overall', str_overall);
  LS_AddStr('menu_overall_cases', str_cases);
  LS_AddStr('menu_overall_incidence', str_incidence);
  LS_AddStr('menu_overall_vaccination', str_vaccination);
  LS_AddStr('menu_overall_others', str_others);
  LS_AddStr('menu_timeline', str_timeline);
  LS_AddStr('menu_source', str_source);
  LS_AddStr('menu_copyleft', str_copyleft);
  
  LS_AddStr('menu_latest_highlight', str_highlight);
  LS_AddStr('menu_latest_breakdown', str_cases);
  LS_AddStr('menu_2021', str_2021);
  LS_AddStr('menu_2021_breakdown', str_cases);
  LS_AddStr('menu_2021_incidence', str_incidence);
  LS_AddStr('menu_2021_others', str_others);
  LS_AddStr('menu_2020', str_2020);
  LS_AddStr('menu_2020_breakdown', str_cases);
  LS_AddStr('menu_2020_incidence', str_incidence);
  LS_AddStr('menu_2020_others', str_others);
  
  //-- Header + footer
  LS_AddStr('title', str_title);
  LS_AddStr('title_index', str_index);
  LS_AddStr('title_latest_cases', str_latest + ' - ' + str_cases);
  LS_AddStr('title_latest_incidence', str_latest + ' - ' + str_incidence);
  LS_AddStr('title_latest_vaccination', str_latest + ' - ' + str_vaccination);
  LS_AddStr('title_latest_others', str_latest + ' - ' + str_others);
  LS_AddStr('title_overall_cases', str_overall + ' - ' + str_cases);
  LS_AddStr('title_overall_incidence', str_overall + ' - ' + str_incidence);
  LS_AddStr('title_overall_vaccination', str_overall + ' - ' + str_vaccination);
  LS_AddStr('title_overall_others', str_overall + ' - ' + str_others);
  LS_AddStr('title_timeline', str_timeline);
  LS_AddStr('title_source', str_source);
  LS_AddStr('title_copyleft', str_copyleft);
  LS_AddStr('footer_last_update', str_update);
  
  LS_AddStr('title_latest_highlight', str_latest + ' - ' + str_highlight);
  LS_AddStr('title_latest_breakdown', str_latest + ' - ' + str_cases);
  LS_AddStr('title_2021_breakdown', str_2021 + ' - ' + str_cases);
  LS_AddStr('title_2021_incidence', str_2021 + ' - ' + str_incidence);
  LS_AddStr('title_2021_others', str_2021 + ' - ' + str_others);
  LS_AddStr('title_2020_breakdown', str_2020 + ' - ' + str_cases);
  LS_AddStr('title_2020_incidence', str_2020 + ' - ' + str_incidence);
  LS_AddStr('title_2020_others', str_2020 + ' - ' + str_others);
}

function LS_FillText_Source() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('data_source_original_title', '資料來源');
    LS_AddHtml('data_source_original_body', "\
      <p>目前本站資料是由三種不同管道所取得。</p>\
      <p>主要來源為一份由PTT網友們所整理的線上\
      <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'> \
      Google表單 <i class='fas fa-external-link-alt'></i></a> 。作者們利用網路爬蟲獲取資料，同時也從官方新聞稿及記者會收集瑣碎資訊，整理後彙整至表單內。</p>\
      <p>在此由衷感謝資料整理團隊，若無如此熱心之舉本站勢必難以完成。</p>\
      <p>資料來源二是疾管署<a href='https://data.cdc.gov.tw/zh_TW/' target='_blank'> \
      官方資料平台 <i class='fas fa-external-link-alt'></i></a> 。很可惜平台上的資料多半乏善可陳，因此才以非官方表單作為主要資料來源。</p>\
      <p>第三來源是國網中心的\
      <a href='https://covid-19.nchc.org.tw/index.php' target='_blank'>\
      疫情儀表板 <i class='fas fa-external-link-alt'></i></a> 。國網中心會將部份官方資料整理後開放下載，有些可能也是透過爬蟲取得的。</p>\
    ");
    LS_AddStr('data_source_raw_title', '初階資料');
    LS_AddHtml('data_source_raw_body', "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'> \
      初階資料 <i class='fas fa-external-link-alt'></i></a> 是前面所提資料來源之部份分頁或檔案。目前共有6個csv和1個json檔，最主要者為一記有所有確診者及其相關流行病學資訊之表單。</p>\
    ");
    LS_AddStr('data_source_processed_title', '高階資料');
    LS_AddHtml('data_source_processed_body', "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'> \
      高階資料 <i class='fas fa-external-link-alt'></i></a> 為整理過後直接用來畫圖的檔案。絕大多數為csv檔，由低階資料處理後生成，另有一geojson檔為微調過之台灣地圖。</p>\
      <p>除經特殊標示外，所有高階資料編碼皆符合ASCII格式。</p>\
    ");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('data_source_original_title', 'Sources des données');
    LS_AddHtml('data_source_original_body', "\
      <p>À ce stade, ce site recueille les données à partir de 3 sources.</p>\
      <p>La source principale est un \
      <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>\
      Google Spreadsheet <i class='fas fa-external-link-alt'></i></a> \
      entretenu par de nombreux internautes anonymes du forum PTT, souvent considéré comme le <i>Reddit</i> taïwanais. \
      Ils font du crawling pour récolter des données. \
      Ils rassemblent également des informations fragmentées à partir des communiqués et des conférences de presse. \
      Ils les trient ensuite avant de les mettre dans un tableau bien taillé.</p>\
      <p>Bien évidemment, ce site n'aurait pas pu voir le jour sans le travail de ces bénévoles bienveillants. Je leur en suis très reconnaissant.</p>\
      <p>La source secondaire est le <a href='https://data.cdc.gov.tw/zh_TW/' target='_blank'>\
      plateform des données officiel <i class='fas fa-external-link-alt'></i></a> du Centre du contrôle des maladies (CDC) taïwanais, \
      qui fournit malheureusement peu de données intéressantes. \
      C'est pour cette raison que la source principale n'est pas celle qui est officielle.</p>\
      <p>La 3e source est le <a href='https://covid-19.nchc.org.tw/index.php' target='_blank'>\
      tableau de bord <i class='fas fa-external-link-alt'></i></a> du Centre national de calcul de haute performance (NCHC).\
      Le site redistribue les données officielles qui sont parfois éphémères, peut-être aussi récoltées grâce au crawling.</p>\
      <p>Les données des 3 sources sont toutes en mandarin.</p>\
    ");
    LS_AddStr('data_source_raw_title', 'Données brutes');
    LS_AddHtml('data_source_raw_body', "\
      <p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>\
      données brutes <i class='fas fa-external-link-alt'></i></a> \
      sont un sous-ensemble des fichiers provenant des 2 sources des données mentionnées auparavant.</p>\
      <p>À ce stade, 6 fichiers csv et 1 fichier json y figurent. Le fichier principal est une liste de tous cas confirmés avec leurs détails épidémiologiques respectifs.</p>\
      <p>Ces données contiennent des caractères mandarins en abondance.</p>\
    ");
    LS_AddStr('data_source_processed_title', 'Données traitées');
    LS_AddHtml('data_source_processed_body', "\
      <p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>\
      données traitées <i class='fas fa-external-link-alt'></i></a> \
      comprennent de nombreux fichiers directement utilisés pour afficher les figures.</p>\
      <p>Tous les fichiers csv sont générés à partir des données brutes par un script. \
      Une carte de Taïwan retouchée sous format geojson est également ajoutée.</p>\
      <p>Sauf précision, tous les fichiers ici ne contiennent que les caractères ASCII.</p>\
    ");
  }
  
  else { //-- En
    LS_AddStr('data_source_original_title', 'Data Sources');
    LS_AddHtml('data_source_original_body', "\
      <p>At this stage, this website collects data from 3 sources.</p>\
      <p>The principle source is a \
      <a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#' target='_blank'>\
      Google Spreadsheet <i class='fas fa-external-link-alt'></i></a> \
      maintained by various anonymous users of the PTT forum, often considered as Taiwanese Reddit. \
      They crawl to harvest data from official sites. \
      They also collect fragmental information from daily press releases and conferences, and sort them into comprehensive worksheets.</p>\
      <p>Obviously this website cannot be done without the goodwill of these volunteers that I am fully grateful to.</p>\
      <p>The second source is Taiwan Centers for Disease Control (CDC)'s <a href='https://data.cdc.gov.tw/zh_TW/' target='_blank'>\
      official data platform <i class='fas fa-external-link-alt'></i></a>, which unfortunately doesn't provide many meaningful datasets. \
      This is why the principle source is not the official one.</p>\
      <p>The third source is National Center for High-performance Computing (NCHC)'s \
      <a href='https://covid-19.nchc.org.tw/index.php' target='_blank'>\
      dashboard <i class='fas fa-external-link-alt'></i></a>.\
      The site redistributes ephemeral official data, possibly also by crawling.</p>\
      <p>All sources provide data in Mandarin.</p>\
    ");
    LS_AddStr("data_source_raw_title", "Raw data");
    LS_AddHtml("data_source_raw_body", "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>\
      Raw data <i class='fas fa-external-link-alt'></i></a> \
      are a subset of files or spreadsheets from 2 data sources mentioned earlier that have been used by this website.</p>\
      <p>There are 6 csv files & 1 json file at this stage. The main one is a list of every single confirmed cases with their epidemiological details.</p>\
      <p>These files contain abundant Mandarin strings.</p>\
    ");
    LS_AddStr("data_source_processed_title", "Processed data");
    LS_AddHtml("data_source_processed_body", "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>\
      Processed data <i class='fas fa-external-link-alt'></i></a> \
      contain various files that are directly used for plotting.</p>\
      <p>All csv files were generated from raw data by executing a script. \
      A geojson file containing a modified version of Taiwan map is also added.</p>\
      <p>All files here only contain ASCII characters unless specified.</p>\
    ");
  }
}

function LS_FillText_Copyleft() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr("no_right_reserved_title", "啊就真的沒有版權");
    LS_AddHtml("no_right_reserved_body", "\
      <p>本站所創作之所有文字及圖像均以<a href='https://creativecommons.org/publicdomain/zero/1.0/deed.zh_TW' target='_blank'>\
      CC0 1.0 通用 公眾領域貢獻宣告 <i class='fas fa-external-link-alt'></i></a> 條款發布。</p>\
      <p>意即使用者可自由用作營利或非營利之途，且不需經許可或標示來源。</p>\
      <p>原始碼授權條款請洽此<a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>連結 <i class='fas fa-external-link-alt'></i></a>。</p>\
    ");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr("no_right_reserved_title", "Fièrement sans droit d'auteur");
    LS_AddHtml("no_right_reserved_body", "\
      <p>Tous les textes et les graphes créés sur ce site sont distribués sous \
      <a href='https://creativecommons.org/publicdomain/zero/1.0/deed.fr' target='_blank'>\
      CC0 1.0 universel Transfert dans le Domaine Public <i class='fas fa-external-link-alt'></i></a>.</p>\
      <p>Cela signifie que vous pouvez en faire presque tout ce que vous voulez : usages personnel et/ou commercial, sans avoir besoin d'autorisation ou d'attribution d'auteur.</p>\
      <p>La license pour les codes et les scripts se trouve \
      <a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>\
      ici <i class='fas fa-external-link-alt'></i></a>.</p>\
    ");
  }
  
  else { //-- En
    LS_AddStr("no_right_reserved_title", "Proudly No Right Reserved");
    LS_AddHtml("no_right_reserved_body", "\
      <p>All texts and plots created by this site are released under \
      <a href='https://creativecommons.org/publicdomain/zero/1.0/deed.en' target='_blank'>\
      CC0 1.0 Universal Public Domain Dedication <i class='fas fa-external-link-alt'></i></a>.</p>\
      <p>That basically means you can do almost whatever you want with them: personal and commercial use, no permission or attribution needed.</p>\
      <p>The license for codes and scripts can be found \
      <a href='https://github.com/Linc-tw/COVID_breakdown/blob/master/README.md' target='_blank'>\
      here <i class='fas fa-external-link-alt'></i></a>.</p>\
    ");
  }
}

function LS_FillText_Main() {
  LS_FillText_Menu();
  
  if (window.location.pathname.includes('data_source.htm'))
    LS_FillText_Source();
  
  else if (window.location.pathname.includes('no_right_reserved.htm'))
    LS_FillText_Copyleft();
}

//-- End of file
//------------------------------------------------------------------------------
