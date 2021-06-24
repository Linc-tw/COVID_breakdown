
    ##########################################
    ##  COVID_breakdown_data_processing.py  ##
    ##  Chieh-An Lin                        ##
    ##  Version 2021.06.24                  ##
    ##########################################

import os
import sys
import warnings
import collections as clt
import datetime as dtt
import json

import numpy as np
import scipy as sp
import matplotlib as mpl
import pandas as pd

################################################################################
## TODO

#delayed loading
#index redirection
#screenshot

################################################################################
## Parameters

DATA_PATH = '/home/linc/21_Codes/COVID_breakdown/'
ISO_DATE_REF = '2020-01-01'
NB_LOOKBACK_DAYS = 90

SYMPTOM_DICT = {
  'sneezing': {'zh-tw': '鼻腔症狀', 'fr': 'éternuement'},
  'cough': {'zh-tw': '咳嗽', 'fr': 'toux'},
  'throatache': {'zh-tw': '喉嚨症狀', 'fr': 'mal de gorge'},
  'earache': {'zh-tw': '耳朵痛', 'fr': 'otalgie'},
  'dyspnea': {'zh-tw': '呼吸困難', 'fr': 'dyspnée'}, 
  'bronchitis': {'zh-tw': '支氣管炎', 'fr': 'bronchite'},
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
  'rash': {'zh-tw': '出疹', 'fr': 'rash'},
  
  'fatigue': {'zh-tw': '倦怠', 'fr': 'fatigue'},
  'soreness': {'zh-tw': '痠痛', 'fr': 'myalgie'},
  'hypersomnia': {'zh-tw': '嗜睡', 'fr': 'hypersomnie'},
  'insomnia': {'zh-tw': '失眠', 'fr': 'insomnie'},
  
  'dysnosmia': {'zh-tw': '嗅覺異常', 'fr': 'dysosmie'}, 
  'dysgeusia': {'zh-tw': '味覺異常', 'fr': 'dysgueusie'},
  
  'tonsillitis': {'zh-tw': '淋巴腫脹', 'fr': 'adénopathie'}, 
  'hypoglycemia': {'zh-tw': '低血糖', 'fr': 'hypoglycémie'}, 
  'anorexia': {'zh-tw': '食慾不佳', 'fr': 'anorexie'},
  'arrhythmia': {'zh-tw': '心律不整', 'fr': 'arythmie'},
  'coma': {'zh-tw': '意識不清', 'fr': 'coma'},
  
  'symptomatic': {'zh-tw': '有症狀', 'fr': 'symptomatique'},
  'asymptomatic': {'zh-tw': '無症狀', 'fr': 'asymptomatique'} 
}

TRAVEL_HISTORY_DICT = {
  ## Far-East Asia
  'Bangladesh': {'zh-tw': '孟加拉', 'fr': 'Bangladesh'},
  'China': {'zh-tw': '中國', 'fr': 'Chine'},
  'Hong Kong': {'zh-tw': '香港', 'fr': 'Hong Kong'},
  'Indonesia': {'zh-tw': '印尼', 'fr': 'Indonésie'},
  'India': {'zh-tw': '印度', 'fr': 'Inde'},
  'Japan': {'zh-tw': '日本', 'fr': 'Japon'},
  'Korea': {'zh-tw': '韓國', 'fr': 'Corée'},
  'Macao': {'zh-tw': '澳門', 'fr': 'Macao'},
  'Malaysia': {'zh-tw': '馬來西亞', 'fr': 'Malaisie'},
  'Myanmar': {'zh-tw': '緬甸', 'fr': 'Myanmar'},
  'Nepal': {'zh-tw': '尼泊爾', 'fr': 'Népal'},
  'Pakistan': {'zh-tw': '巴基斯坦', 'fr': 'Pakistan'},
  'Philippines': {'zh-tw': '菲律賓', 'fr': 'Philippines'},
  'Singapore': {'zh-tw': '新加坡', 'fr': 'Singapour'},
  'Thailand': {'zh-tw': '泰國', 'fr': 'Thaïlande'},
  'Vietnam': {'zh-tw': '越南', 'fr': 'Vietnam'},
  
  ## West & Central Asia
  'Kazakhstan': {'zh-tw': '哈薩克', 'fr': 'Kazakhstan'}, 
  'Kyrgyzstan': {'zh-tw': '吉爾吉斯', 'fr': 'Kirghizistan'},
  'Oman': {'zh-tw': '阿曼', 'fr': 'Oman'},
  'Qatar': {'zh-tw': '卡達', 'fr': 'Qatar'},
  'Syria': {'zh-tw': '敘利亞', 'fr': 'Syrie'}, 
  'Turkey': {'zh-tw': '土耳其', 'fr': 'Turquie'},
  'UAE': {'zh-tw': '阿拉伯聯合大公國', 'fr': 'EAU'},
  'Uzbekistan': {'zh-tw': '烏茲別克',  'fr': 'Ouzbékistan'},
  
  ## Europe
  'Europe': {'zh-tw': '歐洲', 'fr': 'Europe'},
  'Albania': {'zh-tw': '阿爾巴尼亞', 'fr': 'Albanie'}, 
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
  'Slovakia': {'zh-tw': '斯洛伐克', 'fr': 'Slovaquie'},
  'Spain': {'zh-tw': '西班牙', 'fr': 'Espagne'},
  'Switzerland': {'zh-tw': '瑞士', 'fr': 'Suisse'},
  'UK': {'zh-tw': '英國', 'fr': 'Royaume-Uni'},
  'Ukraine': {'zh-tw': '烏克蘭', 'fr': 'Ukraine'},
  
  ## Africa
  'Africa': {'zh-tw': '非洲', 'fr': 'Afrique'},
  'Cameroon': {'zh-tw': '喀麥隆', 'fr': 'Cameroun'},
  'Eswatini': {'zh-tw': '史瓦帝尼', 'fr': 'Eswatini'},
  'Egypt': {'zh-tw': '埃及', 'fr': 'Égypte'},
  'Ethiopia': {'zh-tw': '衣索比亞', 'fr': 'Éthiopie'},
  'Ghana': {'zh-tw': '迦納', 'fr': 'Ghana'},
  'Lesotho': {'zh-tw': '賴索托', 'fr': 'Lesotho'},
  'Morocco': {'zh-tw': '摩洛哥', 'fr': 'Maroc'},
  'Nigeria': {'zh-tw': '奈及利亞', 'fr': 'Nigéria'}, 
  'Senegal': {'zh-tw': '塞內加爾', 'fr': 'Sénégal'},
  'South Africa': {'zh-tw': '南非', 'fr': 'Afrique du Sud'},
  'Tunisia': {'zh-tw': '突尼西亞', 'fr': 'Tunisie'},
  'Uganda': {'zh-tw': '烏干達', 'fr': 'Ouganda'},
  
  ## North & South America
  'Argentina': {'zh-tw': '阿根廷', 'fr': 'Argentine'},
  'Bolivia': {'zh-tw': '玻利維亞', 'fr': 'Bolivie'},
  'Brazil': {'zh-tw': '巴西', 'fr': 'Brésil'},
  'Canada': {'zh-tw': '加拿大', 'fr': 'Canada'},
  'Chile': {'zh-tw': '智利', 'fr': 'Chili'},
  'Dominican Republic': {'zh-tw': '多明尼加', 'fr': 'République dominicaine'},
  'Guatemala': {'zh-tw': '瓜地馬拉', 'fr': 'Guatemala'}, 
  'Haiti': {'zh-tw': '海地', 'fr': 'Haïti'}, 
  'Honduras': {'zh-tw': '宏都拉斯', 'fr': 'Honduras'}, 
  'Latin America': {'zh-tw': '中南美洲', 'fr': 'Amérique latine'},
  'Mexico': {'zh-tw': '墨西哥', 'fr': 'Mexique'},
  'Paraguay': {'zh-tw': '巴拉圭', 'fr': 'Paraguay'},
  'Peru': {'zh-tw': '秘魯', 'fr': 'Pérou'},
  'USA': {'zh-tw': '美國', 'fr': 'États-Unis'},
  
  ## Oceania
  'Australia': {'zh-tw': '澳洲', 'fr': 'Australie'},
  'Marshall Islands': {'zh-tw': '馬紹爾', 'fr': 'Îles Marshall'},
  'New Zealand': {'zh-tw': '紐西蘭', 'fr': 'Nouvelle-Zélande'},
  'Palau': {'zh-tw': '帛琉', 'fr': 'Palaos'},
  
  ## Others
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
  '100s': {'zh-tw': '>100歲', 'fr': '100aine'}
}

COUNTY_DICT = {
  ## Metropole
  '63000': dict( ## Taipei
    tag = 'Taipei', 
    label = ['Taipei', 'Taipei', '台北'], 
    population = 2635286,
  ),
  '64000': dict( ## Kaohsiung
    tag = 'Kaohsiung', 
    label = ['Kaohsiung', 'Kaohsiung', '高雄'],
    population = 2773984,
  ),
  '65000': dict( ## New_Taipei
    tag = 'New_Taipei', 
    label = ['New Taipei', 'Nouveau Taipei', '新北'],
    population = 4023620,
  ),
  '66000': dict( ## Taichung
    tag = 'Taichung',
    label = ['Taichung', 'Taichung', '台中'],
    population = 2816667,
  ),
  '67000': dict( ## Tainan
    tag = 'Tainan', 
    label = ['Tainan', 'Tainan', '台南'],
    population = 1879115,
  ),
  '68000': dict( ## Taoyuan
    tag = 'Taoyuan',
    label = ['Taoyuan', 'Taoyuan', '桃園'],
    population = 2254363,
  ),
  
  ## County
  '10002': dict( ## Yilan
    tag = 'Yilan',
    label = ['Yilan', 'Yilan', '宜蘭'],
    population = 453951,
  ),
  '10004': dict( ## Hsinchu
    tag = 'Hsinchu',
    label = ['Hsinchu County', 'Comté de Hsinchu', '竹縣'],
    population = 565272,
  ),
  '10005': dict( ## Miaoli
    tag = 'Miaoli',
    label = ['Miaoli', 'Miaoli', '苗栗'],
    population = 544762,
  ),
  '10007': dict( ## Changhua
    tag = 'Changhua',
    label = ['Changhua', 'Changhua', '彰化'],
    population = 1271015,
  ),
  '10008': dict( ## Nantou
    tag = 'Nantou',
    label = ['Nantou', 'Nantou', '南投'],
    population = 493403,
  ),
  '10009': dict( ## Yunlin
    tag = 'Yunlin',
    label = ['Yunlin', 'Yunlin', '雲林'],
    population = 680050,
  ),
  '10010': dict( ## Chiayi
    tag = 'Chiayi',
    label = ['Chiayi County', 'Comté de Chiayi', '嘉縣'],
    population = 502007,
  ),
  '10013': dict( ## Pingtung
    tag = 'Pingtung',
    label = ['Pingtung', 'Pingtung', '屏東'],
    population = 817193,
  ),
  '10014': dict( ## Taitung
    tag = 'Taitung',
    label = ['Taitung', 'Taitung', '台東'],
    population = 216308,
  ),
  '10015': dict( ## Hualien
    tag = 'Hualien',
    label = ['Hualien', 'Hualien', '花蓮'],
    population = 325706,
  ),
  '10016': dict( ## Penghu
    tag = 'Penghu',
    label = ['Penghu', 'Penghu', '澎湖'],
    population = 105117,
  ),
  
  ## City
  '10017': dict( ## Keelung
    tag = 'Keelung',
    label = ['Keelung', 'Keelung', '基隆'],
    population = 371878,
  ),
  '10018': dict( ## Hsinchu_C
    tag = 'Hsinchu_C',
    label = ['Hsinchu City', 'Ville de Hsinchu', '竹市'],
    population = 448207,
  ),
  '10020': dict( ## Chiayi_C
    tag = 'Chiayi_C',
    label = ['Chiayi City', 'Ville de Chiayi', '嘉市'],
    population = 270254,
  ),
  
  ## 09
  '09007': dict( ## Matsu
    tag = 'Matsu',
    label = ['Matsu', 'Matsu', '馬祖'],
    population = 12716,
  ),
  '09020': dict( ## Kinmen
    tag = 'Kinmen',
    label = ['Kinmen', 'Kinmen', '金門'],
    population = 127723,
  ), 
}

################################################################################
## Functions - utilities

def saveCsv(name, data, verbose=True):
  data.to_csv(name, index=False)
  if verbose:
    print('Saved \"%s\"' % name)
  return

def loadJson(name, verbose=True):
  file_ = open(name, 'r')
  data = json.load(file_)
  file_.close()
  if verbose:
    print('Loaded \"%s\"' % name)
  return data

def ISODateToOrd(iso):
  ord = dtt.date.fromisoformat(iso).toordinal()
  return ord

def ordDateToISO(ord):
  return dtt.date.fromordinal(ord).isoformat()

def normalizeBoolArr(bool_arr):
  bool_arr = bool_arr.astype(float)
  bool_arr -= bool_arr.mean()
  norm = np.sqrt(np.sum(bool_arr**2))
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter("ignore")
    bool_arr /= norm
  return bool_arr

def asFloat(a, copy=True):
  if np.isscalar(a):
    return float(a)
  if type(a) is list:
    return np.array(a, dtype=float)
  return a.astype(float, copy=copy)

