

// 'en', 'zh-tw'

var lang;
var cList = ['#3366BB', '#CC6677', '#55BB44', '#DDAA77', '#AA55AA'];
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
});



function index_title() {
  if (lang == 'zh-tw')
    return '嚴重特殊傳染性肺炎 台灣疫情'
  return 'COVID-19 Statistics in Taiwan'
}

