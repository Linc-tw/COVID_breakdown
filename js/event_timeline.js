var ET_wrap = {};
ET_wrap.tag = 'event_timeline'
ET_wrap.id = '#' + ET_wrap.tag
ET_wrap.dataPathList = [
  "processed_data/event_timeline_zh-tw.csv"
];

function ET_makeCanvas() {
  var totWidth = 1200;
  var totHeight = 540;
  var cellSize = 20; //-- Cell size
  
  var margin = {left: 0, right: 0, bottom: 0, top: 0};
  var width = totWidth - margin.left - margin.right;
  var height = totHeight - margin.top - margin.bottom;
  var corner = [[0, 0], [width, 0], [0, height], [width, height]];
  
  var svg = d3.select(ET_wrap.id)
    .append("svg")
      .attr('class', 'plot')
      .attr("viewBox", "0 0 " + totWidth + " " + totHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style('shape-rendering', 'crispEdges');
  
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  
  ET_wrap.totWidth = totWidth;
  ET_wrap.totHeight = totHeight;
  ET_wrap.cellSize = cellSize;
  ET_wrap.margin = margin;
  ET_wrap.width = width;
  ET_wrap.height = height;
  ET_wrap.corner = corner;
  ET_wrap.svg = svg;
}

function ET_formatData(data) {
  var lim = 40;
  var item = '★ ';
  var formattedData = {}
  var row, splitA1, splitA2, splitA3, splitB1, splitB2, splitB3;
  var i, j, k, q, r, str_;
  
  for (i=0; i<data.length; i++) {
    row = data[i];
    splitA1 = row['Taiwan_event'].split('\n');
    splitA2 = row['global_event'].split('\n');
    splitA3 = row['key_event'].split('\n');
    
    if (splitA1[0] == '') splitA1 = [];
    if (splitA2[0] == '') splitA2 = [];
    if (splitA3[0] == '') splitA3 = [];
    
    splitB1 = ['', '台灣事件'];
    splitB2 = ['', '全球事件'];
    splitB3 = ['', '重點事件'];
    
    for (j=0; j<splitA1.length; j++) {
      str_ = item + splitA1[j];
      q = Math.ceil(str_.length / lim);
      for (k=0; k<q; k++) {
        splitB1.push(str_.substring(k*lim, (k+1)*lim));
      }
    }
    for (j=0; j<splitA2.length; j++) {
      str_ = item + splitA2[j];
      q = Math.ceil(str_.length / lim);
      for (k=0; k<q; k++) {
        splitB2.push(str_.substring(k*lim, (k+1)*lim));
      }
    }
    for (j=0; j<splitA3.length; j++) {
      str_ = item + splitA3[j];
      q = Math.ceil(str_.length / lim);
      for (k=0; k<q; k++) {
        splitB3.push(str_.substring(k*lim, (k+1)*lim));
      }
    }
    
    formattedData[row['date']] = [[row['date']], splitB1, splitB2, splitB3];
  }
  
  ET_specialProcess(formattedData);
    
  var dateList = data.map(function (d) {return d['date'];});
  var beginYear = +dateList[0].substring(0, 4);
  var beginMonth = +dateList[0].substring(5, 7);
  var endYear = +dateList[dateList.length-1].substring(0, 4);
  var endMonth = +dateList[dateList.length-1].substring(5, 7);
  var beginHalfYear = ~~((beginMonth-1)/6) + 2 * beginYear;
  var endHalfYear = ~~((endMonth-1)/6) + 2 * endYear;
  
  var halfYearList = [];
  for (i=beginHalfYear; i<=endHalfYear; i++) halfYearList.push(i);
  
  ET_wrap.formattedData = formattedData;
  ET_wrap.beginYear = beginYear;
  ET_wrap.beginMonth = beginMonth;
  ET_wrap.endYear = endYear;
  ET_wrap.endMonth = endMonth;
  ET_wrap.halfYearList = halfYearList;
}

function ET_specialProcess(formattedData) {
  formattedData['2019-12-30'][2] = [
    '',
    '全球事件',
    '★ 武漢市衛生健康委員會－市衛生健康委關於報送不明原因肺炎救治情況的緊急通知',
    '★ 檢驗所把檢驗報告(12/27)發回醫院，報告中將「SARS coronavirus」',
    '（SARS冠狀病毒）列為「高置信度」陽性指標的結果之一',
    '★ 李文亮、劉文、謝琳卡等醫生在內部微信群中披露此次疫情相關的訊息'
  ]
  
  formattedData['2019-12-31'][1] = [
    '',
    '台灣事件', 
    '★ PTT爆卦文 #1U2a3N5t (Gossiping)',
    'https://www.ptt.cc/bbs/Gossiping/M.1577730263.A.177.html',
    '★ 衛福部疾管署向世界衛生組織國際健康法規(IHR)窗口及中國疾控中心確認疫情資訊',
    '★ 疾管署宣布武漢入境者登機檢疫',
    '★ 台灣向世界衛生組織提出以下電子郵件(04/11更):',
    'News resource today indicate that at least seven atypical pneumonia cases were',
    'reported in Wuhan, CHINA.',
    'Their health authorities replied to the media that the cases were believed not SARS; ',
    'however the sample are still under examination, and cases have been isolated',
    'for treatment.',
    'I would greatly appreciate it if you have relevant information to share with us.',
    'Thank you very much in advance for your attention to this matter.',
    'Best Regards.',
    '已暗示有人傳人的跡象'
  ]
  
  formattedData['2020-01-07'][2] = [
    '',
    '全球事件',
    '★ 中共中央總書記習近平主持召開中共中央政治局常委會，對疫情防控工作提出了要求',
    '★ WHO 宣布發現新病毒',
    '★ 這個病毒來自成員包含SARS和一般感冒的冠狀病毒家族',
    '★ 世衛將其正式命名為2019新型冠狀病毒(Novel coronavirus, 2019-nCoV)'
  ]
  
  formattedData['2020-02-07'][1] = [
    '',
    '台灣事件',
    '★ 陸委會宣布自2月10日起暫停小三通客船服務',
    '★ 交通部宣布自2月10日至4月30日，台灣往返中國大陸航線，除北京首都國際機場、上',
    '海浦東國際機場、上海虹橋國際機場、廈門高崎國際機場、成都雙流國際機場外，全面停飛',
    '★ 因應鑽石公主號郵輪已爆發群聚感染，中央流行疫情指揮中心透過災防告警系統針對臺',
    '灣北部發布防疫訊息，提醒1月31日曾去相關觀光景點的旅客，請自主健康管理至2月14日'
  ]
  
  formattedData['2020-02-14'][1] = [
    '',
    '台灣事件',
    '★ 中央流行疫情指揮中心將日本升為第一級（一級 一般措施），次日起將中國大陸浙',
    '江省、河南省列為一級流行地區'
  ]
  
  formattedData['2020-02-25'][1] = [
    '',
    '台灣事件',
    '★ #31',
    '★ 一、教育部說明開學日情況',
    '額溫槍、酒精、口罩已配送到各地點使用。各縣市政府環保單位也已完成公共設施、',
    '空間清潔打掃消毒工作。目前無狀況。',
    '★ 二、口罩機制調整',
    '02/27起，13歲以下取消單雙號限制，每人每次可代持三張兒童健保卡購買。',
    '★ 義大利升為二級警示。',
    '★ 有一名鑽石公主號患者昨晚跟今早都有發燒（未滿38），已送入醫院隔離觀察。'
  ]
  
  formattedData['2020-02-26'][1] = [
    '',
    '台灣事件',
    '★ #32',
    '★ 伊朗升為二級（Alert）',
    '★ 醫護人員出入境管制問題',
    '★ 管制對象為醫院，前往三級旅遊警告地區原則禁止，例外經衛服部報准，一二級地區原',
    '則暫緩，例外由服務單位報准，回國後皆應照規定實施檢疫管理，管制範圍至六月底為止。',
    '以上管制包含轉機在內，期間為02/23-06/30，視情況延長或縮短。',
    '★ 新增感控規定',
    '１　進出醫院人員分三類',
    '病人：進入醫院前一律分流動線',
    '訪客：依醫院規定時段分流，每個住院病人限制兩名，陪病者（含看護）只能有一名。',
    '進出病房採登記制，並應報告TOCC。',
    '外包人員：包含所有機構委託外部承攬，並在機構內工作的非核心工作人員，需遵守管',
    '制規定及健康管理措施。工作時應配戴口罩。',
    '２　應設置人員紓壓關懷機制',
    '３　擴大設置專責病房，屬於指定對象病院應開始設置專責病房收治呼吸道疾病及武漢',
    '肺炎病患，照顧人員採固定制，避免跨部門流動。',
    '★ 社會大型活動:請宗教團體要因應指揮中心規定，準備延期備案全球事件'
  ]
  
  formattedData['2020-02-27'][1] = [
    '',
    '台灣事件',
    '★ 指揮中心一級開設',
    '★ 兒童健保卡不受身分證字號尾數單雙號分流限制，每日都可購買，且最多一次可持三張',
    '兒童健保卡購買口罩',
    '★ 義大利升為三級警告（warning），自該國入境者需居家檢疫14天。',
    '★ 公布了案32在雙北2月16日至24日的活動軌跡，同時段出入者須自主健康管理14天',
    '★ 無新增案例，解除九例列管（含一例死亡）目前尚有23案列管。',
    '★ 醫事人員請假規定，協調會議後決議如下：',
    '１　僅針對有旅遊疫情警告的九個國家／地區進行限制',
    '２　原以醫院服務人員為主，排除診所；社工人員團體主動要求納入旅遊管制，本部分',
    '將進行修正，納入醫院服務的社工人員。',
    '３　限制地區不變',
    '４　實施時間不變，視情況調整',
    '５　出境回國後需１４天居家檢疫或自主管理，不得從事醫療照護。',
    '６　防疫期間，因防疫需要取消出國者，依法給予損失補償。補償不限於目前限制的九',
    '個國家／地區，不分公務或私人行程。',
    '７　特休及婚假部分，因防疫需求而自願取消或配合延後者，得於疫情結束後遞延一年。',
    '８　規範對象僅限於醫事與社工人員，暫不擴及全體醫院人員。'
  ]
  
  formattedData['2020-02-27'][2] = [
    '',
    '全球事件',
    '★ 日本內閣總理大臣（首相）安倍晉三召開的政府對策本部會議上，提出了要求全國的小',
    '學、初中、高中停課的要求',
    '★ 同時政府已向各體育團體和文化團體下達通告，要求3月15日前停辦所有大型活動和公演'
  ]
  
  formattedData['2020-02-28'][1] = [
    '',
    '台灣事件',
    '★ #33 #34',
    '★ 首起院內感染(#34)',
    '★ 法務部假訊息宣導',
    '★ 猝死女性採檢結果出爐，確認陰性。',
    '★ 陪病人員管理問題',
    '★ 醫事司：各醫院已陸續公布新的陪病規定，重點在於人員掌握，進入病房一律需要登錄',
    'TOCC、姓名、與病患關係等等。',
    '目前已經在建置資訊系統，會和其他醫事系統和長照系統串接比對，可以抓出非合法的看',
    '護和跨院照護情形，以進行風險管控。',
    '★ 勞動部：我們對於移工會進行宣導來落實保護，目前有透過翻譯將宣導資料翻譯成英泰',
    '印越四國語言，並且在各入境處所和地方政府，廣播、社群媒體等進行宣導。有關非法移',
    '工部分，有和移民警政海巡等單位落實查緝，呼籲雇主不要非法雇用。非法雇用就是造',
    '成疫情和移工的潛在風險。希望合法雇主要落實移工的醫療保護，提供必要設備。',
    '★ 出院標準改變',
    '★ 三陰才可以出院，以避免出現國外出院又復發的情形。'
  ]
  
  formattedData['2020-03-17'][1] = [
    '',
    '台灣事件',
    '★ #68 #69 #70 #71 #72 #73 #74 #75 #76 #77',
    '★ 亞洲、東歐共20國及美國3州旅遊疫情升至第三級警告',
    '★ 03/19 0時起升級，檢疫措施從現在開始實施。記者會當下未登機者居家檢疫14天。',
    '★ 外籍人士自三級區域入境者取消免簽，特殊理由取得簽證才能入境，一樣要檢疫14天。',
    '★ 亞洲：日本、新加坡、北韓、泰國、馬來西亞、菲律賓、印尼、汶萊、越南、寮國、柬',
    '埔寨、緬甸、東帝汶、孟加拉、不丹、尼泊爾、斯里蘭卡、印度及馬爾地夫。(共19國)',
    '★ 東歐：摩爾多瓦。',
    '★ 美國：華盛頓州、紐約州及加利福尼亞州。(共3州)',
    '★ 移工相關政策',
    '１　減少人員跨域流動',
    '請雇主考慮期滿續聘或國內承接，延長工作年限，鼓勵暫時不要返國休假。',
    '取消返國的損失由勞動部就安基金補償，堅持返國者不能再入境。',
    '２　加強雇主防疫措施管理',
    '機場集中講習改為線上講習，入境處發放口罩。啟動強制接機措施，雇主須提供居家檢疫',
    '計畫書，落實管理措施。'
  ]
  
  formattedData['2020-03-18'][1] = [
    '',
    '台灣事件',
    '★ #78~#100',
    '★ 一、因應境外移入案例',
    '非本國籍人士一律限制入境，特殊情況專案處理。所有入境者一律居家檢疫14天。除持居',
    '留證，外交公務，商務履約，或其他特別許可外，一律限制其入境。持以上證明入境者須',
    '配合檢疫政策。限制日期依照疫情進展調整，其宣布由中央流行疫情指揮中心公布之。',
    '本措施由台北03/19凌晨零點起實施。當地時間03/18凌晨零點後起飛的班機適用。',
    '★ 二、回溯檢驗。',
    '回溯了550人，100多採檢中，其他進行中。回溯期間為03/05-03/14從歐洲各地和杜拜埃',
    '及土耳其入境者。呼籲所有03/05-03/14有歐洲旅遊史，經杜拜或義大利轉機者，請跟鄉鎮',
    '公所聯繫，納入檢疫管理，通報完成後實施檢疫。旅遊史陳報不實者，依特別條例和傳染',
    '病防治法懲處之。',
    '★ 三、公布與ＡＩＴ的防疫聯合聲明',
    '進一步強化台北諮商合作機制，在夥伴關係上分享最佳做法，包括快篩試劑疫苗和接觸者',
    '追蹤，還有專家會議等。本聲明由外交部長和ＡＩＴ處長共同發佈。美方為台灣保留30萬',
    '件防護衣原料，充實防疫物資。台灣在產能充足前提下，每周提供美方十萬枚口罩。',
    '★ 四、口罩供應',
    '線上應該不用抽，線下有剩貨的先停止配發，會增加售完藥局的販售量。與藥師公會討論',
    '如何減輕藥局包裝和負擔壓力。依傳染病防治法授權，製作線上電子通報與追蹤系統。詳',
    '情另見新聞稿。本系統為政府部門和HTC與LINE合作製作。',
    '★ 1922進線42090通'
  ]
  
  formattedData['2020-03-19'][1] = [
    '',
    '台灣事件',
    '★ #101~#108',
    '★ 首起高中全校停課(#59,#103)',
    '★ 機場採檢數量：3/16 126, 3/17 227, 3/18 228, 3/19 103(中午為止)',
    '★ 本日一點為止大概入境五千人，桃機目前有四個採檢站，入境旅客有四個檢疫點。',
    '★ 開艙開始就進行電子申告，鼓勵民眾使用。中午前有69%使用電子申告。',
    '★ 協調國籍航空讓旅客在外站進行電子申請。',
    '★ 觀光局會協助海外旅行團一律電子申告入境。',
    '★ 防疫車隊增加國光客運疏運中南部旅客，到定點後由家人或防疫車隊或排班車輛',
    '登記運送紀錄。',
    '★ 呼籲歸國學生的家長準備檢疫場所，希望家長可以親自到機場接送，減輕車隊負擔。',
    '★ 採檢條件已放寬，有狀況就採檢。',
    '★ 醫牙部份的面試要跟衛生主管單位申請，會透過防疫專車或親人專車抵達特殊試場',
    '處理。',
    '★ 呼籲不要出門去玩，造成校園防疫的挑戰與威脅。',
    '★ 口罩2.0',
    '★ 本日開始繳錢，請記得三天內繳錢。',
    '★ 繳費後會在322統一更新繳費狀況。'
  ]
  
  formattedData['2020-03-26'][2] = [
    '',
    '全球事件',
    '★ 中華人民共和國外交部、國家移民管理局發布了《中華人民共和國外交部、國家移民',
    '管理局關於暫時停止持有效中國簽證、居留許可的外國人入境的公告》，',
    '★ 並且在2020年3月28日0時起，暫時停止外國人持目前有效來華簽證和居留許可入境',
    '★ 南非總統拉瑪佛沙（Cyril Ramaphosa）23日晚間宣布，將自3月26日午夜至4月16',
    '日午夜，全國封鎖3週。',
    '★ 封鎖期間所有人必須待在家裡，但不包括急難救助人員、醫院、藥房、警察、醫事',
    '人員、實驗室、銀行、約堡證券交易所、超市食品等。',
    '★ 泰國從3月26日凌晨到4月30日進入緊急狀態，陸海空的邊境口岸除了泰國人、各國',
    '外交官、國際貨運運輸業者及有泰國工作證的外國人之外，均禁止外國人入境'
  ]
  
  formattedData['2020-03-29'][1] = [
    '',
    '台灣事件',
    '★ #284~#298',
    '★ #108死亡',
    '★ 由中華航空定期班機CI504以「類包機」方式，從上海浦東機場接回滯留湖北的臺灣民',
    '眾，共153人返臺，統一送至集中檢疫所進行14天隔離'
  ]
  
  formattedData['2020-04-21'][2] = [
    '',
    '全球事件',
    '★ 全球確診人數逾250萬',
    '★ 土耳其突破9萬確診，擴大實施封城措施，總統艾爾段今晚宣布31個省自23日凌晨起',
    '封鎖4天',
    '★ 先前已連續兩個週末對31個省實施為期48小時宵禁，影響占人口78%的約6400萬人',
    '★ 香港當局今天宣布延長實施各種嚴格防疫措施，包括限制超過4人以上聚集的限聚令',
    '將自23日起再實施14天。'
  ]
  
  formattedData['2020-04-23'][1] = [
    '',
    '台灣事件',
    '★ 新增:#427',
    '★ 指揮中心今日宣布，原4月29日到期的「限縮兩岸航空客運直航航線」及4月30日到期',
    '的「全面禁止旅客來台轉機」二項政策，要繼續延長執行，何時解禁視疫情狀況決定',
    '★ 指揮中心今提出個案資料和活動史「公布原則」，規定公布資訊不得包含姓名、病歷及',
    '病史等；個案任職單位是否公開，也必須看該公司協調；可掌握人員名單的餐飲和旅宿、',
    '疑似個案及接觸者則不能公開。',
    '★ 一、 確診個案',
    '1. 有關個案資訊之公開：',
    '公布之資訊不得包含姓名、病歷及病史等，且不能得以辨識個人資料。如公布某地區國中',
    '學生確診， 但該地區只有1間國中。',
    '2. 有關個案任職單位之公開：',
    '如確有防治需要，須事先與該公司/機構進行溝通協調，以避免影響其運作及營運。',
    '3. 有關個案活動史之公開：',
    '（1）大眾運輸工具及公共場所，如有防治需要，原則上公開；公布前，須與該單位進行溝',
    '通協調，避免影響其運作及營運。',
    '（2）可掌握人員名單之地點或場所，則以追蹤特定名單為原則，不予公開。如可掌握人員',
    '名單之「旅宿業、餐飲業」等，原則上不予公開。',
    '★ 二、 疑似個案及接觸者：以不公布為原則，以免造成不必要之恐慌。',
    '為了準備日後兒童口罩其他尺寸的供應，口罩訂購週期簡化調整，五六輪預購過者，第七',
    '輪都能預購，兩週開放預購一次，預購起始日及取貨起始日都調整至週一（隔週）'
  ]
  
  formattedData['2020-05-03'][1] = [
    '',
    '台灣事件',
    '★ 零確診 20:00臨時記者會 +4敦睦 #433~#436',
    '★ 新增:#433~#436',
    '★ 敦睦713人今日零時隔離期滿，再次採檢4人陽性，均為磐石艦成員，無症狀，餘709人',
    '陰性，其中岳飛及康定艦隊成員共367人，將於明(4)日上午5時30分解除隔離，自主健',
    '康管理7天',
    '★ 磐石艦成員明日上午(間隔24小時後)再度採檢'
  ]
  
  formattedData['2020-05-11'][2] = [
    '',
    '全球事件',
    '★ 荷蘭首相呂特（Mark Rutte）宣布11日起在4個月內分階段解封，包括學童分批到校',
    '上課；髮廊、美容院可為事先預約的客人服務；不會有肢體接觸的戶外運動，公共運輸',
    '則從6月1日起按照正常行程表運作，但只開放40％座位以維持社交距離，且強制規定乘',
    '客配戴口罩，高中也將於6月1日復課'
  ]
  
  formattedData['2020-05-13'][2] = [
    '',
    '全球事件',
    '★ 法國今起逐步解除實施近2個月的全國性封鎖禁令',
    '★ 中國東北吉林省疫情加劇，12日全中國新增確診7例，其中本土6例集中在吉林省。',
    '吉林市疫情防控指揮小組宣布，鄉鎮、社區全面實行封閉管理，前往外地人員需持有',
    '48小時內自費核酸檢測陰性報告和自我隔離後才能登記出城；另吉林火車站自即日起，',
    '暫停始發或乘車服務，防疫人員在站外拉起封鎖線'
  ]
  
  formattedData['2020-05-15'][1] = [
    '',
    '台灣事件',
    '★ 零確診',
    '★ 交通部召開第七次防疫會議，研商第三階段的交通觀光防疫措施鬆綁推動方案（草',
    '案），其中有關兩岸客運航點、海運直航及小三通客船航班等，規劃於10月1日全面恢復',
    '★ 陳時中於16日針對此議題指出，交通部的規畫是超前準備，先做構想並提出時間表，',
    '實際上要如何做還是要看疫情的發展而定。中華職棒例行賽每場開放進場觀眾增加至2千',
    '名，也能於場內食用官方準備之餐盒'
  ]
  
  formattedData['2020-05-15'][2] = [
    '',
    '全球事件',
    '★ 全球死亡人數逾30萬',
    '★ 斯洛維尼亞過去兩週來，每天新增確診病例低於7例，政府今天晚上因此宣布境內疫情',
    '正式結束，成為第一個宣布疫情告終的歐洲國家',
    '★ 波羅的海國家立陶宛、拉脫維亞和愛沙尼亞15日凌晨起互相開放邊界，成為歐盟區域',
    '內首個「安全旅行圈」（travel bubble）。這3個共和國目前確診病例增幅趨緩，3國13日',
    '新增病例都不超過7例，3國整體通報病故案例迄今不到150例'
  ]
  
  formattedData['2020-05-16'][1] = [
    '台灣事件',
    '★ 零確診',
    '★ 鑑於商務人士居家檢疫十四天可能影響商務作業，研擬改為商務人士來台居家檢疫第五',
    '天後即可採檢，若採檢結果為陰性可短暫外出2至3天。',
    '★ 經濟部官員表示，口罩本週單日最高產量達2000萬片，平均日產能達1800萬到1900萬片'
  ]
  
  formattedData['2020-05-16'][2] = [
    '',
    '全球事件',
    '★ 紐約州州長古莫（Andrew Cuomo）今天指出，紐約市防疫封鎖措施延長至5月28日'
  ]
  
  formattedData['2020-05-26'][1] = [
    '',
    '台灣事件',
    '★ 零確診',
    '★ 中央流行疫情指揮中心表示，如臺灣至6月7日仍可維持本土個案零確診或無社區感染，',
    '將擴大鬆綁生活防疫規範。民眾只要配合實名制，及落實個人防護措施，從事各項日常及',
    '休閒活動將不再受限於人數限制規範'
  ]
  
  formattedData['2020-05-29'][1] = [
    '',
    '台灣事件',
    '★ #442',
    '★ 自費採檢對象放寬，增加其他因素需檢驗之民眾可自費採檢，並從原來的18家增至37',
    '家，金額以醫院公告為準'
  ]
  
  formattedData['2020-06-01'][2] = [
    '',
    '全球事件',
    '★ 首相強生宣布小學1日起局部復課，戶外市場若能遵守防疫安全準則就可復業，若政',
    '府能達成檢驗標準，所有非民生必須商店包括百貨公司及小型獨立商店等皆可復業',
    '★ 土耳其逐步放寬防疫措施，6月1日解除多項防疫措施，包括城際交通禁令全面解除，',
    '餐飲業、體育場所、文化場所、休閒場所及體育設施將復業或重新開放，並且可以舉辦',
    '音樂會',
    '★ 新加坡近來疫情趨穩，防疫「阻斷措施」今天結束後，明起將分3階段恢復經濟活動',
    '★ 西班牙總理桑切斯表示將向國會尋求再度延長居家令14天與15天的國家緊急狀態至',
    '6月21日，之後解除外國人士入境後須自主隔離命令，並按原計畫於7月1日開放邊境'
  ]
  
  formattedData['2020-06-22'][1] = [
    '',
    '台灣事件',
    '★ 零確診',
    '★ 短期商務人士若同時符合以下四項基本條件，可申請縮短居家檢疫時間︰',
    '(一)依指揮中心宣布可入境之人士。',
    '(二)申請來臺停留天數小於3個月。',
    '(三)短期入境從事商務活動(如：驗貨、售後服務、技術指導與培訓、簽約等)商務人士。',
    '(四)出發地為指揮中心公告之低感染風險或中低感染風險國家/地區，且登機前14天無其他',
    '國家/地區旅遊史。',
    '★ 下列低感染風險、中低感染風險國家/地區名單，將視各國疫情規模及趨勢、監測及檢驗',
    '量能、疫情資訊透明度、所屬區域及鄰近國家疫情狀況每兩週調整。',
    '★ 低感染風險國家/地區：紐西蘭、澳洲、澳門、帛琉、斐濟、汶萊、越南、香港、泰國、',
    '蒙古、不丹。',
    '★ 中低感染風險國家/地區：韓國、日本、馬來西亞、新加坡。'
  ]
  
  formattedData['2020-06-29'][1] = [
    '',
    '台灣事件',
    '★ 零確診',
    '★ 放寬外籍、香港及澳門人士入境對象如下：',
    '★ 外籍人士：除觀光、一般社會訪問以外，均得提出申請。',
    '★ 港澳人士：特殊人道考量及緊急協處、商務履約、跨國企業內部調動、已取得我居留證',
    '之國人配偶、子女及商務經貿交流(含工作居留、投資居留及創新創業居留等)，均得提出',
    '申請。',
    '★ 指揮中心指出，為確保飛航防疫安全，並降低開放外籍及港澳人士入境後發生社區疫情',
    '之風險，對於獲准入境台灣之外籍、香港及澳門人士，要求應於航空公司報到前，主動出',
    '示「表訂登機時間前3天內之COVID-19核酸檢驗陰性報告(英文版)」，並配合入境後居家檢',
    '疫14天及必要之檢疫措施。'
  ]
  
  formattedData['2020-07-22'][1] = [
    '',
    '台灣事件',
    '★ 零確診',
    '★ 香港、澳洲自中低感染風險國家移除',
    '★ 教育部開放低風險與中低風險國家/地區109學年度第1學期境外學位新生來臺及開放19',
    '個國家/地區以外之應屆畢業境外生返臺入境就學'
  ]
  
  
  
}
    
//-- Tooltip
var ET_tooltip = d3.select(ET_wrap.id)
  .append("div")
  .attr("class", "tooltip")

function ET_mouseover(d) {
  ET_tooltip.transition()
    .duration(200)
    .style("opacity", 0.9)
  d3.select(this)
    .style("opacity", 0.6)
}

function ET_getTooltipPos(pos, d) {
  var year  = +d.substring(0, 4);
  var month = +d.substring(5, 7);
  var ind = 2*(year - 2019) + ~~((month-1) / 6) - 1;
  
  var xPos = pos[0];
  var yPos = pos[1];
  
  var buffer = 1.25*16; //-- Margin buffer of card-body
  var button = (0.9+0.875)*16 + 20; //-- Offset caused by button
  var cardHdr = 3.125*16; //-- Offset caused by card-header
  var svgDim = d3.select(ET_wrap.id).node().getBoundingClientRect();
  var xAspect = (svgDim.width - 2*buffer) / ET_wrap.totWidth;
  var yAspect = (svgDim.height - 2*buffer) / ET_wrap.totHeight;
  
  xPos = (xPos + ET_wrap.margin.left) * xAspect + buffer;
  yPos = (yPos + ET_wrap.margin.top + ind*(ET_wrap.dy0+ET_wrap.cellSize*7)) * yAspect + buffer + cardHdr + button;
  
  xPos = xPos + 0;
  yPos = yPos - 0;
  return [xPos, yPos];
}

function ET_mousemove(d) {
  var newPos = ET_getTooltipPos(d3.mouse(this), d);
  var tooltipText;
  
  if (lang == 'zh-tw')
    tooltipText = '點我'
  else if (lang == 'fr')
    tooltipText = 'Cliquez'
  else
    tooltipText = 'Click me'
    
  ET_tooltip
    .html(tooltipText)
    .style("left", newPos[0] + "px")
    .style("top", newPos[1] + "px")
}

function ET_mouseleave(d) {
  ET_tooltip.transition()
    .duration(10)
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 1)
}

