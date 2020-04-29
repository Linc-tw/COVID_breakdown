//-- Language settings
var lang = Cookies.get("lang"); // 'en', 'fr', 'zh-tw'
if (!lang) {
  lang = "en";
  Cookies.set("lang", lang);
}

let el = document.getElementById('lang_'+lang);
el.classList.add("active");


//-- Glocal settings
var cList = ['#3366BB', '#CC6677', '#55BB44', '#DDAA77', '#AA55AA', '#44AA99'];
var wrap = {};


//-- General functions
function ISODateToMDDate(ISODate) {
  var fmtStr;
  if (lang == 'zh-tw') fmtStr = "%-m月%-d日"
  else fmtStr = "%b %d"
  
  var MDDateFormat = d3.timeFormat(fmtStr);
  return MDDateFormat(d3.isoParse(ISODate));
}

function cumsum(data, colTagList) {
  var i, j;
  for (i=1; i<data.length; i++) {
    for (j=0; j<colTagList.length; j++) {
      data[i][colTagList[j]] = +data[i][colTagList[j]] + +data[i-1][colTagList[j]];
    }
  }
}


//-- Tooltip
var copyleft_tooltip = d3.select('#menu_copyleft_2')
  .append("div")
  .attr("class", "tooltip")

function copyleft_mouseover(d) {
  copyleft_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.8)
}

