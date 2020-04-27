

    ##########################################
    ##  COVID_breakdown_data_processing.py  ##
    ##  Chieh-An Lin                        ##
    ##  Version 2020.04.24                  ##
    ##########################################


import os
import sys
import collections as clt
import datetime as dtt

import numpy as np
import scipy as sp
import matplotlib as mpl
import pandas as pd

#sys.path.append("../pycommon/")
#import commonFunctions as cf
#import matplotlibFunctions as mplf


################################################################################
## Parameters

DATA_PATH = '/home/linc/03_Codes/COVID_breakdown/'

SYMPTOM_DICT = {
  'sneezing': '鼻腔症狀',
  'cough': '咳嗽',
  'throatache': '喉嚨症狀',
  'dyspnea': '呼吸困難', 
  'pneumonia': '肺炎', 
  
  'fever': '發燒',
  'chills': '畏寒', 
  
  'Nausea': '噁心',
  'vomiting': '嘔吐',
  'diarrhea': '腹瀉', 
  
  'headache': '頭痛',
  'eyes sore': '眼痛', 
  'chest pain': '胸痛', 
  'stomachache': '腹痛',
  'backache': '背痛', 
  'toothache': '牙痛', 
  
  'fatigue': '倦怠',
  'soreness': '痠痛',
  
  'anosmia': '嗅覺異常', 
  'ageusia': '味覺異常',
  
  'lymphatic swelling': '淋巴腫脹', 
  'hypoglycemia': '低血糖', 
  'poor appetite': '食慾不佳',
  'arrhythmia': '心律不整',
  
  'symptomatic': '有症狀',
  'asymptomatic': '無症狀' 
}

TRAVEL_HISTORY_DICT = {
  'China': '中國',
  'Hong Kong': '香港',
  'Macao': '澳門',
  'Japan': '日本',
  'Thailand': '泰國', 
  'Malaysia': '馬來西亞', 
  'Indonesia': '印尼', 
  'Philippines': '菲律賓', 
  'Singapore': '新加坡', 
  
  'USA': '美國', 
  'Canada': '加拿大', 
  'Mexico': '墨西哥', 
  'Chile': '智利',
  'Argentina': '阿根廷', 
  'Peru': '秘魯',
  'Bolivia': '玻利維亞', 
  'Brazil': '巴西',
  'Latin America': '中南美洲', 
  
  'Europe': '歐洲', 
  'Ireland': '愛爾蘭', 
  'UK': '英國', 
  'France': '法國',
  'Portugal': '葡萄牙', 
  'Spain': '西班牙', 
  'Italy': '義大利', 
  'Belgium': '比利時', 
  'Netherlands': '荷蘭', 
  'Luxemburg': '盧森堡', 
  'Switzerland': '瑞士', 
  'Germany': '德國',
  'Austria': '奧地利', 
  'Czechia': '捷克', 
  'Danmark': '丹麥', 
  'Finland': '芬蘭', 
  'Iceland': '冰島', 
  'Poland': '波蘭', 
  'Bugaria': '保加利亞', 
  'Greece': '希臘',
  
  'Turkey': '土耳其', 
  'Qatar': '卡達', 
  'UAE': '阿拉伯聯合大公國', 
  'Egypt': '埃及', 
  
  'Morocco': '摩洛哥', 
  'Tunisia': '突尼西亞', 
  'South Africa': '南非', 
  
  'Australia': '澳洲', 
  'New Zealand': '紐西蘭', 
  'Palau': '帛琉', 
  
  'Antarctica': '南極', 
  
  'Diamond Princess': '鑽石公主號', 
  'Coral Princess': '珊瑚公主號', 
  'Pan-Shi': '磐石艦', 
  'indigenous': '無'
}

AGE_DICT = {
  '0s': '未滿十歲',
  '10s': '十多歲',
  '20s': '二十多歲',
  '30s': '三十多歲',
  '40s': '四十多歲',
  '50s': '五十多歲',
  '60s': '六十多歲',
  '70s': '七十多歲',
  '80s': '八十多歲'
}

###############################################################################
## General functions

def saveCsv(name, data, verbose=True):
  data.to_csv(name, index=False)
  if verbose:
    print('Saved \"%s\"' % name)
  return

def ISODateToOrdinal(ISODate):
  ordinal = dtt.date.fromisoformat(ISODate).toordinal()
  return ordinal

def ordinalToISODate(ordinal):
  return dtt.date.fromordinal(ordinal).isoformat()

def normalizeBoolArr(boolArr):
  boolArr  = boolArr.astype(float)
  mean     = boolArr.mean()
  boolArr -= mean
  norm     = np.sqrt(np.sum(boolArr**2))
  boolArr /= norm
  return boolArr

def entropy(p):
  ind0 = p == 0
  ind1 = p == 1
  ind2 = ~(ind0 + ind1)
  p2 = p[ind2]
  
  s = np.zeros_like(p, dtype=float)
  s[ind2] = p2*np.log2(p2) + (1-p2)*np.log2(1-p2)
  return s

###############################################################################
## Main sheet

