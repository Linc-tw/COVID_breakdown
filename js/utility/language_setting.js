
    //--------------------------------//
    //--  language_setting.js       --//
    //--  Chieh-An Lin              --//
    //--  2022.05.26                --//
    //--------------------------------//

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
  var str_2020;
  var str_2021;
  var str_2022;
  
  if (LS_lang == 'zh-tw') {
    str_latest = '近90日統計';
    str_overall = '整體統計';
    str_2020 = '2020統計';
    str_2021 = '2021統計';
    str_2022 = '2022統計';
  }
  
  else if (LS_lang == 'fr') {
    str_latest = '90 derniers jours';
    str_overall = 'Stat complète';
    str_2020 = 'Stat 2020';
    str_2021 = 'Stat 2021';
    str_2022 = 'Stat 2022';
  }
  
  else { //-- En
    str_latest = 'Last 90 days';
    str_overall = 'Overall stats';
    str_2020 = 'Stats 2020';
    str_2021 = 'Stats 2021';
    str_2022 = 'Stats 2022';
  }
  
  if (wrap.tag.includes('latest'))
    return str_latest;
  
  if (wrap.tag.includes('overall'))
    return str_overall;
  
  if (wrap.tag.includes('2020'))
    return str_2020;
  
  if (wrap.tag.includes('2021'))
    return str_2021;
  
  if (wrap.tag.includes('2022'))
    return str_2022;
  
  return '';
}

