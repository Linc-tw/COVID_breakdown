
    ################################
    ##  COVID_death.py            ##
    ##  Chieh-An Lin              ##
    ##  2022.05.12                ##
    ################################

import os
import sys
import datetime as dtt
import collections as clt

import numpy as np
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - death sheet

class DeathSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_row_id = 'ID'
    self.coltag_report_date = '公布日'
    self.coltag_id = '案號'
    self.coltag_gender = '性別'
    self.coltag_age = '年齡'
    self.coltag_comorbidity = '慢性病史'
    self.coltag_vacc_status = '是否接種COVID19疫苗'
    self.coltag_contact_hist = '活動接觸史'
    self.coltag_onset_date = '發病日'
    self.coltag_symptoms = '症狀'
    self.coltag_tested_date = '採檢日'
    self.coltag_isolation_date = '住院/隔離日'
    self.coltag_confirmed_date = '確診日'
    self.coltag_death_date = '死亡日'
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_death.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    #https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=4002
    
    self.data = data
    self.n_total = self.data.shape[0]
    self.age_key_list = [
      '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', 
      '60-69', '70-79', '80-89', '90-99', '100+'
    ]
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return 
    
  def getReportDate(self):
    return self.getCol(self.coltag_report_date)
  
  def getID(self):
    id_list = []
    for id_ in self.getCol(self.coltag_id):
      if id_ == '--':
        id_list.append(np.nan)
      else:
        id_list.append(int(id_))
    return id_list
  
  def getAge(self):
    age_list = []
    for age in self.getCol(self.coltag_age):
      ind = int(age) // 10
      age_list.append(self.age_key_list[ind])
    return age_list
  
  def increment_deathCounts(self):
    report_date_list = self.getReportDate()
    
    ## Initialize stocks
    col_tag_list = ['death']
    stock = ccm.initializeStock_dailyCounts(col_tag_list)
    
    ## Loop over cases
    for report_date in report_date_list:
      try:
        ind = ccm.indexForOverall(report_date)
        stock['death'][ind] += 1
      except IndexError: ## If NaN
        pass
        
    ## Loop over column
    for col_tag in col_tag_list:
      key = col_tag + '_avg'
      stock[key] = ccm.makeMovingAverage(stock[col_tag])
    return stock
    
  def makeReadme_deathCounts(self, page):
    key = 'death_counts'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `death`')
    stock.append('  - `death_avg`: 7-day moving average of `death`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_deathCounts(self):
    stock = self.increment_deathCounts()
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '{}processed_data/{}/death_counts.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_deathCounts(page)
    return
  
  def increment_deathByAge(self):
    report_date_list = self.getReportDate()
    id_list = self.getID()
    age_list = self.getAge()
    
    ## Initialize stock dict
    death_hist = {age: 0 for age in self.age_key_list}
    year_list = ['total', ccm.PAGE_2020, ccm.PAGE_2021, ccm.PAGE_2022] ## new_year_token (2023)
    stock_dict = {col_tag: death_hist.copy() for col_tag in year_list}
    
    for report_date, id_, age in zip(report_date_list, id_list, age_list):
      if id_ < 300:
        col_tag = '2020'
      else:
        col_tag = report_date[:4]
        
      stock_dict[col_tag][age] += 1
      stock_dict['total'][age] += 1
    
    return stock_dict
    
  def makeReadme_deathByAge(self, page):
    key = 'death_by_age'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: age group')
    stock.append('- Column')
    stock.append('  - `death`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_deathByAge(self):
    stock_dict = self.increment_deathByAge()
    
    data = {'age': self.age_key_list}
    data.update({col_tag: death_hist.values() for col_tag, death_hist in stock_dict.items()})
    data = pd.DataFrame(data)
    
    page = ccm.PAGE_OVERALL
    
    name = '{}processed_data/{}/death_by_age.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data)
    
    self.makeReadme_deathByAge(page)
    return
  
  def saveCsv_fatalityRateByAge(self):
    return
  
  def saveCsv(self):
    self.saveCsv_deathByAge()
    return

## End of file
################################################################################
