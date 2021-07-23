
    ##############################
    ##  COVID_test.py           ##
    ##  Chieh-An Lin            ##
    ##  Version 2021.07.22      ##
    ##############################

import os
import sys
import warnings
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm

################################################################################
## Classes - test sheet

class TestSheet(ccm.Template):
  
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
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv' % ccm.DATA_PATH
    data = ccm.loadCsv(name, verbose=verbose)
    #https://covid19dashboard.cdc.gov.tw/dash4
    
    from_extended_list = data[self.coltag_from_extended].values
    self.ind_2021 = (from_extended_list == '2021分隔線').argmax()
    
    date_list = data[self.coltag_date].values
    ind = date_list == date_list
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
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
  
  def makeReadme_testCounts(self, page):
    key = 'test_counts'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: total test counts')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_testCounts(self):
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    value_arr = np.array(from_clin_def_list, dtype=int) + np.array(from_qt_list, dtype=int) + np.array(from_ext_list, dtype=int)
    avg_arr = ccm.makeMovingAverage(value_arr)
    stock = {'date': date_list, 'total': value_arr, 'total_avg': avg_arr}
    
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/test_counts.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_testCounts(page)
    return
  
  def makeReadme_testByCriterion(self, page):
    key = 'test_by_criterion'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `clinical`: based on clinical criteria')
    stock.append('  - `quarantine`: on people in quarantine (obsolete)')
    stock.append('  - `extended`: extended community search')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_testByCriterion(self):
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    stock = {'date': date_list, 'clinical': from_clin_def_list, 'quarantine': from_qt_list, 'extended': from_ext_list}
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/test_by_criterion.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_testByCriterion(page)
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
  
  #TODO
  def makeReadme_criteriaTimeline(self):
    #key = 'criteria_timeline'
    #stock = []
    #stock.append('`%s.csv`' % key)
    #stock.append('- Row: report date')
    #stock.append('- Column')
    #stock.append('  - `date`')
    #stock.append('  - `entry`')
    #stock.append('  - `exit`')
    #stock.append('  - `total`: entry + exit')
    #stock.append('  - `entry_avg`: 7-day moving average of `entry`')
    #stock.append('  - `exit_avg`: 7-day moving average of `exit`')
    #stock.append('  - `total_avg`: 7-day moving average of `total`')
    #ccm.README_DICT[page][key] = stock
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
    
    stock = {'date': date_list, 'en': en_list, 'fr': fr_list, 'zh-tw': zh_tw_list}
    data = pd.DataFrame(stock)
    
    name = '%sprocessed_data/criteria_timeline.csv' % ccm.DATA_PATH
    ccm.saveCsv(name, data)
    return
  
  def updateNewTestCounts(self, stock):
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    ord_today = ccm.getTodayOrdinal()
    nb_days = ord_today - ord_ref
    
    stock['new_tests'] = np.zeros(nb_days, dtype=int)
    
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    for date, from_clin_def, from_qt, from_ext in zip(date_list, from_clin_def_list, from_qt_list, from_ext_list):
      ind = ccm.ISODateToOrd(date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      stock['new_tests'][ind] = from_clin_def + from_qt + from_ext
    return
  
  def saveCsv(self):
    self.saveCsv_testCounts()
    self.saveCsv_testByCriterion()
    self.saveCsv_criteriaTimeline()
    return

## End of file
################################################################################
