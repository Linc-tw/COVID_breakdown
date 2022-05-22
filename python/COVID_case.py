
    ################################
    ##  COVID_case.py             ##
    ##  Chieh-An Lin              ##
    ##  2022.05.22                ##
    ################################

import os
import sys
import datetime as dtt
import collections as clt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd
import statsmodels as sm

import COVID_common as ccm

################################################################################
## Class - case sheet

class CaseSheet(ccm.Template):
  
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
    self.n_year_dict = {}
    self.n_empty = 0
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_case_breakdown.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    
    self.setData(data)
    self.setCaseCounts()
    
    self.trans_key_list = ['imported', 'local', 'others']
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
      print('N_latest = {:d}'.format(self.n_latest))
      for year in ccm.GROUP_YEAR_LIST:
        print('N_{} = {:d}'.format(year, self.n_year_dict[year]))
      print('N_empty = {:d}'.format(self.n_empty))
    return 
    
  def setData(self, data):
    case_nb_list = data[self.coltag_case].values
    ind = case_nb_list == case_nb_list
    self.data = data[ind]
    return
  
  def setCaseCounts(self):
    n_list = [0] * len(ccm.GROUP_LIST)
    
    for report_date, trans in zip(self.getReportDate(), self.getCol(self.coltag_transmission)):
      if trans != trans: ## NaN
        self.n_empty += 1
        continue
      
      index_list = ccm.makeIndexList(report_date)
      
      for i, ind in enumerate(index_list):
        if ind != ind: ## If NaN
          continue
        
        n_list[i] += 1
        
    self.n_latest = n_list[0]
    self.n_total = n_list[1]
    for i, year in enumerate(ccm.GROUP_YEAR_LIST):
      self.n_year_dict[year] = n_list[i+2]
    return
  
  def getReportDate(self):
    report_date_list = []
    
    for report_date, trans in zip(self.getCol(self.coltag_report_date), self.getCol(self.coltag_transmission)):
      if trans != trans: ## NaN
        report_date_list.append(np.nan)
        continue
      
      yyyymdday_zh = report_date.split('年')
      y = int(yyyymdday_zh[0])
      mdday_zh = yyyymdday_zh[1].split('月')
      m = int(mdday_zh[0])
      dday_zh = mdday_zh[1].split('日')
      d = int(dday_zh[0])
      report_date = '{:04d}-{:02d}-{:02d}'.format(y, m, d)
      report_date_list.append(report_date)
        
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
        age_list.append('100+')
        
      elif age in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '<1', '<2', '<5', '<6', '<10', '<12', '8月大', '10個月']:
        age_list.append('0s')
      elif age in ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '10-14']:
        age_list.append('10s')
      elif age in ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '20-24', '24.4']:
        age_list.append('20s')
      elif age in ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '.3X']:
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
        '<5-2X', '<5-4X', '<5-5X', '<5-6X', '<5-7X', '<5-8X', '<5-9X', '<5-1XX', '3-77', '9-49', 
        '<10-4X', '<10-6X','<10-8X', '<10-9X', '<1X-6X', '<1X-8X', '18-55',
        '1X-2X', '1X-4X', '1X-5X', '1X-6X', '1X-7X', '2X-3X', '2X-4X', '2X-5X', '2X-6X', '2X-7X', '2X-8X', '2X-9X', '29-65', 
        '3X-4X', '3X-5X', '3X-6X', '3X-8X', '39-57', '5X-7X', '5X-8X', '54-65',
        '男', '女', 
      ]:
        age_list.append(np.nan)
      elif age != age:
        age_list.append(np.nan)
      else:
        print('Age, Case {:d}, {}'.format(i+1, age))
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
        trans_list.append('local')
      
      elif trans == '不明':
        trans_list.append('unknown')
      
      else:
        print('Transmission, Case {:d}, {}'.format(i+1, trans))
        trans_list.append(np.nan)
        
    return trans_list
  
  def getNationality(self):
    nat_list = []
    for nat in self.getCol(self.coltag_nationality):
      nat_list.append(nat)
    return nat_list
  
  def getTravHist(self):
    key_dict = {
      ## East & South Asia
      'Bangladesh': ['孟加拉'],
      'Cambodia': ['柬埔寨'],
      'China': ['中國', '武漢', '深圳', '廣州', '遼寧', '江蘇', '浙江', '大陸'],
      'Hong Kong': ['香港'],
      'India': ['印度'], 
      'Indonesia': ['印尼'], 
      'Japan': ['日本', '東京', '大阪', '北海道'],
      'Korea': ['韓國', '首爾'],
      'Laos': ['寮國'],
      'Macao': ['澳門'],
      'Malaysia': ['馬來西亞'], 
      'Maldives': ['馬爾地夫'], 
      'Mongolia': ['蒙古'],
      'Myanmar' : ['緬甸'],
      'Nepal': ['尼泊爾'],
      'Pakistan': ['巴基斯坦'],
      'Papua New Guinea': ['巴布亞紐幾內亞'], 
      'Philippines': ['菲律賓'], 
      'Singapore': ['新加坡'], 
      'Sri Lanka': ['斯里蘭卡'],
      'Thailand': ['泰國', '曼谷'], 
      'Vietnam': ['越南'],
      
      ## West & Central Asia
      'Afghanistan': ['阿富汗'],
      'Iran': ['伊朗'],
      'Israel': ['以色列'],
      'Kazakhstan': ['哈薩克'], 
      'Kyrgyzstan': ['吉爾吉斯'],
      'Oman': ['阿曼'],
      'Qatar': ['阿拉伯－卡達', '卡達'], 
      'Saudi Arabia': ['沙烏地阿拉伯', '阿拉伯'],
      'Syria': ['敘利亞'], 
      'Turkey': ['土耳其'], 
      'UAE': ['聯合大公國', '阿拉伯－杜拜', '杜拜'], 
      'Uzbekistan': ['烏茲別克'],
      
      ## Europe
      'Europe': ['歐洲'], 
      'Albania': ['阿爾巴尼亞'],  
      'Armania': ['亞美尼亞'],
      'Austria': ['奧地利'], 
      'Belarus': ['白俄羅斯'],
      'Belgium': ['比利時'], 
      'Bulgaria': ['保加利亞'], 
      'Croatia': ['克羅埃西亞'],
      'Cyprus': ['賽普勒斯'],
      'Czechia': ['捷克'], 
      'Danmark': ['丹麥'], 
      'Estonia': ['愛沙尼亞'],
      'Finland': ['芬蘭'], 
      'France': ['法國', '巴黎'], 
      'Germany': ['德國', '紐倫堡', '慕尼黑'], 
      'Greece': ['希臘'],
      'Iceland': ['冰島'], 
      'Ireland': ['愛爾蘭'], 
      'Italy': ['義大利'], 
      'Hungary': ['匈牙利'],
      'Latvia': ['拉脫維亞'], 
      'Lithuania': ['立陶宛'],
      'Luxemburg': ['盧森堡'], 
      'Malta': ['馬爾他'],
      'Netherlands': ['荷蘭'], 
      'Norway': ['挪威'],
      'Poland': ['波蘭'], 
      'Portugal': ['葡萄牙'], 
      'Romania': ['羅馬尼亞'],
      'Russia': ['俄羅斯'],
      'Serbia': ['塞爾維亞'],
      'Slovakia': ['斯洛伐克'],
      'Spain': ['西班牙'], 
      'Sweden': ['瑞典'], 
      'Switzerland': ['瑞士'], 
      'UK': ['英國', '倫敦'], 
      'Ukraine': ['烏克蘭'],
      
      ## Africa
      'Africa': ['非洲'],
      'Algeria': ['阿爾及利亞'],
      'Burkina Faso': ['布吉納法索'],
      'Cameroon': ['喀麥隆'],
      'Chad': ['查德'],
      'Eswatini': ['史瓦帝尼'],
      'Egypt': ['埃及'], 
      'Ethiopia': ['衣索比亞', '埃塞俄比亞'],
      'Gambia': ['甘比亞'],
      'Ghana': ['迦納', '加納'], 
      'Kenya': ['肯亞'],
      'Lesotho': ['賴索托'],
      'Malawi': ['馬拉威'],
      'Mauritania': ['茅利塔尼亞'],
      'Mauritius': ['模里西斯'],
      'Morocco': ['摩洛哥'], 
      'Nigeria': ['奈及利亞'], 
      'Senegal': ['塞內加爾'],
      'Somaliland': ['索馬利蘭'],
      'South Africa': ['南非'], 
      'Tanzania': ['坦尚尼亞'],
      'Tunisia': ['突尼西亞'], 
      'Uganda': ['烏干達'],
      
      ## North & South America
      'Argentina': ['阿根廷'], 
      'Belize': ['貝里斯'],
      'Bolivia': ['玻利維亞'], 
      'Brazil': ['巴西'],
      'Canada': ['加拿大'], 
      'Chile': ['智利', '聖地牙哥'], 
      'Colombia': ['哥倫比亞'],
      'Costa Rica': ['哥斯大黎加'],
      'Dominican Republic': ['多明尼加'],
      'Ecuador': ['厄瓜多'],
      'Guatemala': ['瓜地馬拉'], 
      'Haiti': ['海地'], 
      'Honduras': ['宏都拉斯'], 
      'Latin America': ['中南美洲'],
      'Mexico': ['墨西哥'], 
      'Nicaragua': ['尼加拉瓜'],
      'Panama': ['巴拿馬'],
      'Paraguay': ['巴拉圭'],
      'Peru': ['秘魯', '祕魯'], 
      'Saint Kitts and Nevis': ['聖克里斯多福及尼維斯'],
      'Saint Lucia': ['聖露西亞'],
      'Salvador': ['薩爾瓦多'],
      'Trinidad and Tobago': ['千里達及托巴哥'],
      'USA': ['美國', '加州', '紐約'], 
      
      ## Oceania
      'Australia': ['澳大利亞', '澳洲'], 
      'Marshall Islands': ['馬紹爾'],
      'New Zealand': ['紐西蘭'], 
      'Palau': ['帛琉'], 
      'Solomon Islands': ['索羅門群島'], 
      
      ## Others
      'Antarctica': ['南極'], 
      'Coral Princess': ['珊瑚公主號'], 
      'Diamond Princess': ['鑽石公主號'], 
      'Pan-Shi': ['海軍敦睦支隊磐石艦', '整隊登艦', '台灣啟航', '左營靠泊檢疫'],
      'local': ['無', 'x', 'X']
    }
    
    ## Make reverse dictionary
    rev_key_dict = {}
    for key, value_list in key_dict.items():
      for value in value_list:
        rev_key_dict[value] = key
        
    ## Make decreasingly-ordered Mandarin word list
    value_list = sorted(rev_key_dict.keys(), key=lambda str_: (len(str_), str_[0]), reverse=True) ## Reorder
    
    nat_list = self.getNationality()
    trav_hist_list = []
    
    for i, trav_hist in enumerate(self.getCol(self.coltag_trav_hist)):
      if trav_hist != trav_hist: ## Is nan
        trav_hist_list.append([])
        continue
      
      stock = []
      
      ## Remove line break
      trav_hist = ''.join(trav_hist.split('\n'))
      trav_hist = ''.join(trav_hist.split('\r'))
      
      ## Mandarin word matching
      for value in value_list:
        if value in trav_hist:
          trav_hist = ''.join(trav_hist.split(value))
          key = rev_key_dict[value]
          stock.append(key) ## Put the translation in stock
      
      ## Remove meaningless words
      trav_hist = ''.join(trav_hist.split('2017年8月就入境台灣，期間並未出境'))
      trav_hist = ''.join(trav_hist.split('2020年3月入境後未再出境'))
      trav_hist = ''.join(trav_hist.split('自離境前往'))
      trav_hist = ''.join(trav_hist.split('從搭機'))
      trav_hist = ''.join(trav_hist.split('轉機'))
      trav_hist = ''.join(trav_hist.split('出海'))
      trav_hist = ''.join(trav_hist.split('出境'))
      trav_hist = ''.join(trav_hist.split('或前'))
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
      
      trav_hist = trav_hist.lstrip(' 0123456789*-/()、月及到等經\n→ ?')
      
      ## Complain if unrecognized texts remain
      if len(trav_hist) > 0:
        print('Travel history, Case {:d}, {}'.format(i+1, trav_hist))
      
      ## If no travel history but imported, add nationality (only for i >= 460)
      if i >= 460 and len(stock) == 0:
        if nat_list[i] != nat_list[i]:
          stock.append('unknown')
          continue
          
        for value in value_list:
          if value in nat_list[i]:
            key = rev_key_dict[value]
            stock.append(key) ## Put the translation in stock
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
          mmdd = entry_date.split('/') ## new_year_token (2023)
          m = int(mmdd[0])
          d = int(mmdd[1])
          if i+1 <= 447 and m > 6: ## 2020/06
            y = 2019
          elif i+1 <= 800 or (i+1 < 14900 and m > 6): ## 2020/12, 2021/06
            y = 2020
          elif i+1 <= 14900 or (i+1 < 22000 and m > 6): ## 2021/12, 2022/06
            y = 2021
          else: ## 2022/12
            y = 2022
            
          if '109/2/？' == entry_date:
            entry_date = np.nan
          elif '2022/1/7' == entry_date:
            entry_date = '2022-01-07'
          else:
            entry_date = '{:04d}-{:02d}-{:02d}'.format(y, m, d)
          entry_date_list.append(entry_date)
        except:
          print('Entry date, Case {:d}, {}'.format(i+1, entry_date))
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
        '5/14-22', '5/14-29', '5/14-6/8', '5/15-26', '5/15-6/4', '5/16\n*5/24', '5/18-6/2', '5/18-6/24', '5/19-6/10', 
        '5/20-30', '5/20-31', '5/21-6/6', '5/22-6/7', '5/22-6/9', '5/23-6/12', '5/24-6/5', '5/28-6/11', '5/28-6/13',
        '6/1-2', '6/1-14', '6/1-15', '6/3-16', '6/3-18', '6/4-19', '6/4-23', '6/8-20', '6/10-22', '6/10-26', '6/10-7/5', '6/11-25', '6/14-21', 
        '6/16-28', '6/17-7/3', '6/19-27', '6/19-7/4', '6/20-29', '6/20-7/11', '6/22-30', '6/22-7/1', '6/22-7/2', '6/22-7/9', '6/26-7/6', '6/26-7/10', '6/26-7/12', 
        '7/1-7', '7/1-8', '7/5-15', '7/7-13', '7/7-14', '7/10-17', '7/10-22', '7/12-19', '7/12-27', '7/14-17', '7/14-26', 
        '7/19-23', '7/19-25', '7/23-30', '7/23-31', '7/23-8/4', '7/24-28', '7/24-8/3', '7/25-28', '7/26-8/2', '7/27-8/5',
        '8/2-7', '8/2-10', '8/4-9', '8/10-15', '8/16-28', '8/16(30)', '8/27-9/7', '8/28-9/4', '9/1-5', 
        '9月下旬', '去年9月起', '10月中旬', '11月初', '11月上旬', '11月下旬', '12/', '12月上旬', '×', 'x', 'X', 'x\n*6/25',
      ]:
        onset_date_list.append(np.nan)
        
      elif onset_date in ['4/11-4/13']:
        onset_date_list.append('2022-04-12')
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
      elif onset_date in ['7/23-24']:
        onset_date_list.append('2021-07-23')
      elif onset_date in ['7/29-31']:
        onset_date_list.append('2021-07-30')
      elif onset_date in ['8/4-5']:
        onset_date_list.append('2021-08-04')
      elif onset_date in ['8/7-8']:
        onset_date_list.append('2021-08-07')
      elif onset_date in ['8/7-9']:
        onset_date_list.append('2021-08-08')
      elif onset_date in ['9/7-9']:
        onset_date_list.append('2021-09-08')
        
      else:
        try:
          mmdd = onset_date.split('/')
          m = int(mmdd[0])
          d = int(mmdd[1])
          if i+1 < 100 and m > 6:
            y = 2019
          elif i+1 < 800:
            y = 2020
          elif i+1 < 10000 and m > 6:
            y = 2020
          elif i+1 < 14000:
            y = 2021
          elif i+1 < 20000 and m > 6:
            y = 2021
          else:
            y = 2022
          onset_date = '{:04d}-{:02d}-{:02d}'.format(y, m, d)
          onset_date_list.append(onset_date)
        except:
          print('Onset date, Case {:d}, {}'.format(i+1, onset_date))
          onset_date_list.append(np.nan)
    
    return onset_date_list
  
  def getChannel(self):
    channel_list = []
    key_list_out = ['其他', '採檢']
    
    for i, channel in enumerate(self.getCol(self.coltag_channel)):
      if channel != channel: ## Is nan
        channel_list.append(np.nan)
      
      elif channel in key_list_out:
        channel_list.append(np.nan)
        
      elif channel in ['長程航班\n落地採檢', '落地採檢', '機場']:
        channel_list.append('airport')
        
      elif channel in ['居家檢疫(5+9)', '居家檢疫', '集中檢疫', '英國專案', '死亡']:
        channel_list.append('quarantine')
        
      elif channel in [
        '居家隔離', '住院隔離', '接觸患者', '同院患者', '框列採檢', '匡列篩檢', '匡列居隔', 
        '接觸者回溯', '接觸者檢查', '接觸者採檢', '接觸者框列', '接觸者匡列', '匡列接觸者', '接觸史回溯', '同餐廳接觸史',
        '確診者回溯', '確診者匡列', '居家隔離期滿後採檢', '居家隔離期滿後確診'
      ]:
        channel_list.append('isolation')
        
      elif channel in ['自主健康管理', '加強自主管理', '居家隔離期滿\n自主健康管理']:
        channel_list.append('monitoring')
        
      elif '入院' in channel:
        channel_list.append('hospital')
      elif '工作' in channel:
        channel_list.append('hospital')
      elif '定期' in channel:
        channel_list.append('hospital')
      elif '社區' in channel:
        channel_list.append('hospital')
      elif '自行' in channel:
        channel_list.append('hospital')
      elif '自主' in channel:
        channel_list.append('hospital')
      elif '自費' in channel:
        channel_list.append('hospital')
      elif '例行' in channel:
        channel_list.append('hospital')
      elif '專案' in channel:
        channel_list.append('hospital')
      elif '擴大' in channel:
        channel_list.append('hospital')
      elif '預防' in channel:
        channel_list.append('hospital')
      elif '醫院' in channel:
        channel_list.append('hospital')
        
      elif channel in [
        '入院', '快篩站', '慢性病',
        '常規篩檢', '院內採檢', '就醫採檢', '陪病採檢', '陪產篩檢', '登船檢疫', '清零採檢', 
        '出國前採檢', '入住機構前採檢', '入機構探視前採檢', '投案進入收容所採檢'
      ]:
        channel_list.append('hospital')
        
      elif channel in ['香港檢驗', '外國檢驗', '外國篩檢']:
        channel_list.append('overseas')
        
      else:
        print('Channel, Case {:d}, {}'.format(i+1, channel))
        channel_list.append(np.nan)
    return channel_list
  
  def getSymptom(self):
    key_dict = {
      'sneezing': [
        '鼻子症狀像感冒', '伴隨感冒症狀', '類似感冒症狀', '感冒症狀', '鼻涕倒流', '鼻子不適', '流鼻涕症', 
        '打噴嚏', '流鼻水', '流鼻涕', '鼻塞', '鼻水', '鼻炎', '感冒',
      ],
      'cough': [
        '乾咳及稍有痰', '輕微咳嗽', '咳嗽症狀', '咳嗽加劇', '咳嗽併痰', '咳嗽有痰', '痰有血絲', '喉嚨有痰', '有點咳嗽', '偶爾咳嗽', '偶有咳嗽', 
        '少量痰', '咳嗽', '乾咳', '輕咳', '微咳', '咳痰', '微痰', '有痰', '痰多', '痰'
      ],
      'throatache': [
        '上呼吸道相關症狀', '上呼吸道症狀', '上呼吸道感染', '上呼吸道腫痛', '喉嚨有異物感', '喉嚨乾澀想咳', 
        '呼吸道症狀', '喉嚨刺激感', '喉嚨有異狀', '上呼吸道', '咽喉不適', '急性咽炎', '聲音沙啞', '口乾舌燥', '吞嚥困難', 
        '喉嚨不適', '喉嚨痛癢', '喉嚨乾癢', '喉嚨異狀', '喉嚨異常', '喉嚨乾痛', '喉嚨紅腫', '喉嚨癢痛', '喉嚨痛 癢', 
        '異物感', '樓龍痛', '呼吸道', '呼吸痛', '咽喉痛', '鼻子乾', '喉嚨痛', '喉嚨癢', '喉嚨腫', '喉嚨乾', '喉嚨卡', 
        '沙啞', '乾嘔', '口渴', '口乾', '喉嚨', '嚨痛', 
      ],
      'earache': ['左耳神經痛', '耳朵痛', '耳鳴'],
      'dyspnea': [
        '講話、呼吸吃力', '活動後呼吸喘', '重度呼吸窘迫', '些微呼吸急促', '呼吸喘 困難', 
        '呼吸窘迫', '呼吸衰竭', '呼吸不順', '呼吸困難', '呼吸短促', '呼吸急促', '呼吸微快', 
        '呼吸微喘', '走路會喘', '喘不過氣', '走路喘', '呼吸喘', '輕微喘', '微喘', '氣喘', '喘嗚', '喘'
      ],
      'bronchitis': ['支氣管炎'],
      'pneumonia': ['X光顯示肺炎', 'X光片顯示肺炎', 'X光顯示肺部輕微浸潤', '雙側肺部有異狀', '細菌肺炎', '肺浸潤', '肺炎'], 
      
      'fever': [
        '出現中暑的狀態', '身體悶熱不適', '間歇性發燒', '身體微熱', '身體溫熱', '身體發熱', '體溫偏高', '體溫升高', '反覆發燒', '臉紅微熱', '睡覺盜汗', '發燒症狀',
        '體溫高', '微燒', '低燒', '高燒', '發燒', '發熱', '盜汗'
      ], 
      'chills': ['忽冷忽熱症狀', '全身冒冷汗', '全身發冷', '忽冷忽熱', '冒冷汗', '畏寒', '發冷', '寒顫'], 
      
      'nausea': ['嘔吐感', '嘔吐', '噁心', '想吐', '反胃'],
      'diarrhea': ['急性腸胃炎', '拉肚子', '腹瀉'], 
      
      'headache': ['頭部不適感', '頭暈目眩', '輕度頭痛', '頭骨痛', '偏頭痛', '頭痛', '頭暈', '頭量', '頭脹', '頭昏', '暈眩', '頭重'],
      'eyes sore': ['結膜充血', '後眼窩痛', '左眼紅痛', '眼睛癢', '眼睛痛', '眼壓高'], 
      'chest pain+backache': ['胸背痛'], 
      'chest pain': ['呼吸時胸痛', '心臟不舒服', '胸部不適', '胸口悶', '胸痛', '胸悶', '心悸'],
      'stomachache': ['腸胃不舒服', '腸胃道不適', '腸胃不適', '胃部不適', '腹部不適', '肚子不適', '肚子痛', '腹悶痛', '下腹痛', '胃痛', '腹痛', '胃脹', '腹脹'],
      'backache': ['腰酸背痛', '腰痠背痛', '背部痠痛', '腰痠', '腰酸', '腰痛', '背痛'], 
      'toothache': ['牙痛'], 
      'dermatitis': ['皮膚痛', '過敏', '出疹'],
      
      'fatigue': [
        '全身倦怠無力', '左側肢體無力', '疑似中暑症狀', '全身倦怠', '全身疲憊', '全身疲倦', '全身虛弱', '全身疲軟', 
        '身體無力', '全身無力', '全身乏力', '走路無力', '四肢無力', '肌肉無力', '精神倦怠', '體力不支', '體力變差', 
        '疲倦感', '倦怠情', '體力差', '沒精神', '倦怠', '疲憊', '疲倦', '疲勞', '疲累', '無力', '虛弱'
      ],
      'soreness': [
        '上半身骨頭刺痛', '全身肌肉痠痛', '全身痠痛症狀', '小腿肌肉痠痛', '肌肉痠痛症狀', '肌肉關節痠痛', '手部肌肉痠痛', '關節肌肉痛', '肌肉 痠痛', '肌肉酸痛', '肌肉痠痛', 
        '全身痠痛', '全身酸痛', '骨頭痠痛', '骨頭酸痛', '關節痠痛', '身體痠痛', '四肢痠痛', '手部痠痛', '手腳痠痛', '脖子痠痛', '肩膀痠痛', 
        '肌肉痛', '骨頭酸', '骨頭痛', '關節痛', '膝蓋痛', '身體痛', '痠痛'
      ],
      'hypersomnia': ['嗜睡'],
      'insomnia': ['不易入睡', '睡不著'], 
      
      'dysnosmia+dysgeusia': ['味覺及嗅覺都喪失', '味覺及嗅覺喪失', '嗅覺和味覺喪失', '嗅味覺異常', '味嗅覺異常'], 
      'dysnosmia': ['嗅覺異常症狀', '嗅覺不靈敏', '失去嗅覺', '嗅覺喪失', '嗅覺變差', '嗅覺遲鈍', '嗅覺異常', '喪失嗅覺', '嗅覺降低', '無嗅覺'], 
      'dysgeusia': ['味覺喪失', '味覺異常', '喪失味覺', '失去味覺', '味覺變差', '口苦'], 
      
      'tonsillitis': ['右側扁桃體腫脹及壓痛', '扁桃腺發炎及紅腫', '淋巴腫脹', '扁桃腺腫痛'], 
      'hypotension': ['低血壓'],
      'hypoglycemia': ['低血糖'],
      'hypoxemia': ['血氧濃度54%', '血氧降低', '血氧下降', '低血氧', '低 血氧'],
      'anorexia': ['食慾不佳', '食慾不振', '食慾下降', '食欲不振', '胃口變差', '沒有食慾', '食慾差', '無食慾'],
      'fatigue+anorexia': ['食慾及活動力差'],
      'arrhythmia': ['心律不整'],
      'coma': ['意識不清', '意識改變'],
      
      'symptomatic': ['全身不舒服', '出現症狀', '身體不適', '全身不適', '樓紅不適', '心跳快', '有症狀', '不舒服', '活動差', '調查中', '不適'] + \
        ['排尿疼痛', '眼球上吊', '肢體變黑', '高血糖', '舌頭痛', '猝死', '抽搐', '手抖', '吐血', '敗血', '休克', '煩躁', '抽筋'],
      'asymptomatic': ['首例無症狀', '無症狀', 'x', 'X'],
    }
    
    ## Make reverse dictionary
    rev_key_dict = {}
    for key, value_list in key_dict.items():
      for value in value_list:
        rev_key_dict[value] = key
        
    ## Make decreasingly-ordered Mandarin word list
    value_list = sorted(rev_key_dict.keys(), key=lambda str_: (len(str_), str_[0]), reverse=True) ## Reorder
    
    symp_list = []
    
    for i, symp in enumerate(self.getCol(self.coltag_symptom)):
      symp_orig = symp
      
      if symp != symp: ## Is nan
        symp_list.append([])
        continue
      
      stock = []
      ## Remove line break
      symp = ''.join(symp.split('入境已無症狀'))
      symp = ''.join(symp.split('#68 #69 #70 #73其中一人無症狀'))
      symp = ''.join(symp.split('\n'))
      symp = ''.join(symp.split('\r'))
      
      ## Mandarin word matching
      for value in value_list:
        if value in symp:
          symp = ''.join(symp.split(value))
          key = rev_key_dict[value]
          for k in key.split('+'):
            stock.append(k)
        
      symp = ''.join(symp.split('(耳溫量測37.7度)'))
      symp = ''.join(symp.split('住院中出現:'))
      symp = ''.join(symp.split('到37.5度'))
      symp = ''.join(symp.split('(37.5度)'))
      symp = ''.join(symp.split('(37.4度)'))
      symp = ''.join(symp.split('首例本土'))
      symp = ''.join(symp.split('平常就常'))
      symp = ''.join(symp.split('入境前有'))
      symp = ''.join(symp.split('心情不佳'))
      symp = ''.join(symp.split('診斷為'))
      symp = ''.join(symp.split('嚴重'))
      symp = ''.join(symp.split('輕微'))
      symp = ''.join(symp.split('伴隨'))
      symp = ''.join(symp.split('不順'))
      symp = ''.join(symp.split('自覺'))
      symp = symp.lstrip('  0123456789/\n\r .，、與及有')
      
      if len(symp) > 0:
        print('Symptom, Case {:d}, {}'.format(i+1, symp))
        print('Symptom, Case {:d}, {}'.format(i+1, symp_orig))
      
      stock = list(set(stock))
      symp_list.append(stock)
      
    symp_list = [symp if len(symp) > 0 else np.nan for symp in symp_list]
    return symp_list

  def getLink(self):
    link_list = []
    for i, link in enumerate(self.getCol(self.coltag_link)):
      if link != link:
        link_list.append(np.nan)
      
      elif link == '軍艦':
        link_list.append('fleet')
      
      elif '未知' in link:
        link_list.append('unlinked')
      elif '不明' in link:
        link_list.append('unlinked')
      elif '調查中' in link:
        link_list.append('unlinked')
        
      elif 'O' in link:
        link_list.append('linked')
      elif 'o' in link:
        link_list.append('linked')
      elif '#' in link:
        link_list.append('linked')
      
      else:
        link_list.append('linked')
    return link_list
  
  def increment_caseByTransmission(self):
    report_date_list = self.getReportDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    link_list = self.getLink()
    
    ## Initialize stocks
    trans_key_list = ['imported', 'linked', 'unlinked', 'fleet', 'plane', 'unknown']
    stock_r = ccm.initializeStock_dailyCounts(trans_key_list)
    stock_o = ccm.initializeStock_dailyCounts(trans_key_list)
    
    ## Loop over cases
    for report_date, onset_date, trans, link in zip(report_date_list, onset_date_list, trans_list, link_list):
      if trans != trans:
        continue
      
      ## Determine column tag
      if trans == 'local':
        if link == 'unlinked':
          key = link
        else:
          key = 'linked'
      else:
        key = trans
        
      try:
        ind = ccm.indexForOverall(report_date)
        stock_r[key][ind] += 1
      except IndexError: ## If NaN
        pass
        
      ## Check if NaN
      if onset_date != onset_date:
        continue
      
      try:
        ind = ccm.indexForOverall(onset_date)
        stock_o[key][ind] += 1
      except IndexError: ## If NaN
        pass
      
    return stock_r, stock_o
  
  def makeReadme_caseByTransmission(self, gr):
    key = 'case_by_transmission_by_report_day'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `imported`')
    stock.append('  - `linked`: local cases linked to known ones')
    stock.append('  - `unlinked`: local cases with unknown origin')
    stock.append('  - `fleet`: on boat')
    stock.append('  - `plane`: on plane')
    stock.append('  - `unknown`: undetermined`')
    ccm.README_DICT[gr][key] = stock
    
    key = 'case_by_transmission_by_onset_day'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: onset date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `imported`')
    stock.append('  - `linked`: local cases linked to known ones')
    stock.append('  - `unlinked`: local cases with unknown origin')
    stock.append('  - `fleet`: on boat')
    stock.append('  - `plane`: on plane')
    stock.append('  - `unknown`: undetermined`')
    stock.append('- Cases without onset date do not show up in the file')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_caseByTransmission(self, mode='both'):
    if mode in ['data', 'both']:
      stock_r, stock_o = self.increment_caseByTransmission()
      
      stock_r = pd.DataFrame(stock_r)
      stock_r = ccm.adjustDateRange(stock_r)
      
      stock_o = pd.DataFrame(stock_o)
      stock_o = ccm.adjustDateRange(stock_o)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data_r = ccm.truncateStock(stock_r, gr)
        data_o = ccm.truncateStock(stock_o, gr)
        
        ## Save
        name = '{}processed_data/{}/case_by_transmission_by_report_day.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data_r)
        name = '{}processed_data/{}/case_by_transmission_by_onset_day.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data_o)
      
      if mode in ['readme', 'both']:
        self.makeReadme_caseByTransmission(gr)
    return
  
  def increment_caseByDetection(self):
    report_date_list = self.getReportDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    channel_list = self.getChannel()
    
    ## Initialize data dict
    det_key_list = ['airport', 'quarantine', 'isolation', 'monitoring', 'hospital', 'overseas', 'no_data']
    stock_r = ccm.initializeStock_dailyCounts(det_key_list)
    stock_o = ccm.initializeStock_dailyCounts(det_key_list)
    
    ## Loop over cases
    for report_date, onset_date, trans, channel in zip(report_date_list, onset_date_list, trans_list, channel_list):
      if trans != trans:
        continue
      
      ## Determine column tag
      if channel != channel:
        key = 'no_data'
      else:
        key = channel
      
      try:
        ind = ccm.indexForOverall(report_date)
        stock_r[key][ind] += 1
      except IndexError: ## If NaN
        pass
        
      ## Check if NaN
      if onset_date != onset_date:
        continue
      
      try:
        ind = ccm.indexForOverall(onset_date)
        stock_o[key][ind] += 1
      except IndexError: ## If NaN
        pass
      
    return stock_r, stock_o
    
  def makeReadme_caseByDetection(self, gr):
    key = 'case_by_detection_by_report_day'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `airport`')
    stock.append('  - `quarantine`: during isolation because of having high-risk travel history')
    stock.append('  - `isolation`: during isolation because of being close contact of confirmed cases')
    stock.append('  - `monitoring`: during 7 days after quarantine or isolation`')
    stock.append('  - `hospital`: detected in community`')
    stock.append('  - `overseas`: diagnosed overseas`')
    stock.append('  - `no_data`: no detection channel data`')
    ccm.README_DICT[gr][key] = stock
    
    key = 'case_by_detection_by_onset_day'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: onset date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `airport`')
    stock.append('  - `quarantine`: during isolation because of having high-risk travel history')
    stock.append('  - `isolation`: during isolation because of being close contact of confirmed cases')
    stock.append('  - `monitoring`: during 7 days after quarantine or isolation`')
    stock.append('  - `hospital`: detected in community`')
    stock.append('  - `overseas`: diagnosed overseas`')
    stock.append('  - `no_data`: no detection channel data`')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_caseByDetection(self, mode='both'):
    gr = ccm.GROUP_2020
    
    if mode in ['data', 'both']:
      stock_r, stock_o = self.increment_caseByDetection()
      
      stock_r = pd.DataFrame(stock_r)
      stock_r = ccm.adjustDateRange(stock_r)
      
      stock_o = pd.DataFrame(stock_o)
      stock_o = ccm.adjustDateRange(stock_o)
      
      ## Make data frame
      data_r = ccm.truncateStock(stock_r, gr)
      data_o = ccm.truncateStock(stock_o, gr)
      
      ## Save
      name = '{}processed_data/{}/case_by_detection_by_report_day.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data_r)
      name = '{}processed_data/{}/case_by_detection_by_onset_day.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data_o)
    
    if mode in ['readme', 'both']:
      self.makeReadme_caseByDetection(gr)
    return
  
  def increment_travHistSymptomCorr(self):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    trav_hist_list = self.getTravHist()
    symp_list = self.getSymptom()
    
    stock = {'x_list_list': [], 'y_list_list': [], 'nb_dict': {'N_total': 0, 'N_imported': 0, 'N_data': 0}}
    stock_dict = ccm.initializeStockDict_general(stock)
    
    ## Loop over case
    for report_date, trans, trav_hist, symp in zip(report_date_list, trans_list, trav_hist_list, symp_list):
      if trans != trans:
        continue
      
      index_list = ccm.makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock['nb_dict']['N_total'] += 1
        
        ## Keep only imported
        if trans != 'imported':
          continue
        
        stock['nb_dict']['N_imported'] += 1
        
        ## Remove NaN
        if trav_hist != trav_hist or symp != symp:
          continue
        
        stock['nb_dict']['N_data'] += 1
        stock['x_list_list'].append(symp)
        stock['y_list_list'].append(trav_hist)
              
    return stock_dict
  
  def calculateCorr_travHistSymptomCorr(self, stock_dict):
    for stock in stock_dict.values():
      assert len(stock['x_list_list']) == len(stock['y_list_list'])
      
      if 0 == stock['nb_dict']['N_data']:
        continue
      
      ## Make histogram
      x_hist = clt.Counter([x for x_list in stock['x_list_list'] for x in x_list])
      x_hist = sorted(x_hist.items(), key=lambda t: t[1], reverse=True)
      
      ## Make histogram
      y_hist = clt.Counter([y for y_list in stock['y_list_list'] for y in y_list])
      y_hist = sorted(y_hist.items(), key=lambda t: t[1], reverse=True)
      
      ## Make boolean matrix
      x_bool_mat = []
      for x_pair in x_hist:
        x_bool_arr = [int(x_pair[0] in x_list) for x_list in stock['x_list_list']]
        x_bool_mat.append(x_bool_arr)
      x_bool_mat = np.array(x_bool_mat)
      
      ## Make boolean matrix
      y_bool_mat = []
      for y_pair in y_hist:
        y_bool_arr = [int(y_pair[0] in y_list) for y_list in stock['y_list_list']]
        y_bool_mat.append(y_bool_arr)
      y_bool_mat = np.array(y_bool_mat)
      
      x_norm_mat = np.array([ccm.normalizeBoolArr(x_bool_arr) for x_bool_arr in x_bool_mat])
      y_norm_mat = np.array([ccm.normalizeBoolArr(y_bool_arr) for y_bool_arr in y_bool_mat])
      
      stock['x_hist'] = x_hist
      stock['y_hist'] = y_hist
      stock['corr_mat'] = y_norm_mat.dot(x_norm_mat.T);
      stock['count_mat'] = y_bool_mat.dot(x_bool_mat.T);
    return stock_dict
  
  def makeStock_travHistSymptomCorr(self, stock):
    n_trav = 10 ## For y
    n_symp = 10 ## For x
    
    ## Truncate
    corr_mat = stock['corr_mat'][:n_trav, :n_symp]
    count_mat = stock['count_mat'][:n_trav, :n_symp]
    x_dict = dict(stock['x_hist'][:n_symp])
    y_dict = dict(stock['y_hist'][:n_trav])
    
    ## Make matrix grid
    x_list = list(x_dict.keys())
    y_list = list(y_dict.keys())
    grid = np.meshgrid(x_list, y_list)
    
    ## Data for coefficient
    symp_arr = grid[0].flatten()
    trav_hist_arr = grid[1].flatten()
    corr_arr = corr_mat.flatten()
    corr_arr = np.around(corr_arr, decimals=4)
    count_arr = count_mat.flatten()
    
    ## Data for label
    tot_dict = stock['nb_dict'].copy()
    tot_dict.update(y_dict)
    tot_dict.update(x_dict)
    key_arr = list(tot_dict.keys())
    x_list_fr = [ccm.SYMPTOM_DICT[x]['fr'] for x in x_list]
    value_arr = list(tot_dict.values())
    label_arr_en = ['', '', ''] + y_list + [x[0].upper() + x[1:] for x in x_list]
    label_arr_fr = ['', '', ''] + [ccm.TRAVEL_HISTORY_DICT[y]['fr'] for y in y_list] + [x[0].upper() + x[1:] for x in x_list_fr]
    label_arr_zh = ['', '', ''] + [ccm.TRAVEL_HISTORY_DICT[y]['zh-tw'] for y in y_list] + [ccm.SYMPTOM_DICT[x]['zh-tw'] for x in x_list]
    
    ## Make new stocks
    stock_c = {'symptom': symp_arr, 'trav_hist': trav_hist_arr, 'corr': corr_arr, 'count': count_arr}
    stock_l = {'key': key_arr, 'count': value_arr, 'label': label_arr_en, 'label_fr': label_arr_fr, 'label_zh': label_arr_zh}
    return stock_c, stock_l
  
  def makeReadme_travHistSymptomCorr(self, gr):
    key = 'travel_history_symptom_correlations'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: matrix element')
    stock.append('- Column')
    stock.append('  - `symptom`')
    stock.append('  - `trav_hist`: country as travel history')
    stock.append('  - `corr`: correlation coefficient between `symptom` & `trav_hist`')
    stock.append('  - `count`: number of confirmed cases having `symptom` & `trav_hist` simultaneously')
    ccm.README_DICT[gr][key] = stock
    
    key = 'travel_history_symptom_correlations_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: symptom or travel history')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `count`: number of confirmed cases of `key`')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
    stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_travHistSymptomCorr(self, mode='both'):
    gr = ccm.GROUP_2020
    
    if mode in ['data', 'both']:
      stock_dict = self.increment_travHistSymptomCorr()
      stock_dict = self.calculateCorr_travHistSymptomCorr(stock_dict)
    
      ## Make data frame
      stock = stock_dict[gr]
      data_c, data_l = self.makeStock_travHistSymptomCorr(stock)
      data_c = pd.DataFrame(data_c)
      data_l = pd.DataFrame(data_l)
      
      ## Save
      name = '{}processed_data/{}/travel_history_symptom_correlations.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data_c)
      name = '{}processed_data/{}/travel_history_symptom_correlations_label.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data_l)
    
    if mode in ['readme', 'both']:
      self.makeReadme_travHistSymptomCorr(gr)
    return
  
  def increment_ageSymptomCorr(self):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    age_list = self.getAge()
    symp_list = self.getSymptom()
    
    stock = {'x_list_list': [], 'y_list_list': [], 'nb_dict': {'N_total': 0, 'N_data': 0}}
    stock_dict = ccm.initializeStockDict_general(stock)
    
    ## Loop over case
    for report_date, trans, age, symp in zip(report_date_list, trans_list, age_list, symp_list):
      if trans != trans:
        continue
      
      index_list = ccm.makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock['nb_dict']['N_total'] += 1
        
        ## Remove NaN
        if age != age or symp != symp:
          continue
        
        stock['nb_dict']['N_data'] += 1
        stock['x_list_list'].append(symp)
        stock['y_list_list'].append(age)
            
    return stock_dict
  
  def calculateCorr_ageSymptomCorr(self, stock_dict):
    for stock in stock_dict.values():
      assert len(stock['x_list_list']) == len(stock['y_list_list'])
      
      if 0 == stock['nb_dict']['N_data']:
        continue
      
      ## Make histogram
      x_hist = clt.Counter([x for x_list in stock['x_list_list'] for x in x_list])
      x_hist = sorted(x_hist.items(), key=lambda t: t[1], reverse=True)
      
      ## Make histogram
      y_hist = clt.Counter(stock['y_list_list'])
      for key in ccm.AGE_DICT:
        y_hist[key] = y_hist.get(key, 0)
      y_hist = sorted(y_hist.items(), key=lambda t: str(len(t[0]))+t[0], reverse=True)
    
      ## Make boolean matrix
      x_bool_mat = []
      for x_pair in x_hist:
        x_bool_arr = [int(x_pair[0] in x_list) for x_list in stock['x_list_list']]
        x_bool_mat.append(x_bool_arr)
      x_bool_mat = np.array(x_bool_mat)
      
      ## Make boolean matrix
      y_bool_mat = []
      for y_pair in y_hist:
        y_bool_arr = [int(y_pair[0] == y_list) for y_list in stock['y_list_list']]
        y_bool_mat.append(y_bool_arr)
      y_bool_mat = np.array(y_bool_mat)
      
      x_norm_mat = np.array([ccm.normalizeBoolArr(x_bool_arr) for x_bool_arr in x_bool_mat])
      y_norm_mat = np.array([ccm.normalizeBoolArr(y_bool_arr) for y_bool_arr in y_bool_mat])
      
      stock['x_hist'] = x_hist
      stock['y_hist'] = y_hist
      stock['corr_mat'] = y_norm_mat.dot(x_norm_mat.T);
      stock['count_mat'] = y_bool_mat.dot(x_bool_mat.T);
    return stock_dict
  
  def makeStock_ageSymptomCorr(self, stock):
    n_age = stock['corr_mat'].shape[0] ## For y
    n_symp = 10 ## For x
  
    ## Truncate
    corr_mat = stock['corr_mat'][:n_age, :n_symp]
    count_mat = stock['count_mat'][:n_age, :n_symp]
    x_dict = dict(stock['x_hist'][:n_symp])
    y_dict = dict(stock['y_hist'][:n_age])
    
    ## Make matrix grid
    x_list = list(x_dict.keys())
    y_list = list(y_dict.keys())
    grid = np.meshgrid(x_list, y_list)
    
    ## Data for coefficient
    symp_arr = grid[0].flatten()
    age_arr = grid[1].flatten()
    corr_arr = corr_mat.flatten()
    corr_arr = np.around(corr_arr, decimals=4)
    count_arr = count_mat.flatten()
    
    ## Data for total
    tot_dict = stock['nb_dict'].copy()
    tot_dict.update(y_dict)
    tot_dict.update(x_dict)
    key_arr = list(tot_dict.keys())
    x_list_fr = [ccm.SYMPTOM_DICT[x]['fr'] for x in x_list]
    value_arr = list(tot_dict.values())
    label_arr_en = ['', ''] + y_list + [x[0].upper() + x[1:] for x in x_list]
    label_arr_fr = ['', ''] + [ccm.AGE_DICT[y]['fr'] for y in y_list] + [x[0].upper() + x[1:] for x in x_list_fr]
    label_arr_zh = ['', ''] + [ccm.AGE_DICT[y]['zh-tw'] for y in y_list] + [ccm.SYMPTOM_DICT[x]['zh-tw'] for x in x_list]
    
    ## Make new stocks
    stock_c = {'symptom': symp_arr, 'age': age_arr, 'corr': corr_arr, 'count': count_arr}
    stock_l = {'key': key_arr, 'count': value_arr, 'label': label_arr_en, 'label_fr': label_arr_fr, 'label_zh': label_arr_zh}
    return stock_c, stock_l
  
  def makeReadme_ageSymptomCorr(self, gr):
    key = 'age_symptom_correlations'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: matrix element')
    stock.append('- Column')
    stock.append('  - `symptom`')
    stock.append('  - `age`: age range')
    stock.append('  - `corr`: correlation coefficient between `symptom` & `age`')
    stock.append('  - `count`: number of confirmed cases from `age` having `symptom`')
    ccm.README_DICT[gr][key] = stock
    
    key = 'age_symptom_correlations_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: symptom or age range')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `count`: number of confirmed cases of `key`')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
    stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_ageSymptomCorr(self, mode='both'):
    gr = ccm.GROUP_2020
    
    if mode in ['data', 'both']:
      stock_dict = self.increment_ageSymptomCorr()
      stock_dict = self.calculateCorr_ageSymptomCorr(stock_dict)
    
      ## Make data frame
      stock = stock_dict[gr]
      data_c, data_l = self.makeStock_ageSymptomCorr(stock)
      data_c = pd.DataFrame(data_c)
      data_l = pd.DataFrame(data_l)
      
      ## Save
      name = '{}processed_data/{}/age_symptom_correlations.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data_c)
      name = '{}processed_data/{}/age_symptom_correlations_label.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data_l)
      
    if mode in ['readme', 'both']:
      self.makeReadme_ageSymptomCorr(gr)
    return
  
  def increment_diffByTransmission(self):
    report_date_list = self.getReportDate()
    entry_date_list = self.getEntryDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    
    trans_key_list = ['total'] + self.trans_key_list
    stock = {key: [] for key in trans_key_list}
    stock_dict = ccm.initializeStockDict_general(stock)

    for report_date, entry_date, onset_date, trans in zip(report_date_list, entry_date_list, onset_date_list, trans_list):
      if trans != trans:
        continue
      
      if trans in ['imported', 'local']:
        key = trans
      else:
        key = 'others'
        
      ord_rep = ccm.ISODateToOrd(report_date)
      ord_entry = ccm.ISODateToOrd(entry_date) if entry_date == entry_date else 0
      ord_onset = ccm.ISODateToOrd(onset_date) if onset_date == onset_date else 0
      diff = min(ord_rep-ord_entry, ord_rep-ord_onset)
      
      index_list = ccm.makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock['total'].append(diff)
        stock[key].append(diff)
          
    return stock_dict
  
  def makeHist_diffByTransmission(self, stock_dict):
    upper = 30
    width = 1
    bins = np.arange(-0.5, upper+width, width) ## Histogram bins
    bins[-1] = 999
    
    trans_key_list = ['total'] + self.trans_key_list
    
    for gr, stock in stock_dict.items():
      for key in trans_key_list:
        n_arr, ctr_bins = ccm.makeHist(stock[key], bins)
        n_arr = n_arr.round(0).astype(int)
        stock[key] = n_arr
      
      ctr_bins = ctr_bins.round(0).astype(int)
      ctr_bins[-1] = upper
      
      stock['difference'] = ctr_bins
      
    return stock_dict
  
  def makeReadme_diffByTransmission(self, gr):
    key = 'difference_by_transmission' 
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: delay in number of days before identifying a transmission')
    stock.append('  - For local cases, it is defined as the delay between the report date & the onset date.')
    stock.append('  - For imported cases, it is defined as the delay between the report date & the later one of the onset date & the entry date.')
    stock.append('- Column: transmission type')
    stock.append('  - `difference`: see row')
    stock.append('  - `total`: `imported` + `local` + `others`')
    stock.append('  - `imported`: imported cases')
    stock.append('  - `local`: local cases')
    stock.append('  - `others`: on plane, on boat, & unknown')
    stock.append('- Value: number of case counts')
    stock.append('- This information is not available for all cases.')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_diffByTransmission(self, mode='both'):
    gr = ccm.GROUP_2020
    
    if mode in ['data', 'both']:
      stock_dict = self.increment_diffByTransmission()
      stock_dict = self.makeHist_diffByTransmission(stock_dict)
      
      col_tag_list = ['difference', 'total'] + self.trans_key_list
      
      stock = stock_dict[gr]
      data = {key: stock[key] for key in col_tag_list}
      data = pd.DataFrame(data)
      
      name = '{}processed_data/{}/difference_by_transmission.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      self.makeReadme_diffByTransmission(gr)
    return
  
  def saveCsv(self, mode='both'):
    self.saveCsv_caseByTransmission(mode='readme')
    self.saveCsv_caseByDetection(mode='readme')
    self.saveCsv_travHistSymptomCorr(mode='readme')
    self.saveCsv_ageSymptomCorr(mode='readme')
    self.saveCsv_diffByTransmission(mode='readme')
    return

## End of file
################################################################################
