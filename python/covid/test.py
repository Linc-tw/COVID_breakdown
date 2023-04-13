
    ################################
    ##  test.py                   ##
    ##  Chieh-An Lin              ##
    ##  2023.01.25                ##
    ################################

import os
import sys
import datetime as dtt

import numpy as np
import pandas as pd

import covid.common as cvcm

################################################################################
## Class - specimen sheet

class TestSheet(cvcm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '通報日'
    self.coltag_clin_def = '法定傳染病通報'
    self.coltag_qt = '居家檢疫送驗'
    self.coltag_extended = '擴大監測送驗'
    self.coltag_total = 'Total'
    
    name = f'{cvcm.DATA_PATH}raw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv'
    data = cvcm.loadCsv(name, verbose=verbose)
    #https://od.cdc.gov.tw/eic/covid19/covid19_tw_specimen.csv
    
    self.setData(data)
    self.n_total = self.getNbRows()
    
    if verbose:
      print(f'N_total = {self.n_total}')
    return 
    
  def setData(self, data):
    tot_list = data[self.coltag_total].values
    ind = tot_list != '0.0'
    ind[:-50] = True ## Remove trailing 0.0 but ensuring the front
    self.data = data[ind]
    return
  
  def getDate(self):
    date_list = []
    
    for date in self.getCol(self.coltag_date):
      md_slash = date.split('/')
      y = int(md_slash[0])
      m = int(md_slash[1])
      d = int(md_slash[2])
      
      date = f'{y:04}-{m:02}-{d:02}'
      date_list.append(date)
    return date_list
  
  def getClinDef(self):
    from_clin_def_list = []
    for from_clin_def in self.getCol(self.coltag_clin_def):
      from_clin_def_list.append(int(float(from_clin_def)))
    return from_clin_def_list

  def getQT(self):
    from_qt_list = []
    for from_qt in self.getCol(self.coltag_qt):
      from_qt_list.append(int(float(from_qt)))
    return from_qt_list

  def getExtended(self):
    from_ext_list = []
    for from_ext in self.getCol(self.coltag_extended):
        from_ext_list.append(int(float(from_ext)))
    return from_ext_list

  def getTotal(self):
    total_list = []
    for total in self.getCol(self.coltag_total):
      total_list.append(int(float(total)))
    return total_list

  def makeReadme_testCounts(self, gr):
    key = 'test_counts'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: total test counts')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_testCounts(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      total_list = self.getTotal()
      avg_arr = cvcm.makeMovingAverage(total_list)
      print(f'Latest nb of tests = {total_list[-1]}')
      
      stock = {'date': date_list, 'total': total_list, 'total_avg': avg_arr}
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
    
    for gr in cvcm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/test_counts.csv'
        cvcm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_testCounts(gr)
    return
  
  def makeReadme_testByCriterion(self, gr):
    key = 'test_by_criterion'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `clinical`: based on clinical criteria')
    stock.append('  - `quarantine`: on people in quarantine (obsolete)')
    stock.append('  - `extended`: extended community search')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_testByCriterion(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      clin_def_list = self.getClinDef()
      qt_list = self.getQT()
      ext_list = self.getExtended()
      
      stock = {'date': date_list, 'clinical': clin_def_list, 'quarantine': qt_list, 'extended': ext_list}
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
    
    for gr in cvcm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/test_by_criterion.csv'
        cvcm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_testByCriterion(gr)
    return
  
  ## Not used
  def getUrlDict(self):
    url_dict = {
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
      '2020-03-19': 'http://at.cdc.tw/W9XhV5',   ## [F|R|P & (Asia | Europe | N Africa | US | Canada | Aussie | NZ)]      | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-20': 'http://at.cdc.tw/328jaz',   ## [F|R|P & global]                                                      | [F|R|P & contact] | [P & unknown] + [F|R & cluster]
      '2020-03-25': 'https://youtu.be/bVv-u2bcV_g?t=782', 
                                                 ## [F|R|P & global] | [F|R|P & contact] | [P & unknown] + [F|R & (medic | cluster)]
      '2020-04-01': 'http://at.cdc.tw/zU3557', ##   [(F|R|P|Ag|An)   & (global | contact therein F|R)] | [F|R|P|Ag|An & contact] | [F|R|P|Ag|An & cluster] | [P & unknown] + [F|R & unknown]
      '2020-04-03': 'http://at.cdc.tw/1vI50K', ##   [(F|R|P|Ag|An)   & (global | contact therein F|R)] | [F|R|P|Ag|An & contact] | [F|R|P|Ag|An & cluster] | [P & unknown] + [F|R|Ag|An & unknown]
      '2020-04-05': 'http://at.cdc.tw/Q96xrb', ##   [(F|R|D-unknown) & (global | contact therein F|R)] | [F|R|D-unknown & contact] | [F|R & cluster] | [P] + [F|R|Ag|An & unknown]
      '2020-04-24': 'http://at.cdc.tw/R3sI9v', ##   [(F|R|D-unknown) & (global | contact therein F|R)] | [F|R|D-unknown & contact] | [F|R & cluster] | [P] + [F|R|Ag|An & (cluster | unknown)]
      
      '2020-07-26': 'http://at.cdc.tw/6E3xJ6', ## Philippines all passengers
      '2020-12-01': 'http://at.cdc.tw/07gjm3', ## Negative COVID tests
      '2021-07-02': 'http://at.cdc.tw/9ZY9Od', ## Entry tests
    }
    return url_dict
  
  def makeReadme_criteriaTimeline(self):
    key = 'criteria_timeline'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: date')
    stock.append('- Column: language')
    stock.append('  - `en`')
    stock.append('  - `fr`')
    stock.append('  - `zh-tw`')
    stock.append('- Timeline table for evolution of testing criteria in Taiwan')
    stock.append('- Contains non-ASCII characters')
    cvcm.README_DICT['root'][key] = stock
    return
  
  def saveCsv_criteriaTimeline(self, mode='both'):
    if mode in ['data', 'both']:
      crit_dict = {
        '2020-01-16': {
          'en': 'Wuhan w/ fever or resp. symp. or pneumonia\nClose contact of confirmed cases', ## Close contact of confirmed cases or ppl satisfying prev. cond.
          'fr': 'Wuhan avec fièvre ou sympt. resp. ou pneumonie\nContacts proches des cas confirmés',
          'zh-tw': '武漢旅遊史且有發燒或呼吸道症狀或肺炎\n確診案例之密切接觸者'
        },
        '2020-01-21': {
          'en': 'China w/ pneumonia',
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
          'en': 'Started community monitoring\nMedics or local cluster w/ pneumonia',
          'fr': 'Surveillance supplémentaire des\ntransmissions locales\nClusters locaux ou de soignants\navec pneumonie',
          'zh-tw': '啟動擴大社區監測\n醫護或本土肺炎群聚',
        },
        '2020-02-29': {
          'en': 'Korea, Italy\nAll pneumonia\nLocal cluster w/ resp. symp.', ## Merged QT into clinical
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
          'en': 'Medics w/ resp. symp.',
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
        },
        '2020-12-01': {
          'en': 'Negative PCR result required',
          'fr': 'PCR négatif obligatoire',
          'zh-tw': '需檢附陰性證明'
        },  ## Negative COVID tests
        '2021-07-02': {
          'en': 'All passengers w/ or w/o symp.',
          'fr': 'Tous les passagers avec ou sans sympt.',
          'zh-tw': '所有旅客無論有無症狀'
        },
      }
      
      date_list = [key for key, value in crit_dict.items()]
      en_list = [value['en'] for key, value in crit_dict.items()]
      fr_list = [value['fr'] for key, value in crit_dict.items()]
      zh_tw_list = [value['zh-tw'] for key, value in crit_dict.items()]
      
      data = {'date': date_list, 'en': en_list, 'fr': fr_list, 'zh-tw': zh_tw_list}
      data = pd.DataFrame(data)
      
      name = f'{cvcm.DATA_PATH}processed_data/criteria_timeline.csv'
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      self.makeReadme_criteriaTimeline()
    return
  
  def updateNewTestCounts(self, stock):
    date_list = self.getDate()
    total_list = self.getTotal()
    
    stock_tmp = {'date': date_list, 'new_tests': total_list}
    stock_tmp = pd.DataFrame(stock_tmp)
    stock_tmp = cvcm.adjustDateRange(stock_tmp)
    
    stock['new_tests'] = stock_tmp['new_tests'].values
    return
  
  def saveCsv(self, mode='both'):
    self.saveCsv_testCounts(mode='readme')
    self.saveCsv_testByCriterion(mode='readme')
    self.saveCsv_criteriaTimeline(mode='readme')
    return

## End of file
################################################################################
