

    ##########################################
    ##  COVID_breakdown_data_processing.py  ##
    ##  Chieh-An Lin                        ##
    ##  Version 2020.12.07                  ##
    ##########################################


import os
import sys
import warnings
import collections as clt
import datetime as dtt

import numpy as np
import scipy as sp
import matplotlib as mpl
import pandas as pd


################################################################################
## Global variables

DATA_PATH = '/home/linc/03_Codes/COVID_breakdown/'
REF_ISO_DATE = '2020-01-01'
NB_LOOKBACK_DAYS = 90

SYMPTOM_DICT = {
  'sneezing': {'zh-tw': '鼻腔症狀', 'fr': 'éternuement'},
  'cough': {'zh-tw': '咳嗽', 'fr': 'toux'},
  'throatache': {'zh-tw': '喉嚨症狀', 'fr': 'mal de gorge'},
  'dyspnea': {'zh-tw': '呼吸困難', 'fr': 'dyspnée'}, 
  'pneumonia': {'zh-tw': '肺炎', 'fr': 'pneumonie'}, 
  
  'fever': {'zh-tw': '發燒', 'fr': 'fièvre'},
  'chills': {'zh-tw': '畏寒', 'fr': 'frissons'}, 
  
  'nausea': {'zh-tw': '噁心', 'fr': 'nausée'},
  'vomiting': {'zh-tw': '嘔吐', 'fr': 'vomissement'},
  'diarrhea': {'zh-tw': '腹瀉', 'fr': 'diarrhée'}, 
  
  'headache': {'zh-tw': '頭痛', 'fr': 'mal de tête'},
  'eyes sore': {'zh-tw': '眼痛', 'fr': 'mal aux yeux'}, 
  'chest pain': {'zh-tw': '胸痛', 'fr': 'mal à la poitrine'}, 
  'stomachache': {'zh-tw': '腹痛', 'fr': 'mal de ventre'},
  'backache': {'zh-tw': '背痛', 'fr': 'mal de dos'}, 
  'toothache': {'zh-tw': '牙痛', 'fr': 'mal de dents'}, 
  
  'fatigue': {'zh-tw': '倦怠', 'fr': 'fatigue'},
  'soreness': {'zh-tw': '痠痛', 'fr': 'myalgie'},
  'hypersomnia': {'zh-tw': '嗜睡', 'fr': 'hypersomnie'},
  
  'anosmia': {'zh-tw': '嗅覺異常', 'fr': 'anosmie'}, 
  'ageusia': {'zh-tw': '味覺異常', 'fr': 'agueusie'},
  
  'lymphadenopathy': {'zh-tw': '淋巴腫脹', 'fr': 'adénopathie'}, 
  'hypoglycemia': {'zh-tw': '低血糖', 'fr': 'hypoglycémie'}, 
  'anorexia': {'zh-tw': '食慾不佳', 'fr': 'anorexie'},
  'arrhythmia': {'zh-tw': '心律不整', 'fr': 'arythmie'},
  
  'symptomatic': {'zh-tw': '有症狀', 'fr': 'symptomatique'},
  'asymptomatic': {'zh-tw': '無症狀', 'fr': 'asymptomatique'} 
}

TRAVEL_HISTORY_DICT = {
  'Bangladesh': {'zh-tw': '孟加拉', 'fr': 'Bangladesh'},
  'China': {'zh-tw': '中國', 'fr': 'Chine'},
  'Hong Kong': {'zh-tw': '香港', 'fr': 'Hong Kong'},
  'Indonesia': {'zh-tw': '印尼', 'fr': 'Indonésie'},
  'India': {'zh-tw': '印度', 'fr': 'Inde'},
  'Japan': {'zh-tw': '日本', 'fr': 'Japon'},
  'Macao': {'zh-tw': '澳門', 'fr': 'Macao'},
  'Malaysia': {'zh-tw': '馬來西亞', 'fr': 'Malaisie'},
  'Myanmar': {'zh-tw': '緬甸', 'fr': 'Myanmar'},
  'Nepal': {'zh-tw': '尼泊爾', 'fr': 'Népal'},
  'Philippines': {'zh-tw': '菲律賓', 'fr': 'Philippines'},
  'Singapore': {'zh-tw': '新加坡', 'fr': 'Singapour'},
  'Thailand': {'zh-tw': '泰國', 'fr': 'Thaïlande'},
  
  'Argentina': {'zh-tw': '阿根廷', 'fr': 'Argentine'},
  'Bolivia': {'zh-tw': '玻利維亞', 'fr': 'Bolivie'},
  'Brazil': {'zh-tw': '巴西', 'fr': 'Brésil'},
  'Canada': {'zh-tw': '加拿大', 'fr': 'Canada'},
  'Chile': {'zh-tw': '智利', 'fr': 'Chili'},
  'Guatemala': {'zh-tw': '瓜地馬拉', 'fr': 'Guatemala'}, 
  'Latin America': {'zh-tw': '中南美洲', 'fr': 'Amérique latine'},
  'Mexico': {'zh-tw': '墨西哥', 'fr': 'Mexique'},
  'Peru': {'zh-tw': '秘魯', 'fr': 'Pérou'},
  'USA': {'zh-tw': '美國', 'fr': 'États-Unis'},
  
  'Europe': {'zh-tw': '歐洲', 'fr': 'Europe'},
  'Austria': {'zh-tw': '奧地利', 'fr': 'Autriche'},
  'Belarus': {'zh-tw': '白俄羅斯', 'fr': 'Biélorussie'},
  'Belgium': {'zh-tw': '比利時', 'fr': 'Belgique'},
  'Bulgaria': {'zh-tw': '保加利亞', 'fr': 'Bulgarie'},
  'Croatia': {'zh-tw': '克羅埃西亞', 'fr': 'Croatie'},
  'Czechia': {'zh-tw': '捷克', 'fr': 'Tchéquie'},
  'Danmark': {'zh-tw': '丹麥', 'fr': 'Danemark'},
  'Finland': {'zh-tw': '芬蘭', 'fr': 'Finlande'},
  'France': {'zh-tw': '法國', 'fr': 'France'},
  'Germany': {'zh-tw': '德國', 'fr': 'Allemagne'},
  'Greece': {'zh-tw': '希臘', 'fr': 'Grèce'},
  'Iceland': {'zh-tw': '冰島', 'fr': 'Islande'},
  'Ireland': {'zh-tw': '愛爾蘭', 'fr': 'Irlande'},
  'Italy': {'zh-tw': '義大利', 'fr': 'Italie'},
  'Luxemburg': {'zh-tw': '盧森堡', 'fr': 'Luxembourg'},
  'Netherlands': {'zh-tw': '荷蘭', 'fr': 'Pays-Bas'},
  'Poland': {'zh-tw': '波蘭', 'fr': 'Pologne'},
  'Portugal': {'zh-tw': '葡萄牙', 'fr': 'Portugal'},
  'Russia': {'zh-tw': '俄羅斯', 'fr': 'Russie'},
  'Spain': {'zh-tw': '西班牙', 'fr': 'Espagne'},
  'Switzerland': {'zh-tw': '瑞士', 'fr': 'Suisse'},
  'UK': {'zh-tw': '英國', 'fr': 'Royaume-Uni'},
  'Ukraine': {'zh-tw': '烏克蘭', 'fr': 'Ukraine'},
  
  'Oman': {'zh-tw': '阿曼', 'fr': 'Oman'},
  'Qatar': {'zh-tw': '卡達', 'fr': 'Qatar'},
  'Turkey': {'zh-tw': '土耳其', 'fr': 'Turquie'},
  'UAE': {'zh-tw': '阿拉伯聯合大公國', 'fr': 'EAU'},
  
  'Egypt': {'zh-tw': '埃及', 'fr': 'Égypte'},
  'Ghana': {'zh-tw': '迦納', 'fr': 'Ghana'},
  'Lesotho': {'zh-tw': '賴索托', 'fr': 'Lesotho'},
  'Morocco': {'zh-tw': '摩洛哥', 'fr': 'Maroc'},
  'Senegal': {'zh-tw': '塞內加爾', 'fr': 'Sénégal'},
  'South Africa': {'zh-tw': '南非', 'fr': 'Afrique du Sud'},
  'Tunisia': {'zh-tw': '突尼西亞', 'fr': 'Tunisie'},
  
  'Australia': {'zh-tw': '澳洲', 'fr': 'Australie'},
  'New Zealand': {'zh-tw': '紐西蘭', 'fr': 'Nouvelle-Zélande'},
  'Palau': {'zh-tw': '帛琉', 'fr': 'Palaos'},
  
  'Antarctica': {'zh-tw': '南極', 'fr': 'Antartique'},
  
  'Coral Princess': {'zh-tw': '珊瑚公主號', 'fr': 'Coral Princess'},
  'Diamond Princess': {'zh-tw': '鑽石公主號', 'fr': 'Diamond Princess'}, 
  'Pan-Shi': {'zh-tw': '磐石艦', 'fr': 'Pan-Shi'},
  'indigenous': {'zh-tw': '無', 'fr': 'local'}
}