function LS_GetLegendTitle_Last(wrap) {
  var legend_title_dict = {
    'en': 'Latest value',
    'fr': 'Dernières données',
    'zh-tw': '最新資料',
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
  var str_2020;
  var str_2021;
  var str_2022;
  
  var str_cases;
  var str_incidence;
  var str_vaccination;
  var str_deaths;
  var str_others;
  var str_comparison;
  
  var str_timeline;
  var str_data_source;
  var str_no_right_reserved;
  var str_update;
  
  if (LS_lang == 'zh-tw') {
    str_title = '嚴重特殊傳染性肺炎 台灣疫情';
    str_index = '首頁';
    str_latest = '近90日統計';
    str_overall = '整體統計';
    str_2020 = '2020統計';
    str_2021 = '2021統計';
    str_2022 = '2022統計';
    
    str_cases = '確診分析';
    str_incidence = '盛行率比較';
    str_vaccination = '疫苗進度';
    str_deaths = '病故分析';
    str_others = '檢驗與邊境';
    str_comparison = '對比圖表';
    
    str_timeline = '時間軸';
    str_data_source = '資料來源';
    str_no_right_reserved = '版權沒有';
    str_update = '最後更新：' + LS_wrap.timestamp + ' \u00A0 - \u00A0 模板：Start Bootstrap \u00A0 - \u00A0 視覺化：D3';
    
  }
  
  else if (LS_lang == 'fr') {
    str_title = 'Statistiques de COVID-19 à Taïwan';
    str_index = 'Accueil';
    str_latest = '90 derniers jours';
    str_overall = 'Stat complète';
    str_2020 = 'Stat 2020';
    str_2021 = 'Stat 2021';
    str_2022 = 'Stat 2022';
    
    str_cases = 'Cas confirmés';
    str_incidence = "Taux d'incidence";
    str_vaccination = 'Vaccination';
    str_deaths = 'Décès';
    str_others = 'Tests & frontière';
    str_comparison = 'Comparaison';
    
    str_timeline = 'Chronologie';
    str_data_source = 'Sources des données';
    str_no_right_reserved = "Sans droit d'auteur";
    str_update = 'Dernière mise à jour : ' + LS_wrap.timestamp + ' \u00A0 - \u00A0 Modèle : Start Bootstrap \u00A0 - \u00A0 Visualisation : D3';
  }
  
  else { //-- En
    str_title = 'COVID-19 Statistics in Taiwan';
    str_index = 'Home';
    str_latest = 'Last 90 days';
    str_overall = 'Overall stats';
    str_2020 = 'Stats 2020';
    str_2021 = 'Stats 2021';
    str_2022 = 'Stats 2022';
    
    str_cases = 'Confirmed cases';
    str_incidence = 'Incidence rates';
    str_vaccination = 'Vaccination';
    str_deaths = 'Deaths';
    str_others = 'Tests & border';
    str_comparison = 'Comparison';
    
    str_timeline = 'Timeline';
    str_data_source = 'Data Sources';
    str_no_right_reserved = 'No right reserved';
    str_update = 'Last update: ' + LS_wrap.timestamp + ' \u00A0 - \u00A0 Template by Start Bootstrap \u00A0 - \u00A0 Visualization by D3';
  }
  
  //-- Menu
  LS_AddStr('menu_index', str_index);
  LS_AddStr('menu_latest', str_latest);
  LS_AddStr('menu_latest_cases', str_cases);
  LS_AddStr('menu_latest_incidence', str_incidence);
  LS_AddStr('menu_latest_vaccination', str_vaccination);
  LS_AddStr('menu_latest_deaths', str_deaths);
  LS_AddStr('menu_latest_others', str_others);
  LS_AddStr('menu_latest_comparison', str_comparison);
  LS_AddStr('menu_overall', str_overall);
  LS_AddStr('menu_overall_cases', str_cases);
  LS_AddStr('menu_overall_incidence', str_incidence);
  LS_AddStr('menu_overall_vaccination', str_vaccination);
  LS_AddStr('menu_overall_deaths', str_deaths);
  LS_AddStr('menu_overall_others', str_others);
  LS_AddStr('menu_overall_comparison', str_comparison);
  LS_AddStr('menu_timeline', str_timeline);
  LS_AddStr('menu_source', str_data_source);
  LS_AddStr('menu_copyleft', str_no_right_reserved);
  
  //-- Header + footer
  LS_AddStr('title', str_title);
  LS_AddStr('title_index', str_index);
  LS_AddStr('title_latest_cases', str_latest + ' - ' + str_cases);
  LS_AddStr('title_latest_incidence', str_latest + ' - ' + str_incidence);
  LS_AddStr('title_latest_vaccination', str_latest + ' - ' + str_vaccination);
  LS_AddStr('title_latest_deaths', str_latest + ' - ' + str_deaths);
  LS_AddStr('title_latest_others', str_latest + ' - ' + str_others);
  LS_AddStr('title_latest_comparison', str_latest + ' - ' + str_comparison);
  LS_AddStr('title_overall_cases', str_overall + ' - ' + str_cases);
  LS_AddStr('title_overall_incidence', str_overall + ' - ' + str_incidence);
  LS_AddStr('title_overall_vaccination', str_overall + ' - ' + str_vaccination);
  LS_AddStr('title_overall_deaths', str_overall + ' - ' + str_deaths);
  LS_AddStr('title_overall_others', str_overall + ' - ' + str_others);
  LS_AddStr('title_overall_comparison', str_overall + ' - ' + str_comparison);
  LS_AddStr('title_timeline', str_timeline);
  LS_AddStr('title_data_source', str_data_source);
  LS_AddStr('title_no_right_reserved', str_no_right_reserved);
  LS_AddStr('footer_last_update', str_update);
  
  //-- Index
  LS_AddStr('vignette_title_cases', str_cases);
  LS_AddStr('vignette_title_incidence', str_incidence);
  LS_AddStr('vignette_title_vaccination', str_vaccination);
  LS_AddStr('vignette_title_deaths', str_deaths);
  LS_AddStr('vignette_title_others', str_others);
  LS_AddStr('vignette_title_comparison', str_comparison);
  LS_AddStr('vignette_latest_cases', str_latest);
  LS_AddStr('vignette_latest_incidence', str_latest);
  LS_AddStr('vignette_latest_vaccination', str_latest);
  LS_AddStr('vignette_latest_deaths', str_latest);
  LS_AddStr('vignette_latest_others', str_latest);
  LS_AddStr('vignette_latest_comparison', str_latest);
  LS_AddStr('vignette_overall_cases', str_overall);
  LS_AddStr('vignette_overall_incidence', str_overall);
  LS_AddStr('vignette_overall_vaccination', str_overall);
  LS_AddStr('vignette_overall_deaths', str_overall);
  LS_AddStr('vignette_overall_others', str_overall);
  LS_AddStr('vignette_overall_comparison', str_overall);
}

function LS_FillText_Source() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('data_source_original_title', '資料來源');
    LS_AddHtml('data_source_original_body', "\
      本站視覺化所使用之資料來源如下：\
      <ul>\
          <li>由網友維護的Google表格</li>\
          <li>衛生福利部疾病管制署（CDC）</li>\
          <li>國家高速網路與計算中心（NCHC）</li>\
          <li>衛生福利部食品藥物管理署（FDA）</li>\
          <li>內政部戶政司</li>\
      </ul>\
      <p>其他細節請參考<a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>\
      初階資料 <i class='fas fa-external-link-alt'></i></a>\
      和<a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>\
      高階資料 <i class='fas fa-external-link-alt'></i></a> \
      的<tt>README.md</tt>。</p>\
    ");
    LS_AddStr('data_source_raw_title', '初階資料');
    LS_AddHtml('data_source_raw_body', "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'> \
      初階資料 <i class='fas fa-external-link-alt'></i></a> 是前面所提資料來源之部份分頁或檔案，目前共有9個<tt>csv</tt>檔。</p>\
    ");
    LS_AddStr('data_source_processed_title', '高階資料');
    LS_AddHtml('data_source_processed_body', "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'> \
      高階資料 <i class='fas fa-external-link-alt'></i></a> 為整理過後直接用來畫圖的檔案。絕大多數為<tt>csv</tt>檔，由低階資料處理後生成，另有一<tt>geojson</tt>檔為微調過之台灣地圖。</p>\
      <p>除經特殊標示外，所有高階資料編碼皆符合ASCII格式。</p>\
    ");
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('data_source_original_title', 'Sources des données');
    LS_AddHtml('data_source_original_body', "\
      La visualisation faite sur ce site est basée sur les données recueillies des sources suivantes :\
      <ul>\
          <li>un <i>Google Spreadsheet</i> maintenu par la foule,</li>\
          <li>Centres pour le contrôle et la prévention des maladies (CDC),</li>\
          <li>Centre national pour le calcul de haute performance</i> (NCHC),</li>\
          <li>Agence des produits alimentaires et médicamenteux (FDA) et </li>\
          <li>Ministère de l'Intérieur (MOI).</li>\
      </ul>\
      <p>Voir <tt>README.md</tt> des <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>données brutes <i class='fas fa-external-link-alt'></i></a> \
      et des <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>données traitées <i class='fas fa-external-link-alt'></i></a> \
      pour les details.</p>\
    ");
    LS_AddStr('data_source_raw_title', 'Données brutes');
    LS_AddHtml('data_source_raw_body', "\
      <p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>\
      données brutes <i class='fas fa-external-link-alt'></i></a> \
      sont un sous-ensemble des fichiers provenant des 2 sources des données mentionnées auparavant.</p>\
      <p>À ce stade, 9 fichiers <tt>csv</tt> y figurent. Ces données contiennent des caractères mandarins en abondance.</p>\
    ");
    LS_AddStr('data_source_processed_title', 'Données traitées');
    LS_AddHtml('data_source_processed_body', "\
      <p>Les <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>\
      données traitées <i class='fas fa-external-link-alt'></i></a> \
      comprennent de nombreux fichiers directement utilisés pour afficher les figures.</p>\
      <p>Tous les fichiers <tt>csv</tt> sont générés à partir des données brutes par un script. \
      Une carte de Taïwan retouchée sous format <tt>geojson</tt> est également ajoutée.</p>\
      <p>Sauf précision, tous les fichiers ici ne contiennent que les caractères ASCII.</p>\
    ");
  }
  
  else { //-- En
    LS_AddStr('data_source_original_title', 'Data Sources');
    LS_AddHtml('data_source_original_body', "\
      The visualization of this website is based on data collected from the following sources:\
      <ul>\
          <li>a crowdsourced Google Spreadsheet,</li>\
          <li>Centers for Disease Control (CDC),</li>\
          <li>National Center for High-performance Computing (NCHC),</li>\
          <li>Food and Drug Administration (FDA), and </li>\
          <li>Ministry of the Interior (MOI).</li>\
      </ul>\
      <p>See <tt>README.md</tt> of <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>raw data <i class='fas fa-external-link-alt'></i></a> \
      and <a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>processed data <i class='fas fa-external-link-alt'></i></a> \
      for details.</p>\
    ");
    LS_AddStr("data_source_raw_title", "Raw data");
    LS_AddHtml("data_source_raw_body", "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data' target='_blank'>\
      Raw data <i class='fas fa-external-link-alt'></i></a> \
      are a subset of files or spreadsheets from 2 data sources mentioned earlier that have been used by this website.</p>\
      <p>There are 9 <tt>csv</tt> files at this stage. These files contain abundant Mandarin strings.</p>\
    ");
    LS_AddStr("data_source_processed_title", "Processed data");
    LS_AddHtml("data_source_processed_body", "\
      <p><a href='https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data' target='_blank'>\
      Processed data <i class='fas fa-external-link-alt'></i></a> \
      contain various files that are directly used for plotting.</p>\
      <p>All <tt>csv</tt> files were generated from raw data by executing a script. \
      A <tt>geojson</tt> file containing a modified version of Taiwan map is also added.</p>\
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