//-- Click
function ET_click(d, i) {
  var transDuration = 0;
  if (!(d in ET_wrap.formattedData)) {
    ET_wrap.svg.selectAll(ET_wrap.id+'_text')
      .transition()
      .duration(transDuration)
      .text('');
    return;
  }
  
  var split = ET_wrap.formattedData[d];
  var colorList = ['#000000'];
  var j;
  
  for (j=0; j<split[1].length; j++) {
    colorList.push(cList[0]);
  }
  for (j=0; j<split[2].length; j++) {
    colorList.push(cList[1]);
  }
  for (j=0; j<split[3].length; j++) {
    colorList.push(cList[2]);
  }
  
  var text = split[0].concat(split[1]).concat(split[2]).concat(split[3]);
  
  ET_wrap.svg.selectAll(ET_wrap.id+'_text')
    .transition()
    .duration(transDuration)
    .text(function (d2, j) {return text[j];})
    .attr('fill', function (d2, j) {return colorList[j];});
}

function ET_initialize() {
  //-- Year block
  var x0 = 35;
  var y0 = 45;
  var dy0 = 30;
  
  var block = ET_wrap.svg.selectAll(".year")
    .data(ET_wrap.halfYearList)
    .enter()
    .append("svg")
      .attr('class', 'year')
      .attr("width", ET_wrap.width)
      .attr("height", ET_wrap.height)
      .append("g")
        .attr("transform", function(d, i) {
          return "translate(" + x0 + "," + (y0+i*(dy0+ET_wrap.cellSize*7)) + ")";
        });
  
  var nbSquares = 27;
  var dx1 = 25;
  
  block.append("text")
    .attr('class', 'content text')
    .attr("transform", "translate(" + (nbSquares*ET_wrap.cellSize+dx1) + "," + (ET_wrap.cellSize*3.5) + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) {return ~~(d/2);});
  
  //-- Title
  var title;
  if (lang == 'zh-tw') title = '疫情爆發時間軸';
  else if (lang == 'fr') title = "Chronologie de la pandémie (en mandarin seulement)";
  else title = 'Pandemic Timeline (Mandarin only)';
  
  ET_wrap.svg.append("text")
      .attr("class", "title")
      .attr("x", x0+nbSquares*ET_wrap.cellSize*0.5)
      .attr("y", 15)
      .attr("fill", 'black')
      .text(title)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "bottom")
  
  //-- Content text
  var dx2 = 20;
  var dy2 = 16;
  var split = ['', '', '', '', '', '', '', '', '', '', 
               '', '', '', '', '', '', '', '', '', '', 
               '', '', '', '', '', '', '', '', '', '', 
               '', '', '', '', '', '', '', '', '', ''];
  
  ET_wrap.svg.append("g").selectAll()
    .data(split)
    .enter()
    .append("text")
      .attr("class", "content text")
      .attr("x", x0+nbSquares*ET_wrap.cellSize+dx1+dx2)
      .attr("y", function(d, j) {return y0-28+j*dy2})
      .attr("fill", 'black')
      .attr("id", function(d, j) {return ET_wrap.tag+'_text';})
      .text(function(d) {return d;})
      .attr("text-anchor", 'start')
      .attr("dominant-baseline", "middle")
          
  ET_wrap.block = block;
  ET_wrap.x0 = x0;
  ET_wrap.y0 = y0;
  ET_wrap.dy0 = dy0;
}