def centerOfBins(bins, area=False):
  bins = np.array(bins, dtype=float)
  left = bins[:-1]
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
  n_arr : (1, N) float array
    number counts, could be rescaled
    
  ctr_bins : (1, N) float array
    center of the bins
    n_arr & ctr_bins have the same size.
  """
  n_arr, bins = np.histogram(data, bins, weights=wgt)
  ctr_bins = centerOfBins(bins)
  
  if pdf == True:
    n_arr = asFloat(n_arr) / (float(sum(n_arr)) * (bins[1:] - bins[:-1]))
  else:
    n_arr = asFloat(n_arr) * factor
  
  return n_arr, ctr_bins

def adjustDateRange(data):
  ord_ref = ISODateToOrd(ISO_DATE_REF)
  ord_begin = ISODateToOrd(data['date'].values[0])
  ord_end = ISODateToOrd(data['date'].values[-1]) + 1
  ord_today = dtt.date.today().toordinal() + 1
  
  zero = [0] * (len(data.columns) - 1)
  stock1 = []
  stock2 = []
  
  for ord in range(ord_ref, ord_begin):
    iso = ordDateToISO(ord)
    stock1.append([iso] + zero)
    
  for ord in range(ord_end, ord_today):
    iso = ordDateToISO(ord)
    stock2.append([iso] + zero)
  
  if ord_ref > ord_begin:
    data = data[ord_ref-ord_begin:]
  
  data1 = pd.DataFrame(stock1, columns=data.columns)
  data2 = pd.DataFrame(stock2, columns=data.columns)
  data = pd.concat([data1, data, data2])
  return data

################################################################################
## Classes - template

class Template:
  def getCol(self, col):
    return self.data[col].values
  
  def __str__(self):
    return str(self.data.head(25))

################################################################################
## Classes - main sheet

class MainSheet(Template):
  
  def __init__(self, verbose=True):
    self.coltag_case = '案例'
    self.coltag_report_date = '新聞稿發布日期'
    self.coltag_gender = '性別'
    self.coltag_age = '年齡'
    self.coltag_nationality = '國籍'
    self.coltag_city = '區域'
    self.coltag_transmission = '來源'
    self.coltag_trav_hist = '旅遊史'
    self.coltag_entry_date = '入境臺灣日期'
    self.coltag_onset_date = '出現症狀日期'
    self.coltag_hosp_date = '就醫日期'
    self.coltag_channel = '發現管道'
    self.coltag_symptom = '症狀'
    self.coltag_disease = '疾病史'
    self.coltag_link = '感染源'
    self.coltag_notes = '備註'
    self.coltag_discharged = '痊癒'
    self.coltag_dis_date = '痊癒日期'
    self.coltag_dis_date_2 = '出院日期'
    self.coltag_conf_press_rel = '疾管署新聞稿'
    self.coltag_dis_press_rel = '出院新聞稿'
    
    self.n_total = 0
    self.n_latest = 0
    self.n_2020 = 0
    self.n_2021 = 0
    self.n_empty = 0
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_case_breakdown.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    case_nb_list = data[self.coltag_case].values
    ind = case_nb_list == case_nb_list
    self.data = data[ind]
    
    self.getReportDate()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
      print('N_latest = %d' % self.n_latest)
      print('N_2020 = %d' % self.n_2020)
      print('N_2021 = %d' % self.n_2021)
      print('N_empty = %d' % self.n_empty)
    return 
    
  def getReportDate(self):
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    ord_end_2022 = ISODateToOrd('2022-12-31') + 1
    
    report_date_list = []
    n_total = 0
    n_latest = 0
    n_2020 = 0
    n_2021 = 0
    n_empty = 0
    
    for report_date, trans in zip(self.getCol(self.coltag_report_date), self.getCol(self.coltag_transmission)):
      if trans != trans: ## NaN
        report_date_list.append(np.nan)
        n_empty += 1
        continue
      
      yyyymdday_zh = report_date.split('年')
      y = int(yyyymdday_zh[0])
      mdday_zh = yyyymdday_zh[1].split('月')
      m = int(mdday_zh[0])
      dday_zh = mdday_zh[1].split('日')
      d = int(dday_zh[0])
      report_date = '%04d-%02d-%02d' % (y, m, d)
      report_date_list.append(report_date)
      n_total += 1
      
      ord_rep = ISODateToOrd(report_date)
      
      if ord_rep + NB_LOOKBACK_DAYS >= ord_today:
        n_latest += 1
        
      if ord_rep < ord_end_2020:
        n_2020 += 1
        
      if ord_rep >= ord_end_2020 and ord_rep < ord_end_2021:
        n_2021 += 1
    
    self.n_total = n_total
    self.n_latest = n_latest
    self.n_2020 = n_2020
    self.n_2021 = n_2021
    self.n_empty = n_empty
    return report_date_list
  
  def getAge(self):
    age_list = []
    for i, age in enumerate(self.getCol(self.coltag_age)):
      if age in [
        '1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X', '9X',
        '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', 
      ]:
        age_list.append(age[0]+'0s')
      elif age in ['1XX', '10X', '11X', '100s', '102']:
        age_list.append('100s')
        
      elif age in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '<10', '<1', '<5', '<6', '8月大']:
        age_list.append('0s')
      elif age in ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '10-14']:
        age_list.append('10s')
      elif age in ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '20-24']:
        age_list.append('20s')
      elif age in ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39']:
        age_list.append('30s')
      elif age in ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '40-44']:
        age_list.append('40s')
      elif age in ['50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '50-54']:
        age_list.append('50s')
      elif age in ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69']:
        age_list.append('60s')
      elif age in ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79']:
        age_list.append('70s')
      elif age in ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89']:
        age_list.append('80s')
      elif age in ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99']:
        age_list.append('90s')
        
      elif age in [
        '<5-4X', '<5-8X', '<5-9X', '<5-1XX', '<10-4X', '<10-8X', '<10-9X', '3-77', 
        '1X-2X', '1X-4X', '2X-3X', '2X-4X', '2X-6X', '3X-4X', '3X-8X', '5X-7X', '5X-8X'
      ]:
        age_list.append(np.nan)
      elif age != age:
        age_list.append(np.nan)
      else:
        print('Age, Case %d, %s' % (i+1, age))
        age_list.append(np.nan)
    return age_list
  
  def getTransmission(self):
    trans_list = []
    
    for i, trans in enumerate(self.getCol(self.coltag_transmission)):
      if trans != trans:
        trans_list.append(np.nan)
      
      elif i+1 in [760, 766]:
        trans_list.append('plane')
      
      elif trans == '境外':
        trans_list.append('imported')
      
      elif trans in ['敦睦遠訓', '敦睦\n遠訓']:
        trans_list.append('fleet')
      
      elif trans == '本土':
        trans_list.append('indigenous')
      
      elif trans == '不明':
        trans_list.append('unknown')
      
      else:
        print('Transmission, Case %d, %s' % (i+1, trans))
        trans_list.append(np.nan)
        
    return trans_list
  
  def getNationality(self):
    nat_list = []
    for nat in self.getCol(self.coltag_nationality):
      nat_list.append(nat)
    return nat_list
  
  def getTravHist(self):
    key_dict = {
      ## Far-East Asia
      'Bangladesh': ['孟加拉'],
      'China': ['中國', '武漢', '深圳', '廣州', '遼寧', '江蘇', '浙江'],
      'Hong Kong': ['香港'],
      'India': ['印度'], 
      'Indonesia': ['印尼'], 
      'Japan': ['日本', '東京', '大阪', '北海道'],
      'Korea': ['韓國', '首爾'],
      'Macao': ['澳門'],
      'Malaysia': ['馬來西亞'], 
      'Myanmar' : ['緬甸'],
      'Nepal': ['尼泊爾'],
      'Pakistan': ['巴基斯坦'],
      'Philippines': ['菲律賓'], 
      'Singapore': ['新加坡'], 
      'Thailand': ['泰國', '曼谷'], 
      'Vietnam': ['越南'],
      
      ## West & Central Asia
      'Kazakhstan': ['哈薩克'], 
      'Kyrgyzstan': ['吉爾吉斯'],
      'Oman': ['阿曼'],
      'Qatar': ['阿拉伯－卡達', '卡達'], 
      'Syria': ['敘利亞'], 
      'Turkey': ['土耳其'], 
      'UAE': ['阿拉伯－杜拜', '杜拜'], 
      'Uzbekistan': ['烏茲別克'],
      
      ## Europe
      'Europe': ['歐洲'], 
      'Albania': ['阿爾巴尼亞'], 
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
      'Slovakia': ['斯洛伐克'],
      'Spain': ['西班牙'], 
      'Switzerland': ['瑞士'], 
      'UK': ['英國', '倫敦'], 
      'Ukraine': ['烏克蘭'],
      
      ## Africa
      'Africa': ['非洲'],
      'Cameroon': ['喀麥隆'],
      'Eswatini': ['史瓦帝尼'],
      'Egypt': ['埃及'], 
      'Ethiopia': ['衣索比亞'],
      'Ghana': ['迦納'], 
      'Lesotho': ['賴索托'],
      'Morocco': ['摩洛哥'], 
      'Nigeria': ['奈及利亞'], 
      'Senegal': ['塞內加爾'],
      'South Africa': ['南非'], 
      'Tunisia': ['突尼西亞'], 
      'Uganda': ['烏干達'],
      
      ## North & South America
      'Argentina': ['阿根廷'], 
      'Bolivia': ['玻利維亞'], 
      'Brazil': ['巴西'],
      'Canada': ['加拿大'], 
      'Chile': ['智利', '聖地牙哥'], 
      'Dominican Republic': ['多明尼加'],
      'Guatemala': ['瓜地馬拉'], 
      'Haiti': ['海地'], 
      'Honduras': ['宏都拉斯'], 
      'Latin America': ['中南美洲'], 
      'Mexico': ['墨西哥'], 
      'Paraguay': ['巴拉圭'],
      'Peru': ['秘魯', '祕魯'], 
      'USA': ['美國', '加州', '紐約'], 
      
      ## Oceania
      'Australia': ['澳大利亞', '澳洲'], 
      'Marshall Islands': ['馬紹爾'],
      'New Zealand': ['紐西蘭'], 
      'Palau': ['帛琉'], 
      
      ## Others
      'Antarctica': ['南極'], 
      'Coral Princess': ['珊瑚公主號'], 
      'Diamond Princess': ['鑽石公主號'], 
      'Pan-Shi': ['海軍敦睦支隊磐石艦', '整隊登艦', '台灣啟航', '左營靠泊檢疫'],
      'indigenous': ['無', 'x', 'X']
    }
    nat_list = self.getNationality()
    trav_hist_list = []
    
    for i, trav_hist in enumerate(self.getCol(self.coltag_trav_hist)):
      if trav_hist != trav_hist: ## Is nan
        trav_hist_list.append([])
        continue
      
      stock = []
      
      ## Scan the content with all keys
      for key, value_list in key_dict.items():
        for value in value_list:
          if value in trav_hist:
            trav_hist = ''.join(trav_hist.split(value))
            stock.append(key) ## Put the translation in stock
      
      ## Remove meaningless words
      trav_hist = ''.join(trav_hist.split('2017年8月就入境台灣，期間並未出境'))
      trav_hist = ''.join(trav_hist.split('2020年3月入境後未再出境'))
      trav_hist = ''.join(trav_hist.split('自離境前往'))
      trav_hist = ''.join(trav_hist.split('從搭機'))
      trav_hist = ''.join(trav_hist.split('轉機'))
      trav_hist = ''.join(trav_hist.split('出海'))
      trav_hist = ''.join(trav_hist.split('出境'))
      trav_hist = ''.join(trav_hist.split('上旬'))
      trav_hist = ''.join(trav_hist.split('中旬'))
      trav_hist = ''.join(trav_hist.split('下旬'))
      trav_hist = ''.join(trav_hist.split('返國'))
      trav_hist = ''.join(trav_hist.split('回台'))
      trav_hist = ''.join(trav_hist.split('來台'))
      
      for key in [
        '臺灣', '台灣', '北部', '台北', '萬華', '板橋', '新北', '桃園', '苗栗', '台中', '彰化', '新竹', '南投', 
        '雲林', '嘉縣', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '馬祖'
      ]:
        trav_hist = ''.join(trav_hist.split(key))
      
      trav_hist = trav_hist.lstrip(' 0123456789-/()、月及到等經\n→ ')
      
      ## Complain if unrecognized texts remain
      if len(trav_hist) > 0:
        print('Travel history, Case %d, %s' % (i+1, trav_hist))
      
      ## If no travel history but imported, add nationality (only for i >= 460)
      if i >= 460 and len(stock) == 0:
        for key, value_list in key_dict.items():
          for value in value_list:
            if value in nat_list[i]:
              stock.append(key)
              break
      
      stock = list(set(stock))
      trav_hist_list.append(stock)
      
    trav_hist_list = [trav_hist if len(trav_hist) > 0 else np.nan for trav_hist in trav_hist_list]
    return trav_hist_list
  
  def getEntryDate(self):
    entry_date_list = []
    
    for i, entry_date in enumerate(self.getCol(self.coltag_entry_date)):
      if entry_date != entry_date: ## NaN
        entry_date_list.append(np.nan)
        
      elif entry_date in ['x', 'X', '3/7-5/12', '2017年8月']:
        entry_date_list.append(np.nan)
        
      elif entry_date in ['3/1\n3/8']:
        entry_date_list.append('2020-03-08')
      
      elif entry_date in ['10/28(29)']:
        entry_date_list.append('2020-10-28')
      
      elif entry_date in ['11/7(8)']:
        entry_date_list.append('2020-11-07')
      
      elif entry_date in ['11/20(-27)']:
        entry_date_list.append('2020-11-24')
        
      elif entry_date in ['11/28(12/2)']:
        entry_date_list.append('2020-11-30')
        
      elif entry_date in ['12/4\n12/15', '12/7\n12/15']:
        entry_date_list.append('2020-12-15')
        
      elif entry_date in ['12/27(30)']:
        entry_date_list.append('2020-12-29')
        
      elif entry_date in ['5/5(6)']:
        entry_date_list.append('2021-05-05')
        
      elif entry_date in ['5/17(18)']:
        entry_date_list.append('2021-05-17')
        
      else:
        try:
          mmdd = entry_date.split('/')
          y = 2020
          m = int(mmdd[0])
          d = int(mmdd[1])
          if i+1 < 100 and m > 6:
            y = 2019
          elif i+1 >= 800 and m <= 6:
            y = 2021
            
          entry_date = '%04d-%02d-%02d' % (y, m, d)
          entry_date_list.append(entry_date)
        except:
          print('Entry date, Case %d, %s' % (i+1, entry_date))
          entry_date_list.append(np.nan)
    
    return entry_date_list
  
  def getOnsetDate(self):
    onset_date_list = []
    
    for i, onset_date in enumerate(self.getCol(self.coltag_onset_date)):
      if onset_date != onset_date: ## NaN
        onset_date_list.append(np.nan)
      
      elif onset_date in [
        '1月', '2/18-25', '3月', '4/1-6/3', '4/6-5/15', '4/25-5/22', '4/26-5/26', '4/28-6/2', '4/29-5/27', '4/29-5/30', '4/30-5/18', 
        '5/1-19', '5/2-13', '5/2-22', '5/2-6/1', '5/5-16', '5/5-17', '5/6-22', '5/6-27', '5/6-6/13', '5/7-20', '5/7-24', '5/7-25', '5/7-28', 
        '5/8-20', '5/8-25', '5/10-16', '5/10-5/18', '5/10-20', '5/10-21', '5/10-23', '5/11-27', '5/13-25', '5/13-27', '5/13-30', '5/13-31',
        '5/14-22', '5/14-29', '5/14-6/8', '5/15-26', '5/15-6/4', '5/16\n*5/24', '5/18-6/2', '5/19-6/10', 
        '5/20-30', '5/20-31', '5/21-6/6', '5/22-6/7', '5/22-6/9', '5/23-6/12', '5/24-6/5', '5/28-6/11', '5/28-6/13',
        '6/1-2', '6/1-14', '6/1-15', '6/3-16', '6/3-18', '6/4-19', '6/4-23', '6/8-20', '6/10-22', '6/14-21', 
        '9月下旬', '10月中旬', '11月初', '11月上旬', '11月下旬', '12/', '12月上旬', 'x', 'X']:
        onset_date_list.append(np.nan)
        
      elif onset_date in ['5/26 採檢\n5/26 確診']:
        onset_date_list.append('2021-05-26')
      elif onset_date in ['6/7 喉嚨痛、疲勞\n6/8 發燒']:
        onset_date_list.append('2021-06-07')
      elif onset_date in ['6/8 發燒']:
        onset_date_list.append('2021-06-08')
        

      elif onset_date in ['7月、11/1']:
        onset_date_list.append('2020-11-01')
        
      elif onset_date in ['5/8-10']:
        onset_date_list.append('2021-05-09')
        
      else:
        try:
          mmdd = onset_date.split('/')
          y = 2020
          m = int(mmdd[0])
          d = int(mmdd[1])
          if i+1 < 100 and m > 6:
            y = 2019
          elif i+1 >= 800 and m <= 6:
            y = 2021
          onset_date = '%04d-%02d-%02d' % (y, m, d)
          onset_date_list.append(onset_date)
        except:
          print('Onset date, Case %d, %s' % (i+1, onset_date))
          onset_date_list.append(np.nan)
    
    return onset_date_list
  
  def getChannel(self):
    channel_list = []
    key_list_out = ['採檢']
    
    for i, channel in enumerate(self.getCol(self.coltag_channel)):
      if channel != channel: ## Is nan
        channel_list.append(np.nan)
      
      elif channel in key_list_out:
        channel_list.append(np.nan)
        
      elif channel in ['機場']:
        channel_list.append('airport')
        
      elif channel in ['居家檢疫', '集中檢疫', '英國專案', '死亡']:
        channel_list.append('quarantine')
        
      elif channel in [
        '居家隔離', '住院隔離', '接觸患者', '同院患者', '框列採檢', '匡列篩檢', '匡列居隔', 
        '接觸者回溯', '接觸者檢查', '接觸者採檢', '接觸者框列', '接觸者匡列', '匡列接觸者', 
        '確診者回溯', '確診者匡列', '居家隔離期滿後採檢', '居家隔離期滿後確診'
      ]:
        channel_list.append('isolation')
        
      elif channel in ['自主健康管理', '加強自主管理', '居家隔離期滿\n自主健康管理']:
        channel_list.append('monitoring')
        
      elif channel in [
        '入院', '快篩站', '自行就醫', '自主就醫', '自費篩檢', '自費採檢', '自費檢驗', '自行通報', '定期篩檢', '定期監測', '定期監控', 
        '入院篩檢', '入院採檢', '院內採檢', '社區快篩', '社區專案', '社區篩檢', '專案篩檢', '常規篩檢', 
        '萬華專案', '擴大採檢', '擴大篩檢', '預防性快篩', '預防性採檢', '鄰家擴大採檢', '入院前預防性採檢', '解隔離後自行就醫'
      ]:
        channel_list.append('hospital')
        
      elif '定期篩檢' in channel:
        channel_list.append('hospital')
        
      elif channel in ['香港檢驗', '外國檢驗', '外國篩檢']:
        channel_list.append('overseas')
        
      else:
        print('Channel, Case %d, %s' % (i+1, channel))
        channel_list.append(np.nan)
    return channel_list
  
  def getSymptom(self):
    key_dict = {
      'sneezing': ['伴隨感冒症狀', '感冒症狀', '鼻涕倒流', '打噴嚏', '流鼻水', '流鼻涕', '鼻塞', '鼻水', '鼻炎', '感冒'],
      'cough': ['輕微咳嗽', '咳嗽症狀', '咳嗽加劇', '咳嗽併痰', '咳嗽有痰', '痰有血絲', '喉嚨有痰', '有點咳嗽', '咳嗽', '乾咳', '輕咳', '有痰'],
      'throatache': [
        '上呼吸道症狀', '上呼吸道腫痛', '呼吸道症狀', '上呼吸道', '咽喉不適', '急性咽炎', '聲音沙啞', '口乾舌燥', 
        '異物感', '樓龍痛', '呼吸道', '沙啞', '乾嘔', 
        '喉嚨有異物感', '喉嚨乾澀想咳', '喉嚨不適', '喉嚨痛癢', '喉嚨乾癢', '喉嚨乾痛', '喉嚨痛', '喉嚨癢', '喉嚨腫', 
        '喉嚨乾', '喉嚨'
      ],
      'earache': [' 耳朵痛'],
      'dyspnea': [
        '講話、呼吸吃力', '活動後呼吸喘', '重度呼吸窘迫', '些微呼吸急促', '呼吸喘 困難', '呼吸窘迫', '呼吸不順', '呼吸困難', '呼吸微喘', '呼吸短促', '呼吸急促', '走路會喘', 
        '走路喘', '呼吸喘', '輕微喘', '微喘', '氣喘', '喘嗚', '喘'
      ],
      'bronchitis': ['支氣管炎'],
      'pneumonia': ['X光顯示肺炎', 'X光片顯示肺炎', 'X光顯示肺部輕微浸潤', '雙側肺部有異狀', '肺浸潤', '肺炎'], 
      
      'fever': ['出現中暑的狀態', '身體悶熱不適', '間歇性發燒', '身體微熱', '體溫偏高', '體溫升高', '反覆發燒', '身體發熱', '微燒', '低燒', '發燒', '發熱', '盜汗'], 
      'chills': ['忽冷忽熱症狀', '忽冷忽熱', '冒冷汗', '畏寒', '發冷', '寒顫'], 
      
      'nausea': ['噁心', '想吐'],
      'vomiting': ['嘔吐感', '嘔吐'],
      'diarrhea': ['腹瀉'], 
      
      'headache': ['頭暈目眩', '輕度頭痛', '頭骨痛', '偏頭痛', '頭痛', '頭暈', '頭脹', '暈眩', '頭重'],
      'eyes sore': ['結膜充血', '後眼窩痛', '眼睛癢', '眼睛痛', '眼壓高'], 
      'chest pain+backache': ['胸背痛'], 
      'chest pain': ['呼吸時胸痛', '心臟不舒服', '胸部不適', '胸痛', '胸悶'],
      'stomachache': ['腸胃不舒服', '腸胃道不適', '腸胃不適', '胃部不適', '腹部不適', '肚子不適', '腹悶痛', '胃痛', '腹痛', '胃脹', '腹脹'],
      'backache': ['腰酸背痛', '背痛'], 
      'toothache': ['牙痛'], 
      'rash': ['出疹'],
      
      'fatigue': [
        '全身倦怠無力', '左側肢體無力', '全身倦怠', '全身疲憊', '全身疲倦', '身體無力', '全身無力', '走路無力', '四肢無力', '精神倦怠', '體力不支', '體力變差', '全身虛弱', '全身疲軟', 
        '疲倦感', '倦怠情', '體力差', '沒精神', '倦怠', '疲憊', '疲倦', '疲勞', '疲累', '無力', '虛弱'
      ],
      'soreness': [
        '全身肌肉痠痛', '上半身骨頭刺痛', '小腿肌肉痠痛', '肌肉痠痛症狀', '肌肉關節痠痛', '肌肉 痠痛', '肌肉酸痛', '肌肉痠痛', 
        '全身痠痛', '全身酸痛', '骨頭痠痛', '骨頭酸痛', '關節痠痛', '身體痠痛', '肌肉痛', '骨頭酸', '關節痛', '身體痛', '痠痛'
      ],
      'hypersomnia': ['嗜睡'],
      'insomnia': ['睡不著'], 
      
      'dysnosmia+dysgeusia': ['味覺及嗅覺都喪失', '味覺及嗅覺喪失', '嗅覺和味覺喪失', '嗅味覺異常', '味嗅覺異常'], 
      'dysnosmia': ['嗅覺異常症狀', '嗅覺不靈敏', '失去嗅覺', '嗅覺喪失', '嗅覺變差', '嗅覺遲鈍', '嗅覺異常', '喪失嗅覺', '嗅覺降低', '無嗅覺'], 
      'dysgeusia': ['味覺喪失', '味覺異常', '喪失味覺', '失去味覺', '味覺變差', '口苦'], 
      
      'tonsillitis': ['淋巴腫脹', '扁桃腺腫痛'], 
      'hypoglycemia': ['低血糖'],
      'anorexia': ['食慾不佳', '食慾不振', '食慾下降', '食欲不振', '胃口變差', '沒有食慾', '食慾差', '無食慾'],
      'arrhythmia': ['心律不整'],
      'coma': ['意識不清', '意識改變'],
      
      'symptomatic': ['全身不舒服', '出現症狀', '身體不適', '有症狀', '不舒服', '不適'] + \
        ['血氧濃度54%', '血氧降低', '排尿疼痛', '眼球上吊', '肢體變黑', '鼻子乾', '猝死', '抽搐', '手抖', '吐血'],
      'asymptomatic': ['首例無症狀', '無症狀', 'x', 'X'],
    }
    symp_list = []
    
    for i, symp in enumerate(self.getCol(self.coltag_symptom)):
      symp_orig = symp
      
      if symp != symp: ## Is nan
        symp_list.append([])
        continue
      
      stock = []
      symp = ''.join(symp.split('入境已無症狀'))
      symp = ''.join(symp.split('#68 #69 #70 #73其中一人無症狀'))
      
      for key, value_list in key_dict.items():
        for value in value_list:
          if value in symp:
            symp = ''.join(symp.split(value))
            for k in key.split('+'):
              stock.append(k)
      
      symp = ''.join(symp.split('(耳溫量測37.7度)'))
      symp = ''.join(symp.split('到37.5度'))
      symp = ''.join(symp.split('(37.5度)'))
      symp = ''.join(symp.split('(37.4度)'))
      symp = ''.join(symp.split('首例本土'))
      symp = ''.join(symp.split('入境前有'))
      symp = ''.join(symp.split('心情不佳'))
      symp = ''.join(symp.split('診斷為'))
      symp = ''.join(symp.split('嚴重'))
      symp = ''.join(symp.split('輕微'))
      symp = ''.join(symp.split('伴隨'))
      symp = ''.join(symp.split('不順'))
      symp = ''.join(symp.split('自覺'))
      symp = symp.lstrip('  678/\n .，、與及有')
      
      if len(symp) > 0:
        print('Symptom, Case %d, %s' % (i+1, symp))
        print('Symptom, Case %d, %s' % (i+1, symp_orig))
      
      stock = list(set(stock))
      symp_list.append(stock)
      
    symp_list = [symp if len(symp) > 0 else np.nan for symp in symp_list]
    return symp_list

  def getLink(self):
    link_list = []
    for i, link in enumerate(self.getCol(self.coltag_link)):
      if link == '未知':
        link_list.append('unlinked')
      elif link == '院內尚不明':
        link_list.append('unlinked')
      elif link == '調查中':
        link_list.append('unlinked')
        
      elif link == '軍艦':
        link_list.append('fleet')
      
      elif link != link:
        link_list.append(np.nan)
      
      elif 'O' in link:
        link_list.append('linked')
      elif 'o' in link:
        link_list.append('linked')
      elif '#' in link:
        link_list.append('linked')
      elif '接觸' in link:
        link_list.append('linked')
      elif '群聚' in link:
        link_list.append('linked')
      elif '萬華' in link:
        link_list.append('linked')
      elif '金樽' in link:
        link_list.append('linked')
      elif '高血壓' in link:
        link_list.append('linked')
      elif '糖尿病' in link:
        link_list.append('linked')
      elif '林家小館' in link:
        link_list.append('linked')
      elif '長照機構' in link:
        link_list.append('linked')
      elif '美樂地KTV' in link:
        link_list.append('linked')        
        
      elif link in [
        '家祭', '遠傳案', '京元電', 
        '養護中心', '照護中心', '護理之家', '朝陽夜唱', '金沙酒店', '泰安附幼', '成功市場', '洗腎診所', '豐原家庭', '立揚鞋業', '仁愛市場', 
        '銀河百家樂', '維納斯會館', '羅東遊藝場', '串門子餐廳', '彰化麻將團', 
        '中國醫K歌團', '小姑娘小吃店', '快樂城小吃店', '桃園觀音工地', '台北農產公司', 
        '東方紅時尚會館', '梧棲區藥局家族', '加強型防疫旅館', '鳳山早餐店家族', 
        '南澳雜貨店傳播鏈', '復興區公所員工家族案關係圖', 
      ]:
        link_list.append('linked')

      else:
        print('Link, Case %d, %s' % (i+1, link))
        link_list.append(np.nan)
    return link_list
    
  def makeDailyCaseCounts(self):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = dtt.date.today().toordinal() + 1
    
    date_arr = [ordDateToISO(i) for i in range(ord_ref, ord_today)]
    nb_days = ord_today - ord_ref
    nb_imp_arr = np.zeros(nb_days, dtype=int)
    nb_indi_arr = np.zeros(nb_days, dtype=int)
    nb_cases_arr = np.zeros(nb_days, dtype=int)
    
    for report_date, trans in zip(report_date_list, trans_list):
      if trans != trans:
        continue
      
      ind = ISODateToOrd(report_date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      if trans == 'imported':
        nb_imp_arr[ind] += 1
      elif trans == 'indigenous':
        nb_indi_arr[ind] += 1
      
      nb_cases_arr[ind] += 1
      
    return date_arr, nb_imp_arr, nb_indi_arr, nb_cases_arr
    
  def makeTravHistHist(self):
    trans_list = self.getTransmission()
    trav_hist_list = self.getTravHist()
    trav_hist_list_2 = []
    
    for trans, trav_hist in zip(trans_list, trav_hist_list):
      if trans == 'imported' and trav_hist == trav_hist: ## Not NaN
        for trav in trav_hist:
          trav_hist_list_2.append(trav)
    
    hist = clt.Counter(trav_hist_list_2)
    hist = sorted(hist.items(), key=lambda x: x[1], reverse=True)
    return hist

  def makeSymptomHist(self):
    symp_list = self.getSymptom()
    symp_list_2 = []
    
    for symp in symp_list:
      if symp == symp: ## Not NaN
        for s in symp:
          symp_list_2.append(s)
    
    hist = clt.Counter(symp_list_2)
    hist = sorted(hist.items(), key=lambda x: x[1], reverse=True)
    return hist
  
  def makeTravHistSymptomMat(self, selection='latest'):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    trav_hist_list = self.getTravHist()
    symp_list = self.getSymptom()
    
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    trav_hist_list_2 = []
    symp_list_2 = []
    n_total = 0
    n_imported = 0
    
    for report_date, trans, trav_hist, symp in zip(report_date_list, trans_list, trav_hist_list, symp_list):
      if trans != trans:
        continue
      
      ord_rep = ISODateToOrd(report_date)
      
      if 'latest' == selection and ord_rep + NB_LOOKBACK_DAYS < ord_today:
        continue
      
      if '2020' == selection and ord_rep >= ord_end_2020:
        continue
      
      if '2021' == selection and (ord_rep < ord_end_2020 or ord_rep >= ord_end_2021):
        continue
      
      n_total += 1
      if trans == 'imported':
        n_imported += 1
        if trav_hist == trav_hist and symp == symp: ## Not NaN
          trav_hist_list_2.append(trav_hist)
          symp_list_2.append(symp)
    
    assert len(trav_hist_list_2) == len(symp_list_2)
    n_data = len(trav_hist_list_2)
    
    trav_hist_hist = clt.Counter([trav for trav_hist in trav_hist_list_2 for trav in trav_hist])
    trav_hist_hist = sorted(trav_hist_hist.items(), key=lambda x: x[1], reverse=True)
    symp_hist = clt.Counter([s for symp in symp_list_2 for s in symp])
    symp_hist = sorted(symp_hist.items(), key=lambda x: x[1], reverse=True)
    
    trav_bool_mat = []
    for trav_hist_pair in trav_hist_hist:
      trav_bool_arr = [1 if trav_hist_pair[0] in trav_hist else 0 for trav_hist in trav_hist_list_2]
      trav_bool_mat.append(trav_bool_arr)
    trav_bool_mat = np.array(trav_bool_mat)
    
    symp_bool_mat = []
    for symp_pair in symp_hist:
      symp_bool_arr = [1 if symp_pair[0] in symp else 0 for symp in symp_list_2]
      symp_bool_mat.append(symp_bool_arr)
    symp_bool_mat = np.array(symp_bool_mat)
    
    return n_total, n_imported, n_data, trav_hist_hist, symp_hist, trav_bool_mat, symp_bool_mat
  
  def makeTravHistSymptomCorr(self, selection='latest'):
    n_total, n_imported, n_data, trav_hist_hist, symp_hist, trav_bool_mat, symp_bool_mat = self.makeTravHistSymptomMat(selection=selection)
    
    travBoolMat_n = np.array([normalizeBoolArr(trav_bool_arr) for trav_bool_arr in trav_bool_mat])
    symp_bool_mat_n = np.array([normalizeBoolArr(symp_bool_arr) for symp_bool_arr in symp_bool_mat])
    
    corr_mat  = travBoolMat_n.dot(symp_bool_mat_n.T)
    count_mat = trav_bool_mat.dot(symp_bool_mat.T)
    return n_total, n_imported, n_data, trav_hist_hist, symp_hist, corr_mat, count_mat
  
  def makeAgeSymptomMat(self, selection='latest'):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    age_list = self.getAge()
    symp_list = self.getSymptom()
    
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    age_list_2 = []
    symp_list_2 = []
    n_total = 0
    
    for report_date, trans, age, symp in zip(report_date_list, trans_list, age_list, symp_list):
      if trans != trans:
        continue
      
      ord_rep = ISODateToOrd(report_date)
      
      if 'latest' == selection and ord_rep + NB_LOOKBACK_DAYS < ord_today:
        continue
      
      if '2020' == selection and ord_rep >= ord_end_2020:
        continue
      
      if '2021' == selection and (ord_rep < ord_end_2020 or ord_rep >= ord_end_2021):
        continue
      
      n_total += 1
      if age == age and symp == symp: ## Not NaN
        age_list_2.append(age)
        symp_list_2.append(symp)
    
    assert len(age_list_2) == len(symp_list_2)
    n_data = len(age_list_2)
        
    age_hist = clt.Counter(age_list_2)
    for age in AGE_DICT:
      age_hist[age] = age_hist.get(age, 0)
    age_hist = sorted(age_hist.items(), key=lambda x: x[0], reverse=True)
    symp_hist = clt.Counter([s for symp in symp_list_2 for s in symp])
    symp_hist = sorted(symp_hist.items(), key=lambda x: x[1], reverse=True)
    
    age_bool_mat = []
    for age_pair in age_hist:
      age_bool_arr = [1 if age_pair[0] == age_hist else 0 for age_hist in age_list_2]
      age_bool_mat.append(age_bool_arr)
    age_bool_mat = np.array(age_bool_mat)
    
    symp_bool_mat = []
    for symp_pair in symp_hist:
      symp_bool_arr = [1 if symp_pair[0] in symp else 0 for symp in symp_list_2]
      symp_bool_mat.append(symp_bool_arr)
    symp_bool_mat = np.array(symp_bool_mat)
    
    return n_total, n_data, age_hist, symp_hist, age_bool_mat, symp_bool_mat
  
  def makeAgeSymptomCorr(self, selection='latest'):
    n_total, n_data, age_hist, symp_hist, age_bool_mat, symp_bool_mat = self.makeAgeSymptomMat(selection=selection)
    
    age_bool_mat_n = np.array([normalizeBoolArr(age_bool_arr) for age_bool_arr in age_bool_mat])
    symp_bool_mat_n = np.array([normalizeBoolArr(symp_bool_arr) for symp_bool_arr in symp_bool_mat])
    
    corr_mat = age_bool_mat_n.dot(symp_bool_mat_n.T)
    count_mat = age_bool_mat.dot(symp_bool_mat.T)
    return n_total, n_data, age_hist, symp_hist, corr_mat, count_mat
  
  def saveCsv_keyNb(self):
    self.getReportDate()
    timestamp = dtt.datetime.now().astimezone()
    timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC%z')
    
    key = ['n_total', 'n_latest', 'n_2020', 'n_2021', 'n_empty', 'timestamp']
    value = [self.n_total, self.n_latest, self.n_2020, self.n_2021, self.n_empty, timestamp]
    
    data = {'key': key, 'value': value}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/key_numbers.csv' % DATA_PATH
    saveCsv(name, data)
    return
    
  def saveCsv_caseByTrans(self):
    report_date_list = self.getReportDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    link_list = self.getLink()
    
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = dtt.date.today().toordinal() + 1
    
    date = [ordDateToISO(i) for i in range(ord_ref, ord_today)]
    nb_days = ord_today - ord_ref
    imported_r = np.zeros(nb_days, dtype=int)
    linked_r   = np.zeros(nb_days, dtype=int)
    unlinked_r = np.zeros(nb_days, dtype=int)
    fleet_r    = np.zeros(nb_days, dtype=int)
    plane_r    = np.zeros(nb_days, dtype=int)
    unknown_r  = np.zeros(nb_days, dtype=int)
    imported_o = np.zeros(nb_days, dtype=int)
    linked_o   = np.zeros(nb_days, dtype=int)
    unlinked_o = np.zeros(nb_days, dtype=int)
    fleet_o    = np.zeros(nb_days, dtype=int)
    plane_o    = np.zeros(nb_days, dtype=int)
    unknown_o  = np.zeros(nb_days, dtype=int)
    
    for report_date, onset_date, trans, link in zip(report_date_list, onset_date_list, trans_list, link_list):
      if trans != trans:
        continue
      
      ## Regroup by report date
      ind_r = ISODateToOrd(report_date) - ord_ref
      if ind_r < 0 or ind_r >= nb_days:
        print('Bad ind_r = %d' % ind_r)
        continue
      
      if trans == 'imported':
        imported_r[ind_r] += 1
      elif trans == 'fleet':
        fleet_r[ind_r] += 1
      elif trans == 'plane':
        plane_r[ind_r] += 1
      elif trans == 'unknown':
        unknown_r[ind_r] += 1
      elif link == 'unlinked':
        unlinked_r[ind_r] += 1
      else:
        linked_r[ind_r] += 1
      
      ## Regroup by onset date
      if onset_date == onset_date: ## Not NaN
        ind_o = ISODateToOrd(onset_date) - ord_ref
        if ind_o < 0 or ind_o >= nb_days:
          print('Bad ind_o = %d' % ind_o)
          continue
        
        if trans == 'imported':
          imported_o[ind_o] += 1
        elif trans == 'fleet':
          fleet_o[ind_o] += 1
        elif trans == 'plane':
          plane_o[ind_o] += 1
        elif trans == 'unknown':
          unknown_o[ind_o] += 1
        elif link == 'unlinked':
          unlinked_o[ind_o] += 1
        else:
          linked_o[ind_o] += 1
    
    data_r = {'date': date, 'unknown': unknown_r, 'plane': plane_r, 'fleet': fleet_r, 'unlinked': unlinked_r, 'linked': linked_r, 'imported': imported_r}
    data_r = pd.DataFrame(data_r)
    data_o = {'date': date, 'unknown': unknown_o, 'plane': plane_o, 'fleet': fleet_o, 'unlinked': unlinked_o, 'linked': linked_o, 'imported': imported_o}
    data_o = pd.DataFrame(data_o)
    
    data_latest_r = data_r.iloc[-NB_LOOKBACK_DAYS:]
    data_latest_o = data_o.iloc[-NB_LOOKBACK_DAYS:]
    data_2020_r = data_r.iloc[:366]
    data_2020_o = data_o.iloc[:366]
    data_2021_r = data_r.iloc[366:731]
    data_2021_o = data_o.iloc[366:731]
    
    name = '%sprocessed_data/latest/case_by_transmission_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_latest_r)
    name = '%sprocessed_data/latest/case_by_transmission_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_latest_o)
    
    name = '%sprocessed_data/2020/case_by_transmission_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_2020_r)
    name = '%sprocessed_data/2020/case_by_transmission_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_2020_o)
    
    name = '%sprocessed_data/2021/case_by_transmission_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_2021_r)
    name = '%sprocessed_data/2021/case_by_transmission_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_2021_o)
    return
  
  def saveCsv_caseByDetection(self):
    report_date_list = self.getReportDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    channel_list = self.getChannel()
    
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = dtt.date.today().toordinal() + 1
    
    date = [ordDateToISO(i) for i in range(ord_ref, ord_today)]
    nb_days = ord_today - ord_ref
    airport_r  = np.zeros(nb_days, dtype=int)
    qt_r       = np.zeros(nb_days, dtype=int)
    iso_r      = np.zeros(nb_days, dtype=int)
    monitor_r  = np.zeros(nb_days, dtype=int)
    hospital_r = np.zeros(nb_days, dtype=int)
    overseas_r = np.zeros(nb_days, dtype=int)
    no_data_r  = np.zeros(nb_days, dtype=int)
    airport_o  = np.zeros(nb_days, dtype=int)
    qt_o       = np.zeros(nb_days, dtype=int)
    iso_o      = np.zeros(nb_days, dtype=int)
    monitor_o  = np.zeros(nb_days, dtype=int)
    hospital_o = np.zeros(nb_days, dtype=int)
    overseas_o = np.zeros(nb_days, dtype=int)
    no_data_o  = np.zeros(nb_days, dtype=int)
    
    for report_date, onset_date, trans, channel in zip(report_date_list, onset_date_list, trans_list, channel_list):
      if trans != trans:
        continue
      
      ind_r = ISODateToOrd(report_date) - ord_ref
      if ind_r < 0 or ind_r >= nb_days:
        print('Bad ind_r = %d' % ind_r)
        continue
      
      if channel == 'airport':
        airport_r[ind_r] += 1
      elif channel == 'quarantine':
        qt_r[ind_r] += 1
      elif channel == 'isolation':
        iso_r[ind_r] += 1
      elif channel == 'monitoring':
        monitor_r[ind_r] += 1
      elif channel == 'hospital':
        hospital_r[ind_r] += 1
      elif channel == 'overseas':
        overseas_r[ind_r] += 1
      elif channel != channel: ## Is nan
        no_data_r[ind_r] += 1
      
      if onset_date == onset_date: ## Not NaN
        ind_o = ISODateToOrd(onset_date) - ord_ref
        if ind_o < 0 or ind_o >= nb_days:
          print('Bad ind_o = %d' % ind_o)
          continue
        
        if channel == 'airport':
          airport_o[ind_o] += 1
        elif channel == 'quarantine':
          qt_o[ind_o] += 1
        elif channel == 'isolation':
          iso_o[ind_o] += 1
        elif channel == 'monitoring':
          monitor_o[ind_o] += 1
        elif channel == 'hospital':
          hospital_o[ind_o] += 1
        elif channel == 'overseas':
          overseas_o[ind_o] += 1
        elif channel != channel: ## Is nan
          no_data_o[ind_o] += 1
    
    data_r = {'date': date, 'no_data': no_data_r, 'overseas': overseas_r, 'hospital': hospital_r, 
              'monitoring': monitor_r, 'isolation': iso_r, 'quarantine': qt_r, 'airport': airport_r}
    data_r = pd.DataFrame(data_r)
    data_o = {'date': date, 'no_data': no_data_o, 'overseas': overseas_o, 'hospital': hospital_o, 
              'monitoring': monitor_o, 'isolation': iso_o, 'quarantine': qt_o, 'airport': airport_o}
    data_o = pd.DataFrame(data_o)
    
    data_latest_r = data_r.iloc[-NB_LOOKBACK_DAYS:]
    data_latest_o = data_o.iloc[-NB_LOOKBACK_DAYS:]
    data_2020_r = data_r.iloc[:366]
    data_2020_o = data_o.iloc[:366]
    data_2021_r = data_r.iloc[366:731]
    data_2021_o = data_o.iloc[366:731]
    
    name = '%sprocessed_data/latest/case_by_detection_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_latest_r)
    name = '%sprocessed_data/latest/case_by_detection_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_latest_o)
    
    name = '%sprocessed_data/2020/case_by_detection_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_2020_r)
    name = '%sprocessed_data/2020/case_by_detection_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_2020_o)
    
    name = '%sprocessed_data/2021/case_by_detection_by_report_day.csv' % DATA_PATH
    saveCsv(name, data_2021_r)
    name = '%sprocessed_data/2021/case_by_detection_by_onset_day.csv' % DATA_PATH
    saveCsv(name, data_2021_o)
    return
  
  def saveCsv_diffByTrans(self):
    report_date_list = self.getReportDate()
    entry_date_list  = self.getEntryDate()
    onset_date_list  = self.getOnsetDate()
    trans_list       = self.getTransmission()
    
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    stock_latest_imp = []
    stock_latest_indi = []
    stock_latest_other = []
    stock_2020_imp = []
    stock_2020_indi = []
    stock_2020_other = []
    stock_2021_imp = []
    stock_2021_indi = []
    stock_2021_other = []
    
    for i, report_date, entry_date, onset_date, trans in zip(range(len(report_date_list)), report_date_list, entry_date_list, onset_date_list, trans_list):
      if trans != trans:
        continue
      
      if trans == 'imported':
        stock_latest = stock_latest_imp
        stock_2020 = stock_2020_imp
        stock_2021 = stock_2021_imp
      elif trans == 'indigenous':
        stock_latest = stock_latest_indi
        stock_2020 = stock_2020_indi
        stock_2021 = stock_2021_indi
      elif trans in ['fleet', 'plane', 'unknown']:
        stock_latest = stock_latest_other
        stock_2020 = stock_2020_other
        stock_2021 = stock_2021_other
      else:
        print('diffByTrans, Case %d, %s' % (i+1, trans))
      
      ord_rep = ISODateToOrd(report_date)
      ord_entry = ISODateToOrd(entry_date) if entry_date == entry_date else 0
      ord_onset = ISODateToOrd(onset_date) if onset_date == onset_date else 0
      
      if ord_entry + ord_onset == 0:
        continue
      
      diff = min(ord_rep-ord_entry, ord_rep-ord_onset)
      
      if ord_rep + NB_LOOKBACK_DAYS > ord_today:
        stock_latest.append(diff)
      
      if ord_rep < ord_end_2020:
        stock_2020.append(diff)
        
      if ord_rep >= ord_end_2020 and ord_rep < ord_end_2021:
        stock_2021.append(diff)
    
    ## Histogram bins
    bins = np.arange(-0.5, 31, 1)
    bins[-1] = 999
    
    ## Latest
    n_imp, ctr_bins = makeHist(stock_latest_imp, bins)
    n_indi, ctr_bins = makeHist(stock_latest_indi, bins)
    n_other, ctr_bins = makeHist(stock_latest_other, bins)
    n_tot = n_imp + n_indi + n_other
    
    n_imp = n_imp.round(0).astype(int)
    n_indi = n_indi.round(0).astype(int)
    n_other = n_other.round(0).astype(int)
    n_tot = n_tot.round(0).astype(int)
    ctr_bins = ctr_bins.round(0).astype(int)
    ctr_bins[-1] = 30
    
    data = {'difference': ctr_bins, 'all': n_tot, 'imported': n_imp, 'indigenous': n_indi, 'other': n_other}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/latest/difference_by_transmission.csv' % DATA_PATH
    saveCsv(name, data)
    
    ## 2020
    n_imp, ctr_bins = makeHist(stock_2020_imp, bins)
    n_indi, ctr_bins = makeHist(stock_2020_indi, bins)
    n_other, ctr_bins = makeHist(stock_2020_other, bins)
    n_tot = n_imp + n_indi + n_other
    
    n_imp = n_imp.round(0).astype(int)
    n_indi = n_indi.round(0).astype(int)
    n_other = n_other.round(0).astype(int)
    n_tot = n_tot.round(0).astype(int)
    ctr_bins = ctr_bins.round(0).astype(int)
    ctr_bins[-1] = 30
    
    data = {'difference': ctr_bins, 'all': n_tot, 'imported': n_imp, 'indigenous': n_indi, 'other': n_other}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/2020/difference_by_transmission.csv' % DATA_PATH
    saveCsv(name, data)
    
    ## 2021
    n_imp, ctr_bins = makeHist(stock_2021_imp, bins)
    n_indi, ctr_bins = makeHist(stock_2021_indi, bins)
    n_other, ctr_bins = makeHist(stock_2021_other, bins)
    n_tot = n_imp + n_indi + n_other
    
    n_imp = n_imp.round(0).astype(int)
    n_indi = n_indi.round(0).astype(int)
    n_other = n_other.round(0).astype(int)
    n_tot = n_tot.round(0).astype(int)
    ctr_bins = ctr_bins.round(0).astype(int)
    ctr_bins[-1] = 30
    
    data = {'difference': ctr_bins, 'all': n_tot, 'imported': n_imp, 'indigenous': n_indi, 'other': n_other}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/2021/difference_by_transmission.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv_travHistSymptomCorr(self, selection='latest'):
    n_total, n_imported, n_data, trav_hist_hist, symp_hist, corr_mat, count_mat = self.makeTravHistSymptomCorr(selection=selection)
    
    n_trav = 10
    n_symp = 10
    
    corr_mat = corr_mat[:n_trav, :n_symp]
    count_mat = count_mat[:n_trav, :n_symp]
    trav_hist_hist = trav_hist_hist[:n_trav]
    symp_hist = symp_hist[:n_symp]
    
    trav_hist_list = [trav[0] for trav in trav_hist_hist]
    symp_list = [symp[0] for symp in symp_hist]
    grid = np.meshgrid(symp_list, trav_hist_list)
    
    symp = grid[0].flatten()
    trav_hist = grid[1].flatten()
    value_r = corr_mat.flatten()
    label_r = ['%+.0f%%' % (100*v) if v == v else '0%' for v in value_r]
    label_n = count_mat.flatten()
    
    data1 = {'symptom': symp, 'trav_hist': trav_hist, 'value': value_r, 'label': label_r}
    data1 = pd.DataFrame(data1)
    
    data2 = {'symptom': symp, 'trav_hist': trav_hist, 'value': value_r, 'label': label_n}
    data2 = pd.DataFrame(data2)
    
    pairList = [('N_total', n_total), ('N_imported', n_imported), ('N_data', n_data)] + trav_hist_hist + symp_hist
    label = [pair[0] for pair in pairList]
    count = [pair[1] for pair in pairList]
    label_zh = ['合計', '境外移入總數', '有資料案例數'] + [TRAVEL_HISTORY_DICT[trav]['zh-tw'] for trav in trav_hist_list] + [SYMPTOM_DICT[symp]['zh-tw'] for symp in symp_list]
    label_fr = ['Total', 'Importés', 'Données complètes'] + [TRAVEL_HISTORY_DICT[trav]['fr'] for trav in trav_hist_list] + [SYMPTOM_DICT[symp]['fr'] for symp in symp_list]
    
    data3 = {'label': label, 'count': count, 'label_zh': label_zh, 'label_fr': label_fr}
    data3 = pd.DataFrame(data3)
    
    name = '%sprocessed_data/%s/travel_history_symptom_correlations_coefficient.csv' % (DATA_PATH, selection)
    saveCsv(name, data1)
    name = '%sprocessed_data/%s/travel_history_symptom_correlations_counts.csv' % (DATA_PATH, selection)
    saveCsv(name, data2)
    name = '%sprocessed_data/%s/travel_history_symptom_correlations_total.csv' % (DATA_PATH, selection)
    saveCsv(name, data3)
    return
  
  def saveCsv_ageSymptomCorr(self, selection='latest'):
    n_total, n_data, age_hist, symp_hist, corr_mat, count_mat = self.makeAgeSymptomCorr(selection=selection)
    
    n_age  = corr_mat.shape[0]
    n_symp = 10
    
    corr_mat = corr_mat[:n_age, :n_symp]
    count_mat = count_mat[:n_age, :n_symp]
    age_hist = age_hist[:n_age]
    symp_hist = symp_hist[:n_symp]
    
    age_list = [age[0] for age in age_hist]
    symp_list = [symp[0] for symp in symp_hist]
    grid = np.meshgrid(symp_list, age_list)
    
    symp = grid[0].flatten()
    age = grid[1].flatten()
    value_r = corr_mat.flatten()
    label_r = ['%+.0f%%' % (100*v) if v == v else '0%' for v in value_r]
    label_n = count_mat.flatten()
    
    data1 = {'symptom': symp, 'age': age, 'value': value_r, 'label': label_r}
    data1 = pd.DataFrame(data1)
    
    data2 = {'symptom': symp, 'age': age, 'value': value_r, 'label': label_n}
    data2 = pd.DataFrame(data2)
    
    pair_list = [('N_total', n_total), ('N_data', n_data)] + age_hist + symp_hist
    label = [pair[0] for pair in pair_list]
    count = [pair[1] for pair in pair_list]
    label_zh = ['合計', '有資料案例數'] + [AGE_DICT[age]['zh-tw'] for age in age_list] + [SYMPTOM_DICT[symp]['zh-tw'] for symp in symp_list]
    label_fr = ['Total', 'Données complètes'] + [AGE_DICT[age]['fr'] for age in age_list] + [SYMPTOM_DICT[symp]['fr'] for symp in symp_list]
    
    data3 = {'label': label, 'count': count, 'label_zh': label_zh, 'label_fr': label_fr}
    data3 = pd.DataFrame(data3)
    
    name = '%sprocessed_data/%s/age_symptom_correlations_coefficient.csv' % (DATA_PATH, selection)
    saveCsv(name, data1)
    name = '%sprocessed_data/%s/age_symptom_correlations_counts.csv' % (DATA_PATH, selection)
    saveCsv(name, data2)
    name = '%sprocessed_data/%s/age_symptom_correlations_total.csv' % (DATA_PATH, selection)
    saveCsv(name, data3)
    return
  
  def saveCsv(self):
    self.saveCsv_keyNb()
    self.saveCsv_caseByTrans()
    self.saveCsv_caseByDetection()
    self.saveCsv_diffByTrans()
    self.saveCsv_travHistSymptomCorr(selection='latest')
    self.saveCsv_travHistSymptomCorr(selection='2020')
    self.saveCsv_travHistSymptomCorr(selection='2021')
    self.saveCsv_ageSymptomCorr(selection='latest')
    self.saveCsv_ageSymptomCorr(selection='2020')
    self.saveCsv_ageSymptomCorr(selection='2021')
    return

################################################################################
## Classes - status sheet

class StatusSheet(Template):

  def __init__(self, verbose=True):
    self.coltag_date = '日期'
    self.coltag_week_nb = '週次'
    self.coltag_new_nb_cases = '新增確診'
    self.coltag_new_cases_per_week = '每週新增確診'
    self.coltag_cum_cases = '確診總人數'
    self.coltag_new_males = '新增男性'
    self.coltag_cum_males = '男性總數'
    self.coltag_male_frac = '確診男性率'
    self.coltag_new_females = '新增女性'
    self.coltag_cum_females = '女性總數'
    self.coltag_female_frac = '確診女性率'
    self.coltag_new_soldiers = '新增軍人'
    self.coltag_cum_soldiers = '敦睦總人數'
    self.coltag_soldier_frac = '軍隊率'
    self.coltag_new_imported = '新增境外'
    self.coltag_cum_imported = '境外總人數'
    self.coltag_imported_frac = '境外率'
    self.coltag_newLocal = '新增本土'
    self.coltag_cumLocal = '本土總人數'
    self.coltag_local_frac = '本土率'
    self.coltag_new_deaths = '新增死亡'
    self.coltag_cum_deaths = '死亡總人數'
    self.coltag_death_frac = '死亡率'
    self.coltag_new_unknown = '當日未知感染源數'
    self.coltag_cum_unknown = '未知感染源總數'
    self.coltag_cum_known = '已知感染源數'
    self.coltag_new_dis = '新增解除隔離'
    self.coltag_cum_dis = '解除隔離數'
    self.coltag_cum_dis_and_deaths = '解除隔離+死亡'
    self.coltag_cum_hosp = '未解除隔離數'
    self.coltag_notes = '備註'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    date_list = data[self.coltag_date].values
    self.ind_2021 = (date_list == '2021分隔線').argmax()
    
    cum_dis_list = data[self.coltag_cum_dis].values
    ind = (cum_dis_list == cum_dis_list) * (date_list != '2021分隔線')
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
  
  def getDate(self):
    date_list = []
    y = 2020 #WARNING
    
    for i, date in enumerate(self.getCol(self.coltag_date)):
      if i >= self.ind_2021:
        y = 2021
        
      mmdd_zh = date.split('月')
      m = int(mmdd_zh[0])
      dd_zh = mmdd_zh[1].split('日')
      d = int(dd_zh[0])
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
    
  def getCumCases(self):
    return self.getCol(self.coltag_cum_cases).astype(int)
    
  def getCumDeaths(self):
    return self.getCol(self.coltag_cum_deaths).astype(int)
    
  def getCumDischarged(self):
    cum_dis_list = self.getCol(self.coltag_cum_dis)
    ind = cum_dis_list == '0.00%'
    cum_dis_list[ind] = 0
    return cum_dis_list.astype(int)
    
  def getCumHospitalized(self):
    return self.getCol(self.coltag_cum_hosp).astype(int)
    
  def saveCsv_statusEvolution(self):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_dis_list = self.getCumDischarged()
    cum_hosp_list = self.getCumHospitalized()
    
    data = {'date': date_list, 'death': cum_deaths_list, 'hospitalized': cum_hosp_list, 'discharged': cum_dis_list}
    data = pd.DataFrame(data)
    data = adjustDateRange(data)
    
    data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data.iloc[:366]
    data_2021 = data.iloc[366:731]
    
    name = '%sprocessed_data/latest/status_evolution.csv' % DATA_PATH
    saveCsv(name, data_latest)
    
    name = '%sprocessed_data/2020/status_evolution.csv' % DATA_PATH
    saveCsv(name, data_2020)
    
    name = '%sprocessed_data/2021/status_evolution.csv' % DATA_PATH
    saveCsv(name, data_2021)
    return
    
  def saveCsv(self):
    self.saveCsv_statusEvolution()
    return

################################################################################
## Classes - test sheet

class TestSheet(Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '日期'
    self.coltag_from_extended = '擴大監測'
    self.coltag_cum_from_extended = '擴大監測累計'
    self.coltag_from_qt = '居檢送驗'
    self.coltag_cum_from_qt = '居檢送驗累計'
    self.coltag_from_clin_def = '武肺通報'
    self.coltag_cum_from_clin_def = '武肺通報累計'
    self.coltag_nb_tests = '檢驗人數'
    self.coltag_cum_nb_tests = '檢驗人數累計'
    self.coltag_confirmed = '確診人數'
    self.coltag_cum_confirmed = '確診人數累計'
    self.coltag_daily_pos_rate = '單日陽性率'
    self.coltag_tot_pos_rate = '陽性率'
    self.coltag_criteria = '擴大之檢驗標準(含擴大監測標準及通報定義)'
    self.coltag_note = '來源：疾管署（每天1am更新）'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    from_extended_list = data[self.coltag_from_extended].values
    self.ind_2021 = (from_extended_list == '2021分隔線').argmax()
    
    date_list = data[self.coltag_date].values
    ind = date_list == date_list
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = []
    y = 2020
    
    for i, date in enumerate(self.getCol(self.coltag_date)):
      if i >= self.ind_2021:
        y = 2021
      
      md_slash = date.split('/')
      m = int(md_slash[0])
      d = int(md_slash[1])
      
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
  
  def getFromExtended(self):
    from_ext_list = []
    for from_ext in self.getCol(self.coltag_from_extended):
      if from_ext != from_ext: ## Is nan
        from_ext_list.append(0)
        continue
      
      try:
        from_ext = from_ext.lstrip('+').split(',')
        from_ext = int(''.join(from_ext))
        from_ext_list.append(from_ext)
      except:
        print('From extended, %s' % from_ext)
        from_ext_list.append(0)
    return from_ext_list

  def getFromQT(self):
    from_qt_list = []
    for from_qt in self.getCol(self.coltag_from_qt):
      if from_qt != from_qt: ## Is nan
        from_qt_list.append(0)
        continue
        
      try:
        from_qt = from_qt.lstrip('+').split(',')
        from_qt = int(''.join(from_qt))
        from_qt_list.append(from_qt)
      except:
        print('From extended, %s' % from_qt)
        from_qt_list.append(0)
    return from_qt_list

  def getFromClinDef(self):
    from_clin_def_list = []
    for from_clin_def in self.getCol(self.coltag_from_clin_def):
      if from_clin_def != from_clin_def: ## Is nan
        from_clin_def_list.append(0)
        continue
        
      try:
        from_clin_def = from_clin_def.lstrip('+').split(',')
        from_clin_def = int(''.join(from_clin_def))
        from_clin_def_list.append(from_clin_def)
      except:
        print('Clinical definition, %s' % from_clin_def)
        from_clin_def_list.append(0)
    return from_clin_def_list

  def getCriteria(self):
    crit_list = []
    
    for crit in self.getCol(self.coltag_criteria):
      crit_list.append(crit)
    return crit_list
  
  def makeDailyTestCounts(self):
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = dtt.date.today().toordinal() + 1
    
    nb_days = ord_today - ord_ref
    nb_tests_arr = np.zeros(nb_days, dtype=int)
    
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    for date, from_clin_def, from_qt, from_ext in zip(date_list, from_clin_def_list, from_qt_list, from_ext_list):
      ind = ISODateToOrd(date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      nb_tests_arr[ind] = from_clin_def + from_qt + from_ext
    return nb_tests_arr
  
  def saveCsv_testByCriterion(self):
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    data = {'date': date_list, 'clinical': from_clin_def_list, 'quarantine': from_qt_list, 'extended': from_ext_list}
    data = pd.DataFrame(data)
    data = adjustDateRange(data)
    
    data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data.iloc[:366]
    data_2021 = data.iloc[366:731]
    
    name = '%sprocessed_data/latest/test_by_criterion.csv' % DATA_PATH
    saveCsv(name, data_latest)
    
    name = '%sprocessed_data/2020/test_by_criterion.csv' % DATA_PATH
    saveCsv(name, data_2020)
    
    name = '%sprocessed_data/2021/test_by_criterion.csv' % DATA_PATH
    saveCsv(name, data_2021)
    return
  
  def printCriteria(self):
    date_list = self.getDate()
    crit_list = self.getCriteria()
    
    url_list = {
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
    
    for date, crit in zip(date_list, crit_list):
      if crit != crit:
        pass
      else:
        print(date, crit, url_list.get(date, np.nan))
        print()
    return
  
  def saveCsv_criteriaTimeline(self):
    crit_dict = {
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
        'en': 'Dysnosmia, dysgeusia',
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
    
    date_list = [key for key, value in crit_dict.items()]
    en_list = [value['en'] for key, value in crit_dict.items()]
    fr_list = [value['fr'] for key, value in crit_dict.items()]
    zh_tw_list = [value['zh-tw'] for key, value in crit_dict.items()]
    
    data = {'date': date_list, 'en': en_list, 'fr': fr_list, 'zh-tw': zh_tw_list}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/criteria_timeline.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_testByCriterion()
    self.saveCsv_criteriaTimeline()
    return

################################################################################
## Classes - border sheet

class BorderSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_date = '日期 '
    self.tag_dict = {
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
      'Hualien S in': '花蓮港 入境查驗', 
      'Hualien S out': '花蓮港 出境查驗', 
      'Hualien S total': '花蓮港 小計', 
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
      'Hualien A in': '花蓮機場 入境查驗', 
      'Hualien A out': '花蓮機場 出境查驗', 
      'Hualien A total': '花蓮機場 小計', 
      'Yunlin S in': '麥寮港 入境查驗', 
      'Yunlin S out': '麥寮港 出境查驗', 
      'Yunlin S total': '麥寮港 小計', 
      'Penghu A in': '馬公機場 入境查驗', 
      'Penghu A out': '馬公機場 出境查驗', 
      'Penghu A total': '馬公機場 小計', 
      'Taichung A in': '台中機場 入境查驗', 
      'Taichung A out': '台中機場 出境查驗', 
      'Taichung A total': '台中機場 小計', 
      'Hualien SN in': '和平港 入境查驗', 
      'Hualien SN out': '和平港 出境查驗', 
      'Hualien SN total': '和平港 小計', 
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
    hdr = []
    for pair in data.columns:
      if 'Unnamed:' in pair[0]:
        hdr.append((hdr[-1][0], pair[1]))
      elif 'Unnamed:' in pair[1]:
        hdr.append((pair[0], ''))
      else:
        hdr.append(pair)
    data.columns = [pair[0]+' '+pair[1] for pair in hdr]
    
    date_list = data[self.coltag_date].values
    ind = date_list == date_list
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = ['%s-%s-%s' % (date[:4], date[4:6], date[6:8]) for date in self.getCol(self.coltag_date)]
    return date_list
    
  def getNumbers(self, tag):
    nb_list = [int(out.replace(',', '')) for out in self.getCol(self.tag_dict[tag])]
    return nb_list
    
  def getIn(self):
    return self.getNumbers('in')
    
  def getOut(self):
    return self.getNumbers('out')
    
  def getTotal(self):
    return self.getNumbers('total')
    
  def getAirportBreakdown(self, tag='total'):
    label_list = [
      'Taipei A',
      'Taoyuan A1',
      'Taoyuan A2',
      'Taichung A',
      'Chiayi A',
      'Tainan A',
      'Kaohsiung A',
      'Pintung A',
      
      'Hualien A',
      'Taitung A',
      'Penghu A',
      'Kinmen A',
      'Mazu AN',
      'Mazu AS'
    ]
    
    air_list_break = []
    for label in label_list:
      air_list_break.append((label, self.getNumbers(label+' '+tag)))
    return air_list_break
  
  def getSeaportBreakdown(self, tag='total'):
    label_list = [
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
      'Hualien SN',
      'Hualien S',
      'Taitung S',
      'Penghu S',
      'Kinmen SW',
      'Kinmen SE',
      'Mazu S',
    ]
    
    sea_list_break = []
    for label in label_list:
      sea_list_break.append((label, self.getNumbers(label+' '+tag)))
    return sea_list_break
  
  def getNotSpecifiedBreakdown(self, tag='total'):
    label_list = [
      'Penghu X',
      'Mazu X'
    ]
    
    not_spec_list_break = []
    for label in label_list:
      not_spec_list_break.append((label, self.getNumbers(label+' '+tag)))
    return not_spec_list_break
  
  def getAirport(self, tag='total'):
    air_list_break = self.getAirportBreakdown(tag=tag)
    air_list_break = [air_list[1] for air_list in air_list_break]
    air_list = np.array(air_list_break).sum(axis=0)
    return air_list
  
  def getSeaport(self, tag='total'):
    sea_list_break = self.getSeaportBreakdown(tag=tag)
    sea_list_break = [sea_list[1] for sea_list in sea_list_break]
    sea_list = np.array(sea_list_break).sum(axis=0)
    return sea_list
  
  def getNotSpecified(self, tag='total'):
    not_spec_list_break = self.getNotSpecifiedBreakdown(tag=tag)
    not_spec_list_break = [not_spec_list[1] for not_spec_list in not_spec_list_break]
    not_spec_list = np.array(not_spec_list_break).sum(axis=0)
    return not_spec_list
  
  def makeDailyArrivalCounts(self):
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = dtt.date.today().toordinal() + 1
    
    nb_days = ord_today - ord_ref
    nb_arrival_arr = np.zeros(nb_days, dtype=int)
    
    date_list = self.getDate()
    in_list = self.getIn()
    
    for date, in_ in zip(date_list, in_list):
      ind = ISODateToOrd(date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      nb_arrival_arr[ind] = in_
    return nb_arrival_arr
  
  def saveCsv_borderStats(self):
    pass 
    
    ## In
    date_list = self.getDate()
    air_list = self.getAirport(tag='in')
    sea_list = self.getSeaport(tag='in')
    not_spec_list = self.getNotSpecified(tag='in')
    
    data = {'date': date_list, 'not_specified': not_spec_list, 'seaport': sea_list, 'airport': air_list}
    data = pd.DataFrame(data)
    data = adjustDateRange(data)
    
    data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data.iloc[:366]
    data_2021 = data.iloc[366:731]
    
    name = '%sprocessed_data/latest/border_statistics_entry.csv' % DATA_PATH
    saveCsv(name, data_latest)
    
    name = '%sprocessed_data/2020/border_statistics_entry.csv' % DATA_PATH
    saveCsv(name, data_2020)
    
    name = '%sprocessed_data/2021/border_statistics_entry.csv' % DATA_PATH
    saveCsv(name, data_2021)
    
    ## Out
    air_list = self.getAirport(tag='out')
    sea_list = self.getSeaport(tag='out')
    not_spec_list = self.getNotSpecified(tag='out')
    
    data = {'date': date_list, 'not_specified': not_spec_list, 'seaport': sea_list, 'airport': air_list}
    data = pd.DataFrame(data)
    data = adjustDateRange(data)
    
    data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data.iloc[:366]
    data_2021 = data.iloc[366:731]
    
    name = '%sprocessed_data/latest/border_statistics_exit.csv' % DATA_PATH
    saveCsv(name, data_latest)
    
    name = '%sprocessed_data/2020/border_statistics_exit.csv' % DATA_PATH
    saveCsv(name, data_2020)
    
    name = '%sprocessed_data/2021/border_statistics_exit.csv' % DATA_PATH
    saveCsv(name, data_2021)
    
    ## Both
    air_list = self.getAirport(tag='total')
    sea_list = self.getSeaport(tag='total')
    not_spec_list = self.getNotSpecified(tag='total')
    
    data = {'date': date_list, 'not_specified': not_spec_list, 'seaport': sea_list, 'airport': air_list}
    data = pd.DataFrame(data)
    data = adjustDateRange(data)
    
    data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
    data_2020 = data.iloc[:366]
    data_2021 = data.iloc[366:731]
    
    name = '%sprocessed_data/latest/border_statistics_both.csv' % DATA_PATH
    saveCsv(name, data_latest)
    
    name = '%sprocessed_data/2020/border_statistics_both.csv' % DATA_PATH
    saveCsv(name, data_2020)
    
    name = '%sprocessed_data/2021/border_statistics_both.csv' % DATA_PATH
    saveCsv(name, data_2021)
    return
      
  def saveCsv(self):
    self.saveCsv_borderStats()
    return

################################################################################
## Classes - timeline sheet

class TimelineSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_date = '時間'
    self.coltag_twn_evt = '台灣事件'
    self.coltag_criteria = '台灣檢驗標準'
    self.coltag_global_evt = '全球事件'
    self.coltag_key_evt = '重點事件'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    date_list = data[self.coltag_date].values
    ind = (date_list == date_list) * (date_list != '2021分隔線')
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = []
    
    for date in self.getCol(self.coltag_date):
      yyyymmddday_zh = date.split('年')
      y = int(yyyymmddday_zh[0])
      mmddday_zh = yyyymmddday_zh[1].split('月')
      m = int(mmddday_zh[0])
      ddday_zh = mmddday_zh[1].split('日')
      d = int(ddday_zh[0])
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
  
  def getTWNEvt(self):
    twn_evt_list = []
    for twn_evt in self.getCol(self.coltag_twn_evt):
      if twn_evt == twn_evt:
        twn_evt = twn_evt.rstrip('\n')
        twn_evt = '\n'.join(twn_evt.split('\n\n\n'))
        twn_evt = '\n'.join(twn_evt.split('\n\n'))
        twn_evt_list.append(twn_evt)
      else:
        twn_evt_list.append(twn_evt)
    return twn_evt_list
  
  def getGlobalEvt(self):
    global_evt_list = []
    for global_evt in self.getCol(self.coltag_global_evt):
      if global_evt == global_evt:
        global_evt = global_evt.rstrip('\n')
        global_evt = '\n'.join(global_evt.split('\n\n\n'))
        global_evt = '\n'.join(global_evt.split('\n\n'))
        global_evt_list.append(global_evt)
      else:
        global_evt_list.append(global_evt)
    return global_evt_list
  
  def getKeyEvt(self):
    key_evt_list = []
    for key_evt in self.getCol(self.coltag_key_evt):
      if key_evt == key_evt:
        key_evt_list.append(key_evt.rstrip('\n'))
      else:
        key_evt_list.append(key_evt)
    return key_evt_list
  
  def saveCsv_evtTimeline(self):
    date_list = []
    twn_evt_list = []
    global_evt_list = []
    key_evt_list = []
    
    for date, twn_evt, global_evt, key_evt in zip(self.getDate(), self.getTWNEvt(), self.getGlobalEvt(), self.getKeyEvt()):
      if twn_evt != twn_evt and global_evt != global_evt and key_evt != key_evt:
        continue
      else:
        date_list.append(date)
        twn_evt_list.append(twn_evt)
        global_evt_list.append(global_evt)
        key_evt_list.append(key_evt)
    
    data = {'date': date_list, 'Taiwan_event': twn_evt_list, 'global_event': global_evt_list, 'key_event': key_evt_list}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/event_timeline_zh-tw.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_evtTimeline()
    return
  
################################################################################
## Classes - County breakdown

class CountySheet(Template):
  
  def __init__(self, verbose=True):
    self.coltag_disease = '確定病名'
    self.coltag_report_date = '個案研判日'
    self.coltag_county = '縣市'
    self.coltag_village = '鄉鎮'
    self.coltag_gender = '性別'
    self.coltag_imported = '是否為境外移入'
    self.coltag_age = '年齡層'
    self.coltag_nb_cases = '確定病例數'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_county_age.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    self.data    = data
    self.n_total = data[self.coltag_nb_cases].astype(int).sum()
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    self.county_code_list = [
      '10017', '63000', '65000', '68000', '10004', '10018', '10005', 
      '66000', '10007', '10008', '10009', 
      '10010' ,'10020', '67000', '64000', '10013', 
      '10002', '10015', '10014', 
      '10016', '09020', '09007', 
    ]
    self.age_key_list = [
      '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', 
      '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70+',
    ]
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return
  
  def getReportDate(self):
    report_date_list = []
    
    for report_date in self.getCol(self.coltag_report_date):
      yyyy = report_date[:4]
      mm = report_date[5:7]
      dd = report_date[8:]
      report_date = '%s-%s-%s' % (yyyy, mm, dd)
      report_date_list.append(report_date)
    
    return report_date_list
  
  def getCounty(self):
    county_list = []
    
    for county in self.getCol(self.coltag_county):
      if county == '基隆市':
        county_list.append('Keelung')
      elif county == '台北市':
        county_list.append('Taipei')
      elif county == '新北市':
        county_list.append('New_Taipei')
      elif county == '桃園市':
        county_list.append('Taoyuan')
      elif county == '新竹縣':
        county_list.append('Hsinchu')
      elif county == '新竹市':
        county_list.append('Hsinchu_C')
      elif county == '苗栗縣':
        county_list.append('Miaoli')
        
      elif county == '台中市':
        county_list.append('Taichung')
      elif county == '彰化縣':
        county_list.append('Changhua')
      elif county == '南投縣':
        county_list.append('Nantou')
      elif county == '雲林縣':
        county_list.append('Yunlin')
      
      elif county == '嘉義縣':
        county_list.append('Chiayi')
      elif county == '嘉義市':
        county_list.append('Chiayi_C')
      elif county == '台南市':
        county_list.append('Tainan')
      elif county == '高雄市':
        county_list.append('Kaohsiung')
      elif county == '屏東縣':
        county_list.append('Pingtung')
        
      elif county == '宜蘭縣':
        county_list.append('Yilan')
      elif county == '花蓮縣':
        county_list.append('Hualien')
      elif county == '台東縣':
        county_list.append('Taitung')
        
      elif county == '澎湖縣':
        county_list.append('Penghu')
      elif county == '金門縣':
        county_list.append('Kinmen')
      elif county == '連江縣':
        county_list.append('Matsu')
        
      elif county == '空值':
        county_list.append('unknown')
      else:
        print('County, %s' % county)
        county_list.append('unknown')
    
    return county_list
    
  def getVillage(self):
    return self.getCol(self.coltag_village)
    
  def getGender(self):
    gender_list = [1 if gender == '男' else 2 for gender in self.getCol(self.coltag_gender)]
    return gender_list
    
  def getImported(self):
    imported_list = [1 if imported == '是' else 0 for imported in self.getCol(self.coltag_imported)]
    return imported_list
    
  def getAge(self):
    age_list = []
    
    for age in self.getCol(self.coltag_age):
      if age in ['0', '1', '2', '3', '4']:
        age_list.append('0-4')
      else:
        age_list.append(age)
    
    return age_list
  
  def getNbCases(self):
    return self.getCol(self.coltag_nb_cases).astype(int)
  
  ## In date order
  def makeCountyListDict(self, selection='latest'):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2019 = ISODateToOrd('2019-12-31') + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    
    if 'latest' == selection:
      date = [ordDateToISO(ord) for ord in range(ord_today-90, ord_today)]
      case_arr = np.zeros_like(date, dtype=int)
    elif '2020' == selection:
      date = [ordDateToISO(ord) for ord in range(ord_end_2019, min(ord_end_2020, ord_today))]
      case_arr = np.zeros_like(date, dtype=int)
    else:
      date = [ordDateToISO(ord) for ord in range(ord_end_2020, min(ord_end_2021, ord_today))]
      case_arr = np.zeros_like(date, dtype=int)
    
    case_arr_dict = {'date': date}
    case_arr_dict.update({county: case_arr.copy() for county in ['total'] + self.county_key_list})
    
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      ord_rep = ISODateToOrd(report_date)
      
      if 'latest' == selection:
        ind = ord_rep - ord_today
        if ind < -NB_LOOKBACK_DAYS:
          continue
        
      if '2020' == selection:
        ind = ord_rep - ord_end_2019
        if ind >= ord_end_2020 - ord_end_2019:
          continue
        
      if '2021' == selection:
        ind = ord_rep - ord_end_2020
        if ind >= ord_end_2021 - ord_end_2020 or ind < 0:
          continue
      
      case_arr_dict['total'][ind] += nb_cases
      case_arr_dict[county][ind] += nb_cases
    
    return case_arr_dict
  
  def makeCountyHistList(self, selection='latest'):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    case_hist = {county: 0 for county in self.county_key_list}
    case_hist_list = [case_hist.copy() for i in range(13)]
    
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      ord_rep = ISODateToOrd(report_date)
      
      if 'latest' == selection and ord_rep + NB_LOOKBACK_DAYS < ord_today:
        continue
        
      if '2020' == selection and ord_rep >= ord_end_2020:
        continue
      
      if '2021' == selection and (ord_rep < ord_end_2020 or ord_rep >= ord_end_2021):
        continue
      
      case_hist_list[0][county] += nb_cases
        
      if 'latest' == selection:
        lookback_week = (ord_rep - ord_today) // 7 ## ord_rep-ord_today in [-90, -1]; this will be in [-13, -1]
        if lookback_week >= -12:
          case_hist_list[-lookback_week][county] += nb_cases
        
      else:
        mm = int(report_date[5:7])
        case_hist_list[mm][county] += nb_cases
    
    return case_hist_list
  
  def makeAgeHistList(self, selection='latest'):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    nb_cases_list = self.getNbCases()
    
    case_hist = {age: 0 for age in self.age_key_list}
    case_hist_list = [case_hist.copy() for i in range(13)]
    
    ord_today = dtt.date.today().toordinal() + 1
    ord_end_2020 = ISODateToOrd('2020-12-31') + 1
    ord_end_2021 = ISODateToOrd('2021-12-31') + 1
    
    for report_date, age, nb_cases in zip(report_date_list, age_list, nb_cases_list):
      ord_rep = ISODateToOrd(report_date)
      
      if 'latest' == selection and ord_rep + NB_LOOKBACK_DAYS < ord_today:
        continue
      
      if '2020' == selection and ord_rep >= ord_end_2020:
        continue
      
      if '2021' == selection and (ord_rep < ord_end_2020 or ord_rep >= ord_end_2021):
        continue
      
      case_hist_list[0][age] += nb_cases
        
      if 'latest' == selection:
        lookback_week = (ord_rep - ord_today) // 7 ## ord_rep-ord_today in [-90, -1]; this will be in [-13, -1]
        if lookback_week >= -12:
          case_hist_list[-lookback_week][age] += nb_cases
        
      else:
        mm = int(report_date[5:7])
        case_hist_list[mm][age] += nb_cases
    
    return case_hist_list
  
  def saveCsv_dailyCasePerCounty(self, selection='latest'):
    case_list_dict = self.makeCountyListDict(selection=selection)
    data = pd.DataFrame(case_list_dict)
    
    name = '%sprocessed_data/%s/daily_case_per_county.csv' % (DATA_PATH, selection)
    saveCsv(name, data)
    return

  def saveCsv_incidenceMap(self, selection='latest'):
    case_hist_list = self.makeCountyHistList(selection=selection)
    county_list = list(case_hist_list[0].keys())
    
    if 'latest' == selection:
      label_list = ['total', 'week_-1', 'week_-2', 'week_-3', 'week_-4', 'week_-5', 'week_-6', 'week_-7', 'week_8', 'week_-9', 'week_-10', 'week_-11', 'week_-12']
    else:
      label_list = ['total', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    
    data_1 = {'county': county_list}
    data_1.update({label: case_hist.values() for label, case_hist in zip(label_list, case_hist_list)})
    data_1 = pd.DataFrame(data_1)
    
    inv_dict = {dict_['tag']: code for code, dict_ in COUNTY_DICT.items()}
    code_list = [inv_dict[county] for county in county_list]
    population = [COUNTY_DICT[code]['population'] for code in code_list]
    label_list_en = [COUNTY_DICT[code]['label'][0] for code in code_list]
    label_list_fr = [COUNTY_DICT[code]['label'][1] for code in code_list]
    label_list_zh = [COUNTY_DICT[code]['label'][2] for code in code_list]
    
    data_2 = {'county': county_list, 'code': code_list, 'population': population, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data_2 = pd.DataFrame(data_2)
    
    name = '%sprocessed_data/%s/incidence_map.csv' % (DATA_PATH, selection)
    saveCsv(name, data_1)
    
    name = '%sprocessed_data/%s/incidence_map_population.csv' % (DATA_PATH, selection)
    saveCsv(name, data_2)
    return

  def saveCsv_caseByAge(self, selection='latest'):
    case_hist_list = self.makeAgeHistList(selection=selection)
    age_list = list(case_hist_list[0].keys())
    
    if 'latest' == selection:
      label_list = ['total', 'week_-1', 'week_-2', 'week_-3', 'week_-4', 'week_-5', 'week_-6', 'week_-7', 'week_8', 'week_-9', 'week_-10', 'week_-11', 'week_-12']
    else:
      label_list = ['total', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    
    data = {'age': age_list}
    data.update({label: case_hist.values() for label, case_hist in zip(label_list, case_hist_list)})
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/%s/case_by_age.csv' % (DATA_PATH, selection)
    saveCsv(name, data)
    return

  def saveCsv(self):
    self.saveCsv_dailyCasePerCounty(selection='latest')
    self.saveCsv_dailyCasePerCounty(selection='2020')
    self.saveCsv_dailyCasePerCounty(selection='2021')
    self.saveCsv_incidenceMap(selection='latest')
    self.saveCsv_incidenceMap(selection='2020')
    self.saveCsv_incidenceMap(selection='2021')
    self.saveCsv_caseByAge(selection='latest')
    self.saveCsv_caseByAge(selection='2020')
    self.saveCsv_caseByAge(selection='2021')
    return
  
################################################################################
## Classes - Vaccination

class VaccinationSheet(Template):
  
  def __init__(self, verbose=True):
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' % DATA_PATH
    data = loadJson(name, verbose=verbose)
    #https://covid-19.nchc.org.tw/dt_002-csse_covid_19_daily_reports_vaccine.php?countryCode=TW/taiwan
    
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_location = 'a01'
    self.key_iso_code = 'a02'
    self.key_date = 'a03'
    self.key_tot_vacc = 'a04'
    self.key_tot_vacc_per_100 = 'a05'
    self.key_daily_vacc_raw = 'a06'
    self.key_daily_vacc = 'a07'
    self.key_daily_vacc_per_1m = 'a08'
    self.key_ppl_vacc = 'a09'
    self.key_ppl_vacc_per_100 = 'a10'
    self.key_ppl_fully_vacc = 'a11'
    self.key_ppl_fully_vacc_per_100 = 'a12'
    self.key_manu = 'a13'
    self.key_jj = 'a14'
    self.key_moderna = 'a15'
    self.key_az = 'a16'
    self.key_pfizer = 'a17'
    self.key_sinovac = 'a18'
    self.key_sputnik = 'a19'
    self.key_sinopharm = 'a20'
    
    self.data = data
    self.n_total = len(self.data['data'])
    
    if verbose:
      print('N_total = %d' % self.n_total)
    return
  
  def getColData(self, key):
    return [row[key] for row in self.data['data']]
  
  def getDate(self):
    return [row[self.key_date] for row in self.data['data']]
  
  def getTotVacc(self):
    return [int(row[self.key_tot_vacc]) for row in self.data['data']]
  
  def getDailyVacc(self):
    return [int(row[self.key_daily_vacc]) for row in self.data['data']]
  
  def getAZ(self):
    return [int(row[self.key_az]) for row in self.data['data']]
  
  def getModerna(self):
    return [int(row[self.key_moderna]) for row in self.data['data']]
  
  def saveCsv_vaccinationByDay(self):
    date_list = self.getDate()
    az_list = self.getAZ()
    moderna_list = self.getModerna()
    
    daily_vacc_list = self.getDailyVacc()
    tot_vacc_list = self.getTotVacc()
    
    
    #for date, az, moderna in zip(date_list, az_list, moderna_list):
      #print(date, az, moderna)
    
    for date, daily_vacc, tot_vacc in zip(date_list, daily_vacc_list, tot_vacc_list):
      print(date, daily_vacc, tot_vacc)
    
    #print(date_list)
    #az_list = np.array(az_list, dtype=int)
    #moderna_list = np.array(moderna_list, dtype=int)
    #print(az_list)
    
    ## From cumulative to daily
    #az_list = [j-i for i, j in zip([0]+az_list[:-1], az_list)]
    #print(az_list)
    
    #date_arr, new_vax_arr, tot_vax_arr = self.makeUpdatedNew(county='total')
    
    #data = {'date': date_arr, 'updated_new': new_vax_arr, 'updated_tot': tot_vax_arr}
    #data = pd.DataFrame(data)
    
    #name = '%sprocessed_data/2021/vaccination_by_day.csv' % DATA_PATH
    #saveCsv(name, data)
    return

  def saveCsv(self):
    self.saveCsv_vaccinationByDay()
    return
  
#class VaccinationSheet(Template):
  
  #def __init__(self, verbose=True):
    #name = '%sraw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' % DATA_PATH
    #data = loadJson(name, verbose=verbose)
    
    #self.key_row_id = 'DT_RowId'
    #self.key_id = 'id'
    #self.key_report_date = 'a01'
    #self.key_county = 'a02'
    #self.key_population = 'a03'
    #self.key_updated_tot = 'a04'
    #self.key_new_vacc = 'a05'
    #self.key_tot_vacc = 'a06'
    #self.key_vacc_rate = 'a07'
    #self.key_nb_doses = 'a08'
    #self.key_remaining_ratio = 'a09'
    
    #self.report_date_list = []
    #self.county_list = []
    #self.population_list = []
    #self.updated_tot_list = []
    #self.new_vacc_list = []
    #self.tot_vacc_list = []
    #self.vacc_rate_list = []
    #self.nb_doses_list = []
    #self.remaining_ratio_list = []
    
    #self.data = data
    #self.processed_data = {}
    #self.process()
    #self.applyCorrections()
    
    #if verbose:
      #print('N_total = %d' % len(self.processed_data))
    #return
  
  #def getCountyLabel(self, county):
    #if county == '基隆市':
      #return 'Keelung'
    #if county == '臺北市':
      #return 'Taipei'
    #if county == '新北市':
      #return 'New_Taipei'
    #if county == '桃園市':
      #return 'Taoyuan'
    #if county == '新竹縣':
      #return 'Hsinchu'
    #if county == '新竹市':
      #return 'Hsinchu_C'
    #if county == '苗栗縣':
      #return 'Miaoli'
      
    #if county == '臺中市':
      #return 'Taichung'
    #if county == '彰化縣':
      #return 'Changhua'
    #if county == '南投縣':
      #return 'Nantou'
    #if county == '雲林縣':
      #return 'Yunlin'
    
    #if county == '嘉義縣':
      #return 'Chiayi'
    #if county == '嘉義市':
      #return 'Chiayi_C'
    #if county == '臺南市':
      #return 'Tainan'
    #if county == '高雄市':
      #return 'Kaohsiung'
    #if county == '屏東縣':
      #return 'Pingtung'
      
    #if county == '宜蘭縣':
      #return 'Yilan'
    #if county == '花蓮縣':
      #return 'Hualien'
    #if county == '臺東縣':
      #return 'Taitung'
      
    #if county == '澎湖縣':
      #return 'Penghu'
    #if county == '金門縣':
      #return 'Kinmen'
    #if county == '連江縣':
      #return 'Matsu'
      
    #print('County label, %s' % county)
    #return 'unknown'
    
  #def process(self):
    #for row in self.data['data']:
      #report_date = row[self.key_report_date]
      #county = self.getCountyLabel(row[self.key_county])
      #try:
        #self.processed_data[report_date][county] = row
      #except KeyError:
        #self.processed_data[report_date] = {county: row}
    
    #self.processed_data = dict(sorted(self.processed_data.items()))
    #return
      
  #def applyCorrections(self):
    #corr_list = [
      #['2021-05-06', 'Taipei', 15884, 1251, 17135], 
      #['2021-05-06', 'Kaohsiung', 10159, 676, 10835], 
      #['2021-05-18', 'Pingtung', 5311, 496, 5807], 
    #]
    
    ### Correct bad crawling numbers
    #for corr in corr_list:
      #row = self.processed_data[corr[0]][corr[1]]
      #row[self.key_updated_tot] = corr[2]
      #row[self.key_new_vacc] = corr[3]
      #row[self.key_tot_vacc] = corr[4]
      
    ### Remove repeated data
    #corr_list = ['2021-04-03', '2021-04-04', '2021-04-14']
    
    #for corr in corr_list:
      #self.processed_data.pop(corr)
    #return
    
  #def getReportDate(self, county='total'):
    #if 'total' == county:
      #return list(self.processed_data.keys())
    
    #report_date_list = []
    #for report_date, county_dict in self.processed_data.items():
      #if county in county_dict:
        #report_date_list.append(report_date)
    #return report_date_list
  
  #def getUpdatedTot(self, county='total'):
    #updated_tot_list = []
    
    #for report_date, county_dict in self.processed_data.items():
      #if 'total' == county:
        #updated_tot_list.append(0)
        #for _, row in county_dict.items():
          #updated_tot_list[-1] += int(row[self.key_updated_tot])
      
      #try:
        #row = county_dict[county]
        #updated_tot_list.append(int(row[self.key_updated_tot]))
      #except KeyError:
        #pass
        
    #return updated_tot_list
  
  #def getNewVacc(self, county='total'):
    #new_vacc_list = []
    
    #for report_date, county_dict in self.processed_data.items():
      #if 'total' == county:
        #new_vacc_list.append(0)
        #for _, row in county_dict.items():
          #new_vacc_list[-1] += int(row[self.key_new_vacc])
      
      #try:
        #row = county_dict[county]
        #new_vacc_list.append(int(row[self.key_new_vacc]))
      #except KeyError:
        #pass
        
    #return new_vacc_list
    
  #def getTotVacc(self, county='total'):
    #tot_vacc_list = []
    
    #for report_date, county_dict in self.processed_data.items():
      #if 'total' == county:
        #tot_vacc_list.append(0)
        #for _, row in county_dict.items():
          #tot_vacc_list[-1] += int(row[self.key_tot_vacc])
      
      #try:
        #row = county_dict[county]
        #tot_vacc_list.append(int(row[self.key_tot_vacc]))
      #except KeyError:
        #pass
    
    #return tot_vacc_list
    
  #def makeUpdatedNew(self, county='total'):
    #report_date_list = self.getReportDate(county=county)
    #updated_tot_list = self.getUpdatedTot(county=county)
    #new_vacc_list = self.getNewVacc(county=county)
    
    ### Calculate array length
    #ord_begin = ISODateToOrd('2021-03-21') ## Pretend to start on 2021-03-21 for easier reshape later
    #ord_today = dtt.date.today().toordinal() + 1
    #nb_days = ord_today - ord_begin
    #ind = nb_days % 7 - 1 ## Get remainer; will be used later
    #nb_days = ((nb_days - 1) // 7 + 1) * 7 ## Ceiling function for 7
    
    ### Prepare array
    #new_vax_arr = np.zeros(nb_days, dtype=float) + np.nan
    #tot_vax_arr = np.zeros(nb_days, dtype=float) + np.nan
    #date_arr = ord_begin + np.arange(nb_days, dtype=int)
    #date_arr = [ordDateToISO(ord) for ord in date_arr]
    
    ### Fill values
    #ord_rep_list = [ISODateToOrd(report_date)-ord_begin for report_date in report_date_list]
    #for ord_rep, updated_tot, new_vacc in zip(ord_rep_list, updated_tot_list, new_vacc_list):
      #new_vax_arr[ord_rep] = new_vacc
      #tot_vax_arr[ord_rep] = updated_tot
      
    ### Reshape to mask Saturdays
    #new_vax_arr = new_vax_arr.reshape(-1, 7)
    #tot_vax_arr = tot_vax_arr.reshape(-1, 7)
    #new_vax_arr_2 = new_vax_arr[:, :6].flatten()
    #tot_vax_arr_2 = tot_vax_arr[:, :6].flatten()
    
    ### Calculate the correct new_vax
    #for i in range(len(new_vax_arr_2)-1):
      #if tot_vax_arr_2[i] == tot_vax_arr_2[i] and tot_vax_arr_2[i+1] == tot_vax_arr_2[i+1]:
        #new_vax_arr_2[i] = tot_vax_arr_2[i+1] - tot_vax_arr_2[i]
      #elif new_vax_arr_2[i] == new_vax_arr_2[i]:
        #tot_vax_arr_2[i+1] = new_vax_arr_2[i] + tot_vax_arr_2[i]
    
    ### Offset tot_vax
    #tot_vax_arr_2[:-1] = tot_vax_arr_2[1:]
    
    ### Add the current day's value to tot_vax
    #if ind < 6:
      #tot_vax_arr_2[ind-6] = new_vax_arr_2[ind-6] + tot_vax_arr_2[ind-7]
    
    ### Return to 7 columns
    #new_vax_arr[:, :6] = new_vax_arr_2.reshape(-1, 6)
    #tot_vax_arr[:, :6] = tot_vax_arr_2.reshape(-1, 6)
    
    ### Remove 2021-03-21 & trailing NaN
    #if ind < 6:
      #new_vax_arr = new_vax_arr.flatten()[1:ind-6]
      #tot_vax_arr = tot_vax_arr.flatten()[1:ind-6]
      #date_arr = date_arr[1:ind-6]
    #else:
      #new_vax_arr = new_vax_arr.flatten()[1:]
      #tot_vax_arr = tot_vax_arr.flatten()[1:]
      #date_arr = date_arr[1:]
    #return date_arr, new_vax_arr, tot_vax_arr
    
  #def saveCsv_vaccinationByDay(self):
    #date_arr, new_vax_arr, tot_vax_arr = self.makeUpdatedNew(county='total')
    
    #data = {'date': date_arr, 'updated_new': new_vax_arr, 'updated_tot': tot_vax_arr}
    #data = pd.DataFrame(data)
    
    #name = '%sprocessed_data/2021/vaccination_by_day.csv' % DATA_PATH
    #saveCsv(name, data)
    #return

  #def saveCsv(self):
    #self.saveCsv_vaccinationByDay()
    #return
  
################################################################################
## Functions - cross-sheet operations

import scipy.signal as signal

def makeVariousRates(main_sheet, test_sheet, border_sheet):
  date_arr, nb_imp_arr, nb_indi_arr, nb_cases_arr = main_sheet.makeDailyCaseCounts()
  nb_tests_arr = test_sheet.makeDailyTestCounts()
  nb_arrival_arr = border_sheet.makeDailyArrivalCounts()
  
  ## Convert to float
  nb_imp_arr = nb_imp_arr.astype(float)
  nb_indi_arr = nb_indi_arr.astype(float)
  nb_cases_arr = nb_cases_arr.astype(float)
  nb_tests_arr = nb_tests_arr.astype(float)
  nb_arrival_arr = nb_arrival_arr.astype(float)
  
  ind_test = nb_tests_arr == 0
  ind_arrival = nb_arrival_arr == 0
  
  ## Smooth
  kernel = [1/7] * 7 + [0.0] * 6
  nb_imp_arr = signal.convolve(nb_imp_arr, kernel[::-1], mode='same')
  nb_indi_arr = signal.convolve(nb_indi_arr, kernel[::-1], mode='same')
  nb_cases_arr = signal.convolve(nb_cases_arr, kernel[::-1], mode='same')
  nb_tests_arr = signal.convolve(nb_tests_arr, kernel[::-1], mode='same')
  nb_arrival_arr = signal.convolve(nb_arrival_arr, kernel[::-1], mode='same')
  
  population_twn = sum(v['population'] for v in COUNTY_DICT.values())
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter("ignore")
    
    pos_rate = nb_cases_arr / nb_tests_arr
    pos_rate[ind_test] = np.nan
    
    imp_inci_rate = nb_imp_arr / nb_arrival_arr
    imp_inci_rate[ind_arrival] = np.nan
    
    indi_inci_rate = nb_indi_arr / float(population_twn)
    
  return date_arr, pos_rate, imp_inci_rate, indi_inci_rate
  
def saveCsv_variousRate(main_sheet, test_sheet, border_sheet):
  date_arr, pos_rate, imp_inci_rate, indi_inci_rate = makeVariousRates(main_sheet, test_sheet, border_sheet)
  
  data = {'date': date_arr, 'positive_rate': pos_rate, 'imp_inci_rate': imp_inci_rate, 'indi_inci_rate': indi_inci_rate}
  data = pd.DataFrame(data)
  
  data_latest = data.iloc[-NB_LOOKBACK_DAYS:]
  data_2020 = data.iloc[:366]
  data_2021 = data.iloc[366:731]
  
  name = '%sprocessed_data/latest/various_rates.csv' % DATA_PATH
  saveCsv(name, data_latest)
  
  name = '%sprocessed_data/2020/various_rates.csv' % DATA_PATH
  saveCsv(name, data_2020)
  
  name = '%sprocessed_data/2021/various_rates.csv' % DATA_PATH
  saveCsv(name, data_2021)
  return
  
################################################################################
## Functions - sandbox

def sandbox():
  #main_sheet = MainSheet()
  #print(main_sheet.getReportDate())
  #main_sheet.saveCsv_keyNb()
  
  #status_sheet = StatusSheet()
  #print(status_sheet.getCumHosp())
  #status_sheet.saveCsv_statusEvolution()
  
  #test_sheet = TestSheet()
  #print(test_sheet.getReportDate())
  #test_sheet.saveCsv_testByCriterion()
  
  #border_sheet = BorderSheet()
  #print(border_sheet.makeDailyArrivalCounts())
  #border_sheet.saveCsv_borderStats()
  
  #timeline_sheet = TimelineSheet()
  #print(timeline_sheet.saveCriteria())
  #timeline_sheet.saveCsv_evtTimeline()
  
  #county_sheet = CountySheet()
  #print(county_sheet)
  #county_sheet.saveCsv_dailyCasePerCounty()
  
  vacc_sheet = VaccinationSheet()
  #print(vacc_sheet.makeUpdatedNew())
  vacc_sheet.saveCsv_vaccinationByDay()
  return

################################################################################
## Functions - save

def saveCsv_all():
  print()
  main_sheet = MainSheet()
  main_sheet.saveCsv()
  
  print()
  status_sheet = StatusSheet()
  status_sheet.saveCsv()
  
  print()
  test_sheet = TestSheet()
  test_sheet.saveCsv()
  
  print()
  border_sheet = BorderSheet()
  border_sheet.saveCsv()
  
  print()
  timeline_sheet = TimelineSheet()
  timeline_sheet.saveCsv()
  
  print()
  saveCsv_variousRate(main_sheet, test_sheet, border_sheet)
  
  print()
  county_sheet = CountySheet()
  county_sheet.saveCsv()
  
  print()
  #vacc_sheet = VaccinationSheet()
  #vacc_sheet.saveCsv()
  print()
  return

################################################################################
## Main

if __name__ == '__main__':
  saveCsv_all()

## End of file
################################################################################
