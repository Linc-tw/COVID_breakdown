

// 'en', 'zh-tw'

var lang;

//-- Button listener
$(document).on("change", "input:radio[name='index_language']", function(event) {
  lang = this.value;
  
  d3.selectAll('svg').remove()
  
  d3.csv(DC_wrap.dataPathList[DC_wrap.doOnset], function(error, data) {
    if (error) return console.warn(error);
    
    DC_makeCanvas();
    DC_formatData(data, DC_wrap.doCumul);
    DC_initialize();
    DC_update();
  });
});



function index_title() {
  if (lang == 'zh-tw')
    return '嚴重特殊傳染性肺炎 台灣疫情'
  return 'COVID-19 Statistics in Taiwan'
}