class MainSheet:
  
  def __init__(self, verbose=True):
    self.n_case = '案例'
    self.n_reportDate = '新聞稿發布日期'
    self.n_gender = '性別'
    self.n_age = '年齡'
    self.n_nationality = '國籍'
    self.n_city = '區域'
    self.n_transmission = '來源'
    self.n_travHist = '旅遊史'
    self.n_entryDate = '入境臺灣日期'
    self.n_onsetDate = '出現症狀日期'
    self.n_hospDate = '就醫日期'
    self.n_channel = '發現管道'
    self.n_symptom = '症狀'
    self.n_disease = '疾病史'
    self.n_link = '感染源'
    self.n_notes = '備註'
    self.n_discharged = '痊癒'
    self.n_disDate = '痊癒日期'
    self.n_disDate2 = '出院日期'
    self.n_confPressRel = '疾管署新聞稿'
    self.n_disPressRel = '出院新聞稿'
    
    name = '%sraw_data/武漢肺炎in臺灣相關整理(請看推廣用連結) - 臺灣武漢肺炎病例.csv' % DATA_PATH
    self.data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    reportDateList = self.data[self.n_reportDate].values
    ind = reportDateList == reportDateList
    self.N_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
    return 
    
  def getReportDate(self):
    reportDateList = []
    
    for reportDate in self.data[self.n_reportDate].values[:self.N_total]:
      reportDate = reportDate.split('日')[0].split('月')
      reportDate = '2020-%02s-%02s' % (reportDate[0], reportDate[1])
      reportDateList.append(reportDate)
    return reportDateList
  
  def getAge(self):
    age = []
    for i, a in enumerate(self.data[self.n_age].values[:self.N_total]):
      if a in ['1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X']:
        age.append(a[0]+'0s')
      elif a in ['<10', '4', '5']:
        age.append('0s')
      elif a in ['11']:
        age.append('10s')
      elif a in ['20', '27']:
        age.append('20s')
      elif a in ['30']:
        age.append('30s')
      elif a in ['2X-6X']:
        age.append(np.nan)
      else:
        print('Age, Case %d, %s' % (i+1, a))
        age.append(np.nan)
    return age
  
  def getTransmission(self):
    transList = []
    for i, trans in enumerate(self.data[self.n_transmission].values[:self.N_total]):
      if trans == '境外':
        transList.append('imported')
      
      elif trans in ['敦睦遠訓', '敦睦\n遠訓']:
        transList.append('fleet')
      
      elif trans == '本土':
        transList.append('indigenous')
      
      else:
        print('Transmission, Case %d, %s' % (i+1, trans))
        transList.append(np.nan)
    return transList
  
  def getTravHist(self):
    travHistList = []
    keyDict = {
      'China': ['中國', '武漢', '深圳', '廣州', '遼寧'],
      'Hong Kong': ['香港'],
      'Macao': ['澳門'],
      'Japan': ['日本', '東京', '大阪', '北海道'],
      'Thailand': ['泰國'], 
      'Malaysia': ['馬來西亞'], 
      'Indonesia': ['印尼'], 
      'Philippines': ['菲律賓'], 
      'Singapore': ['新加坡'], 
      
      'USA': ['美國', '加州', '紐約'], 
      'Canada': ['加拿大'], 
      'Mexico': ['墨西哥'], 
      'Chile': ['智利', '聖地牙哥'], 
      'Argentina': ['阿根廷'], 
      'Peru': ['秘魯', '祕魯'], 
      'Bolivia': ['玻利維亞'], 
      'Brazil': ['巴西'],
      'Latin America': ['中南美洲'], 
      
      'Europe': ['歐洲'], 
      'Ireland': ['愛爾蘭'], 
      'UK': ['英國', '倫敦'], 
      'France': ['法國', '巴黎'], 
      'Portugal': ['葡萄牙'], 
      'Spain': ['西班牙'], 
      'Italy': ['義大利'], 
      'Belgium': ['比利時'], 
      'Netherlands': ['荷蘭'], 
      'Luxemburg': ['盧森堡'], 
      'Switzerland': ['瑞士'], 
      'Germany': ['德國', '紐倫堡', '慕尼黑'], 
      'Austria': ['奧地利'], 
      'Czechia': ['捷克'], 
      'Danmark': ['丹麥'], 
      'Finland': ['芬蘭'], 
      'Iceland': ['冰島'], 
      'Poland': ['波蘭'], 
      'Bugaria': ['保加利亞'], 
      'Greece': ['希臘'],
      
      'Turkey': ['土耳其'], 
      'Qatar': ['阿拉伯－卡達'], 
      'UAE': ['阿拉伯－杜拜'], 
      'Egypt': ['埃及'], 
      
      'Morocco': ['摩洛哥'], 
      'Tunisia': ['突尼西亞'], 
      'South Africa': ['南非'], 
      
      'Australia': ['澳大利亞', '澳洲'], 
      'New Zealand': ['紐西蘭'], 
      'Palau': ['帛琉'], 
      
      'Antarctica': ['南極'], 
      
      'Diamond Princess': ['鑽石公主號'], 
      'Coral Princess': ['珊瑚公主號'], 
      'Pan-Shi': ['海軍敦睦支隊磐石艦', '整隊登艦', '台灣啟航', '左營靠泊檢疫'],
      'indigenous': ['無']
    }
    
    for i, travHist in enumerate(self.data[self.n_travHist].values[:self.N_total]):
      if travHist != travHist: ## Is nan
        travHistList.append([])
        continue
      
      stock = []
      
      for key, valueList in keyDict.items():
        for value in valueList:
          if value in travHist:
            travHist = ''.join(travHist.split(value))
            stock.append(key)
      
      travHist = ''.join(travHist.split('自離境前往'))
      travHist = ''.join(travHist.split('來台'))
      travHist = ''.join(travHist.split('轉機'))
      travHist = travHist.lstrip(' 0123456789/-\n月及等()、')
      
      if len(travHist) > 0:
        print('Travel history, Case %d, %s' % (i+1, travHist))
      
      stock = list(set(stock))
      travHistList.append(stock)
      
    travHistList = [travHist if len(travHist) > 0 else np.nan for travHist in travHistList]
    return travHistList
  
  def getContinent(self):
    keyDict = {
      'East Asia': ['China', 'Hong Kong', 'Macao', 'Japan', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Singapore'],
      'North America': ['USA', 'Canada', 'Mexico'], 
      'South America': ['Chile', 'Argentina', 'Peru', 'Bolivia', 'Brazil', 'Latin America'], 
      'Europe': ['Europe', 'Ireland', 'UK', 'France', 'Portugal', 'Spain', 'Italy', 'Belgium', 'Netherlands', 'Luxemburg', 'Switzerland', 
                 'Germany', 'Austria', 'Czechia', 'Danmark', 'Finland', 'Iceland', 'Poland', 'Bugaria', 'Greece'],
      'Middle East': ['Turkey', 'Qatar', 'UAE', 'Egypt'], 
      'Africa': ['Morocco', 'Tunisia', 'South Africa'],
      'Occeania': ['Australia', 'New Zealand', 'Palau'], 
      
      'Antarctica': ['Antarctica'], 
      'Others': ['Diamond Princess', 'Coral Princess', 'Pan-Shi'], 
      
      'indigenous': ['indigenous']
    }
      
    continentList = []
    
    for travHist in self.getTravHist():
      if travHist != travHist: ## Is nan
        continentList.append([])
        continue
      
      stock = []
      
      for trav in travHist:
        for key, valueList in keyDict.items():
          if trav in valueList:
            stock.append(key)
            break
      
      stock = list(set(stock))
      continentList.append(stock)
      
    continentList = [continent if len(continent) > 0 else np.nan for continent in continentList]
    return continentList
  
  def getOnsetDate(self):
    onsetDateList = []
    
    for i, onsetDate in enumerate(self.data[self.n_onsetDate].values[:self.N_total]):
      if onsetDate in ['2/18-25', 'x']:
        onsetDateList.append(np.nan)
      
      elif onsetDate != onsetDate: ## Is nan
        onsetDateList.append(np.nan)
        
      else:
        try:
          MD = onsetDate.split('/')
          onsetDate = '2020-%02d-%02d' % (int(MD[0]), int(MD[1]))
          onsetDateList.append(onsetDate)
        except:
          print('Onset date, Case %d, %s' % (i+1, onsetDate))
          onsetDateList.append(np.nan)
    
    return onsetDateList
  
  def getChannel(self):
    chanList = []
    keyList_out = ['採檢']
    
    for i, chan in enumerate(self.data[self.n_channel].values[:self.N_total]):
      if chan != chan: ## Is nan
        chanList.append(np.nan)
      
      elif chan in keyList_out:
        chanList.append(np.nan)
        
      elif '機場' in chan:
        chanList.append('airport')
        
      elif '檢疫' in chan:
        chanList.append('quarantine')
        
      elif '隔離' in chan:
        chanList.append('isolation')
        
      elif '接觸者檢查' in chan:
        chanList.append('isolation')
        
      elif '自主健康管理' in chan:
        chanList.append('monitoring')
        
      elif '加強自主管理' in chan:
        chanList.append('monitoring')
        
      elif '自行就醫' in chan:
        chanList.append('hospital')
        
      elif '自主就醫' in chan:
        chanList.append('hospital')
        
      else:
        print('Channel, Case %d, %s' % (i+1, chan))
        chanList.append(np.nan)
    return chanList
  
  def getSymptom(self):
    symptomList = []
    keyDict = {
      'sneezing': ['輕微流鼻水', '打噴嚏', '流鼻水', '流鼻涕', '鼻涕倒流', '輕微鼻塞', '鼻塞', '鼻水', '鼻炎', '感冒'],
      'cough': ['咳嗽有痰', '喉嚨有痰', '有痰', '輕微咳嗽', '咳嗽症狀', '咳嗽併痰', '咳嗽', '輕微乾咳', '乾咳', '輕咳'],
      'throatache': ['上呼吸道腫痛', '呼吸道症狀', '上呼吸道', '急性咽炎', '輕微喉嚨痛', '喉嚨痛癢', '喉嚨痛', '喉嚨癢', '喉嚨不適', '喉嚨乾', '咽喉不適'],
      'dyspnea': ['呼吸不順', '呼吸困難', '呼吸微喘', '微喘', '呼吸喘', '氣喘', '呼吸急促', '走路會喘'],
      'pneumonia': ['X光顯示肺炎', 'X光片顯示肺炎', 'X光顯示肺部輕微浸潤', '診斷為肺炎', '肺炎'], 
      
      'fever': ['微燒(37.5度)', '體溫偏高(37.4度)', '發燒(耳溫量測37.7度)', '微燒', '輕微發燒', '自覺有發燒', '間歇性發燒', '體溫偏高', '自覺發熱', '身體悶熱不適', '發燒', '發熱'],
      'chills': ['畏寒', '冒冷汗', '忽冷忽熱症狀', '發冷', '寒顫'], 
      
      'Nausea': ['噁心'],
      'vomiting': ['嘔吐'],
      'diarrhea': ['輕微腹瀉', '腹瀉'], 
      
      'headache': ['輕度頭痛', '頭痛', '頭暈', '頭脹'],
      'eyes sore': ['結膜充血', '後眼窩痛', '眼睛癢', '眼睛痛'], 
      'chest pain+backache': ['胸背痛'], 
      'chest pain': ['胸痛', '輕微胸悶', '胸悶'],
      'stomachache': ['腹悶痛', '胃痛', '腹痛', '胃脹', '胃部不適', '肚子不適'],
      'backache': ['背痛'], 
      'toothache': ['牙痛'], 
      
      'fatigue': ['全身倦怠無力', '全身倦怠', '全身疲憊', '身體無力', '全身無力', '四肢無力', '疲倦感', '倦怠', '疲憊', '無力'],
      'soreness': ['全身痠痛', '小腿肌肉痠痛', '肌肉痠痛症狀', '肌肉酸痛', '肌肉痠痛', '骨頭痠痛', '關節痠痛', '關節痛', '痠痛'],
      
      'anosmia+ageusia': ['味覺及嗅覺喪失', '味覺及嗅覺都喪失', '嗅覺和味覺喪失', '嗅味覺異常', '味嗅覺異常'], 
      'anosmia': ['嗅覺異常症狀', '自覺嗅覺喪失', '失去嗅覺', '嗅覺不靈敏', '嗅覺喪失', '喪失嗅覺', '嗅覺遲鈍', '嗅覺異常', '無嗅覺'], 
      'ageusia': ['自覺喪失味覺', '味覺喪失', '味覺異常', '失去味覺', '味覺變差'], 
      
      'lymphatic swelling': ['淋巴腫脹'], 
      'hypoglycemia': ['低血糖'], 
      'poor appetite': ['食慾不佳'],
      'arrhythmia': ['心律不整'],
      
      'symptomatic': ['有症狀', '出現症狀', '身體不適'],
      'asymptomatic': ['首例無症狀', '無症狀']
    }
    
    for i, symptom in enumerate(self.data[self.n_symptom].values[:self.N_total]):
      if symptom != symptom: ## Is nan
        symptomList.append([])
        continue
      
      stock = []
      symptom = ''.join(symptom.split('入境已無症狀'))
      symptom = ''.join(symptom.split('#68 #69 #70 #73其中一人無症狀'))
      
      for key, valueList in keyDict.items():
        for value in valueList:
          if value in symptom:
            symptom = ''.join(symptom.split(value))
            for k in key.split('+'):
              stock.append(k)
      
      symptom = ''.join(symptom.split('首例本土'))
      symptom = ''.join(symptom.split('入境前有'))
      symptom = symptom.lstrip(' \n  ，、與及')
      
      if len(symptom) > 0:
        print('Symptom, Case %d, %s' % (i+1, symptom))
      
      stock = list(set(stock))
      symptomList.append(stock)
      
    symptomList = [symptom if len(symptom) > 0 else np.nan for symptom in symptomList]
    return symptomList

  def getLink(self):
    linkList = []
    for i, link in enumerate(self.data[self.n_link].values[:self.N_total]):
      if link == '未知':
        linkList.append('unlinked')
      
      elif link == '軍艦':
        linkList.append('fleet')
      
      elif 'O' in link:
        linkList.append('linked')
      
      else:
        print('Symptom, Case %d, %s' % (i+1, link))
        linkList.append(np.nan)
    return linkList
    
  def makeTravHistHist(self):
    transList = self.getTransmission()
    travHistList = self.getTravHist()
    travHistList2 = []
    
    for trans, travHist in zip(transList, travHistList):
      if trans == 'imported' and travHist == travHist: ## Is not nan
        for trav in travHist:
          travHistList2.append(trav)
    
    hist = clt.Counter(travHistList2)
    hist = sorted(hist.items(), key=lambda x: x[1], reverse=True)
    return hist

  def makeSymptomHist(self):
    symptomList = self.getSymptom()
    symptomList2 = []
    
    for symptom in symptomList:
      if symptom == symptom: ## Is not nan
        for symp in symptom:
          symptomList2.append(symp)
    
    hist = clt.Counter(symptomList2)
    hist = sorted(hist.items(), key=lambda x: x[1], reverse=True)
    return hist
  
  def makeTravHistSymptomMat(self):
    transList = self.getTransmission()
    travHistList = self.getTravHist()
    #travHistList = self.getContinent()
    symptomList = self.getSymptom()
    travHistList2 = []
    symptomList2 = []
    N_imported = 0
    
    for trans, travHist, symptom in zip(transList, travHistList, symptomList):
      if trans == 'imported':
        N_imported += 1
        if travHist == travHist and symptom == symptom: ## Is not nan
          travHistList2.append(travHist)
          symptomList2.append(symptom)
    
    assert len(travHistList2) == len(symptomList2)
    N_data = len(travHistList2)
        
    travHistHist = clt.Counter([trav for travHist in travHistList2 for trav in travHist])
    travHistHist = sorted(travHistHist.items(), key=lambda x: x[1], reverse=True)
    symptomHist = clt.Counter([symp for symptom in symptomList2 for symp in symptom])
    symptomHist = sorted(symptomHist.items(), key=lambda x: x[1], reverse=True)
    
    travBoolMat = []
    for travHistPair in travHistHist:
      travBoolArr = [1 if travHistPair[0] in travHist else 0 for travHist in travHistList2]
      travBoolMat.append(travBoolArr)
    travBoolMat = np.array(travBoolMat)
    
    sympBoolMat = []
    for symptomPair in symptomHist:
      sympBoolArr = [1 if symptomPair[0] in symptom else 0 for symptom in symptomList2]
      sympBoolMat.append(sympBoolArr)
    sympBoolMat = np.array(sympBoolMat)
    
    return N_imported, N_data, travHistHist, symptomHist, travBoolMat, sympBoolMat
  
  def makeTravHistSymptomCorr1(self):
    N_imported, N_data, travHistHist, symptomHist, travBoolMat, sympBoolMat = self.makeTravHistSymptomMat()
    travBoolMat = travBoolMat.astype(bool)
    p_symp = [symptom[1] / N_data for symptom in symptomHist]
    
    p_symp_given_trav = []
    for travBoolArr in travBoolMat:
      sympBoolMat2 = sympBoolMat.T[travBoolArr].astype(float)
      sympBoolMat2 = sympBoolMat2.mean(axis=0)
      p_symp_given_trav.append(sympBoolMat2)
  
    corrMat  = np.array(p_symp_given_trav) - p_symp
    countMat = travBoolMat.dot(sympBoolMat.T)
    return N_imported, N_data, travHistHist, symptomHist, corrMat, countMat
    
  def makeTravHistSymptomCorr2(self):
    N_imported, N_data, travHistHist, symptomHist, travBoolMat, sympBoolMat = self.makeTravHistSymptomMat()
    travBoolMat = travBoolMat.astype(bool)
    p_symp = [symptom[1] / N_data for symptom in symptomHist]
    S_symp = entropy(np.array(p_symp))
    
    p_symp_given_trav = []
    for travBoolArr in travBoolMat:
      sympBoolMat2 = sympBoolMat.T[travBoolArr].astype(float)
      sympBoolMat2 = sympBoolMat2.mean(axis=0)
      p_symp_given_trav.append(sympBoolMat2)
  
    S_symp_given_trav = entropy(np.array(p_symp_given_trav))
    corrMat  = S_symp - S_symp_given_trav
    countMat = travBoolMat.dot(sympBoolMat.T)
    return N_imported, N_data, travHistHist, symptomHist, corrMat, countMat
    
  def makeTravHistSymptomCorr3(self):
    N_imported, N_data, travHistHist, symptomHist, travBoolMat, sympBoolMat = self.makeTravHistSymptomMat()
    
    travBoolMat_n = np.array([normalizeBoolArr(travBoolArr) for travBoolArr in travBoolMat])
    sympBoolMat_n = np.array([normalizeBoolArr(sympBoolArr) for sympBoolArr in sympBoolMat])
    
    corrMat  = travBoolMat_n.dot(sympBoolMat_n.T)
    countMat = travBoolMat.dot(sympBoolMat.T)
    return N_imported, N_data, travHistHist, symptomHist, corrMat, countMat
  
  def makeAgeSymptomMat(self):
    ageList = self.getAge()
    symptomList = self.getSymptom()
    ageList2 = []
    symptomList2 = []
    N_total = 0
    
    for age, symptom in zip(ageList, symptomList):
      N_total += 1
      if age == age and symptom == symptom: ## Is not nan
        ageList2.append(age)
        symptomList2.append(symptom)
    
    assert len(ageList2) == len(symptomList2)
    N_data = len(ageList2)
        
    ageHist = clt.Counter(ageList2)
    ageHist = sorted(ageHist.items(), key=lambda x: x[0], reverse=True)
    symptomHist = clt.Counter([symp for symptom in symptomList2 for symp in symptom])
    symptomHist = sorted(symptomHist.items(), key=lambda x: x[1], reverse=True)
    
    ageBoolMat = []
    for agePair in ageHist:
      ageBoolArr = [1 if agePair[0] == ageHist else 0 for ageHist in ageList2]
      ageBoolMat.append(ageBoolArr)
    ageBoolMat = np.array(ageBoolMat)
    
    sympBoolMat = []
    for symptomPair in symptomHist:
      sympBoolArr = [1 if symptomPair[0] in symptom else 0 for symptom in symptomList2]
      sympBoolMat.append(sympBoolArr)
    sympBoolMat = np.array(sympBoolMat)
    
    return N_total, N_data, ageHist, symptomHist, ageBoolMat, sympBoolMat
  
  def makeAgeSymptomCorr3(self):
    N_total, N_data, ageHist, symptomHist, ageBoolMat, sympBoolMat = self.makeAgeSymptomMat()
    
    ageBoolMat_n = np.array([normalizeBoolArr(ageBoolArr) for ageBoolArr in ageBoolMat])
    sympBoolMat_n = np.array([normalizeBoolArr(sympBoolArr) for sympBoolArr in sympBoolMat])
    
    corrMat  = ageBoolMat_n.dot(sympBoolMat_n.T)
    countMat = ageBoolMat.dot(sympBoolMat.T)
    return N_total, N_data, ageHist, symptomHist, corrMat, countMat
  
  def saveCsv_keyNb(self):
    timestamp = str(dtt.datetime.today())
    
    key   = ['overall_total', 'timestamp']
    value = [self.N_total, timestamp]
    
    data = {'key': key, 'value': value}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/key_numbers.csv' % DATA_PATH
    saveCsv(name, data)
    return
    
  def saveCsv_caseByTrans(self):
    reportDateList = self.getReportDate()
    onsetDateList  = self.getOnsetDate()
    transList      = self.getTransmission()
    linkList       = self.getLink()
    
    refOrd = ISODateToOrdinal('2020-01-11')
    endOrd = dtt.date.today().toordinal() + 1
    
    date       = [ordinalToISODate(i) for i in range(refOrd, endOrd)]
    nbDays     = endOrd - refOrd
    imported_r = np.zeros(nbDays, dtype=int)
    linked_r   = np.zeros(nbDays, dtype=int)
    unlinked_r = np.zeros(nbDays, dtype=int)
    fleet_r    = np.zeros(nbDays, dtype=int)
    imported_o = np.zeros(nbDays, dtype=int)
    linked_o   = np.zeros(nbDays, dtype=int)
    unlinked_o = np.zeros(nbDays, dtype=int)
    fleet_o    = np.zeros(nbDays, dtype=int)
    
    for reportDate, onsetDate, trans, link in zip(reportDateList, onsetDateList, transList, linkList):
      ind_r = ISODateToOrdinal(reportDate) - refOrd
      if ind_r < 0 or ind_r >= nbDays:
        print('Bad ind_r = %d' % ind_r)
        continue
      
      if trans == 'imported':
        imported_r[ind_r] += 1
      elif trans == 'fleet':
        fleet_r[ind_r] += 1
      elif link == 'unlinked':
        unlinked_r[ind_r] += 1
      else:
        linked_r[ind_r] += 1
      
      if onsetDate == onsetDate: ## Is not nan
        ind_o = ISODateToOrdinal(onsetDate) - refOrd
        if ind_o < 0 or ind_o >= nbDays:
          print('Bad ind_o = %d' % ind_o)
          continue
        
        if trans == 'imported':
          imported_o[ind_o] += 1
        elif trans == 'fleet':
          fleet_o[ind_o] += 1
        elif link == 'unlinked':
          unlinked_o[ind_o] += 1
        else:
          linked_o[ind_o] += 1
    
    data_r = {'date': date, 'fleet': fleet_r, 'unlinked': unlinked_r, 'linked': linked_r, 'imported': imported_r}
    data_r = pd.DataFrame(data_r)
    data_o = {'date': date, 'fleet': fleet_o, 'unlinked': unlinked_o, 'linked': linked_o, 'imported': imported_o}
    data_o = pd.DataFrame(data_o)
    
    name = '%sprocessed_data/case_by_transmission_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_r)
    name = '%sprocessed_data/case_by_transmission_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_o)
    return
  
  def saveCsv_caseByDectChan(self):
    reportDateList = self.getReportDate()
    onsetDateList  = self.getOnsetDate()
    chanList       = self.getChannel()
    
    refOrd = ISODateToOrdinal('2020-01-11')
    endOrd = dtt.date.today().toordinal() + 1
    
    date       = [ordinalToISODate(i) for i in range(refOrd, endOrd)]
    nbDays     = endOrd - refOrd
    airport_r  = np.zeros(nbDays, dtype=int)
    QT_r       = np.zeros(nbDays, dtype=int)
    iso_r      = np.zeros(nbDays, dtype=int)
    monitor_r  = np.zeros(nbDays, dtype=int)
    hospital_r = np.zeros(nbDays, dtype=int)
    noData_r   = np.zeros(nbDays, dtype=int)
    airport_o  = np.zeros(nbDays, dtype=int)
    QT_o       = np.zeros(nbDays, dtype=int)
    iso_o      = np.zeros(nbDays, dtype=int)
    monitor_o  = np.zeros(nbDays, dtype=int)
    hospital_o = np.zeros(nbDays, dtype=int)
    noData_o   = np.zeros(nbDays, dtype=int)
    
    for reportDate, onsetDate, chan in zip(reportDateList, onsetDateList, chanList):
      ind_r = ISODateToOrdinal(reportDate) - refOrd
      if ind_r < 0 or ind_r >= nbDays:
        print('Bad ind_r = %d' % ind_r)
        continue
      
      if chan == 'airport':
        airport_r[ind_r] += 1
      elif chan == 'quarantine':
        QT_r[ind_r] += 1
      elif chan == 'isolation':
        iso_r[ind_r] += 1
      elif chan == 'monitoring':
        monitor_r[ind_r] += 1
      elif chan == 'hospital':
        hospital_r[ind_r] += 1
      elif chan != chan: ## Is nan
        noData_r[ind_r] += 1
      
      if onsetDate == onsetDate: ## Is not nan
        ind_o = ISODateToOrdinal(onsetDate) - refOrd
        if ind_o < 0 or ind_o >= nbDays:
          print('Bad ind_o = %d' % ind_o)
          continue
        
        if chan == 'airport':
          airport_o[ind_o] += 1
        elif chan == 'quarantine':
          QT_o[ind_o] += 1
        elif chan == 'isolation':
          iso_o[ind_o] += 1
        elif chan == 'monitoring':
          monitor_o[ind_o] += 1
        elif chan == 'hospital':
          hospital_o[ind_o] += 1
        elif chan != chan: ## Is nan
          noData_o[ind_r] += 1
    
    data_r = {'date': date, 'no_data': noData_r, 'hospital': hospital_r, 'monitoring': monitor_r, 'isolation': iso_r, 'quarantine': QT_r, 'airport': airport_r}
    data_r = pd.DataFrame(data_r)
    data_o = {'date': date, 'no_data': noData_o, 'hospital': hospital_o, 'monitoring': monitor_o, 'isolation': iso_o, 'quarantine': QT_o, 'airport': airport_o}
    data_o = pd.DataFrame(data_o)
    
    name = '%sprocessed_data/case_by_detection_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_r)
    name = '%sprocessed_data/case_by_detection_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_o)
    return

  def saveCsv_travHistSymptomCorr(self):
    N_imported, N_data, travHistHist, symptomHist, corrMat, countMat = self.makeTravHistSymptomCorr3()
    N_min = N_data * 0.033
    
    N_trav = sum([1 if travHist[1] > N_min else 0 for travHist in travHistHist])
    N_symp = sum([1 if symptom[1] > N_min else 0 for symptom in symptomHist])
    
    corrMat = corrMat[:N_trav, :N_symp]
    countMat = countMat[:N_trav, :N_symp]
    travHistHist = travHistHist[:N_trav]
    symptomHist = symptomHist[:N_symp]
    
    travHistList = [trav[0] for trav in travHistHist]
    symptomList = [symp[0] for symp in symptomHist]
    grid = np.meshgrid(symptomList, travHistList)
    
    symptom   = grid[0].flatten()
    trav_hist = grid[1].flatten()
    value_r   = corrMat.flatten()
    label_r   = ['%+.0f%%' % (100*v) for v in value_r]
    label_n   = countMat.flatten()
    
    data = {'symptom': symptom, 'trav_hist': trav_hist, 'value': value_r, 'label': label_r}
    data = pd.DataFrame(data)
    
    data2 = {'symptom': symptom, 'trav_hist': trav_hist, 'value': value_r, 'label': label_n}
    data2 = pd.DataFrame(data2)
    
    pairList = [('N_imported', N_imported), ('N_data', N_data)] + travHistHist + symptomHist
    label = [pair[0] for pair in pairList]
    count = [pair[1] for pair in pairList]
    label_zh = ['境外移入總數', '有資料案例數'] + [TRAVEL_HISTORY_DICT[trav] for trav in travHistList] + [SYMPTOM_DICT[symp] for symp in symptomList]
    data3 = {'label': label, 'count': count, 'label_zh': label_zh}
    data3 = pd.DataFrame(data3)
    
    name = '%sprocessed_data/travel_history_symptom_correlations_coefficient.csv' % DATA_PATH
    saveCsv(name, data)
    name = '%sprocessed_data/travel_history_symptom_correlations_counts.csv' % DATA_PATH
    saveCsv(name, data2)
    name = '%sprocessed_data/travel_history_symptom_counts.csv' % DATA_PATH
    saveCsv(name, data3)
    return
  
  def saveCsv_ageSymptomCorr(self):
    N_total, N_data, ageHist, symptomHist, corrMat, countMat = self.makeAgeSymptomCorr3()
    N_min = N_data * 0.033
    
    N_age  = corrMat.shape[0]
    N_symp = sum([1 if symptom[1] > N_min else 0 for symptom in symptomHist])
    
    corrMat = corrMat[:N_age, :N_symp]
    countMat = countMat[:N_age, :N_symp]
    ageHist = ageHist[:N_age]
    symptomHist = symptomHist[:N_symp]
    
    ageList = [age[0] for age in ageHist]
    symptomList = [symp[0] for symp in symptomHist]
    grid = np.meshgrid(symptomList, ageList)
    
    symptom = grid[0].flatten()
    age     = grid[1].flatten()
    value_r = corrMat.flatten()
    label_r = ['%+.0f%%' % (100*v) for v in value_r]
    label_n = countMat.flatten()
    
    data = {'symptom': symptom, 'age': age, 'value': value_r, 'label': label_r}
    data = pd.DataFrame(data)
    
    data2 = {'symptom': symptom, 'age': age, 'value': value_r, 'label': label_n}
    data2 = pd.DataFrame(data2)
    
    pairList = [('N_total', N_total), ('N_data', N_data)] + ageHist + symptomHist
    label = [pair[0] for pair in pairList]
    count = [pair[1] for pair in pairList]
    
    label_zh = ['個案總數', '有資料案例數'] + [AGE_DICT[age] for age in ageList] + [SYMPTOM_DICT[symp] for symp in symptomList]
    data3 = {'label': label, 'count': count, 'label_zh': label_zh}
    data3 = pd.DataFrame(data3)
    
    name = '%sprocessed_data/age_symptom_correlations_coefficient.csv' % DATA_PATH
    saveCsv(name, data)
    name = '%sprocessed_data/age_symptom_correlations_counts.csv' % DATA_PATH
    saveCsv(name, data2)
    name = '%sprocessed_data/age_symptom_counts.csv' % DATA_PATH
    saveCsv(name, data3)
    return
  
  def saveCsv(self):
    self.saveCsv_keyNb()
    self.saveCsv_caseByTrans()
    self.saveCsv_caseByDectChan()
    self.saveCsv_travHistSymptomCorr()
    self.saveCsv_ageSymptomCorr()
    return

###############################################################################
## Test sheet

class TestSheet:
  
  def __init__(self, verbose=True):
    self.n_date = '日期'
    self.n_fromExtended = '擴大監測'
    self.n_cumFromEextended = '擴大監測累計'
    self.n_fromQT = '居檢送驗'
    self.n_cumFromQT = '居檢送驗累計'
    self.n_fromClinicalDef = '武肺通報'
    self.n_cumFromClinicalDef = '武肺通報累計'
    self.n_nbTests = '檢驗人數'
    self.n_cumNbTests = '檢驗人數累計'
    self.n_confirmed = '確診人數'
    self.n_cumConfirmed = '確診人數累計'
    self.n_dailyPosRate = '單日陽性率'
    self.n_totPosRate = '陽性率'
    self.n_note1 = '擴大之檢驗標準(含擴大監測標準及通報定義)'
    self.n_note2 = '來源：疾管署（每天1am更新）'
    
    name = '%sraw_data/武漢肺炎in臺灣相關整理(請看推廣用連結) - 檢驗人數.csv' % DATA_PATH
    self.data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    dateList = self.data[self.n_date].values
    ind = dateList == dateList
    self.N_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
    return 
    
  def getDate(self):
    dateList = []
    
    for date in self.data[self.n_date].values[:self.N_total]:
      MD = date.split('/')
      date = '2020-%02d-%02d' % (int(MD[0]), int(MD[1]))
      dateList.append(date)
    return dateList
  
  def getFromExtended(self):
    fromExtList = []
    for fromExt in self.data[self.n_fromExtended].values[:self.N_total]:
      if fromExt != fromExt: ## Is nan
        fromExtList.append(0)
        continue
      
      try:
        fromExt = fromExt.lstrip('+').split(',')
        fromExt = int(''.join(fromExt))
        fromExtList.append(fromExt)
      except:
        print('From extended, %s' % fromExt)
        fromExtList.append(0)
    return fromExtList

  def getFromQT(self):
    fromQTList = []
    for fromQT in self.data[self.n_fromQT].values[:self.N_total]:
      if fromQT != fromQT: ## Is nan
        fromQTList.append(0)
        continue
        
      try:
        fromQT = fromQT.lstrip('+').split(',')
        fromQT = int(''.join(fromQT))
        fromQTList.append(fromQT)
      except:
        print('From extended, %s' % fromQT)
        fromQTList.append(0)
    return fromQTList

  def getFromClinicalDef(self):
    clinicalDefList = []
    for clinicalDef in self.data[self.n_fromClinicalDef].values[:self.N_total]:
      if clinicalDef != clinicalDef: ## Is nan
        clinicalDefList.append(np.nan)
        continue
        
      try:
        clinicalDef = clinicalDef.lstrip('+').split(',')
        clinicalDef = int(''.join(clinicalDef))
        clinicalDefList.append(clinicalDef)
      except:
        print('Clinical definition, %s' % clinicalDef)
        clinicalDefList.append(0)
    return clinicalDefList

  def saveCsv_testByCriterion(self):
    dateList    = self.getDate()
    fromExtList = self.getFromExtended()
    fromQTList  = self.getFromQT()
    fromClinicalDefList = self.getFromClinicalDef()
    
    if dateList[-1] != dateList[-1]: ## Is nan
      dateList    = dateList[:-1]
      fromExtList = fromExtList[:-1]
      fromQTList  = fromQTList[:-1]
      fromClinicalDefList = fromClinicalDefList[:-1]
    
    data = {'date': dateList, 'clinical': fromClinicalDefList, 'quarantine': fromQTList, 'extended': fromExtList}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/test_by_criterion.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_testByCriterion()
    return

###############################################################################
## Sandbox

def sandbox():
  sheet = MainSheet()
  print(sheet.getAge())
  #sheet.saveCsv_travHistSymptomCorr()
  
  #sheet = TestSheet()
  #print(sheet.getDate())
  #sheet.saveCsv()
  return

###############################################################################
## Save

def saveCsv_all():
  MainSheet().saveCsv()
  TestSheet().saveCsv()
  return

###############################################################################
## Main

if __name__ == '__main__':
  saveCsv_all()

###############################################################################

