//-- Glocal settings
var lang = 'en'; // 'en', 'zh-tw'
var cList = ['#3366BB', '#CC6677', '#55BB44', '#DDAA77', '#AA55AA', '#44AA99'];

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
    tooltipText = "Yes for all kinds of use<br>No attribution needed"
  
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
    
    node = document.getElementById("case_by_transmission_button_5")
    node.textContent = '';
    node.appendChild(document.createTextNode("下載"));
    
    
    
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
    
    node = document.getElementById("case_by_detection_button_5")
    node.textContent = '';
    node.appendChild(document.createTextNode("下載"));
    
    
    
    node = document.getElementById("test_by_criterion_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("檢驗數量"));
    
    node = document.getElementById("test_by_criterion_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("逐日"));
    
    node = document.getElementById("test_by_criterion_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("累計"));
  
    node = document.getElementById("test_by_criterion_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("下載"));
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
    
    node = document.getElementById("case_by_transmission_button_5")
    node.textContent = '';
    node.appendChild(document.createTextNode("Download"));
    
    
    
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
    
    node = document.getElementById("case_by_detection_button_5")
    node.textContent = '';
    node.appendChild(document.createTextNode("Download"));
    
    
    
    node = document.getElementById("test_by_criterion_title")
    node.textContent = '';
    node.appendChild(document.createTextNode("Number of Tests by Reporting Criterion"));
    
    node = document.getElementById("test_by_criterion_button_1")
    node.textContent = '';
    node.appendChild(document.createTextNode("Daily"));
    
    node = document.getElementById("test_by_criterion_button_2")
    node.textContent = '';
    node.appendChild(document.createTextNode("Cumulative"));
    
    node = document.getElementById("test_by_criterion_button_3")
    node.textContent = '';
    node.appendChild(document.createTextNode("Download"));
  }
}

text_translation()


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
  text_translation();
  
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