function ET_update() {
  //-- Days
  var YToMFct1 = function (d) {
    var q = ~~(d / 2);
    var r = d % 2;
    if (d == ET_wrap.halfYearList[0]) {
      return d3.timeDays(new Date(ET_wrap.beginYear, ET_wrap.beginMonth-1, 1), new Date(ET_wrap.beginYear, 6*(r+1), 1));
    }
    if (d == ET_wrap.halfYearList[ET_wrap.halfYearList.length-1]) {
      return d3.timeDays(new Date(ET_wrap.endYear, 6*r, 1), new Date(ET_wrap.endYear, ET_wrap.endMonth, 1));
    }
    return d3.timeDays(new Date(q, 6*r, 1), new Date(q, 6*(r+1), 1));
  }
  
  var getDay = function(day, start) {
    return (day.getDay() + 7 - start) % 7;
  }
  
  var getWeek = function(day, start) {
    if (start == 1) return d3.timeMonday.count(d3.timeYear(day), day);
    return d3.timeWeek.count(d3.timeYear(day), day);
  }
  
  var square = ET_wrap.block.selectAll(ET_wrap.id+'_day')
    .remove()
    .exit()
    .data(YToMFct1)
    .enter()
    .append("rect")
      .attr('id', ET_wrap.tag+'_day')
      .attr("width", ET_wrap.cellSize)
      .attr("height", ET_wrap.cellSize)
      .attr("x", function(d) {
        var weekNb = getWeek(d, ET_wrap.weekStart);
        if (+d3.timeFormat("%m")(d3.timeMonth(d)) > 6) 
          return (weekNb-26)*ET_wrap.cellSize;
        return weekNb*ET_wrap.cellSize;
      })
      .attr("y", function(d) {return getDay(d, ET_wrap.weekStart) * ET_wrap.cellSize;})
      .style('fill', '#fff')
      .style('stroke', '#ccc')
      .datum(d3.timeFormat("%Y-%m-%d"))
      .on("mouseover", ET_mouseover)
      .on("mousemove", ET_mousemove)
      .on("mouseleave", ET_mouseleave)
      .on("click", ET_click);
  
  //-- Color
  var color2 = d3.scaleSequential()
    .domain([0, 32])
    .interpolator(t => d3.interpolateBuPu(t));
  
  square.filter(function (d) {return d in ET_wrap.formattedData;})
    .style("fill", function (d) {
      var split = ET_wrap.formattedData[d];
      return color2(d3.sum(split.map(function (d) {return d.length;})));
    })

  //-- Months
  var YToMFct2 = function (d) {
    var q = ~~(d / 2);
    var r = d % 2;
    if (d == ET_wrap.halfYearList[0]) {
      return d3.timeMonths(new Date(ET_wrap.beginYear, ET_wrap.beginMonth-1, 1), new Date(ET_wrap.beginYear, 6*(r+1), 1));
    }
    if (d == ET_wrap.halfYearList[ET_wrap.halfYearList.length-1]) {
      return d3.timeMonths(new Date(ET_wrap.endYear, 6*r, 1), new Date(ET_wrap.endYear, ET_wrap.endMonth, 1));
    }
    return d3.timeMonths(new Date(q, 6*r, 1), new Date(q, 6*(r+1), 1));
  }
  var frame = function (t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
    var d0 = getDay(t0, ET_wrap.weekStart);
    var w0 = getWeek(t0, ET_wrap.weekStart);
    var d1 = getDay(t1, ET_wrap.weekStart);
    var w1 = getWeek(t1, ET_wrap.weekStart);
    
    if (+d3.timeFormat("%m")(d3.timeMonth(t0)) > 6) {
      w0 -= 26;
      w1 -= 26;
    }
    
    return "M" + (w0 + 1) * ET_wrap.cellSize + "," + d0 * ET_wrap.cellSize
      + "H" + w0 * ET_wrap.cellSize + "V" + 7 * ET_wrap.cellSize
      + "H" + w1 * ET_wrap.cellSize + "V" + (d1 + 1) * ET_wrap.cellSize
      + "H" + (w1 + 1) * ET_wrap.cellSize + "V" + 0
      + "H" + (w0 + 1) * ET_wrap.cellSize + "Z";
  }

  ET_wrap.block.selectAll(ET_wrap.id+'_month')
    .remove()
    .exit()
    .data(YToMFct2)
    .enter()
    .append('path')
      .attr('id', ET_wrap.tag+'_month')
      .attr('d', frame)
      .style('fill', 'none')
      .style('stroke', '#000')
      .style('stroke-width', '2px');
  
  //-- Month tag
  var monthList;
  if (lang == 'zh-tw') monthList = [
    ['', '', '', '', '', '12月'],
    ['1月', '2月', '3月', '4月', '5月', '6月'],
    ['7月', '8月', '', '', '', '']
  ];
  else if (lang == 'fr') monthList = [
    ['', '', '', '', '', 'déc'],
    ['janv', 'févr', 'mars', 'avr', 'mai', 'juin'],
    ['juil', 'août', '', '', '', '']
  ];
  else monthList = [
    ['', '', '', '', '', 'Dec'],
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    ['Jul', 'Aug', '', '', '', '']
  ];
  var dx1 = ET_wrap.cellSize * 4.417; //-- 53 / 12
  
  ET_wrap.block.selectAll(ET_wrap.id+'_month_tag')
    .remove()
    .exit()
    .data(function (d, i) {return monthList[i];})
    .enter()
    .append("text")
      .attr('class', 'content text')
      .attr("id", ET_wrap.tag+"_month_tag")
      .attr("x", function (d, i) {return (i+0.5)*dx1;})
      .attr("y", -0.5*ET_wrap.dy0+1)
      .style("fill", 'black')
      .text(function (d) {return d;})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
   
  //-- Weekday tag
  var weekdayList;
  if (lang == 'zh-tw') weekdayList = ['日', '一', '二', '三', '四', '五', '六'];
  else if (lang == 'fr') weekdayList = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  else weekdayList = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  if (ET_wrap.weekStart == 1) {
    weekdayList = [weekdayList[1], weekdayList[2], weekdayList[3], weekdayList[4], weekdayList[5], weekdayList[6], weekdayList[0]];
  }
  
  ET_wrap.block.selectAll(ET_wrap.id+'_weekday_tag')
    .remove()
    .exit()
    .data(weekdayList)
    .enter()
    .append("text")
      .attr('class', 'content text')
      .attr("id", ET_wrap.tag+"_weekday_tag")
      .attr("x", -20)
      .attr("y", function (d, i) {return (i+0.5)*ET_wrap.cellSize;})
      .style("fill", 'black')
      .text(function (d) {return d})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
}

ET_wrap.weekStart = 0;

d3.csv(ET_wrap.dataPathList[0], function(error, data) {
  if (error) return console.warn(error);
  
  ET_makeCanvas();
  ET_formatData(data);
  ET_initialize();
  ET_update();
});

//-- Buttons 
$(document).on("change", "input:radio[name='" + ET_wrap.tag + "_weekStart']", function(event) {
  ET_wrap.weekStart = this.value;
  
  ET_update();
});

d3.select(ET_wrap.id + '_button_3').on('click', function(){
  var tag1, tag2;
  
  if (ET_wrap.weekStart == 1) tag1 = 'start_on_Monday';
  else tag1 = 'start_on_Sunday';
  
  name = ET_wrap.tag + '_' + tag1 + '_' + lang + '.png'
  saveSvgAsPng(d3.select(ET_wrap.id).select('svg').node(), name);
});