AGE_DICT = {
  '0s': {'zh-tw': '<10歲', 'fr': '< 10 ans'},
  '10s': {'zh-tw': '10-19歲', 'fr': '10aine'},
  '20s': {'zh-tw': '20-29歲', 'fr': '20aine'},
  '30s': {'zh-tw': '30-39歲', 'fr': '30aine'},
  '40s': {'zh-tw': '40-49歲', 'fr': '40aine'},
  '50s': {'zh-tw': '50-59歲', 'fr': '50aine'},
  '60s': {'zh-tw': '60-69歲', 'fr': '60aine'},
  '70s': {'zh-tw': '70-79歲', 'fr': '70aine'},
  '80s': {'zh-tw': '80-89歲', 'fr': '80aine'},
  '90s': {'zh-tw': '90-99歲', 'fr': '90aine'},
  #'100s': {'zh-tw': '>100歲', 'fr': '100aine'}
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
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter("ignore")
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

def asFloat(a, copy=True):
  if np.isscalar(a):
    return float(a)
  if type(a) is list:
    return np.array(a, dtype=float)
  return a.astype(float, copy=copy)

def centerOfBins(bins, area=False):
  bins  = np.array(bins, dtype=float)
  left  = bins[:-1]
  right = bins[1:]
  if area is True:
    return np.sqrt(0.5 * (left**2 + right**2))
  return 0.5 * (left + right)

def makeHist(data, bins, wgt=None, factor=1.0, pdf=False):
  """
  Make the histogram such that the output can be plotted directly
  
  Parameters
  ----------
  data : array-like
  bins : (1, N) float array
    bin edges
  factor : float, optional
    rescaling factor for the histogram
  pdf : bool, optional
    make the output a pdf, i.e. normalized by the binwidth & the total counts
  
  Returns
  -------
  n : (1, N) float array
    number counts, could be rescaled
  ctrBin : (1, N) float array
    center of the bins
    n & ctrBin have the same size.
  """
  nArr, bins = np.histogram(data, bins, weights=wgt)
  ctrBin     = centerOfBins(bins)
  if pdf == True:
    nArr = asFloat(nArr) / (float(sum(nArr)) * (bins[1:] - bins[:-1]))
  else:
    nArr = asFloat(nArr) * factor
  return nArr, ctrBin

def adjustDateRange(data):
  refOrd   = ISODateToOrdinal(REF_ISO_DATE)
  beginOrd = ISODateToOrdinal(data['date'].values[0])
  endOrd   = ISODateToOrdinal(data['date'].values[-1]) + 1
  todayOrd = dtt.date.today().toordinal() + 1
  
  zero   = [0] * (len(data.columns) - 1)
  stock1 = []
  stock2 = []
  
  for ord in range(refOrd, beginOrd):
    ISO = ordinalToISODate(ord)
    stock1.append([ISO] + zero)
    
  for ord in range(endOrd, todayOrd):
    ISO = ordinalToISODate(ord)
    stock2.append([ISO] + zero)
  
  if refOrd > beginOrd:
    data = data[refOrd-beginOrd:]
  
  data1 = pd.DataFrame(stock1, columns=data.columns)
  data2 = pd.DataFrame(stock2, columns=data.columns)
  data  = pd.concat([data1, data, data2])
  return data

###############################################################################
## Template

class Template:
  
  def getCol(self, col):
    return self.data[col].values

###############################################################################
## Main sheet

class MainSheet(Template):
  
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
    
    self.N_total = 0
    self.N_latest = 0
    self.N_2020 = 0
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_case_breakdown.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    caseNbList = data[self.n_case].values
    ind = caseNbList == caseNbList
    self.data = data[ind]
    
    self.getReportDate()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
      print('N_latest = %d' % self.N_latest)
      print('N_2020 = %d' % self.N_2020)
    return 
    
  def getReportDate(self):
    todayOrd = dtt.date.today().toordinal() + 1
    end2020Ord = ISODateToOrdinal('2020-12-31') + 1
    reportDateList = []
    N_total = 0
    N_latest = 0
    N_2020 = 0
    
    for reportDate in self.getCol(self.n_reportDate):
      if reportDate != reportDate: ## NaN
        reportDateList.append(np.nan)
        continue
      
      reportDate = reportDate.split('日')[0].split('月')
      reportDate = '2020-%02s-%02s' % (reportDate[0], reportDate[1])
      reportDateList.append(reportDate)
      N_total += 1
      
      reportOrd = ISODateToOrdinal(reportDate)
      
      if reportOrd + NB_LOOKBACK_DAYS >= todayOrd:
        N_latest += 1
        
      if reportOrd < end2020Ord:
        N_2020 += 1
    
    self.N_total = N_total
    self.N_latest = N_latest
    self.N_2020 = N_2020
    return reportDateList
  
  def getAge(self):
    age = []
    for i, a in enumerate(self.getCol(self.n_age)):
      if a in ['1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X', '9X']:
        age.append(a[0]+'0s')
      elif a in ['1XX', '10X', '11X']:
        age.append('100s')
      elif a in ['<10', '4', '5']:
        age.append('0s')
      elif a in ['11']:
        age.append('10s')
      elif a in ['20', '27']:
        age.append('20s')
      elif a in ['30']:
        age.append('30s')
      elif a in ['2X-6X', '1X-2X', '2X-4X', '3X-4X', '2X-3X']:
        age.append(np.nan)
      elif a != a:
        age.append(np.nan)
      else:
        print('Age, Case %d, %s' % (i+1, a))
        age.append(np.nan)
    return age
  
  def getTransmission(self):
    transList = []
    for i, trans in enumerate(self.getCol(self.n_transmission)):
      if trans != trans:
        transList.append(np.nan)
      
      elif trans == '境外':
        transList.append('imported')
      
      elif trans in ['敦睦遠訓', '敦睦\n遠訓']:
        transList.append('fleet')
      
      elif trans == '本土':
        transList.append('indigenous')
      
      elif trans == '不明':
        transList.append('imported') #WARNING Shortcut
      
      else:
        print('Transmission, Case %d, %s' % (i+1, trans))
        transList.append(np.nan)
    return transList
  
  def getNationality(self):
    natList = []
    for nat in self.getCol(self.n_nationality):
      natList.append(nat)
    return natList
  
  def getTravHist(self):
    keyDict = {
      'Bangladesh': ['孟加拉'],
      'China': ['中國', '武漢', '深圳', '廣州', '遼寧', '江蘇'],
      'Hong Kong': ['香港'],
      'India': ['印度'], 
      'Indonesia': ['印尼'], 
      'Japan': ['日本', '東京', '大阪', '北海道'],
      'Macao': ['澳門'],
      'Malaysia': ['馬來西亞'], 
      'Myanmar' : ['緬甸'],
      'Nepal': ['尼泊爾'],
      'Philippines': ['菲律賓'], 
      'Singapore': ['新加坡'], 
      'Thailand': ['泰國', '曼谷'], 
      
      'Argentina': ['阿根廷'], 
      'Bolivia': ['玻利維亞'], 
      'Brazil': ['巴西'],
      'Canada': ['加拿大'], 
      'Chile': ['智利', '聖地牙哥'], 
      'Guatemala': ['瓜地馬拉'], 
      'Latin America': ['中南美洲'], 
      'Mexico': ['墨西哥'], 
      'Peru': ['秘魯', '祕魯'], 
      'USA': ['美國', '加州', '紐約'], 
      
      'Europe': ['歐洲'], 
      'Austria': ['奧地利'], 
      'Belarus': ['白俄羅斯'],
      'Belgium': ['比利時'], 
      'Bulgaria': ['保加利亞'], 
      'Croatia': ['克羅埃西亞'],
      'Czechia': ['捷克'], 
      'Danmark': ['丹麥'], 
      'Finland': ['芬蘭'], 
      'France': ['法國', '巴黎'], 
      'Germany': ['德國', '紐倫堡', '慕尼黑'], 
      'Greece': ['希臘'],
      'Iceland': ['冰島'], 
      'Ireland': ['愛爾蘭'], 
      'Italy': ['義大利'], 
      'Luxemburg': ['盧森堡'], 
      'Netherlands': ['荷蘭'], 
      'Poland': ['波蘭'], 
      'Portugal': ['葡萄牙'], 
      'Russia': ['俄羅斯'],
      'Spain': ['西班牙'], 
      'Switzerland': ['瑞士'], 
      'UK': ['英國', '倫敦'], 
      'Ukraine': ['烏克蘭'],
      
      'Oman': ['阿曼'],
      'Qatar': ['阿拉伯－卡達', '卡達'], 
      'Turkey': ['土耳其'], 
      'UAE': ['阿拉伯－杜拜', '杜拜'], 
      
      'Egypt': ['埃及'], 
      'Ghana': ['迦納'], 
      'Lesotho': ['賴索托'],
      'Morocco': ['摩洛哥'], 
      'Senegal': ['塞內加爾'],
      'South Africa': ['南非'], 
      'Tunisia': ['突尼西亞'], 
      
      'Australia': ['澳大利亞', '澳洲'], 
      'New Zealand': ['紐西蘭'], 
      'Palau': ['帛琉'], 
      
      'Antarctica': ['南極'], 
      
      'Coral Princess': ['珊瑚公主號'], 
      'Diamond Princess': ['鑽石公主號'], 
      'Pan-Shi': ['海軍敦睦支隊磐石艦', '整隊登艦', '台灣啟航', '左營靠泊檢疫'],
      'indigenous': ['無']
    }
    natList = self.getNationality()
    travHistList = []
    
    for i, travHist in enumerate(self.getCol(self.n_travHist)):
      if travHist != travHist: ## Is nan
        travHistList.append([])
        continue
      
      stock = []
      
      ## Scan the content with all keys
      for key, valueList in keyDict.items():
        for value in valueList:
          if value in travHist:
            travHist = ''.join(travHist.split(value))
            stock.append(key) ## Put the translation in stock
      
      ## Remove meaningless words
      travHist = ''.join(travHist.split('自離境前往'))
      travHist = ''.join(travHist.split('從搭機'))
      travHist = ''.join(travHist.split('返國'))
      travHist = ''.join(travHist.split('來台'))
      travHist = ''.join(travHist.split('轉機'))
      travHist = ''.join(travHist.split('下旬'))
      travHist = ''.join(travHist.split('上旬'))
      travHist = ''.join(travHist.split('中旬'))
      travHist = ''.join(travHist.split('台灣'))
      travHist = travHist.lstrip(' 0123456789/-\n月及等經()、→ ')
      
      ## Complain if unrecognized texts remain
      if len(travHist) > 0:
        print('Travel history, Case %d, %s' % (i+1, travHist))
      
      ## If no travel history but imported, add nationality (only for i >= 460)
      if i >= 460 and len(stock) == 0:
        for key, valueList in keyDict.items():
          for value in valueList:
            if value in natList[i]:
              stock.append(key)
              break
      
      stock = list(set(stock))
      travHistList.append(stock)
      
    travHistList = [travHist if len(travHist) > 0 else np.nan for travHist in travHistList]
    return travHistList
  
  ##WARNING require updates
  def getContinent(self):
    keyDict = {
      'East Asia': ['China', 'Hong Kong', 'Macao', 'Japan', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Singapore', 'Bangladesh'],
      'North America': ['USA', 'Canada', 'Mexico'], 
      'South America': ['Chile', 'Argentina', 'Peru', 'Bolivia', 'Brazil', 'Guatemala', 'Latin America'], 
      'Europe': ['Europe', 'Ireland', 'UK', 'France', 'Portugal', 'Spain', 'Italy', 'Belgium', 'Netherlands', 'Luxemburg', 'Switzerland', 
                 'Germany', 'Austria', 'Czechia', 'Danmark', 'Finland', 'Iceland', 'Poland', 'Bulgaria', 'Greece', 'Russia'],
      'Middle East': ['Turkey', 'Qatar', 'UAE', 'Egypt', 'Oman'], 
      'Africa': ['Morocco', 'Tunisia', 'South Africa', 'Senegal'],
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
  
  def getEntryDate(self):
    entryDateList = []
    
    for i, entryDate in enumerate(self.getCol(self.n_entryDate)):
      if entryDate != entryDate: ## NaN
        entryDateList.append(np.nan)
        
      elif entryDate in ['3/1\n3/8']:
        entryDateList.append('2020-03-08')
      
      elif entryDate in ['10/28(29)']:
        entryDateList.append('2020-10-28')
      
      elif entryDate in ['11/7(8)']:
        entryDateList.append('2020-11-07')
      
      elif entryDate in ['11/20(-27)']:
        entryDateList.append('2020-11-24')
        
      elif entryDate in ['11/28(12/2)']:
        entryDateList.append('2020-11-30')
      
      else:
        try:
          MD = entryDate.split('/')
          entryDate = '2020-%02d-%02d' % (int(MD[0]), int(MD[1]))
          entryDateList.append(entryDate)
        except:
          print('Entry date, Case %d, %s' % (i+1, entryDate))
          entryDateList.append(np.nan)
    
    return entryDateList
  
  def getOnsetDate(self):
    onsetDateList = []
    
    for i, onsetDate in enumerate(self.getCol(self.n_onsetDate)):
      if onsetDate != onsetDate: ## NaN
        onsetDateList.append(np.nan)
      
      elif onsetDate in ['2/18-25', '9月下旬', '10月中旬', '11月初', 'x', 'X']:
        onsetDateList.append(np.nan)
        
      elif onsetDate in ['7月、11/1']:
        onsetDateList.append('2020-11-01')
        
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
    
    for i, chan in enumerate(self.getCol(self.n_channel)):
      if chan != chan: ## Is nan
        chanList.append(np.nan)
      
      elif chan in keyList_out:
        chanList.append(np.nan)
        
      elif '機場' in chan:
        chanList.append('airport')
        
      elif '檢疫' in chan or '回溯性採檢' in chan:
        chanList.append('quarantine')
        
      elif '隔離' in chan or '接觸者檢查' in chan:
        chanList.append('isolation')
        
      elif '自主健康管理' in chan or '加強自主管理' in chan:
        chanList.append('monitoring')
        
      elif '自行就醫' in chan or '自主就醫' in chan or '自費篩檢' in chan or '自費檢驗' in chan:
        chanList.append('hospital')
        
      elif '香港檢驗' in chan:
        chanList.append('overseas')
        
      else:
        print('Channel, Case %d, %s' % (i+1, chan))
        chanList.append(np.nan)
    return chanList
  
  def getSymptom(self):
    keyDict = {
      'sneezing': ['伴隨感冒症狀', '輕微流鼻水', '打噴嚏', '流鼻水', '流鼻涕', '鼻涕倒流', '輕微鼻塞', '鼻塞', '鼻水', '鼻炎', '感冒'],
      'cough': ['咳嗽有痰', '喉嚨有痰', '有痰', '輕微咳嗽', '咳嗽症狀', '咳嗽併痰', '咳嗽加劇', '咳嗽', '輕微乾咳', '乾咳', '輕咳'],
      'throatache': ['上呼吸道腫痛', '呼吸道症狀', '上呼吸道', '急性咽炎', '聲音沙啞', '輕微喉嚨癢', '輕微喉嚨痛', '喉嚨痛癢', '喉嚨乾癢', '喉嚨痛', '喉嚨癢', '喉嚨腫', '喉嚨不適', '喉嚨乾', '咽喉不適', '喉嚨有異物感', '喉嚨'],
      'dyspnea': ['呼吸不順', '呼吸困難', '呼吸微喘', '呼吸短促', '呼吸急促', '微喘', '呼吸喘', '氣喘', '走路會喘'],
      'pneumonia': ['X光顯示肺炎', 'X光片顯示肺炎', 'X光顯示肺部輕微浸潤', '診斷為肺炎', '肺炎'], 
      
      'fever': ['微燒(37.5度)', '體溫偏高(37.4度)', '發燒(耳溫量測37.7度)', '微燒', '輕微發燒', '自覺有發燒', '間歇性發燒', '體溫偏高', '自覺發熱', '身體悶熱不適', '發燒', '發熱', '盜汗'],
      'chills': ['畏寒', '冒冷汗', '忽冷忽熱症狀', '發冷', '寒顫'], 
      
      'nausea': ['噁心'],
      'vomiting': ['嘔吐'],
      'diarrhea': ['輕微腹瀉', '腹瀉'], 
      
      'headache': ['輕微頭痛', '輕度頭痛', '頭痛', '頭暈', '頭脹'],
      'eyes sore': ['結膜充血', '後眼窩痛', '眼睛癢', '眼睛痛'], 
      'chest pain+backache': ['胸背痛'], 
      'chest pain': ['呼吸時胸痛', '胸痛', '輕微胸悶', '胸悶'],
      'stomachache': ['腹悶痛', '胃痛', '腹痛', '胃脹', '胃部不適', '肚子不適'],
      'backache': ['背痛'], 
      'toothache': ['牙痛'], 
      
      'fatigue': ['全身倦怠無力', '全身倦怠', '全身疲憊', '身體無力', '全身無力', '四肢無力', '疲倦感', '走路喘', '倦怠', '疲憊', '疲倦', '無力'],
      'soreness': ['全身肌肉痠痛', '上半身骨頭刺痛', '全身痠痛', '小腿肌肉痠痛', '肌肉痠痛症狀', '肌肉酸痛', '肌肉痠痛', '肌肉 痠痛', '骨頭痠痛', '骨頭酸', '關節痠痛', '關節痛', '痠痛'],
      'hypersomnia': ['嗜睡'],
      
      'anosmia+ageusia': ['味覺及嗅覺喪失', '味覺及嗅覺都喪失', '嗅覺和味覺喪失', '嗅味覺異常', '味嗅覺異常'], 
      'anosmia': ['嗅覺異常症狀', '自覺嗅覺喪失', '失去嗅覺', '嗅覺不靈敏', '嗅覺喪失', '嗅覺變差', '喪失嗅覺', '嗅覺遲鈍', '嗅覺異常', '無嗅覺'], 
      'ageusia': ['自覺喪失味覺', '味覺喪失', '味覺異常', '失去味覺', '味覺變差'], 
      
      'lymphadenopathy': ['淋巴腫脹'], 
      'hypoglycemia': ['低血糖'], 
      'anorexia': ['食慾不佳', '食慾不振'],
      'arrhythmia': ['心律不整'],
      
      'symptomatic': ['有症狀', '出現症狀', '身體不適'],
      'asymptomatic': ['首例無症狀', '無症狀', 'x', 'X']
    }
    symptomList = []
    
    for i, symptom in enumerate(self.getCol(self.n_symptom)):
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
      symptom = ''.join(symptom.split('伴隨'))
      symptom = symptom.lstrip(' \n  ，、與及')
      
      if len(symptom) > 0:
        print('Symptom, Case %d, %s' % (i+1, symptom))
      
      stock = list(set(stock))
      symptomList.append(stock)
      
    symptomList = [symptom if len(symptom) > 0 else np.nan for symptom in symptomList]
    return symptomList

  def getLink(self):
    linkList = []
    for i, link in enumerate(self.getCol(self.n_link)):
      if link == '未知':
        linkList.append('unlinked')
      
      elif link == '軍艦':
        linkList.append('fleet')
      
      elif link != link:
        linkList.append(np.nan)
      
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
    reportDateList = self.getReportDate()
    transList = self.getTransmission()
    travHistList = self.getTravHist()
    #travHistList = self.getContinent()
    symptomList = self.getSymptom()
    
    todayOrd = dtt.date.today().toordinal() + 1
    travHistList2 = []
    symptomList2 = []
    N_total = 0
    N_imported = 0
    
    for reportDate, trans, travHist, symptom in zip(reportDateList, transList, travHistList, symptomList):
      if reportDate != reportDate:
        continue
      
      repOrd = ISODateToOrdinal(reportDate)
      
      if repOrd + NB_LOOKBACK_DAYS <= todayOrd:
        continue
      
      N_total += 1
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
    
    return N_total, N_imported, N_data, travHistHist, symptomHist, travBoolMat, sympBoolMat
  
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
    N_total, N_imported, N_data, travHistHist, symptomHist, travBoolMat, sympBoolMat = self.makeTravHistSymptomMat()
    
    travBoolMat_n = np.array([normalizeBoolArr(travBoolArr) for travBoolArr in travBoolMat])
    sympBoolMat_n = np.array([normalizeBoolArr(sympBoolArr) for sympBoolArr in sympBoolMat])
    
    corrMat  = travBoolMat_n.dot(sympBoolMat_n.T)
    countMat = travBoolMat.dot(sympBoolMat.T)
    return N_total, N_imported, N_data, travHistHist, symptomHist, corrMat, countMat
  
  def makeAgeSymptomMat(self):
    reportDateList = self.getReportDate()
    ageList = self.getAge()
    symptomList = self.getSymptom()
    
    todayOrd = dtt.date.today().toordinal() + 1
    ageList2 = []
    symptomList2 = []
    N_total = 0
    
    for reportDate, age, symptom in zip(reportDateList, ageList, symptomList):
      if reportDate != reportDate:
        continue
      
      repOrd = ISODateToOrdinal(reportDate)
      
      if repOrd + NB_LOOKBACK_DAYS <= todayOrd:
        continue
      
      N_total += 1
      if age == age and symptom == symptom: ## Is not nan
        ageList2.append(age)
        symptomList2.append(symptom)
    
    assert len(ageList2) == len(symptomList2)
    N_data = len(ageList2)
        
    ageHist = clt.Counter(ageList2)
    for age in AGE_DICT:
      ageHist[age] = ageHist.get(age, 0)
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
    self.getReportDate()
    timestamp = dtt.datetime.now().astimezone()
    timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC%z')
    
    key   = ['overall_total', 'latest_total', '2020_total', 'timestamp']
    value = [self.N_total, self.N_latest, self.N_2020, timestamp]
    
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
    
    refOrd   = ISODateToOrdinal(REF_ISO_DATE)
    todayOrd = dtt.date.today().toordinal() + 1
    
    date       = [ordinalToISODate(i) for i in range(refOrd, todayOrd)]
    nbDays     = todayOrd - refOrd
    imported_r = np.zeros(nbDays, dtype=int)
    linked_r   = np.zeros(nbDays, dtype=int)
    unlinked_r = np.zeros(nbDays, dtype=int)
    fleet_r    = np.zeros(nbDays, dtype=int)
    imported_o = np.zeros(nbDays, dtype=int)
    linked_o   = np.zeros(nbDays, dtype=int)
    unlinked_o = np.zeros(nbDays, dtype=int)
    fleet_o    = np.zeros(nbDays, dtype=int)
    
    for reportDate, onsetDate, trans, link in zip(reportDateList, onsetDateList, transList, linkList):
      if reportDate != reportDate:
        continue
      
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
    
    data_full_r = {'date': date, 'fleet': fleet_r, 'unlinked': unlinked_r, 'linked': linked_r, 'imported': imported_r}
    data_full_r = pd.DataFrame(data_full_r)
    data_last_r = data_full_r.iloc[-NB_LOOKBACK_DAYS:]
    data_2020_r = data_full_r.iloc[:366]
    
    data_full_o = {'date': date, 'fleet': fleet_o, 'unlinked': unlinked_o, 'linked': linked_o, 'imported': imported_o}
    data_full_o = pd.DataFrame(data_full_o)
    data_last_o = data_full_o.iloc[-NB_LOOKBACK_DAYS:]
    data_2020_o = data_full_o.iloc[:366]
    
    name = '%sprocessed_data/case_by_transmission_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_last_r)
    name = '%sprocessed_data/case_by_transmission_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_last_o)
    return
  
  def saveCsv_caseByDetection(self):
    reportDateList = self.getReportDate()
    onsetDateList  = self.getOnsetDate()
    chanList       = self.getChannel()
    
    refOrd   = ISODateToOrdinal(REF_ISO_DATE)
    todayOrd = dtt.date.today().toordinal() + 1
    
    date       = [ordinalToISODate(i) for i in range(refOrd, todayOrd)]
    nbDays     = todayOrd - refOrd
    airport_r  = np.zeros(nbDays, dtype=int)
    QT_r       = np.zeros(nbDays, dtype=int)
    iso_r      = np.zeros(nbDays, dtype=int)
    monitor_r  = np.zeros(nbDays, dtype=int)
    hospital_r = np.zeros(nbDays, dtype=int)
    overseas_r = np.zeros(nbDays, dtype=int)
    noData_r   = np.zeros(nbDays, dtype=int)
    airport_o  = np.zeros(nbDays, dtype=int)
    QT_o       = np.zeros(nbDays, dtype=int)
    iso_o      = np.zeros(nbDays, dtype=int)
    monitor_o  = np.zeros(nbDays, dtype=int)
    hospital_o = np.zeros(nbDays, dtype=int)
    overseas_o = np.zeros(nbDays, dtype=int)
    noData_o   = np.zeros(nbDays, dtype=int)
    
    for reportDate, onsetDate, chan in zip(reportDateList, onsetDateList, chanList):
      if reportDate != reportDate:
        continue
      
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
      elif chan == 'overseas':
        overseas_r[ind_r] += 1
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
        elif chan == 'overseas':
          overseas_o[ind_o] += 1
        elif chan != chan: ## Is nan
          noData_o[ind_o] += 1
    
    data_full_r = {'date': date, 'no_data': noData_r, 'overseas': overseas_r, 'hospital': hospital_r, 
                   'monitoring': monitor_r, 'isolation': iso_r, 'quarantine': QT_r, 'airport': airport_r}
    data_full_r = pd.DataFrame(data_full_r)
    data_last_r = data_full_r.iloc[-NB_LOOKBACK_DAYS:]
    data_2020_r = data_full_r.iloc[:366]
    
    data_full_o = {'date': date, 'no_data': noData_o, 'overseas': overseas_o, 'hospital': hospital_o, 
                   'monitoring': monitor_o, 'isolation': iso_o, 'quarantine': QT_o, 'airport': airport_o}
    data_full_o = pd.DataFrame(data_full_o).iloc[-NB_LOOKBACK_DAYS:]
    data_last_o = data_full_o.iloc[-NB_LOOKBACK_DAYS:]
    data_2020_o = data_full_o.iloc[:366]
    
    name = '%sprocessed_data/case_by_detection_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_last_r)
    name = '%sprocessed_data/case_by_detection_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_last_o)
    return
  
  def saveCsv_diffByTrans(self):
    reportDateList = self.getReportDate()
    entryDateList  = self.getEntryDate()
    onsetDateList  = self.getOnsetDate()
    transList      = self.getTransmission()
    
    todayOrd = dtt.date.today().toordinal() + 1
    end2020Ord = ISODateToOrdinal('2020-12-31') + 1
    stock_latest_imp = []
    stock_latest_ind = []
    stock_latest_fle = []
    stock_2020_imp = []
    stock_2020_ind = []
    stock_2020_fle = []
    max_latest = 30
    max_2020 = 30
    
    for reportDate, entryDate, onsetDate, trans in zip(reportDateList, entryDateList, onsetDateList, transList):
      if reportDate != reportDate:
        continue
      
      if trans == 'imported':
        stock_latest = stock_latest_imp
        stock_2020 = stock_2020_imp
      elif trans == 'indigenous':
        stock_latest = stock_latest_ind
        stock_2020 = stock_2020_ind
      elif trans == 'fleet':
        stock_latest = stock_latest_fle
        stock_2020 = stock_2020_fle
      else:
        print('diffByTrans, transimission not recognized')
      
      repOrd = ISODateToOrdinal(reportDate)
      entOrd = ISODateToOrdinal(entryDate) if entryDate == entryDate else 0
      onsOrd = ISODateToOrdinal(onsetDate) if onsetDate == onsetDate else 0
      
      if entOrd + onsOrd == 0:
        continue
      
      diff = min(repOrd-entOrd, repOrd-onsOrd)
      
      if repOrd + NB_LOOKBACK_DAYS > todayOrd:
        stock_latest.append(diff)
        max_latest = max(max_latest, diff)
      
      if repOrd < end2020Ord:
        stock_2020.append(diff)
        max_2020 = max(max_2020, diff)
    
    ## Latest
    bins = np.arange(-0.5, max_latest+1, 1)
    n_imp, ctrBin = makeHist(stock_latest_imp, bins)
    n_ind, ctrBin = makeHist(stock_latest_ind, bins)
    n_fle, ctrBin = makeHist(stock_latest_fle, bins)
    n_tot = n_imp + n_ind + n_fle
    
    n_imp = n_imp.round(0).astype(int)
    n_ind = n_ind.round(0).astype(int)
    n_fle = n_fle.round(0).astype(int)
    n_tot = n_tot.round(0).astype(int)
    ctrBin = ctrBin.round(0).astype(int)
    
    data = {'difference': ctrBin, 'all': n_tot, 'imported': n_imp, 'indigenous': n_ind, 'fleet': n_fle}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/latest/difference_by_transmission.csv' % DATA_PATH
    saveCsv(name, data)
    
    ## 2020
    bins = np.arange(-0.5, max_2020+1, 1)
    n_imp, ctrBin = makeHist(stock_2020_imp, bins)
    n_ind, ctrBin = makeHist(stock_2020_ind, bins)
    n_fle, ctrBin = makeHist(stock_2020_fle, bins)
    n_tot = n_imp + n_ind + n_fle
    
    n_imp = n_imp.round(0).astype(int)
    n_ind = n_ind.round(0).astype(int)
    n_fle = n_fle.round(0).astype(int)
    n_tot = n_tot.round(0).astype(int)
    ctrBin = ctrBin.round(0).astype(int)
    
    data = {'difference': ctrBin, 'all': n_tot, 'imported': n_imp, 'indigenous': n_ind, 'fleet': n_fle}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/2020/difference_by_transmission.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv_travHistSymptomCorr(self):
    N_total, N_imported, N_data, travHistHist, symptomHist, corrMat, countMat = self.makeTravHistSymptomCorr3()
    N_min = N_data * 0.033
    
    N_trav = 9 #sum([1 if travHist[1] > N_min else 0 for travHist in travHistHist])
    N_symp = 9 #sum([1 if symptom[1] > N_min else 0 for symptom in symptomHist])
    
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
    label_r   = ['%+.0f%%' % (100*v) if v == v else '0%' for v in value_r]
    label_n   = countMat.flatten()
    
    data_1 = {'symptom': symptom, 'trav_hist': trav_hist, 'value': value_r, 'label': label_r}
    data_1 = pd.DataFrame(data_1)
    
    data_2 = {'symptom': symptom, 'trav_hist': trav_hist, 'value': value_r, 'label': label_n}
    data_2 = pd.DataFrame(data_2)
    
    pairList = [('N_total', N_total), ('N_imported', N_imported), ('N_data', N_data)] + travHistHist + symptomHist
    label = [pair[0] for pair in pairList]
    count = [pair[1] for pair in pairList]
    label_zh = ['合計', '境外移入總數', '有資料案例數'] + [TRAVEL_HISTORY_DICT[trav]['zh-tw'] for trav in travHistList] + [SYMPTOM_DICT[symp]['zh-tw'] for symp in symptomList]
    label_fr = ['Total', 'Importés', 'Données complètes'] + [TRAVEL_HISTORY_DICT[trav]['fr'] for trav in travHistList] + [SYMPTOM_DICT[symp]['fr'] for symp in symptomList]
    
    data_3 = {'label': label, 'count': count, 'label_zh': label_zh, 'label_fr': label_fr}
    data_3 = pd.DataFrame(data_3)
    
    name = '%sprocessed_data/travel_history_symptom_correlations_coefficient.csv' % DATA_PATH
    saveCsv(name, data_1)
    name = '%sprocessed_data/travel_history_symptom_correlations_counts.csv' % DATA_PATH
    saveCsv(name, data_2)
    name = '%sprocessed_data/travel_history_symptom_counts.csv' % DATA_PATH
    saveCsv(name, data_3)
    return
  
  def saveCsv_ageSymptomCorr(self):
    N_total, N_data, ageHist, symptomHist, corrMat, countMat = self.makeAgeSymptomCorr3()
    N_min = N_data * 0.033
    
    N_age  = corrMat.shape[0]
    N_symp = 9 #sum([1 if symptom[1] > N_min else 0 for symptom in symptomHist])
    
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
    label_r = ['%+.0f%%' % (100*v) if v == v else '0%' for v in value_r]
    label_n = countMat.flatten() #['%d' % n if v == v else '' for v, n in zip(value_r, countMat.flatten())]
    
    data_1 = {'symptom': symptom, 'age': age, 'value': value_r, 'label': label_r}
    data_1 = pd.DataFrame(data_1)
    
    data_2 = {'symptom': symptom, 'age': age, 'value': value_r, 'label': label_n}
    data_2 = pd.DataFrame(data_2)
    
    pairList = [('N_total', N_total), ('N_data', N_data)] + ageHist + symptomHist
    label = [pair[0] for pair in pairList]
    count = [pair[1] for pair in pairList]
    label_zh = ['合計', '有資料案例數'] + [AGE_DICT[age]['zh-tw'] for age in ageList] + [SYMPTOM_DICT[symp]['zh-tw'] for symp in symptomList]
    label_fr = ['Total', 'Données complètes'] + [AGE_DICT[age]['fr'] for age in ageList] + [SYMPTOM_DICT[symp]['fr'] for symp in symptomList]
    
    data_3 = {'label': label, 'count': count, 'label_zh': label_zh, 'label_fr': label_fr}
    data_3 = pd.DataFrame(data_3)
    
    name = '%sprocessed_data/age_symptom_correlations_coefficient.csv' % DATA_PATH
    saveCsv(name, data_1)
    name = '%sprocessed_data/age_symptom_correlations_counts.csv' % DATA_PATH
    saveCsv(name, data_2)
    name = '%sprocessed_data/age_symptom_counts.csv' % DATA_PATH
    saveCsv(name, data_3)
    return
  
  def saveCsv(self):
    self.saveCsv_keyNb()
    self.saveCsv_caseByTrans()
    self.saveCsv_caseByDetection()
    self.saveCsv_diffByTrans()
    self.saveCsv_travHistSymptomCorr()
    self.saveCsv_ageSymptomCorr()
    return

###############################################################################
## Status sheet

class StatusSheet(Template):

  def __init__(self, verbose=True):
    self.n_date = '日期'
    self.n_weekNb = '週次'
    self.n_newNbCases = '新增確診'
    self.n_newCasesPerWeek = '每週新增確診'
    self.n_cumCases = '確診總人數'
    self.n_newMales = '新增男性'
    self.n_cumMales = '男性總數'
    self.n_maleFrac = '確診男性率'
    self.n_newFemales = '新增女性'
    self.n_cumFemales = '女性總數'
    self.n_femaleFrac = '確診女性率'
    self.n_newSoldiers = '新增軍人'
    self.n_cumSoldiers = '敦睦總人數'
    self.n_soldierFrac = '軍隊率'
    self.n_newImported = '新增境外'
    self.n_cumImported = '境外總人數'
    self.n_importedFrac = '境外率'
    self.n_newLocal = '新增本土'
    self.n_cumLocal = '本土總人數'
    self.n_localFrac = '本土率'
    self.n_newDeaths = '新增死亡'
    self.n_cumDeaths = '死亡總人數'
    self.n_deathFrac = '死亡率'
    self.n_newUnknown = '當日未知感染源數'
    self.n_cumUnknown = '未知感染源總數'
    self.n_cumKnown = '已知感染源數'
    self.n_newDis = '新增解除隔離'
    self.n_cumDis = '解除隔離數'
    self.n_cumDisAndDeaths = '解除隔離+死亡'
    self.n_cumHosp = '未解除隔離數'
    self.n_notes = '備註'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    cumDisList = data[self.n_cumDis].values
    ind = cumDisList == cumDisList
    self.data    = data[ind]
    self.N_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
    return 
  
  def getDate(self):
    dateList = []
    Y = 2020 #WARNING
    
    for date in self.getCol(self.n_date):
      MMDD = date.split('月')
      M = int(MMDD[0])
      DD = MMDD[1].split('日')
      D = int(DD[0])
      date = '%04d-%02d-%02d' % (Y, M, D)
      dateList.append(date)
    return dateList
    
  def getCumCases(self):
    return self.getCol(self.n_cumCases).astype(int)
    
  def getCumDeaths(self):
    return self.getCol(self.n_cumDeaths).astype(int)
    
  def getCumDis(self):
    return self.getCol(self.n_cumDis).astype(int)
    
  def getCumHosp(self):
    return self.getCol(self.n_cumHosp).astype(int)
    
  def saveCsv_statusEvolution(self):
    dateList      = self.getDate()
    cumDeathsList = self.getCumDeaths()
    cumDisList    = self.getCumDis()
    cumHospList   = self.getCumHosp()
    
    data = {'date': dateList, 'death': cumDeathsList, 'hospitalized': cumHospList, 'discharged': cumDisList}
    data = pd.DataFrame(data)
    data = adjustDateRange(data)
    
    data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data.iloc[:366]
    
    name = '%sprocessed_data/latest/status_evolution.csv' % DATA_PATH
    saveCsv(name, data_latest)
    
    name = '%sprocessed_data/2020/status_evolution.csv' % DATA_PATH
    saveCsv(name, data_2020)
    return
      
  def saveCsv(self):
    self.saveCsv_statusEvolution()
    return

###############################################################################
## Test sheet

class TestSheet(Template):
  
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
    self.n_criteria = '擴大之檢驗標準(含擴大監測標準及通報定義)'
    self.n_note = '來源：疾管署（每天1am更新）'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    dateList = data[self.n_date].values
    ind = dateList == dateList
    self.data    = data[ind]
    self.N_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
    return 
    
  def getDate(self):
    dateList = []
    
    for date in self.getCol(self.n_date):
      MD = date.split('/')
      date = '2020-%02d-%02d' % (int(MD[0]), int(MD[1]))
      dateList.append(date)
    return dateList
  
  def getFromExtended(self):
    fromExtList = []
    for fromExt in self.getCol(self.n_fromExtended):
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
    for fromQT in self.getCol(self.n_fromQT):
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
    for clinicalDef in self.getCol(self.n_fromClinicalDef):
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

  def getCriteria(self):
    criteriaList = []
    
    for criteria in self.getCol(self.n_criteria):
      criteriaList.append(criteria)
    return criteriaList
  
  def saveCsv_testByCriterion(self):
    dateList    = self.getDate()
    fromExtList = self.getFromExtended()
    fromQTList  = self.getFromQT()
    fromClinicalDefList = self.getFromClinicalDef()
    
    data_full = {'date': dateList, 'clinical': fromClinicalDefList, 'quarantine': fromQTList, 'extended': fromExtList}
    data_full = pd.DataFrame(data_full)
    data_full = adjustDateRange(data_full)
    data_last = data_full.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data_full.iloc[:366]
    
    name = '%sprocessed_data/test_by_criterion.csv' % DATA_PATH
    saveCsv(name, data_last)
    return
  
  def printCriteria(self):
    dateList = self.getDate()
    criteriaList = self.getCriteria()
    
    urlList = {
      '2020-01-16': 'http://at.cdc.tw/6Jlc8w', ##   [(F&R)|P & Wuhan] | [(F&R)|P & contact]
      '2020-01-21': 'http://at.cdc.tw/9EM3mV', ##   [(F&R)|P & Wuhan] | [(F&R)|P & contact] | [P & China]
      '2020-01-25': 'http://at.cdc.tw/l99yHG', ##   [F|R|P & (Hubei | contact therein F&R)] | [F|R|P & contact] | [P & China]
      '2020-02-01': 'http://at.cdc.tw/8wN31W', ##   [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China]
      '2020-02-02': 'http://at.cdc.tw/CG90qP', ##   Started QT
                                               ##   [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | Guangdong)]
      '2020-02-03': 'http://at.cdc.tw/8IYT56',   ## [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | Guangdong | Wenzhou)]
      '2020-02-05': 'http://at.cdc.tw/th3S0o',   ## [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | Guangdong | Zhejiang)]
      '2020-02-06': 'http://at.cdc.tw/4sU035',   ## [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | China-HK-MC)]
      '2020-02-09': 'http://at.cdc.tw/n48e22',   ## Reminer TOCC
      '2020-02-10': 'http://at.cdc.tw/4sU035',   ## Reminer 2020-02-06
      '2020-02-12': 'http://at.cdc.tw/73gugZ',   ## Checked back on flu negative 
      '2020-02-15': 'http://at.cdc.tw/072iKp', ##   [F|R|P & (Hubei | Guangdong | Henan | Zhejiang] | [F|R|P & contact] | [P & China-HK-MC] + [F|R|P & (Singapore | Thailand)]
      '2020-02-16': 'http://at.cdc.tw/275pmA', ##   Started community transmission
                                               ##   [F|R|P & (Hubei | Guangdong | Henan | Zhejiang] | [F|R|P & contact] | [P & China-HK-MC]                   + [F|R|P & other countries] | [F|R & cluster] | [P & (medic | cluster | unknown)]
      '2020-02-29': 'http://at.cdc.tw/e7C892', ##   Merged QT in clinical case
                                               ##   [F|R|P & (China-HK-MC | Korea | Italy)]                               | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-01': 'http://at.cdc.tw/L20G51',   ## [F|R|P & (China-HK-MC | Korea | Italy | Iran)]                        | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-14': 'http://at.cdc.tw/Nh5CL8',   ## [F|R|P & (China-HK-MC | Korea | EU | Iran | Dubai)]                   | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-16': 'http://at.cdc.tw/6tK52h',   ## [F|R|P & (China-HK-MC | Korea | Europe | M East | C Asia | N Africa)] | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-17': 'http://at.cdc.tw/M24nK2',   ## Europe check-back
      '2020-03-18': 'http://at.cdc.tw/Y3Y592',   ## [F|R|P & (China-HK-MC | Korea | Europe | M East | C Asia | N Africa | US | Canada | Aussie | NZ)] 
                                                 ##                                                                       | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
     #'2020-03-19': 'http://at.cdc.tw/W9XhV5',   ## [F|R|P & (Asia | Europe | N Africa | US | Canada | Aussie | NZ)]      | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-20': 'http://at.cdc.tw/328jaz',   ## [F|R|P & global]                                                      | [F|R|P & contact] | [P & unknown] + [F|R & cluster]
      '2020-03-25': 'https://youtu.be/bVv-u2bcV_g?t=782', 
                                                 ## [F|R|P & global] | [F|R|P & contact] | [P & unknown] + [F|R & (medic | cluster)]
      '2020-04-01': 'http://at.cdc.tw/zU3557', ##   [(F|R|P|Ag|An)   & (global | contact therein F|R)] | [F|R|P|Ag|An & contact] | [F|R|P|Ag|An & cluster] | [P & unknown] + [F|R & unknown]
      '2020-04-03': 'http://at.cdc.tw/1vI50K', ##   [(F|R|P|Ag|An)   & (global | contact therein F|R)] | [F|R|P|Ag|An & contact] | [F|R|P|Ag|An & cluster] | [P & unknown] + [F|R|Ag|An & unknown]
      '2020-04-05': 'http://at.cdc.tw/Q96xrb', ##   [(F|R|D-unknown) & (global | contact therein F|R)] | [F|R|D-unknown & contact] | [F|R & cluster] | [P] + [F|R|Ag|An & unknown]
      '2020-04-24': 'http://at.cdc.tw/R3sI9v'  ##   [(F|R|D-unknown) & (global | contact therein F|R)] | [F|R|D-unknown & contact] | [F|R & cluster] | [P] + [F|R|Ag|An & (cluster | unknown)]
    }
    
    for date, criteria in zip(dateList, criteriaList):
      if criteria != criteria:
        pass
      else:
        print(date, criteria, urlList.get(date, np.nan))
        print()
    return
  
  def saveCsv_criteriaTimeline(self):
    criteriaDict = {
      '2020-01-16': {
        'en': 'Wuhan with fever or resp. symp. or pneumonia\nClose contact of confirmed cases', ## Close contact of confirmed cases or ppl satisfying prev. cond.
        'fr': 'Wuhan avec fièvre ou sympt. resp. ou pneumonie\nContacts proches des cas confirmés',
        'zh-tw': '武漢旅遊史且有發燒或呼吸道症狀或肺炎\n確診案例之密切接觸者'
      },
      '2020-01-21': {
        'en': 'China with pneumonia',
        'fr': 'Chine avec pneumonie',
        'zh-tw': '中國旅遊史且有肺炎'
      },
      '2020-01-25': {
        'en': 'Hubei',
        'fr': 'Hubei',
        'zh-tw': '湖北旅遊史'
      },
      '2020-02-02': {
        'en': 'Started home quarantine scheme\nGuangdong', ## Kinmen & Mazhu fast tracks
        'fr': 'Début de la quarantaine à domicile\nGuangdong',
        'zh-tw': '啟動居家檢疫與居家隔離\n廣東旅遊史'
      },
      '2020-02-03': {
        'en': 'Wenzhou',
        'fr': 'Wenzhou',
        'zh-tw': '溫州旅遊史',
      },
      '2020-02-05': {
        'en': 'Zhejiang',
        'fr': 'Zhejiang',
        'zh-tw': '浙江旅遊史',
      },
      '2020-02-06': {
        'en': 'China, Hong Kong, Macao',
        'fr': 'Chine, Hong Kong, Macao',
        'zh-tw': '中國、香港、澳門旅遊史',
      },
      '2020-02-12': {
        'en': 'Checked back on flu-negative cases',
        'fr': 'Vérification des cas négatifs de grippe',
        'zh-tw': '回溯採檢有呼吸道症狀但流感陰性之病患',
      },
      '2020-02-15': {
        'en': 'Singapore, Thailand',
        'fr': 'Singapour, Thaïlande',
        'zh-tw': '新加坡、泰國旅遊史',
      },
      '2020-02-16': {
        'en': 'Started community monitoring\nMedics or local cluster with pneumonia',
        'fr': 'Surveillance supplémentaire des\ntransmissions locales\nClusters locaux ou de soignants\navec pneumonie',
        'zh-tw': '啟動擴大社區監測\n醫護或本土肺炎群聚',
      },
      '2020-02-29': {
        'en': 'Korea, Italy\nAll pneumonia\nLocal cluster with resp. symp.', ## Merged QT into clinical
        'fr': 'Corée, Italie\nToute pneumonie\nRegroupement local\navec sympt. resp.', 
        'zh-tw': '韓國、義大利旅遊史\n所有肺炎\n本土呼吸道症狀群聚'
      },
      '2020-03-01': {
        'en': 'Iran',
        'fr': 'Iran',
        'zh-tw': '伊朗旅遊史',
      },
      '2020-03-17': {
        'en': 'Europe, Middle East, Central Asia, North Africa',
        'fr': 'Europe, Moyen-Orient,\nAsie centrale, Afrique du Nord',
        'zh-tw': '歐洲、中東、西亞、北非旅遊史',
      },
      '2020-03-19': {
        'en': 'Asia, USA, Canada, Australia, New Zealand',
        'fr': 'Asie, États-Unis, Canada,\nAustralie, Nouvelle-Zélande',
        'zh-tw': '亞洲、美國、加拿大、澳洲、紐西蘭旅遊史',
      },
      '2020-03-21': {
        'en': 'Global',
        'fr': 'Monde entier',
        'zh-tw': '所有入境旅客',
      },
      '2020-03-25': {
        'en': 'Medics with resp. symp.',
        'fr': 'Soignants avec sympt. resp.',
        'zh-tw': '有呼吸道症狀之醫護',
      },
      '2020-04-01': {
        'en': 'Anosmia, ageusia',
        'fr': 'Anosmie, agueusie',
        'zh-tw': '味嗅覺異常',
      },
      '2020-04-05': {
        'en': 'Diarrhea',
        'fr': 'Diarrhée',
        'zh-tw': '腹瀉'
      },
      '2020-07-26': {
        'en': 'Philippines all passengers',
        'fr': 'Philippines tous les passagers',
        'zh-tw': '菲律賓所有旅客'
      }
    }
    
    dateList = [key for key, value in criteriaDict.items()]
    enList = [value['en'] for key, value in criteriaDict.items()]
    frList = [value['fr'] for key, value in criteriaDict.items()]
    zhtwList = [value['zh-tw'] for key, value in criteriaDict.items()]
    
    data = {'date': dateList, 'en': enList, 'fr': frList, 'zh-tw': zhtwList}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/criteria_timeline.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_testByCriterion()
    self.saveCsv_criteriaTimeline()
    return

###############################################################################
## Border sheet

class BorderSheet(Template):

  def __init__(self, verbose=True):
    self.n_date = '日期 '
    self.tagDict = {
      'in': '資料來源：各機場、港口入出境人數統計資料 入境總人數',
      'out': '資料來源：各機場、港口入出境人數統計資料 出境總人數',
      'total': '入出境總人數_小計 ',
      'Taoyuan A1 in': '桃園一期 入境查驗', 
      'Taoyuan A1 out': '桃園一期 出境查驗', 
      'Taoyuan A1 total': '桃園一期 小計', 
      'Taoyuan A2 in': '桃園二期 入境查驗', 
      'Taoyuan A2 out': '桃園二期 出境查驗', 
      'Taoyuan A2 total': '桃園二期 小計', 
      'Taoyuan A total': '桃園一_二期 合計', 
      'Kaohsiung A in': '高雄機場 入境查驗', 
      'Kaohsiung A out': '高雄機場 出境查驗', 
      'Kaohsiung A total': '高雄機場 小計', 
      'Keelung S in': '基隆港 入境查驗', 
      'Keelung S out': '基隆港 出境查驗', 
      'Keelung S total': '基隆港 小計', 
      'Taichung S in': '台中港 入境查驗', 
      'Taichung S out': '台中港 出境查驗', 
      'Taichung S total': '台中港 小計', 
      'Kaohsiung S in': '高雄港 入境查驗', 
      'Kaohsiung S out': '高雄港 出境查驗', 
      'Kaohsiung S total': '高雄港 小計', 
      'Hualian S in': '花蓮港 入境查驗', 
      'Hualian S out': '花蓮港 出境查驗', 
      'Hualian S total': '花蓮港 小計', 
      'Yilan S in': '蘇澳港 入境查驗', 
      'Yilan S out': '蘇澳港 出境查驗', 
      'Yilan S total': '蘇澳港 小計', 
      'Penghu X in': '澎湖港 入境查驗', 
      'Penghu X out': '澎湖港 出境查驗', 
      'Penghu X total': '澎湖港 小計', 
      'Tainan A in': '台南機場 入境查驗', 
      'Tainan A out': '台南機場 出境查驗', 
      'Tainan A total': '台南機場 小計', 
      'Tainan S in': '安平港 入境查驗', 
      'Tainan S out': '安平港 出境查驗', 
      'Tainan S total': '安平港 小計', 
      'Taipei A in': '松山機場 入境查驗', 
      'Taipei A out': '松山機場 出境查驗', 
      'Taipei A total': '松山機場 小計', 
      'Kinmen SW in': '金門港_水頭 入境查驗', 
      'Kinmen SW out': '金門港_水頭 出境查驗', 
      'Kinmen SW total': '金門港_水頭 小計', 
      'Mazu X in': '馬祖 入境查驗', 
      'Mazu X out': '馬祖 出境查驗', 
      'Mazu X total': '馬祖 小計', 
      'Hualian A in': '花蓮機場 入境查驗', 
      'Hualian A out': '花蓮機場 出境查驗', 
      'Hualian A total': '花蓮機場 小計', 
      'Yunlin S in': '麥寮港 入境查驗', 
      'Yunlin S out': '麥寮港 出境查驗', 
      'Yunlin S total': '麥寮港 小計', 
      'Penghu A in': '馬公機場 入境查驗', 
      'Penghu A out': '馬公機場 出境查驗', 
      'Penghu A total': '馬公機場 小計', 
      'Taichung A in': '台中機場 入境查驗', 
      'Taichung A out': '台中機場 出境查驗', 
      'Taichung A total': '台中機場 小計', 
      'Hualian SN in': '和平港 入境查驗', 
      'Hualian SN out': '和平港 出境查驗', 
      'Hualian SN total': '和平港 小計', 
      'Kinmen A in': '金門機場 入境查驗', 
      'Kinmen A out': '金門機場 出境查驗', 
      'Kinmen A total': '金門機場 小計', 
      'Mazu AS in': '南竿機場 入境查驗', 
      'Mazu AS out': '南竿機場 出境查驗', 
      'Mazu AS total': '南竿機場 小計', 
      'Mazu AN in': '北竿機場 入境查驗', 
      'Mazu AN out': '北竿機場 出境查驗', 
      'Mazu AN total': '北竿機場 小計', 
      'Chiayi A in': '嘉義機場 入境查驗', 
      'Chiayi A out': '嘉義機場 出境查驗', 
      'Chiayi A total': '嘉義機場 小計', 
      'Taipei S in': '台北港 入境查驗', 
      'Taipei S out': '台北港 出境查驗', 
      'Taipei S total': '台北港 小計', 
      'Pintung SN1 in': '東港 入境查驗', 
      'Pintung SN1 out': '東港 出境查驗', 
      'Pintung SN1 total': '東港 小計', 
      'Taitung A in': '台東機場 入境查驗', 
      'Taitung A out': '台東機場 出境查驗', 
      'Taitung A total': '台東機場 小計', 
      'Mazu S in': '北竿白沙港 入境查驗', 
      'Mazu S out': '北竿白沙港 出境查驗', 
      'Mazu S total': '北竿白沙港 小計', 
      'Chiayi S in': '布袋港 入境查驗', 
      'Chiayi S out': '布袋港 出境查驗', 
      'Chiayi S total': '布袋港 小計', 
      'Taoyuan SS in': '大園沙崙港 入境查驗', 
      'Taoyuan SS out': '大園沙崙港 出境查驗', 
      'Taoyuan SS total': '大園沙崙港 小計', 
      'Taitung S in': '台東富岡港 入境查驗', 
      'Taitung S out': '台東富岡港 出境查驗', 
      'Taitung S total': '台東富岡港 小計', 
      'Penghu S in': '馬公港 入境查驗', 
      'Penghu S out': '馬公港 出境查驗', 
      'Penghu S total': '馬公港 小計', 
      'Taoyuan SN in': '桃園竹圍港 入境查驗', 
      'Taoyuan SN out': '桃園竹圍港 出境查驗', 
      'Taoyuan SN total': '桃園竹圍港 小計', 
      'Kinmen SE in': '金門港_料羅 入境查驗', 
      'Kinmen SE out': '金門港_料羅 出境查驗', 
      'Kinmen SE total': '金門港_料羅 小計', 
      'Pintung SS in': '後壁湖遊艇港 入境查驗', 
      'Pintung SS out': '後壁湖遊艇港 出境查驗', 
      'Pintung SS total': '後壁湖遊艇港 小計', 
      'New Taipei S in': '淡水第二漁港遊艇碼頭 入境查驗', 
      'New Taipei S out': '淡水第二漁港遊艇碼頭 出境查驗', 
      'New Taipei S total': '淡水第二漁港遊艇碼頭 小計', 
      'Pintung SN2 in': '屏東大鵬灣遊艇港 入境查驗', 
      'Pintung SN2 out': '屏東大鵬灣遊艇港 出境查驗', 
      'Pintung SN2 total': '屏東大鵬灣遊艇港 小計', 
      'Pintung A in': '屏東機場 入境查驗', 
      'Pintung A out': '屏東機場 出境查驗', 
      'Pintung A total': '屏東機場 小計'
    }
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_border_statistics.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True, header=[0, 1])
    
    ## Change header
    hdr  = []
    for pair in data.columns:
      if 'Unnamed:' in pair[0]:
        hdr.append((hdr[-1][0], pair[1]))
      elif 'Unnamed:' in pair[1]:
        hdr.append((pair[0], ''))
      else:
        hdr.append(pair)
    data.columns = [pair[0]+' '+pair[1] for pair in hdr]
    
    dateList = data[self.n_date].values
    ind = dateList == dateList
    self.data    = data[ind]
    self.N_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
    return 
    
  def getDate(self):
    dateList = ['%s-%s-%s' % (date[:4], date[4:6], date[6:8]) for date in self.getCol(self.n_date)]
    return dateList
    
  def getNumbers(self, tag):
    nbList = [int(out.replace(',', '')) for out in self.getCol(self.tagDict[tag])]
    return nbList
    
  def getIn(self):
    return self.getNumbers('in')
    
  def getOut(self):
    return self.getNumbers('out')
    
  def getTotal(self):
    return self.getNumbers('total')
    
  def getAirportBreakdown(self, tag='total'):
    labelList = [
      'Taipei A',
      'Taoyuan A1',
      'Taoyuan A2',
      'Taichung A',
      'Chiayi A',
      'Tainan A',
      'Kaohsiung A',
      'Pintung A',
      
      'Hualian A',
      'Taitung A',
      'Penghu A',
      'Kinmen A',
      'Mazu AN',
      'Mazu AS'
    ]
    
    airList_break = []
    for label in labelList:
      airList_break.append((label, self.getNumbers(label+' '+tag)))
    return airList_break
  
  def getSeaportBreakdown(self, tag='total'):
    labelList = [
      'Keelung S',
      'New Taipei S',
      'Taipei S',
      'Taoyuan SN',
      'Taoyuan SS',
      'Taichung S',
      'Yunlin S',
      'Chiayi S',
      'Tainan S',
      'Kaohsiung S',
      'Pintung SN1',
      'Pintung SN2',
      'Pintung SS',
      
      'Yilan S',
      'Hualian SN',
      'Hualian S',
      'Taitung S',
      'Penghu S',
      'Kinmen SW',
      'Kinmen SE',
      'Mazu S',
    ]
    
    seaList_break = []
    for label in labelList:
      seaList_break.append((label, self.getNumbers(label+' '+tag)))
    return seaList_break
  
  def getNotSpecifiedBreakdown(self, tag='total'):
    labelList = [
      'Penghu X',
      'Mazu X'
    ]
    
    notSpecList_break = []
    for label in labelList:
      notSpecList_break.append((label, self.getNumbers(label+' '+tag)))
    return notSpecList_break
  
  def getAirport(self, tag='total'):
    airList_break = self.getAirportBreakdown(tag=tag)
    airList_break = [airList[1] for airList in airList_break]
    airList = np.array(airList_break).sum(axis=0)
    return airList
  
  def getSeaport(self, tag='total'):
    seaList_break = self.getSeaportBreakdown(tag=tag)
    seaList_break = [airList[1] for airList in seaList_break]
    seaList = np.array(seaList_break).sum(axis=0)
    return seaList
  
  def getNotSpecified(self, tag='total'):
    notSpecList_break = self.getNotSpecifiedBreakdown(tag=tag)
    notSpecList_break = [airList[1] for airList in notSpecList_break]
    notSpecList = np.array(notSpecList_break).sum(axis=0)
    return notSpecList
  
  def saveCsv_borderStats(self):
    dateList    = self.getDate()
    airList     = self.getAirport(tag='in')
    seaList     = self.getSeaport(tag='in')
    notSpecList = self.getNotSpecified(tag='in')
    
    data_full = {'date': dateList, 'not_specified': notSpecList, 'seaport': seaList, 'airport': airList}
    data_full = pd.DataFrame(data_full)
    data_full = adjustDateRange(data_full)
    data_last = data_full.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data_full.iloc[:366]
    
    name = '%sprocessed_data/border_statistics_entry.csv' % DATA_PATH
    saveCsv(name, data_last)
    
    airList     = self.getAirport(tag='out')
    seaList     = self.getSeaport(tag='out')
    notSpecList = self.getNotSpecified(tag='out')
    
    data_full = {'date': dateList, 'not_specified': notSpecList, 'seaport': seaList, 'airport': airList}
    data_full = pd.DataFrame(data_full)
    data_full = adjustDateRange(data_full)
    data_last = data_full.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data_full.iloc[:366]
    
    name = '%sprocessed_data/border_statistics_exit.csv' % DATA_PATH
    saveCsv(name, data_last)
    
    airList     = self.getAirport(tag='total')
    seaList     = self.getSeaport(tag='total')
    notSpecList = self.getNotSpecified(tag='total')
    
    data_full = {'date': dateList, 'not_specified': notSpecList, 'seaport': seaList, 'airport': airList}
    data_full = pd.DataFrame(data_full)
    data_full = adjustDateRange(data_full)
    data_last = data_full.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data_full.iloc[:366]
    
    name = '%sprocessed_data/border_statistics_both.csv' % DATA_PATH
    saveCsv(name, data_last)
    return
      
  def saveCsv(self):
    self.saveCsv_borderStats()
    return

###############################################################################
## Timeline sheet

class TimelineSheet(Template):
  
  def __init__(self, verbose=True):
    self.n_date = '時間'
    self.n_TWNEvt = '台灣事件'
    self.n_criteria = '台灣檢驗標準'
    self.n_globalEvt = '全球事件'
    self.n_keyEvt = '重點事件'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    dateList = data[self.n_date].values
    ind = dateList == dateList
    self.data    = data[ind]
    self.N_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.N_total)
    return 
    
  def getDate(self):
    dateList = []
    
    for date in self.getCol(self.n_date):
      YMDD = date.split('年')
      Y = int(YMDD[0])
      MDD = YMDD[1].split('月')
      M = int(MDD[0])
      DD = MDD[1].split('日')
      D = int(DD[0])
      date = '%04d-%02d-%02d' % (Y, M, D)
      dateList.append(date)
    return dateList
  
  def getTWNEvt(self):
    TWNEvtList = []
    for TWNEvt in self.getCol(self.n_TWNEvt):
      if TWNEvt == TWNEvt:
        TWNEvt = TWNEvt.rstrip('\n')
        TWNEvt = '\n'.join(TWNEvt.split('\n\n\n'))
        TWNEvt = '\n'.join(TWNEvt.split('\n\n'))
        TWNEvtList.append(TWNEvt)
      else:
        TWNEvtList.append(TWNEvt)
    return TWNEvtList
  
  def getGlobalEvt(self):
    globalEvtList = []
    for globalEvt in self.getCol(self.n_globalEvt):
      if globalEvt == globalEvt:
        globalEvt = globalEvt.rstrip('\n')
        globalEvt = '\n'.join(globalEvt.split('\n\n\n'))
        globalEvt = '\n'.join(globalEvt.split('\n\n'))
        globalEvtList.append(globalEvt)
      else:
        globalEvtList.append(globalEvt)
    return globalEvtList
  
  def getKeyEvt(self):
    keyEvtList = []
    for keyEvt in self.getCol(self.n_keyEvt):
      if keyEvt == keyEvt:
        keyEvtList.append(keyEvt.rstrip('\n'))
      else:
        keyEvtList.append(keyEvt)
    return keyEvtList
  
  def saveCsv_evtTimeline(self):
    dateList = []
    TWNEvtList = []
    globalEvtList = []
    keyEvtList = []
    
    for date, TWNEvt, globalEvt, keyEvt in zip(self.getDate(), self.getTWNEvt(), self.getGlobalEvt(), self.getKeyEvt()):
      if TWNEvt != TWNEvt and globalEvt != globalEvt and keyEvt != keyEvt:
        continue
      else:
        dateList.append(date)
        TWNEvtList.append(TWNEvt)
        globalEvtList.append(globalEvt)
        keyEvtList.append(keyEvt)
    
    data = {'date': dateList, 'Taiwan_event': TWNEvtList, 'global_event': globalEvtList, 'key_event': keyEvtList}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/event_timeline_zh-tw.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_evtTimeline()
    return
  
###############################################################################
## Sandbox

def sandbox():
  sheet = MainSheet()
  #print(sheet.getAge())
  sheet.saveCsv_keyNb()
  
  #sheet = StatusSheet()
  #print(sheet.getCumHosp())
  #sheet.saveCsv_statusEvolution()
  
  #sheet = TestSheet()
  #print(sheet.printCriteria())
  #sheet.saveCsv_criteriaTimeline()
  
  #sheet = BorderSheet()
  #print(sheet.getAirportBreakdown('in'))
  #sheet.saveCsv_borderStats()
  
  #sheet = TimelineSheet()
  #print(sheet.saveCriteria())
  #sheet.saveCsv_evtTimeline()
  return

###############################################################################
## Save

def saveCsv_all():
  print()
  MainSheet().saveCsv()
  print()
  StatusSheet().saveCsv()
  print()
  TestSheet().saveCsv()
  print()
  BorderSheet().saveCsv()
  print()
  TimelineSheet().saveCsv()
  print()
  return

###############################################################################
## Main

if __name__ == '__main__':
  saveCsv_all()

###############################################################################

