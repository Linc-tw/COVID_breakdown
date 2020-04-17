

// 'en', 'zh-tw'

//-- Glocal settings
var lang = 'en';
var cList = ['#3366BB', '#CC6677', '#55BB44', '#DDAA77', '#AA55AA'];


//-- Text in html
var node;

function index_title() {
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
    node.appendChild(document.createTextNode("確診日期"));
    
    node = document.getElementById("case_by_transmission_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("發病日期"));
    
    
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
    node.appendChild(document.createTextNode("確診日期"));
    
    node = document.getElementById("case_by_detection_button_4")
    node.textContent = '';
    node.appendChild(document.createTextNode("發病日期"));
    
    
    node = document.getElementById("test_by_criterion_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("檢驗數量"));
    
    node = document.getElementById("test_by_criterion_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("逐日"));
    
    node = document.getElementById("test_by_criterion_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("累計"));
    
    
    
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
    
    
  }
}

index_title()


//-- Total nb of cases
var overallTotNb = 0;

d3.csv('processed_data/case_by_transmission_by_report_day.csv', function(error, data) {
  if (error) return console.warn(error);

  var colTagList = data.columns.slice(1);
  var i;
  
  for (i=0; i<data.length; i++) {
    for (j=0; j<colTagList.length; j++) {
      overallTotNb += +data[i][colTagList[j]];
    }
  }
});




//-- Button listener
$(document).on("change", "input:radio[name='index_language']", function(event) {
  lang = this.value;
  index_title();
  
  d3.selectAll('.plot').remove()
  
  d3.csv(CBT_wrap.dataPathList[CBT_wrap.doOnset], function(error, data) {
    if (error) return console.warn(error);
    
    CBT_makeCanvas();
    CBT_formatData(data);
    CBT_initialize();
    CBT_update();
  });
  
  d3.csv(CBD_wrap.dataPathList[CBD_wrap.doOnset], function(error, data) {
    if (error) return console.warn(error);
    
    CBD_makeCanvas();
    CBD_formatData(data);
    CBD_initialize();
    CBD_update();
  });
  
  d3.csv(TBC_wrap.dataPath, function(error, data) {
    if (error) return console.warn(error);
    
    TBC_makeCanvas();
    TBC_formatData(data);
    TBC_initialize();
    TBC_update();
  });
});