function copyleft_mousemove(d) {
  var newPos = d3.mouse(this);
  newPos[1] += 30;
  
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = "版權沒有<br>翻印不究<br>不需署名<br>敬請亂用"
  else
    tooltipText = "Proudly no right reserved"
  
  console.log(newPos)
  
  copyleft_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function copyleft_mouseleave(d) {
  copyleft_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

d3.select('#menu_copyleft')
    .on("mouseover", copyleft_mouseover)
    .on("mousemove", copyleft_mousemove)
    .on("mouseleave", copyleft_mouseleave)


//-- Text in html
var node;

function text_translation() {
  if (lang == 'zh-tw') {
    node = document.getElementById("title")
    node.textContent = '';
    node.appendChild(document.createTextNode("嚴重特殊傳染性肺炎 台灣疫情"));
    
    node = document.getElementById("menu_summary")
    node.textContent = '';
    node.appendChild(document.createTextNode("摘要"));
    
    node = document.getElementById("menu_source")
    node.textContent = '';
    node.appendChild(document.createTextNode("資料來源"));
    
    node = document.getElementById("menu_copyleft")
    node.textContent = '';
    node.appendChild(document.createTextNode("版權沒有"));
    
    node = document.getElementById("last_update")
    node.textContent = '';
    node.appendChild(document.createTextNode('最後更新：' + wrap.timestamp));
    
    
    
    node = document.getElementById("case_by_transmission_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("依感染源之確診人數"));
    
    node = document.getElementById("case_by_transmission_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("逐日"));
    
    node = document.getElementById("case_by_transmission_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("累計"));
    
    node = document.getElementById("case_by_transmission_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("確診日"));
    
    node = document.getElementById("case_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("發病日"));
    
    
    
    node = document.getElementById("case_by_detection_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("依檢驗管道之確診人數"));
    
    node = document.getElementById("case_by_detection_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("逐日"));
    
    node = document.getElementById("case_by_detection_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("累計"));
    
    node = document.getElementById("case_by_detection_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("確診日"));
    
    node = document.getElementById("case_by_detection_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("發病日"));
    
    
    
    node = document.getElementById("test_by_criterion_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("檢驗數量"));
    
    node = document.getElementById("test_by_criterion_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("逐日"));
    
    node = document.getElementById("test_by_criterion_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("累計"));
    
    
    
    node = document.getElementById("difference_by_transmission_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("抓帶原者要花多久？"));
    
    node = document.getElementById("difference_by_transmission_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("全部"));
    
    node = document.getElementById("difference_by_transmission_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("境外移入"));
    
    node = document.getElementById("difference_by_transmission_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("本土"));
    
    node = document.getElementById("difference_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("敦睦艦隊"));
    
    
    
    node = document.getElementById("travel_history_symptom_correlations_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("境外移入之旅遊史與症狀之相關性"));
    
    node = document.getElementById("travel_history_symptom_correlations_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("相關係數"));
    
    node = document.getElementById("travel_history_symptom_correlations_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("案例數"));
    
    
    
    node = document.getElementById("age_symptom_correlations_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("個案年齡與症狀之相關性"));
    
    node = document.getElementById("age_symptom_correlations_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("相關係數"));
    
    node = document.getElementById("age_symptom_correlations_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("案例數"));
    
  }
  else if (lang == 'fr') {
    node = document.getElementById("title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Statistiques de COVID-19 à Taïwan"));
    
    node = document.getElementById("menu_summary")
    node.textContent = '';
    node.appendChild(document.createTextNode("Résumé"));
    
    node = document.getElementById("menu_source")
    node.textContent = '';
    node.appendChild(document.createTextNode("Source des données"));
    
    node = document.getElementById("menu_copyleft")
    node.textContent = '';
    node.appendChild(document.createTextNode("Gauche d'auteur"));
    
    node = document.getElementById("last_update")
    node.textContent = '';
    node.appendChild(document.createTextNode('Dernière mise à jour : ' + wrap.timestamp));
    
    
    
    node = document.getElementById("case_by_transmission_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cas confirmés par moyen de transmission"));
    
    node = document.getElementById("case_by_transmission_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Quotidien"));
    
    node = document.getElementById("case_by_transmission_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulé"));
    
    node = document.getElementById("case_by_transmission_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Date du diagnostic"));
    
    node = document.getElementById("case_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("Date d'apparition des symptômes"));
    
    
    
    node = document.getElementById("case_by_detection_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cas confirmés par canal de détection"));
    
    node = document.getElementById("case_by_detection_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Quotidien"));
    
    node = document.getElementById("case_by_detection_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulé"));
    
    node = document.getElementById("case_by_detection_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Date du diagnostic"));
    
    node = document.getElementById("case_by_detection_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("Date d'apparition des symptômes"));
    
    
    
    node = document.getElementById("test_by_criterion_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Nombre des tests par critère"));
    
    node = document.getElementById("test_by_criterion_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Quotidien"));
    
    node = document.getElementById("test_by_criterion_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulé"));
    
    
    
    node = document.getElementById("difference_by_transmission_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Combien de temps pour identifier les cas?"));
    
    node = document.getElementById("difference_by_transmission_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Tous"));
    
    node = document.getElementById("difference_by_transmission_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Importé"));
    
    node = document.getElementById("difference_by_transmission_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Local"));
    
    node = document.getElementById("difference_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("Flotte"));
    
    
    
    node = document.getElementById("travel_history_symptom_correlations_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Corrélations entre antécédents de voyage & symptômes"));
    
    node = document.getElementById("travel_history_symptom_correlations_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cœfficient"));
    
    node = document.getElementById("travel_history_symptom_correlations_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Comptage"));
    
    
    
    node = document.getElementById("age_symptom_correlations_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Corrélations entre âge & symptômes"));
    
    node = document.getElementById("age_symptom_correlations_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cœfficient"));
    
    node = document.getElementById("age_symptom_correlations_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Comptage"));
    
  }
  else {
    node = document.getElementById("title")
    node.textContent = '';
    node.appendChild(document.createTextNode("COVID-19 Statistics in Taiwan"));
    
    node = document.getElementById("menu_summary")
    node.textContent = '';
    node.appendChild(document.createTextNode("Summary"));
    
    node = document.getElementById("menu_source")
    node.textContent = '';
    node.appendChild(document.createTextNode("Data Source"));
    
    node = document.getElementById("menu_copyleft")
    node.textContent = '';
    node.appendChild(document.createTextNode("Copyleft"));
    
    node = document.getElementById("last_update")
    node.textContent = '';
    node.appendChild(document.createTextNode('Last updates: ' + wrap.timestamp));
    
    
    
    node = document.getElementById("case_by_transmission_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Confirmed Cases by Transmission Type"));
    
    node = document.getElementById("case_by_transmission_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Daily"));
    
    node = document.getElementById("case_by_transmission_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulative"));
    
    node = document.getElementById("case_by_transmission_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Report date"));
    
    node = document.getElementById("case_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("Onset date"));
    
    
    
    node = document.getElementById("case_by_detection_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Confirmed Cases by Detection Channel"));
    
    node = document.getElementById("case_by_detection_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Daily"));
    
    node = document.getElementById("case_by_detection_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulative"));
    
    node = document.getElementById("case_by_detection_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Report date"));
    
    node = document.getElementById("case_by_detection_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("Onset date"));
    
    
    
    node = document.getElementById("test_by_criterion_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Number of Tests by Reporting Criterion"));
    
    node = document.getElementById("test_by_criterion_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Daily"));
    
    node = document.getElementById("test_by_criterion_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulative"));
    
    
    
    node = document.getElementById("difference_by_transmission_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("How many days to identify cases?"));
    
    node = document.getElementById("difference_by_transmission_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("All"));
    
    node = document.getElementById("difference_by_transmission_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Imported"));
    
    node = document.getElementById("difference_by_transmission_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Local"));
    
    node = document.getElementById("difference_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("Fleet"));
    
    
    
    node = document.getElementById("travel_history_symptom_correlations_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Correlations between Travel History & Symptoms"));
    
    node = document.getElementById("travel_history_symptom_correlations_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Coefficient"));
    
    node = document.getElementById("travel_history_symptom_correlations_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Counts"));
    
    
    
    node = document.getElementById("age_symptom_correlations_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Correlations between Age & Symptoms"));
    
    node = document.getElementById("age_symptom_correlations_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Coefficient"));
    
    node = document.getElementById("age_symptom_correlations_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Counts"));
    
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
  
  wrap.overallTot = overallTot;
  wrap.timestamp = timestamp;
//   console.log(wrap.timestamp);
  console.log(wrap.timestamp);


  text_translation()
});


//-- Button listener
$(document).on("change", "input:radio[name='index_language']", function(event) {
  lang = this.value;
  Cookies.set("lang", lang);
  text_translation();
  
  d3.selectAll('.plot').remove()
  
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
  
  d3.csv(TBC_wrap.dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    TBC_makeCanvas();
    TBC_formatData(data);
    TBC_initialize();
    TBC_update();
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

});

